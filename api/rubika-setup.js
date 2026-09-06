const JSON_HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: JSON_HEADERS,
  });
}

async function rubikaCall(token, method, body) {
  const response = await fetch(
    `https://botapi.rubika.ir/v3/${encodeURIComponent(token)}/${method}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      ...(body ? { body: JSON.stringify(body) } : {}),
    },
  );

  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }

  if (!response.ok) {
    throw new Error(`${method} failed with HTTP ${response.status}: ${text}`);
  }

  return data;
}

export default {
  async fetch(request) {
    if (request.method !== "GET") {
      return json({ ok: false, error: "Method Not Allowed" }, 405);
    }

    const token = process.env.RUBIKA_BOT_TOKEN;
    if (!token) {
      return json({ ok: false, error: "RUBIKA_BOT_TOKEN is not configured" }, 500);
    }

    try {
      const productionHost =
        process.env.VERCEL_PROJECT_PRODUCTION_URL || new URL(request.url).host;
      const endpoint = `https://${productionHost}/api/rubika`;

      const me = await rubikaCall(token, "getMe");
      const endpointResult = await rubikaCall(token, "updateBotEndpoints", {
        url: endpoint,
        type: "ReceiveUpdate",
      });

      return json({
        ok: true,
        token_valid: true,
        webhook_registered: true,
        endpoint,
        bot: me?.bot
          ? {
              bot_id: me.bot.bot_id ?? null,
              bot_username: me.bot.bot_username ?? me.bot.username ?? null,
              bot_name: me.bot.bot_name ?? me.bot.first_name ?? null,
            }
          : null,
        rubika_result: endpointResult,
      });
    } catch (error) {
      console.error("Rubika setup failed", error);
      return json({ ok: false, error: String(error?.message || error) }, 500);
    }
  },
};
