import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, test, vi } from "vitest";
import { Accordion } from "./Accordion";
import { Badge } from "./Badge";
import { IconButton } from "./IconButton";
import { Checkbox, RadioGroup, Select, Switch } from "./Input";
import { Link } from "./Link";
import { VisuallyHidden } from "./Layout";
import { Breadcrumb, Pagination } from "./Navigation";
import { Callout, Progress, Spinner, Toast } from "./Status";
import { Dialog } from "./Dialog";
import { DropdownMenu, Popover, Tooltip } from "./Overlay";
import { Tabs } from "./Tabs";

describe("IconButton", () => {
  test("exposes aria-label as accessible name", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <IconButton label="Close dialog" onClick={onClick}>
        ×
      </IconButton>,
    );
    const button = screen.getByRole("button", { name: "Close dialog" });
    expect(button).toHaveAttribute("aria-label", "Close dialog");
    await user.click(button);
    expect(onClick).toHaveBeenCalledOnce();
  });

  test("disables when loading", () => {
    render(
      <IconButton label="Refresh" loading>
        ↻
      </IconButton>,
    );
    expect(screen.getByRole("button", { name: "Refresh" })).toBeDisabled();
  });
});

describe("Switch", () => {
  test("uses switch role and toggles checked state", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Switch id="notify" label="Notifications" checked={false} onChange={onChange} />);
    const control = screen.getByRole("switch", { name: "Notifications" });
    expect(control).not.toBeChecked();
    await user.click(control);
    expect(onChange).toHaveBeenCalledWith(true);
  });
});

describe("Checkbox", () => {
  test("associates label and toggles", async () => {
    const user = userEvent.setup();
    render(<Checkbox id="terms" label="Accept terms" />);
    const box = screen.getByRole("checkbox", { name: "Accept terms" });
    expect(box).not.toBeChecked();
    await user.click(box);
    expect(box).toBeChecked();
  });
});

describe("Breadcrumb", () => {
  test("marks current page and links ancestors", () => {
    render(
      <Breadcrumb
        items={[
          { href: "/", label: "Home" },
          { href: "/components", label: "Components" },
          { label: "Button" },
        ]}
      />,
    );
    const nav = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(within(nav).getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
    expect(within(nav).getByText("Button")).toHaveAttribute("aria-current", "page");
  });
});

describe("Pagination", () => {
  test("disables edges and emits page changes", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { rerender } = render(<Pagination page={1} pageCount={3} onChange={onChange} />);
    expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled();
    expect(screen.getByText("Page 1 of 3")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(onChange).toHaveBeenCalledWith(2);

    rerender(<Pagination page={3} pageCount={3} onChange={onChange} />);
    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "Previous" }));
    expect(onChange).toHaveBeenCalledWith(2);
  });
});

describe("Accordion", () => {
  test("renders expandable sections", async () => {
    const user = userEvent.setup();
    render(
      <Accordion
        items={[
          { id: "a", title: "What is ADS?", content: "A design system." },
          { id: "b", title: "Why tokens?", content: "Consistency." },
        ]}
      />,
    );
    expect(screen.getByText("What is ADS?")).toBeInTheDocument();
    expect(screen.queryByText("A design system.")).not.toBeVisible();
    await user.click(screen.getByText("What is ADS?"));
    expect(screen.getByText("A design system.")).toBeVisible();
  });
});

describe("Progress", () => {
  test("exposes progressbar semantics and clamps value", () => {
    render(<Progress value={140} label="Upload" />);
    const bar = screen.getByRole("progressbar", { name: "Upload" });
    expect(bar).toHaveAttribute("aria-valuenow", "100");
    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
  });
});

describe("Spinner", () => {
  test("announces loading status", () => {
    render(<Spinner label="Saving" />);
    expect(screen.getByRole("status", { name: "Saving" })).toBeInTheDocument();
  });
});

describe("Toast", () => {
  test("uses status role for live message", () => {
    render(<Toast>Saved successfully</Toast>);
    expect(screen.getByRole("status")).toHaveTextContent("Saved successfully");
  });
});

describe("Callout", () => {
  test("labels aside with title", () => {
    render(<Callout title="Note">Prefer semantic tokens.</Callout>);
    const callout = screen.getByLabelText("Note");
    expect(callout).toHaveTextContent("Prefer semantic tokens.");
  });
});

