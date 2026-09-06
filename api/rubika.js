export default {
  async fetch(request) {
    const jsonHeaders = {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    };

    if (request.method === "GET") {
      return new Response(
        JSON.stringify({
          ok: true,
          service: "rubika-webhook",
          status: "online",
          message: "Rubika webhook endpoint is ready.",
        }),
        { status: 200, headers: jsonHeaders },
      );
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
      return new Response(
        JSON.stringify({ ok: false, error: "Method Not Allowed" }),
        {
          status: 405,
          headers: {
            ...jsonHeaders,
            Allow: "GET, POST, OPTIONS",
          },
        },
      );
    }

    try {
      const rawBody = await request.text();
      let payload = null;

      if (rawBody.trim()) {
        try {
          payload = JSON.parse(rawBody);
        } catch {
          payload = { raw: rawBody };
        }
      }

      // Keep this log for initial webhook verification in Vercel Runtime Logs.
      console.log("Rubika webhook received", JSON.stringify(payload));

      return new Response(
        JSON.stringify({ ok: true, received: true }),
        { status: 200, headers: jsonHeaders },
      );
    } catch (error) {
      console.error("Rubika webhook error", error);

      // Return 200 so temporary parsing/logging issues do not cause webhook retries.
      return new Response(
        JSON.stringify({ ok: true, received: true }),
        { status: 200, headers: jsonHeaders },
      );
    }
  },
};
