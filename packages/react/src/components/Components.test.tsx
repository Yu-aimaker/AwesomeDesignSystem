import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, test, vi } from "vitest";
import { Accordion } from "./Accordion";
import { Badge } from "./Badge";
import { IconButton } from "./IconButton";
import { Checkbox, RadioGroup, Select, Switch } from "./Input";
import { Link } from "./Link";
import { Cluster, Container, Grid, Stack, VisuallyHidden } from "./Layout";
import { Breadcrumb, Pagination } from "./Navigation";
import { Callout, Card, EmptyState, ErrorState, Progress, Skeleton, Spinner, Toast } from "./Status";
import { AlertDialog, Dialog } from "./Dialog";
import { DropdownMenu, Popover, Tooltip } from "./Overlay";
import { Tabs } from "./Tabs";
import { Button } from "./Button";
import { Input, Textarea } from "./Input";

describe("static and layout component contracts", () => {
  test("Card remains a static semantic section", () => {
    render(<Card title="Account"><button>Open</button></Card>);
    expect(screen.getByRole("heading", { name: "Account" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Open" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Account" })).not.toBeInTheDocument();
  });

  test("Skeleton is hidden from the accessibility tree", () => {
    const { container } = render(<Skeleton width="8rem" height="2rem" />);
    const skeleton = container.querySelector(".ads-skeleton");
    expect(skeleton).toHaveAttribute("aria-hidden", "true");
    expect(skeleton).toHaveStyle({ width: "8rem", height: "2rem" });
  });

  test("EmptyState and ErrorState expose working recovery actions", async () => {
    const user = userEvent.setup();
    const browse = vi.fn();
    const retry = vi.fn();
    render(<><EmptyState title="Empty" description="Choose an item" actionLabel="Browse" onAction={browse} /><ErrorState title="Failed" description="Try again" actionLabel="Retry" onAction={retry} /></>);
    await user.click(screen.getByRole("button", { name: "Browse" }));
    await user.click(screen.getByRole("button", { name: "Retry" }));
    expect(browse).toHaveBeenCalledOnce();
    expect(retry).toHaveBeenCalledOnce();
    expect(screen.getByRole("alert")).toHaveTextContent("Failed");
  });

  test("layout primitives preserve DOM and focus order without adding roles", async () => {
    const user = userEvent.setup();
    const { container } = render(<Stack gap={6}><button>First</button><Cluster><button>Second</button></Cluster><Grid><button>Third</button></Grid><Container><button>Fourth</button></Container></Stack>);
    expect(container.querySelector(".ads-stack")).toHaveAttribute("data-gap", "6");
    expect(screen.queryByRole("grid")).not.toBeInTheDocument();
    await user.tab(); expect(screen.getByRole("button", { name: "First" })).toHaveFocus();
    await user.tab(); expect(screen.getByRole("button", { name: "Second" })).toHaveFocus();
    await user.tab(); expect(screen.getByRole("button", { name: "Third" })).toHaveFocus();
    await user.tab(); expect(screen.getByRole("button", { name: "Fourth" })).toHaveFocus();
  });
});

