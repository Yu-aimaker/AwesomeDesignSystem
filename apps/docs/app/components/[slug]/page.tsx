import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Accordion, Badge, Button, Callout, Card, Checkbox, EmptyState, ErrorState, IconButton, Input, Link as AdsLink,
  Pagination, Progress, RadioGroup, Select, Spinner, Switch, Tabs, Textarea, Toast, Breadcrumb, Popover, Tooltip, DropdownMenu, Dialog, Stack, Cluster, Grid, Container, VisuallyHidden,
} from "@awesome-ds/react";
import { componentCatalog, getComponent } from "../../../lib/components-catalog";
import { ComponentLive } from "../../../components/component-live";

export function generateStaticParams() {
  return componentCatalog.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getComponent(slug);
  return { title: item?.name ?? "Component" };
}

export default async function ComponentDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getComponent(slug);
  if (!item) notFound();
  return (
    <article className="ads-motion-enter">
      <p className="meta"><Link href="/components">Components</Link> / {item.family}</p>
      <h1>{item.name}</h1>
      <p className="muted">{item.description}</p>
      <p className="meta">Rules: {item.ruleIds.join(", ")}</p>
      <h2>State matrix</h2>
      <div className="state-matrix">
        {item.states.map((state) => (
          <div className="state-chip" key={state}>
            <strong>{state}</strong>
            <span className="meta">required</span>
          </div>
        ))}
      </div>
      <h2>Live</h2>
      <Card title="Preview">
        <ComponentLive slug={slug} />
      </Card>
      <h2>Copyable example</h2>
      <pre className="code">{item.example}</pre>
      <Callout title="Implementation">
        Import <code>{item.importName}</code> from <code>@awesome-ds/react</code>. Consume semantic tokens only.
      </Callout>
    </article>
  );
}
