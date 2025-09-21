import { NextRequest } from "next/server";

export const runtime = "edge";

function html(head: string) {
  return new Response(
    `<!doctype html><html><head>${head}</head><body></body></html>`,
    { headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}

function originFrom(req: NextRequest) {
  const proto = "https://";
  const host = req.headers.get("host")!;
  return `${proto}${host}`;
}

export async function GET(req: NextRequest) {
  const origin = originFrom(req);

  return html(`
    <meta property="og:title" content="Deploy your token" />
    <meta name="fc:frame" content="vNext" />
    <meta property="og:image" content="${origin}/og/ready" />
    <meta name="fc:frame:image" content="${origin}/og/ready" />

    <meta name="fc:frame:button:1" content="Deploy Token" />
    <meta name="fc:frame:post_url" content="${origin}/api/deploy" />
  `);
}
