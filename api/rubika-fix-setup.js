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
  try { data = JSON.parse(raw); } catch { data = { raw }; }
  if (!response.ok || (data?.status && data.status !== "OK")) {
    throw new Error(`${method} failed: ${raw}`);
  }
  return data;
}

function mainMenuKeypad() {
  return {
    rows: [
      { buttons: [{ id: "open_hafs", type: "Simple", button_text: "🚀 ورود به HAFS" }] },
      { buttons: [
        { id: "test_connection", type: "Simple", button_text: "🧪 تست اتصال" },
        { id: "help", type: "Simple", button_text: "ℹ️ راهنما" }
      ] }
    ],
    resize_keyboard: true,
    one_time_keyboard: false,
  };
}

export default {
  async fetch(request) {
    if (request.method !== "GET") return json({ ok: false, error: "Method Not Allowed" }, 405);

    const token = process.env.RUBIKA_BOT_TOKEN;
    if (!token) return json({ ok: false, error: "token_missing" }, 500);

    try {
      const host = process.env.VERCEL_PROJECT_PRODUCTION_URL || new URL(request.url).host;
      const webhookUrl = `https://${host}/api/rubika`;

      const receiveUpdate = await rubikaCall(token, "updateBotEndpoints", {
        url: webhookUrl,
        type: "ReceiveUpdate",
      });
      const receiveInline = await rubikaCall(token, "updateBotEndpoints", {
        url: webhookUrl,
        type: "ReceiveInlineMessage",
      });
      const commands = await rubikaCall(token, "setCommands", {
        bot_commands: [
          { command: "start", description: "نمایش منوی اصلی HAFS" },
          { command: "app", description: "دریافت لینک ورود به HAFS" },
          { command: "help", description: "راهنمای ربات" },
        ],
      });

      // Push the repaired ChatKeypad to the most recent user chat, if available.
      let menuDelivered = false;
      try {
        const updatesResult = await rubikaCall(token, "getUpdates", { limit: 20 });
        const updates = updatesResult?.data?.updates || updatesResult?.updates || [];
        const target = [...updates].reverse().find(
          (item) => item?.chat_id && item?.new_message?.sender_type === "User",
        );

        if (target?.chat_id) {
          await rubikaCall(token, "sendMessage", {
            chat_id: target.chat_id,
            text: "✅ منوی ربات اصلاح شد. از دکمه‌های پایین چت استفاده کنید.",
            chat_keypad_type: "New",
            chat_keypad: mainMenuKeypad(),
          });
          menuDelivered = true;
        }
      } catch (e) {
        console.error("menu delivery skipped", e);
      }

      return json({
        ok: true,
        webhook_url: webhookUrl,
        receive_update: receiveUpdate?.status === "OK",
        receive_inline_message: receiveInline?.status === "OK",
        commands_set: commands?.status === "OK",
        menu_delivered: menuDelivered,
      });
    } catch (error) {
      console.error("Rubika fix setup failed", error);
      return json({ ok: false, error: String(error?.message || error) }, 500);
    }
  },
};
