import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const metadata = { title: "Interface Quality Review" };

export default async function ReviewPage() {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../../");
  let checklist = "";
  try {
    checklist = await readFile(
      path.join(root, "design-system/review/interface-quality-checklist.md"),
      "utf8",
    );
  } catch {
    checklist = "Checklist file missing.";
  }
  return (
    <article className="ads-motion-enter">
      <h1>Interface quality review</h1>
      <p className="muted">
        Severity-tagged craft checklist synthesized from Vercel Web Interface Guidelines,
        APG, WCAG, and Apple HIG foundations. Agents must cite IQ-* IDs when reviewing UI.
      </p>
      <p>
        <a href="/references?q=vercel">Related references</a>
        {" · "}
        <a href="/interaction">Interaction canon</a>
      </p>
      <pre className="code" style={{ whiteSpace: "pre-wrap" }}>{checklist}</pre>
    </article>
  );
}
