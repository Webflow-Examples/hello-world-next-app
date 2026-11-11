// Loaded with a dynamic import() from ./page.tsx, so the server build emits it
// as its own chunk. The marker string lets the framework-regression harness
// prove this code reached the deployed worker.
export const SERVER_LAZY_MARKER = "chunk-test:server-lazy:ok";

export function serverLazyMarker(): string {
  return SERVER_LAZY_MARKER;
}
