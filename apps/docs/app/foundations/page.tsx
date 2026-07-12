export const metadata = { title: "Foundations" };

export default function Page() {
  return (
    <article className="ads-motion-enter">
      <h1>Foundations</h1>
      <p className="muted">Color, type, space, tokens, elevation — the shared contract.</p>
      <h2>Operational rules</h2>
      <ul>
        <li>Prefer semantic tokens over raw values.</li>
        <li>Design empty/loading/error states with the happy path.</li>
        <li>Cite rule IDs and reference IDs when extending guidance.</li>
        <li>See Markdown modules under <code>design-system/</code> for full prose.</li>
      </ul>
      <p><a href="/references">Trace evidence in the Reference Atlas →</a></p>
      <p className="meta">Route: /foundations</p>
    </article>
  );
}
