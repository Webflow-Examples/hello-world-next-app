"use client";

// Loaded only in the browser through next/dynamic (see ClientLazyLoader.tsx),
// so the client build emits it as its own chunk under /_next/static/chunks/.
// The marker string lets the framework-regression harness find this chunk in
// the build output and check that it is served.
export const CLIENT_LAZY_MARKER = "chunk-test:client-lazy:ok";

export default function ClientLazyWidget() {
  return <code data-chunk-test-client data-loaded="true">{CLIENT_LAZY_MARKER}</code>;
}
