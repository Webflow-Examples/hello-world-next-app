import type { JsonLdNode } from './schema';

/**
 * Renders structured data into the served HTML.
 *
 * A Server Component on purpose. WS-D requires verification in served HTML rather than in the
 * rendered DOM; structured data injected after hydration is invisible to the crawlers and
 * answer engines it exists for.
 */
export function JsonLd({ data }: { data: JsonLdNode | readonly JsonLdNode[] }) {
  const nodes = Array.isArray(data) ? data : [data];

  return (
    <>
      {nodes.map((node, index) => (
        <script
          dangerouslySetInnerHTML={{ __html: serialize(node) }}
          key={typeof node['@id'] === 'string' ? (node['@id'] as string) : index}
          type="application/ld+json"
        />
      ))}
    </>
  );
}

/**
 * `<` is escaped so a value can never terminate the script element early. The builders in
 * `jsonLd.ts` take approved strings, but a CMS-sourced description still reaches this point,
 * and a script-breaking sequence must not become an injection.
 */
function serialize(node: JsonLdNode): string {
  return JSON.stringify(node).replace(/</g, '\\u003c');
}
