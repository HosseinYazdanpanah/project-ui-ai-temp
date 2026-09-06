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

function getAppUrl(request) {
  const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (productionHost) {
    return `https://${productionHost}/?source=rubika`;
  }

  const requestUrl = new URL(request.url);
  return `${requestUrl.origin}/?source=rubika`;
}

function hafsInlineKeypad(appUrl) {
  return {
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
  };
}

async function sendRubikaMessage(
  token,
  chatId,
  text,
  { replyToMessageId, inlineKeypad } = {},
) {
  const response = await fetch(
    `https://botapi.rubika.ir/v3/${encodeURIComponent(token)}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        ...(replyToMessageId ? { reply_to_message_id: replyToMessageId } : {}),
        ...(inlineKeypad ? { inline_keypad: inlineKeypad } : {}),
      }),
    },
  );

  const rawBody = await response.text();
  let body;
  try {
    body = JSON.parse(rawBody);
  } catch {
    body = { raw: rawBody };
  }

  if (!response.ok) {
    throw new Error(
      `Rubika sendMessage failed: HTTP ${response.status} ${rawBody}`,
    );
  }

  if (body?.status && body.status !== "OK") {
    throw new Error(`Rubika sendMessage failed: ${rawBody}`);
  }

  return body;
}

async function sendHafsLauncher(token, chatId, appUrl, replyToMessageId) {
  return sendRubikaMessage(
    token,
    chatId,
    [
      "👋 به HAFS خوش آمدید.",
      "",
      "برای باز کردن پنل وب HAFS روی دکمه زیر بزنید.",
      "سایت روی Vercel اجرا می‌شود و بازوی روبیکا ورودی شما به آن است.",
    ].join("\n"),
    {
      replyToMessageId,
      inlineKeypad: hafsInlineKeypad(appUrl),
    },
  );
}

export default {
  async fetch(request) {
    const token = process.env.RUBIKA_BOT_TOKEN;
    const appUrl = getAppUrl(request);

    if (request.method === "GET") {
      return json({
        ok: true,
        service: "rubika-webhook",
        status: "online",
        token_configured: Boolean(token),
        endpoint_type: "ReceiveUpdate",
        hafs_launcher: true,
        app_url: appUrl,
      });
    }

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          Allow: "GET, POST, OPTIONS",
          "Cache-Control": "no-store",
        },
      });
    }

    if (request.method !== "POST") {
      return json({ ok: false, error: "Method Not Allowed" }, 405);
    }

    try {
      const payload = await request.json();
      const update = payload?.update;

      if (!update) {
        return json({ ok: true, received: true, ignored: "no_update_object" });
      }

      const newMessage = update.new_message;
      const text = typeof newMessage?.text === "string" ? newMessage.text.trim() : "";
      const normalized = text.toLowerCase();

      console.log(
        "Rubika update received",
        JSON.stringify({
          type: update.type ?? null,
          chat_id: update.chat_id ?? null,
          message_id: newMessage?.message_id ?? null,
          sender_type: newMessage?.sender_type ?? null,
          has_text: Boolean(text),
        }),
      );

      if (!token || !update.chat_id) {
        return json({
          ok: true,
          received: true,
          ignored: !token ? "token_not_configured" : "chat_id_missing",
        });
      }

      const isUserMessage = newMessage?.sender_type === "User";
      const isStartedBot = update.type === "StartedBot";
      const wantsApp =
        normalized === "/start" ||
        normalized === "/app" ||
        normalized === "app" ||
        normalized === "hafs" ||
        normalized === "برنامک" ||
        normalized === "سایت" ||
        normalized === "ورود";

      if (isStartedBot || (isUserMessage && wantsApp)) {
        await sendHafsLauncher(
          token,
          update.chat_id,
          appUrl,
          isUserMessage ? newMessage?.message_id : undefined,
        );

        return json({
          ok: true,
          received: true,
          action: "hafs_launcher_sent",
        });
      }

      const isConnectivityTest =
        normalized === "test" ||
        normalized === "تست";

      if (isUserMessage && isConnectivityTest) {
        await sendRubikaMessage(
          token,
          update.chat_id,
          "✅ اتصال ربات روبیکا به Vercel با موفقیت برقرار است. برای ورود به HAFS روی دکمه زیر بزنید.",
          {
            replyToMessageId: newMessage?.message_id,
            inlineKeypad: hafsInlineKeypad(appUrl),
          },
        );

        return json({
          ok: true,
          received: true,
          action: "connectivity_test_replied",
        });
      }

      return json({ ok: true, received: true });
    } catch (error) {
      console.error("Rubika webhook error", error);
      // Keep the webhook acknowledged so a temporary downstream issue does not
      // create an aggressive retry loop. The error remains visible in Vercel logs.
      return json({ ok: true, received: true, processing_error: true });
    }
  },
};