describe("RadioGroup", () => {
  test("selects option and notifies change", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <RadioGroup
        legend="Size"
        name="size"
        value="md"
        onChange={onChange}
        options={[
          { value: "sm", label: "Small" },
          { value: "md", label: "Medium" },
          { value: "lg", label: "Large" },
        ]}
      />,
    );
    expect(screen.getByRole("radio", { name: "Medium" })).toBeChecked();
    await user.click(screen.getByRole("radio", { name: "Large" }));
    expect(onChange).toHaveBeenCalledWith("lg");
  });
});

describe("Select", () => {
  test("wires label and error alert", () => {
    render(
      <Select id="tone" label="Tone" error="Required">
        <option value="neutral">Neutral</option>
        <option value="accent">Accent</option>
      </Select>,
    );
    expect(screen.getByLabelText("Tone")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("alert")).toHaveTextContent("Required");
  });
});

describe("VisuallyHidden", () => {
  test("keeps content available to assistive tech", () => {
    render(
      <button type="button">
        <VisuallyHidden>Delete item</VisuallyHidden>
      </button>,
    );
    expect(screen.getByRole("button", { name: "Delete item" })).toBeInTheDocument();
    expect(screen.getByText("Delete item")).toHaveClass("ads-visually-hidden");
  });
});

describe("Badge", () => {
  test("renders tone variants", () => {
    const { rerender } = render(<Badge>Neutral</Badge>);
    expect(screen.getByText("Neutral")).toHaveClass("ads-badge");
    rerender(<Badge tone="accent">Accent</Badge>);
    expect(screen.getByText("Accent")).toHaveClass("ads-badge", "ads-badge--accent");
  });
});

describe("Link", () => {
  test("renders anchor with href", () => {
    render(<Link href="/docs">Documentation</Link>);
    const link = screen.getByRole("link", { name: "Documentation" });
    expect(link).toHaveAttribute("href", "/docs");
    expect(link).toHaveClass("ads-link");
  });
});

describe("Dialog keyboard contract", () => {
  test("moves focus inside, closes with Escape, and restores trigger focus", async () => {
    const user = userEvent.setup();
    function Example() {
      const [open, setOpen] = React.useState(false);
      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>Open settings</button>
          <Dialog open={open} onClose={() => setOpen(false)} title="Settings">
            <button type="button">Save settings</button>
          </Dialog>
        </>
      );
    }
    render(<Example />);
    const trigger = screen.getByRole("button", { name: "Open settings" });
    await user.click(trigger);
    const dialog = screen.getByRole("dialog", { name: "Settings" });
    expect(dialog).toBeInTheDocument();
    expect(dialog).toContainElement(document.activeElement as HTMLElement);
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});

describe("Tabs keyboard contract", () => {
  test("moves selection with arrow keys", async () => {
    const user = userEvent.setup();
    render(<Tabs items={[{ value: "one", label: "One", content: "First" }, { value: "two", label: "Two", content: "Second" }]} />);
    const first = screen.getByRole("tab", { name: "One" });
    await user.click(first);
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Two" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Second");
  });
});

describe("Overlay keyboard contracts", () => {
  test("opens a menu, moves focus, selects, and closes", async () => {
    const user = userEvent.setup();
    const selected = vi.fn();
    render(<DropdownMenu label="Actions" items={[{ id: "edit", label: "Edit", onSelect: selected }, { id: "delete", label: "Delete" }]} />);
    const trigger = screen.getByRole("button", { name: "Actions" });
    trigger.focus();
    await user.keyboard("{ArrowDown}{Enter}");
    expect(selected).toHaveBeenCalledOnce();
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  test("popover dismisses with Escape", async () => {
    const user = userEvent.setup();
    render(<Popover label="More">Details</Popover>);
    await user.click(screen.getByRole("button", { name: "More" }));
    expect(screen.getByRole("dialog")).toHaveTextContent("Details");
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  test("tooltip opens from keyboard focus and dismisses with Escape", async () => {
    const user = userEvent.setup();
    render(<Tooltip label="Helpful hint">?</Tooltip>);
    await user.tab();
    expect(await screen.findByRole("tooltip")).toHaveTextContent("Helpful hint");
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });
});
