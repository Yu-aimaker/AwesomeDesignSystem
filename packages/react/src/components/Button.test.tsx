import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import { Button } from "./Button";
import { Input } from "./Input";
import { EmptyState, ErrorState } from "./Status";
import { Tabs } from "./Tabs";
import { Dialog } from "./Dialog";

describe("react components", () => {
  test("button exposes accessible name and disabled/loading states", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const { rerender } = render(<Button onClick={onClick}>Save</Button>);
    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(onClick).toHaveBeenCalledOnce();
    rerender(<Button loading>Save</Button>);
    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
    expect(Button.metadata.ruleIds).toContain("rule.a11y.wcag-aa");
  });

  test("input wires label and error alert", () => {
    render(<Input id="email" label="Email" error="Required" />);
    expect(screen.getByLabelText("Email")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("alert")).toHaveTextContent("Required");
  });

  test("tabs selectable roles", async () => {
    const user = userEvent.setup();
    render(<Tabs items={[{ value: "a", label: "Alpha", content: "A body" }, { value: "b", label: "Beta", content: "B body" }]} />);
    expect(screen.getByRole("tab", { name: "Alpha" })).toHaveAttribute("aria-selected", "true");
    await user.click(screen.getByRole("tab", { name: "Beta" }));
    expect(screen.getByRole("tab", { name: "Beta" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("B body")).toBeInTheDocument();
  });

  test("dialog uses modal semantics", () => {
    render(<Dialog open title="Confirm" onClose={() => {}}>Body</Dialog>);
    expect(screen.getByRole("dialog", { name: "Confirm" })).toBeInTheDocument();
  });

  test("empty and error recovery states", () => {
    render(
      <>
        <EmptyState title="No items" description="Create one to start." actionLabel="Create" />
        <ErrorState title="Failed" description="Try again." actionLabel="Retry" />
      </>,
    );
    expect(screen.getByText("No items")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent("Failed");
    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
  });
});
