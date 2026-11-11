// Code-splitting regression page for the Webflow Cloud build and deploy.
//
// Rendered on demand (not prerendered), so it runs in the deployed worker.
// It loads one module with a dynamic import() on the server and one in the
// browser (next/dynamic), so the build emits extra server and client chunks.
// The framework-regression harness checks that both chunks are built,
// shipped, and served: the server marker must be in the HTML, and the client
// chunk that holds the client marker must load from /_next/static/chunks/.
import WebflowLogo from "../components/WebflowLogo";
import ClientLazyLoader from "./ClientLazyLoader";

export const dynamic = "force-dynamic";

const FRAMEWORK = "Next.js";

export default async function ChunkTest() {
  const { serverLazyMarker } = await import("./server-lazy");

  return (
    <div className="wf-page">
      <div className="wf-glow" aria-hidden />
      <header className="wf-header">
        <div className="wf-brand">
          <WebflowLogo />
          <span className="wf-brand-text">Webflow Cloud</span>
        </div>
      </header>

      <main className="wf-main">
        <section className="wf-hero">
          <p className="wf-eyebrow">Code splitting · {FRAMEWORK}</p>
          <h1 className="wf-title">
            Lazy <span className="wf-gradient">chunks</span>
            <br />
            on Webflow Cloud.
          </h1>
          <p className="wf-subtitle">
            Server chunk: <code data-chunk-test-server>{serverLazyMarker()}</code>
          </p>
          <p className="wf-subtitle">
            Client chunk: <ClientLazyLoader />
          </p>
        </section>
      </main>

      <footer className="wf-footer">
        <span>
          Built with {FRAMEWORK} · Deployed on{" "}
          <a href="https://webflow.com/cloud" target="_blank" rel="noreferrer">
            Webflow Cloud
          </a>
        </span>
      </footer>
    </div>
  );
}
