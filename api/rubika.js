const JSON_HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: JSON_HEADERS });
}

function getAppUrl(request) {
  const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (productionHost) return `https://${productionHost}/?source=rubika`;
  return `${new URL(request.url).origin}/?source=rubika`;
}

function hafsChatKeypad() {
  return {
    rows: [
      {
        buttons: [
          {
            id: "open_hafs",
            type: "Simple",
            button_text: "🚀 ورود به HAFS",
          },
        ],
      },
      {
        buttons: [
          {
            id: "test_connection",
            type: "Simple",
            button_text: "🧪 تست اتصال",
          },
          {
            id: "help",
            type: "Simple",
            button_text: "ℹ️ راهنما",
          },
        ],
      },
    ],
    resize_keyboard: true,
    one_time_keyboard: false,
  };
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
    throw new Error(`${method} failed: HTTP ${response.status} ${raw}`);
  }

  return data;
}

async function sendMessage(
  token,
  chatId,
  text,
  { replyToMessageId, chatKeypad, chatKeypadType, metadata } = {},
) {
  return rubikaCall(token, "sendMessage", {
    chat_id: chatId,
    text,
    ...(replyToMessageId ? { reply_to_message_id: replyToMessageId } : {}),
    ...(chatKeypad ? { chat_keypad: chatKeypad } : {}),
    ...(chatKeypadType ? { chat_keypad_type: chatKeypadType } : {}),
    ...(metadata ? { metadata } : {}),
  });
}

async function sendMainMenu(token, chatId, replyToMessageId) {
  return sendMessage(
    token,
    chatId,
    [
      "👋 به HAFS خوش آمدید.",
      "",
      "از دکمه‌های پایین چت استفاده کنید.",
      "برای ورود به پنل، «🚀 ورود به HAFS» را بزنید.",
    ].join("\n"),
    {
      replyToMessageId,
      chatKeypad: hafsChatKeypad(),
      chatKeypadType: "New",
    },
  );
}

async function sendAppLink(token, chatId, appUrl, replyToMessageId) {
  // Official Rubika Metadata Link. The visible linked text is ASCII so UTF-16
  // indices/length stay deterministic: "Open HAFS" = 9 code units.
  return sendMessage(token, chatId, "Open HAFS", {
    replyToMessageId,
    metadata: {
      meta_data_parts: [
        {
          type: "Link",
          from_index: 0,
          length: 9,
          link_url: appUrl,
        },
      ],
    },
  });
}

