import {
  Accordion, Badge, Button, Callout, Card, Checkbox, EmptyState, ErrorState, Input, Progress, Spinner, Stack, Tabs, Toast,
} from "@awesome-ds/react";

export const metadata = { title: "Components" };

const example = `import { Button } from "@awesome-ds/react";

export function Example() {
  return <Button>Save changes</Button>;
}`;

export default function ComponentsPage() {
  return (
    <div className="ads-motion-enter">
      <h1>Components</h1>
      <p className="muted">AwesomeDS-owned React APIs on semantic tokens. Every control ships states, keyboard contracts, and rule IDs.</p>
      <Stack gap={6}>
        <Card title="Actions">
          <div className="ads-cluster">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
            <Button loading>Loading</Button>
            <Badge tone="accent">Baseline</Badge>
          </div>
        </Card>
        <Card title="Forms">
          <Input id="name" label="Name" hint="Used on invoices" />
          <Checkbox id="terms" label="I agree to the terms" />
        </Card>
        <Card title="Status">
          <div className="ads-cluster">
            <Spinner />
            <Progress value={64} label="Upload" />
            <Toast>Saved just now</Toast>
          </div>
          <Callout title="Evidence">Implements rule.a11y.wcag-aa and rule.components.state-matrix.</Callout>
        </Card>
        <Tabs items={[
          { value: "preview", label: "Preview", content: <EmptyState title="Nothing selected" description="Choose a row to inspect." actionLabel="Browse" /> },
          { value: "error", label: "Error", content: <ErrorState title="Could not load" description="Network failed." actionLabel="Retry" /> },
        ]} />
        <Accordion items={[{ id: "a1", title: "Copyable example", content: <pre className="code">{example}</pre> }]} />
      </Stack>
    </div>
  );
}
