const JSON_HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: JSON_HEADERS });
}

async function rubikaCall(token, method, body = {}) {
  const response = await fetch(
    `https://botapi.rubika.ir/v3/${encodeURIComponent(token)}/${method}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );

  const raw = await response.text();
  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    data = { raw };
  }

  if (!response.ok || (data?.status && data.status !== "OK")) {
    throw new Error(`${method} failed`);
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
      return json({ ok: false, error: "token_missing" }, 500);
    }

    try {
      const updatesResult = await rubikaCall(token, "getUpdates", { limit: 20 });
      const updates =
        updatesResult?.data?.updates ||
        updatesResult?.updates ||
        [];

      const target = [...updates]
        .reverse()
        .find((item) => item?.chat_id && item?.new_message?.sender_type === "User");

      if (!target) {
        return json({
          ok: false,
          delivered: false,
          reason: "no_recent_user_update",
        });
      }

      const host = process.env.VERCEL_PROJECT_PRODUCTION_URL || new URL(request.url).host;
      const appUrl = `https://${host}/?source=rubika`;

      const result = await rubikaCall(token, "sendMessage", {
        chat_id: target.chat_id,
        text: "🚀 HAFS آماده است. برای ورود روی دکمه زیر بزنید.",
        inline_keypad: {
          rows: [
            {
              buttons: [
                {
                  id: "open_hafs_web_app",
                  type: "Link",
                  button_text: "🚀 ورود به HAFS",
                  url: appUrl,
                },
              ],
            },
          ],
        },
      });

      return json({
        ok: true,
        delivered: true,
        rubika_status: result?.status || "OK",
      });
    } catch (error) {
      console.error("Rubika launcher test failed", error);
      return json({ ok: false, delivered: false, reason: "rubika_error" }, 500);
    }
  },
};
