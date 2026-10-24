import Script from "next/script";
import { workspaceMarkup } from "@/lib/hafs-workspace";

/**
 * Server-rendered Next.js page using the existing, trusted HAFS interface.
 *
 * The legacy UI modifies its own DOM and relies on global onclick callbacks.
 * React therefore owns only this stable boundary until each workflow section
 * is migrated to native React components. Avoid hydrating the internal nodes.
 */
export default function HomePage() {
  return (
    <>
      <div id="hafs-workspace-root" dangerouslySetInnerHTML={{ __html: workspaceMarkup }} />
      <Script src="/hafs/runtime.js" strategy="afterInteractive" />
    </>
  );
}
