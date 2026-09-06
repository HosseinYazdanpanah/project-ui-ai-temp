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

async function sendRubikaMessage(token, chatId, text, replyToMessageId) {
  const response = await fetch(
    `https://botapi.rubika.ir/v3/${encodeURIComponent(token)}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        ...(replyToMessageId ? { reply_to_message_id: replyToMessageId } : {}),
      }),
    },
  );

  const body = await response.text();
  if (!response.ok) {
    throw new Error(`Rubika sendMessage failed: HTTP ${response.status} ${body}`);
  }

  return body;
}

export default {
  async fetch(request) {
    const token = process.env.RUBIKA_BOT_TOKEN;

    if (request.method === "GET") {
      return json({
        ok: true,
        service: "rubika-webhook",
        status: "online",
        token_configured: Boolean(token),
        endpoint_type: "ReceiveUpdate",
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
      console.log(
        "Rubika update received",
        JSON.stringify({
          type: update.type ?? null,
          chat_id: update.chat_id ?? null,
          message_id: newMessage?.message_id ?? null,
          sender_type: newMessage?.sender_type ?? null,
          has_text: Boolean(newMessage?.text),
        }),
      );

      // A small, non-spamming connectivity test. The bot only replies to /start or test messages.
      const text = typeof newMessage?.text === "string" ? newMessage.text.trim() : "";
      const normalized = text.toLowerCase();
      const isConnectivityTest =
        normalized === "/start" ||
        normalized === "test" ||
        normalized === "تست";

      if (
        isConnectivityTest &&
        token &&
        update.chat_id &&
        newMessage?.sender_type === "User"
      ) {
        await sendRubikaMessage(
          token,
          update.chat_id,
          "✅ اتصال ربات روبیکا به Vercel با موفقیت برقرار است.",
          newMessage.message_id,
        );
      }

      return json({ ok: true, received: true });
    } catch (error) {
      console.error("Rubika webhook error", error);
      // Return 200 so a temporary processing issue does not trigger an aggressive retry loop.
      return json({ ok: true, received: true, processing_error: true });
    }
  },
};
