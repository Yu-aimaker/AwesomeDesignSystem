"use client";

import { useState } from "react";
import {
  Accordion, Badge, Button, Callout, Card, Checkbox, EmptyState, ErrorState, IconButton, Input, Link,
  Pagination, Progress, RadioGroup, Select, Skeleton, Spinner, Switch, Tabs, Textarea, Toast, Breadcrumb, Popover, Tooltip, DropdownMenu, Dialog, Stack, Cluster, Grid, Container, VisuallyHidden,
} from "@awesome-ds/react";

export function ComponentLive({ slug }: { slug: string }) {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(2);
  const [on, setOn] = useState(false);
  const [radio, setRadio] = useState("a");

  switch (slug) {
    case "button":
      return <div className="ads-cluster"><Button>Primary</Button><Button loading>Loading</Button><Button disabled>Disabled</Button><Button variant="danger">Danger</Button></div>;
    case "icon-button":
      return <IconButton label="Settings">⚙</IconButton>;
    case "link":
      return <Link href="/references">Open Atlas</Link>;
    case "badge":
      return <div className="ads-cluster"><Badge>Neutral</Badge><Badge tone="accent">Accent</Badge></div>;
    case "input":
      return <Input id="live-input" label="Email" hint="We never share this" />;
    case "textarea":
      return <Textarea id="live-ta" label="Notes" />;
    case "checkbox":
      return <Checkbox id="live-cb" label="Subscribe" />;
    case "switch":
      return <Switch id="live-sw" label="Notifications" checked={on} onChange={setOn} />;
    case "radio-group":
      return <RadioGroup legend="Size" name="size" value={radio} onChange={setRadio} options={[{ value: "a", label: "S" }, { value: "b", label: "M" }]} />;
    case "select":
      return <Select id="live-sel" label="Role"><option>Admin</option><option>Editor</option></Select>;
    case "dialog":
    case "alert-dialog":
      return (
        <>
          <Button onClick={() => setOpen(true)}>Open dialog</Button>
          <Dialog open={open} title={slug === "alert-dialog" ? "Delete item" : "Dialog"} onClose={() => setOpen(false)} danger={slug === "alert-dialog"}>
            Confirm this action.
          </Dialog>
        </>
      );
    case "popover":
      return <Popover label="Open popover">Popover body</Popover>;
    case "tooltip":
      return <Tooltip label="More info"><Button variant="secondary">Hover/focus</Button></Tooltip>;
    case "dropdown-menu":
      return <DropdownMenu label="Menu" items={[{ id: "1", label: "Edit" }, { id: "2", label: "Share" }]} />;
    case "tabs":
      return <Tabs items={[{ value: "one", label: "One", content: "Panel one" }, { value: "two", label: "Two", content: "Panel two" }]} />;
    case "accordion":
      return <Accordion items={[{ id: "1", title: "Details", content: "Hidden until expanded" }]} />;
    case "breadcrumb":
      return <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Components", href: "/components" }, { label: "Current" }]} />;
    case "pagination":
      return <Pagination page={page} pageCount={5} onChange={setPage} />;
    case "card":
      return <Card title="Card title">Card body content.</Card>;
    case "callout":
      return <Callout title="Tip">Prefer semantic tokens.</Callout>;
    case "skeleton":
      return <Skeleton height="1.25rem" />;
    case "spinner":
      return <Spinner />;
    case "progress":
      return <Progress value={55} label="Progress" />;
    case "toast":
      return <Toast>Changes saved</Toast>;
    case "empty-state":
      return <EmptyState title="No results" description="Try another filter." actionLabel="Reset" />;
    case "error-state":
      return <ErrorState title="Request failed" description="Check the network and retry." actionLabel="Retry" />;
    case "stack":
      return <Stack gap={2}><Button size="sm">One</Button><Button size="sm" variant="secondary">Two</Button></Stack>;
    case "cluster":
      return <Cluster><Badge>A</Badge><Badge>B</Badge><Badge>C</Badge></Cluster>;
    case "grid":
      return <Grid><Card title="1">A</Card><Card title="2">B</Card></Grid>;
    case "container":
      return <Container><p>Constrained width container.</p></Container>;
    case "visually-hidden":
      return <p>Visible text <VisuallyHidden>plus screen-reader-only context</VisuallyHidden></p>;
    default:
      return <p className="meta">No live preview for this slug.</p>;
  }
}