describe("native keyboard contracts", () => {
  test("Button activates with Enter and Space but not while disabled", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const { rerender } = render(<Button onClick={onClick}>Save</Button>);
    const button = screen.getByRole("button", { name: "Save" });
    button.focus();
    await user.keyboard("{Enter} ");
    expect(onClick).toHaveBeenCalledTimes(2);
    rerender(<Button onClick={onClick} disabled>Save</Button>);
    await user.keyboard("{Enter} ");
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  test("IconButton activates from the keyboard", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<IconButton label="Settings" onClick={onClick}>⚙</IconButton>);
    screen.getByRole("button", { name: "Settings" }).focus();
    await user.keyboard("{Enter}");
    expect(onClick).toHaveBeenCalledOnce();
  });

  test("Link follows its href with native Enter behavior", async () => {
    const user = userEvent.setup();
    render(<Link href="#destination">Destination</Link>);
    screen.getByRole("link", { name: "Destination" }).focus();
    await user.keyboard("{Enter}");
    expect(window.location.hash).toBe("#destination");
  });

  test("Input and Textarea accept keyboard editing through their labels", async () => {
    const user = userEvent.setup();
    render(<><Input id="subject" label="Subject" /><Textarea id="body" label="Body" /></>);
    await user.click(screen.getByLabelText("Subject"));
    await user.keyboard("Hello");
    expect(screen.getByLabelText("Subject")).toHaveValue("Hello");
    await user.tab();
    await user.keyboard("Line one{Enter}Line two");
    expect(screen.getByLabelText("Body")).toHaveValue("Line one\nLine two");
  });

  test("Checkbox and Switch toggle with Space", async () => {
    const user = userEvent.setup();
    render(<><Checkbox id="terms-keyboard" label="Terms" /><Switch id="alerts-keyboard" label="Alerts" /></>);
    const checkbox = screen.getByRole("checkbox", { name: "Terms" });
    checkbox.focus();
    await user.keyboard(" ");
    expect(checkbox).toBeChecked();
    await user.tab();
    await user.keyboard(" ");
    expect(screen.getByRole("switch", { name: "Alerts" })).toBeChecked();
  });

  test("Select supports native keyboard selection", async () => {
    const user = userEvent.setup();
    render(<Select id="role-keyboard" label="Role"><option value="admin">Admin</option><option value="editor">Editor</option></Select>);
    const select = screen.getByRole("combobox", { name: "Role" });
    select.focus();
    await user.selectOptions(select, "editor");
    expect(select).toHaveValue("editor");
  });

  test("Pagination activates the next page with Enter", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Pagination page={1} pageCount={2} onChange={onChange} />);
    screen.getByRole("button", { name: "Next" }).focus();
    await user.keyboard("{Enter}");
    expect(onChange).toHaveBeenCalledWith(2);
  });
});

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

  test("cannot be changed into another native input type", () => {
    render(React.createElement(Checkbox, { id: "fixed-checkbox", label: "Fixed checkbox", type: "radio" } as never));
    expect(screen.getByRole("checkbox", { name: "Fixed checkbox" })).toHaveAttribute("type", "checkbox");
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

  test("accepts a localized navigation label", () => {
    render(<Breadcrumb ariaLabel="パンくずリスト" items={[{ label: "現在地" }]} />);
    expect(screen.getByRole("navigation", { name: "パンくずリスト" })).toBeInTheDocument();
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

  test("accepts localized navigation, controls, and page status", () => {
    render(
      <Pagination
        page={2}
        pageCount={5}
        onChange={() => undefined}
        ariaLabel="ページ送り"
        previousLabel="前へ"
        nextLabel="次へ"
        formatPageStatus={(page, pageCount) => `${pageCount}ページ中${page}ページ目`}
      />,
    );
    const navigation = screen.getByRole("navigation", { name: "ページ送り" });
    expect(within(navigation).getByRole("button", { name: "前へ" })).toBeInTheDocument();
    expect(within(navigation).getByRole("button", { name: "次へ" })).toBeInTheDocument();
    expect(within(navigation).getByText("5ページ中2ページ目")).toHaveAttribute("aria-live", "polite");
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

  test("associates both hint and error text without leaking custom attributes", () => {
    render(<Select id="language" label="Language" hint="Choose one" error="Required"><option>English</option></Select>);
    const select = screen.getByRole("combobox", { name: "Language" });
    expect(select).toHaveAttribute("aria-describedby", "language-hint language-error");
    expect(select).not.toHaveAttribute("hint");
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
  test("exposes only the ordinary close action", () => {
    render(<Dialog open onClose={() => undefined} title="Information">Body</Dialog>);
    expect(screen.getByRole("dialog", { name: "Information" })).toBeInTheDocument();
    const dialog = screen.getByRole("dialog", { name: "Information" });
    expect(within(dialog).getAllByRole("button").map((button) => button.textContent)).toEqual(["Close"]);
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });
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

  test("accepts a localized close label", () => {
    render(<Dialog open onClose={() => undefined} title="設定" closeLabel="閉じる">内容</Dialog>);
    expect(screen.getByRole("button", { name: "閉じる" })).toBeInTheDocument();
  });
});

describe("AlertDialog action contract", () => {
  test("keeps destructive confirmation distinct from cancellation", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    const onClose = vi.fn();
    const { rerender } = render(<AlertDialog open title="Delete project" onClose={onClose} onConfirm={onConfirm}>This cannot be undone.</AlertDialog>);
    await user.click(screen.getByRole("button", { name: "Confirm" }));
    expect(onConfirm).toHaveBeenCalledOnce();
    expect(onClose).toHaveBeenCalledOnce();

    rerender(<AlertDialog open title="Delete project" onClose={onClose} onConfirm={onConfirm}>This cannot be undone.</AlertDialog>);
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onConfirm).toHaveBeenCalledOnce();
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  test("locks actions while pending and reports a rejected confirmation", async () => {
    const user = userEvent.setup();
    let reject!: (reason?: unknown) => void;
    const pending = new Promise<void>((_, rejectPromise) => { reject = rejectPromise; });
    const onClose = vi.fn();
    render(<AlertDialog open title="Delete project" onClose={onClose} onConfirm={() => pending}>This cannot be undone.</AlertDialog>);

    await user.click(screen.getByRole("button", { name: "Confirm" }));
    expect(screen.getByRole("button", { name: "Confirming…" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();
    await user.keyboard("{Escape}");
    expect(onClose).not.toHaveBeenCalled();

    reject(new Error("network"));
    expect(await screen.findByRole("alert")).toHaveTextContent("Confirmation failed");
    expect(screen.getByRole("button", { name: "Confirm" })).toBeEnabled();
    expect(onClose).not.toHaveBeenCalled();
  });

  test("accepts a localized pending confirmation label", () => {
    render(
      <AlertDialog
        open
        confirming
        title="削除"
        onClose={() => undefined}
        onConfirm={() => undefined}
        confirmLabel="削除する"
        confirmingLabel="削除中…"
        cancelLabel="キャンセル"
      >
        元に戻せません。
      </AlertDialog>,
    );
    expect(screen.getByRole("button", { name: "削除中…" })).toBeDisabled();
  });

  test("Escape cancels and restores focus to the trigger", async () => {
    const user = userEvent.setup();
    function Example() {
      const [open, setOpen] = React.useState(false);
      return <><button onClick={() => setOpen(true)}>Delete</button><AlertDialog open={open} title="Delete project" onClose={() => setOpen(false)} onConfirm={() => undefined}>Sure?</AlertDialog></>;
    }
    render(<Example />);
    const trigger = screen.getByRole("button", { name: "Delete" });
    await user.click(trigger);
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  test("an old confirmation cannot close a newly opened dialog", async () => {
    const user = userEvent.setup();
    let resolve!: () => void;
    const pending = new Promise<void>((resolvePromise) => { resolve = resolvePromise; });
    const onClose = vi.fn();
    const props = { title: "Delete project", onClose, onConfirm: () => pending, children: "Sure?" };
    const { rerender } = render(<AlertDialog open {...props} />);
    await user.click(screen.getByRole("button", { name: "Confirm" }));
    rerender(<AlertDialog open={false} {...props} />);
    rerender(<AlertDialog open {...props} />);
    await act(async () => resolve());
    expect(screen.getByRole("alertdialog", { name: "Delete project" })).toBeInTheDocument();
    expect(onClose).not.toHaveBeenCalled();
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

  test("accepts a localized tab-list label", () => {
    render(<Tabs ariaLabel="表示切り替え" items={[{ value: "a", label: "概要", content: "内容" }]} />);
    expect(screen.getByRole("tablist", { name: "表示切り替え" })).toBeInTheDocument();
  });
});

describe("Overlay keyboard contracts", () => {
  test("tooltip composes an interactive child without nesting buttons", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Tooltip label="Helpful hint">
        <Button variant="secondary" onClick={onClick}>Visible trigger</Button>
      </Tooltip>,
    );

    const trigger = screen.getByRole("button", { name: "Visible trigger" });
    expect(screen.getAllByRole("button")).toHaveLength(1);
    expect(trigger).toHaveClass("ads-btn", "ads-btn--secondary", "ads-btn--md");
    trigger.focus();
    expect(await screen.findByRole("tooltip")).toHaveTextContent("Helpful hint");
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    await user.click(trigger);
    expect(onClick).toHaveBeenCalledOnce();
  });

  test("tooltip preserves ADS IconButton and Link trigger semantics", () => {
    const iconClick = vi.fn();
    const linkClick = vi.fn((event: React.MouseEvent<HTMLAnchorElement>) => event.preventDefault());
    const { rerender } = render(
      <Tooltip label="Open settings help">
        <IconButton
          id="settings-trigger"
          label="Settings"
          type="submit"
          form="settings-form"
          data-audit-id="settings"
          aria-controls="settings-panel"
          onClick={iconClick}
        >
          ⚙
        </IconButton>
      </Tooltip>,
    );

    const iconTrigger = screen.getByRole("button", { name: "Settings" });
    expect(screen.getAllByRole("button")).toHaveLength(1);
    expect(iconTrigger).toHaveAttribute("id", "settings-trigger");
    expect(iconTrigger).toHaveAttribute("type", "submit");
    expect(iconTrigger).toHaveAttribute("form", "settings-form");
    expect(iconTrigger).toHaveAttribute("data-audit-id", "settings");
    expect(iconTrigger).toHaveAttribute("aria-controls", "settings-panel");
    expect(iconTrigger).toHaveClass("ads-icon-btn");

    rerender(
      <Tooltip label="Atlas help">
        <Link
          id="atlas-trigger"
          href="/atlas"
          target="_blank"
          rel="noreferrer"
          data-audit-id="atlas"
          aria-label="Open Atlas"
          onClick={linkClick}
        >
          Atlas
        </Link>
      </Tooltip>,
    );
    const linkTrigger = screen.getByRole("link", { name: "Open Atlas" });
    expect(linkTrigger).toHaveAttribute("href", "/atlas");
    expect(linkTrigger).toHaveAttribute("target", "_blank");
    expect(linkTrigger).toHaveAttribute("rel", "noreferrer");
    expect(linkTrigger).toHaveAttribute("id", "atlas-trigger");
    expect(linkTrigger).toHaveAttribute("data-audit-id", "atlas");
    expect(linkTrigger).toHaveClass("ads-link");
  });

  test("tooltip preserves native trigger attributes and never nests interactive DOM", () => {
    const onKeyDown = vi.fn();
    const { container, rerender } = render(
      <Tooltip label="Native help">
        <button
          id="native-trigger"
          type="button"
          form="native-form"
          data-audit-id="native"
          aria-pressed="false"
          onKeyDown={onKeyDown}
        >
          Native trigger
        </button>
      </Tooltip>,
    );
    const button = screen.getByRole("button", { name: "Native trigger" });
    expect(button).toHaveAttribute("id", "native-trigger");
    expect(button).toHaveAttribute("type", "button");
    expect(button).toHaveAttribute("form", "native-form");
    expect(button).toHaveAttribute("data-audit-id", "native");
    expect(button).toHaveAttribute("aria-pressed", "false");
    expect(container.querySelector("button button, button a, a button, a a")).toBeNull();

    rerender(<Tooltip label="Native link help"><a href="/docs" data-audit-id="docs">Read docs</a></Tooltip>);
    expect(screen.getByRole("link", { name: "Read docs" })).toHaveAttribute("data-audit-id", "docs");
    expect(container.querySelector("button button, button a, a button, a a")).toBeNull();
  });

  test("tooltip safely adapts an unsupported custom interactive child", () => {
    function CustomTrigger({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
      return <button {...props}>{children}</button>;
    }
    const onClick = vi.fn();
    const { container } = render(
      <Tooltip label="Custom help">
        <CustomTrigger id="custom-trigger" data-audit-id="custom" aria-label="Custom action" onClick={onClick}>
          <span>Custom</span>
        </CustomTrigger>
      </Tooltip>,
    );
    const trigger = screen.getByRole("button", { name: "Custom action" });
    expect(screen.getAllByRole("button")).toHaveLength(1);
    expect(trigger).toHaveAttribute("id", "custom-trigger");
    expect(trigger).toHaveAttribute("data-audit-id", "custom");
    expect(trigger).toHaveAttribute("data-tooltip-trigger-fallback", "");
    expect(trigger).toHaveTextContent("Custom");
    expect(container.querySelector("button button, button a, a button, a a")).toBeNull();
  });

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
