import { notFound } from "next/navigation";
import { Button, Card, Input, Dialog } from "@awesome-ds/react";

const catalog: Record<string, { title: string; ruleIds: string[]; body: string }> = {
  button: { title: "Button", ruleIds: ["rule.a11y.wcag-aa", "rule.components.state-matrix"], body: "Primary action control with loading/disabled states." },
  input: { title: "Input", ruleIds: ["rule.a11y.wcag-aa"], body: "Labeled text field with hint and error association." },
  dialog: { title: "Dialog", ruleIds: ["rule.a11y.wcag-aa"], body: "Modal dialog with Escape dismiss and labelled title." },
};

export function generateStaticParams() {
  return Object.keys(catalog).map((slug) => ({ slug }));
}

export default async function ComponentDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = catalog[slug];
  if (!item) notFound();
  return (
    <article>
      <h1>{item.title}</h1>
      <p className="muted">{item.body}</p>
      <p className="meta">Rules: {item.ruleIds.join(", ")}</p>
      <Card title="Live">
        {slug === "button" ? <Button>Continue</Button> : null}
        {slug === "input" ? <Input id="demo" label="Email" /> : null}
        {slug === "dialog" ? <p className="meta">Open from playground for interactive modal.</p> : null}
      </Card>
    </article>
  );
}
