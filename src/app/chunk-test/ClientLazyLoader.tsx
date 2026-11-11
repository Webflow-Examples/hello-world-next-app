"use client";

import dynamic from "next/dynamic";

// ssr: false keeps the widget out of the server render and out of the
// page's initial scripts, so the browser fetches its chunk on demand.
const ClientLazyWidget = dynamic(() => import("./ClientLazyWidget"), {
  ssr: false,
  loading: () => <code data-chunk-test-client>loading…</code>,
});

export default function ClientLazyLoader() {
  return <ClientLazyWidget />;
}
