import rubikaWebhook from "@/lib/rubika";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Preserve the original Rubika webhook contract under Next.js App Router. */
export async function GET(request: Request) {
  return rubikaWebhook.fetch(request);
}

export async function POST(request: Request) {
  return rubikaWebhook.fetch(request);
}
