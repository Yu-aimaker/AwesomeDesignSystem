export const metadata = { title: "Brand" };

const modules = [
  { href: "/references?q=duolingo", title: "Duolingo-class brand bible lessons", body: "Cross-medium personality, voice/tone, illustration grammar." },
  { title: "Cross-medium coherence", body: "Personality → words, shapes, color, imagery, motion, constraints." },
  { title: "Voice & tone matrix", body: "Stable voice + situational tone for error/success/onboarding/marketing." },
  { title: "Character systems", body: "Anatomy sheets, emotion limits, misuse galleries — process only, no IP copy." },
  { title: "Content design", body: "Glossary, forbidden terms, recovery copy patterns." },
  { title: "Sound & haptics", body: "Optional sonic brand layer with mute and non-sensory alternatives." },
];

export default function BrandPage() {
  return (
    <article className="ads-motion-enter">
      <h1>Brand</h1>
      <p className="muted">
        Personality is a production system. AwesomeDS extracts transferable brand-bible structure
        from elite orgs (Duolingo Design inventory, Dropbox Brand, Apple foundations) without
        copying proprietary assets.
      </p>
      <div className="grid-cards">
        {modules.map((m) => (
          <div className="card-link" key={m.title}>
            <strong>{m.title}</strong>
            <p className="meta">{m.body}</p>
          </div>
        ))}
      </div>
      <h2>Source modules</h2>
      <ul>
        <li><code>design-system/brand/cross-medium-coherence.md</code></li>
        <li><code>design-system/brand/voice-tone-matrix.md</code></li>
        <li><code>design-system/brand/character-system.md</code></li>
        <li><code>design-system/case-studies/duolingo-lessons.md</code></li>
        <li><code>design-system/case-studies/elite-org-map.md</code></li>
      </ul>
    </article>
  );
}