async function processButtonAction({ token, chatId, buttonId, appUrl, replyToMessageId }) {
  if (!buttonId) return false;

  if (buttonId === "open_hafs" || buttonId === "open_hafs_web_app") {
    await sendAppLink(token, chatId, appUrl, replyToMessageId);
    return true;
  }

  if (buttonId === "test_connection") {
    await sendMessage(
      token,
      chatId,
      "✅ اتصال Rubika ↔ Vercel سالم است و دکمه‌ها هم از طریق Webhook دریافت می‌شوند.",
      { replyToMessageId },
    );
    return true;
  }

  if (buttonId === "help") {
    await sendMessage(
      token,
      chatId,
      "راهنما:\n• 🚀 ورود به HAFS → لینک پنل را می‌فرستد.\n• 🧪 تست اتصال → سلامت Webhook را بررسی می‌کند.\n• /start → منوی اصلی را دوباره نمایش می‌دهد.",
      { replyToMessageId },
    );
    return true;
  }

  return false;
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
        receive_update: true,
        receive_inline_message: true,
        chat_keypad: true,
        metadata_link: true,
        app_url: appUrl,
      });
    }

    if (request.method !== "POST") {
      return json({ ok: false, error: "Method Not Allowed" }, 405);
    }

    try {
      const payload = await request.json();

      if (!token) {
        return json({ ok: true, received: true, ignored: "token_not_configured" });
      }

      // ReceiveInlineMessage endpoint payload.
      const inlineMessage = payload?.inline_message;
      if (inlineMessage) {
        const buttonId = inlineMessage?.aux_data?.button_id;
        const chatId = inlineMessage?.chat_id;

        console.log(
          "Rubika inline click received",
          JSON.stringify({ button_id: buttonId ?? null, has_chat_id: Boolean(chatId) }),
        );

        if (chatId) {
          const handled = await processButtonAction({
            token,
            chatId,
            buttonId,
            appUrl,
            replyToMessageId: inlineMessage?.message_id,
          });

          return json({ ok: true, received: true, kind: "inline", handled });
        }

        return json({ ok: true, received: true, kind: "inline", handled: false });
      }

      // ReceiveUpdate endpoint payload: normal messages + ChatKeypad clicks.
      const update = payload?.update;
      if (!update) {
        return json({ ok: true, received: true, ignored: "unsupported_payload" });
      }

      const newMessage = update?.new_message;
      const chatId = update?.chat_id;
      const text = typeof newMessage?.text === "string" ? newMessage.text.trim() : "";
      const normalized = text.toLowerCase();
      const buttonId = newMessage?.aux_data?.button_id;
      const isUserMessage = newMessage?.sender_type === "User";

      console.log(
        "Rubika update received",
        JSON.stringify({
          type: update?.type ?? null,
          has_chat_id: Boolean(chatId),
          button_id: buttonId ?? null,
          sender_type: newMessage?.sender_type ?? null,
          has_text: Boolean(text),
        }),
      );

      if (!chatId) {
        return json({ ok: true, received: true, ignored: "chat_id_missing" });
      }

      const isStartedBot = update?.type === "StartedBot";
      const wantsMenu =
        normalized === "/start" ||
        normalized === "start" ||
        normalized === "منو" ||
        normalized === "menu";

      if (isStartedBot || (isUserMessage && wantsMenu)) {
        await sendMainMenu(token, chatId, isUserMessage ? newMessage?.message_id : undefined);
        return json({ ok: true, received: true, action: "main_menu_sent" });
      }

      if (isUserMessage && buttonId) {
        const handled = await processButtonAction({
          token,
          chatId,
          buttonId,
          appUrl,
          replyToMessageId: newMessage?.message_id,
        });
        if (handled) {
          return json({ ok: true, received: true, action: "chat_keypad_button_handled" });
        }
      }

      // Text fallbacks, useful if a client sends button text but omits button_id.
      if (
        isUserMessage &&
        (normalized === "🚀 ورود به hafs" ||
          normalized === "ورود به hafs" ||
          normalized === "hafs" ||
          normalized === "/app" ||
          normalized === "ورود")
      ) {
        await sendAppLink(token, chatId, appUrl, newMessage?.message_id);
        return json({ ok: true, received: true, action: "app_link_sent" });
      }

      if (
        isUserMessage &&
        (normalized === "🧪 تست اتصال" || normalized === "تست اتصال" || normalized === "test" || normalized === "تست")
      ) {
        await sendMessage(
          token,
          chatId,
          "✅ اتصال Rubika ↔ Vercel سالم است.",
          { replyToMessageId: newMessage?.message_id },
        );
        return json({ ok: true, received: true, action: "test_replied" });
      }

      if (isUserMessage && (normalized === "ℹ️ راهنما" || normalized === "راهنما" || normalized === "/help")) {
        await sendMessage(
          token,
          chatId,
          "برای نمایش دکمه‌ها /start را بفرستید. سپس «🚀 ورود به HAFS» را لمس کنید.",
          { replyToMessageId: newMessage?.message_id },
        );
        return json({ ok: true, received: true, action: "help_replied" });
      }

      return json({ ok: true, received: true });
    } catch (error) {
      console.error("Rubika webhook error", error);
      return json({ ok: true, received: true, processing_error: true });
    }
  },
};
