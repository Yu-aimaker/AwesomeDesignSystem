import { useState, type ReactNode } from "react";
import {
  AlignCenter, AlignLeft, AlignRight, Bold, Bookmark, Copy, FileText, Home, Italic, LayoutGrid, List, MoreHorizontal, Pencil, Plus, Search, Settings, Share2, Trash2, Underline,
} from "lucide-react";
import type { PlaygroundState } from "../layout/Playground";
import type { ComponentEntry, ComponentGroup } from "./registry.types";
export type { ComponentEntry, ComponentGroup } from "./registry.types";
import { defaultLocale, localeMeta, type Locale } from "../i18n/locales";
import { registryMessages, type RegistryMessages } from "../i18n/messages/registry";

import { Accordion } from "./components/Accordion";
import { Alert, type AlertTone } from "./components/Alert";
import { Avatar, AvatarGroup } from "./components/Avatar";
import { Badge, type BadgeTone } from "./components/Badge";
import { Breadcrumb } from "./components/Breadcrumb";
import { Button, type ButtonSize, type ButtonVariant } from "./components/Button";
import { Calendar } from "./components/Calendar";
import { Card, CardDescription, CardMedia, CardTitle, MediaCard } from "./components/Card";
import { Checkbox } from "./components/Checkbox";
import { Chip } from "./components/Chip";
import { Combobox } from "./components/Combobox";
import { CommandMenu } from "./components/CommandMenu";
import { DataTable } from "./components/DataTable";
import { DatePicker } from "./components/DatePicker";
import { Dialog } from "./components/Dialog";
import { Divider } from "./components/Divider";
import { DropdownMenu, type MenuItem } from "./components/DropdownMenu";
import { EmptyState } from "./components/EmptyState";
import { ErrorState } from "./components/ErrorState";
import { FileUpload, type UploadItem } from "./components/FileUpload";
import { Input } from "./components/Input";
import { Kbd } from "./components/Kbd";
import { Link, type LinkVariant } from "./components/Link";
import { NavBar } from "./components/NavBar";
import { Pagination } from "./components/Pagination";
import { Popover } from "./components/Popover";
import { Progress } from "./components/Progress";
import { Radio, RadioGroup } from "./components/Radio";
import { Rating } from "./components/Rating";
import { SegmentedControl } from "./components/SegmentedControl";
import { Select } from "./components/Select";
import { Sheet } from "./components/Sheet";
import { Skeleton, SkeletonCard } from "./components/Skeleton";
import { Slider } from "./components/Slider";
import { Spinner } from "./components/Spinner";
import { StatTile, type DeltaTone } from "./components/StatTile";
import { Stepper } from "./components/Stepper";
import { Switch } from "./components/Switch";
import { Table } from "./components/Table";
import { Tabs } from "./components/Tabs";
import { TagInput } from "./components/TagInput";
import { Textarea } from "./components/Textarea";
import { Timeline, type TimelineTone } from "./components/Timeline";
import { ToastProvider, useToast, type ToastTone } from "./components/Toast";
import { ToggleGroup } from "./components/ToggleGroup";
import { Tooltip } from "./components/Tooltip";

import AccordionSrc from "./components/Accordion.tsx?raw";
import AlertSrc from "./components/Alert.tsx?raw";
import AvatarSrc from "./components/Avatar.tsx?raw";
import BadgeSrc from "./components/Badge.tsx?raw";
import BreadcrumbSrc from "./components/Breadcrumb.tsx?raw";
import ButtonSrc from "./components/Button.tsx?raw";
import CalendarSrc from "./components/Calendar.tsx?raw";
import CardSrc from "./components/Card.tsx?raw";
import CheckboxSrc from "./components/Checkbox.tsx?raw";
import ChipSrc from "./components/Chip.tsx?raw";
import ComboboxSrc from "./components/Combobox.tsx?raw";
import CommandMenuSrc from "./components/CommandMenu.tsx?raw";
import DataTableSrc from "./components/DataTable.tsx?raw";
import DatePickerSrc from "./components/DatePicker.tsx?raw";
import DialogSrc from "./components/Dialog.tsx?raw";
import DividerSrc from "./components/Divider.tsx?raw";
import DropdownMenuSrc from "./components/DropdownMenu.tsx?raw";
import EmptyStateSrc from "./components/EmptyState.tsx?raw";
import ErrorStateSrc from "./components/ErrorState.tsx?raw";
import FileUploadSrc from "./components/FileUpload.tsx?raw";
import InputSrc from "./components/Input.tsx?raw";
import KbdSrc from "./components/Kbd.tsx?raw";
import LinkSrc from "./components/Link.tsx?raw";
import NavBarSrc from "./components/NavBar.tsx?raw";
import PaginationSrc from "./components/Pagination.tsx?raw";
import PopoverSrc from "./components/Popover.tsx?raw";
import ProgressSrc from "./components/Progress.tsx?raw";
import RadioSrc from "./components/Radio.tsx?raw";
import RatingSrc from "./components/Rating.tsx?raw";
import SegmentedControlSrc from "./components/SegmentedControl.tsx?raw";
import SelectSrc from "./components/Select.tsx?raw";
import SheetSrc from "./components/Sheet.tsx?raw";
import SkeletonSrc from "./components/Skeleton.tsx?raw";
import SliderSrc from "./components/Slider.tsx?raw";
import SpinnerSrc from "./components/Spinner.tsx?raw";
import StatTileSrc from "./components/StatTile.tsx?raw";
import StepperSrc from "./components/Stepper.tsx?raw";
import SwitchSrc from "./components/Switch.tsx?raw";
import TableSrc from "./components/Table.tsx?raw";
import TabsSrc from "./components/Tabs.tsx?raw";
import TagInputSrc from "./components/TagInput.tsx?raw";
import TextareaSrc from "./components/Textarea.tsx?raw";
import TimelineSrc from "./components/Timeline.tsx?raw";
import ToastSrc from "./components/Toast.tsx?raw";
import ToggleGroupSrc from "./components/ToggleGroup.tsx?raw";
import TooltipSrc from "./components/Tooltip.tsx?raw";

/* ----------------------------------------------------------------------------
 * Helpers: read typed values out of the untyped PlaygroundState and build JSX.
 * ------------------------------------------------------------------------- */

const str = <T extends string = string>(s: PlaygroundState, k: string, fallback = ""): T => (typeof s[k] === "string" ? (s[k] as T) : (fallback as T));
const num = (s: PlaygroundState, k: string, fallback = 0): number => (typeof s[k] === "number" ? (s[k] as number) : fallback);
const bool = (s: PlaygroundState, k: string): boolean => s[k] === true;

/** Renders props as JSX attributes; omits false, undefined and empty strings. */
function attrs(props: Record<string, string | number | boolean | undefined>): string {
  return Object.entries(props)
    .filter(([, v]) => v !== undefined && v !== false && v !== "")
    .map(([k, v]) => (v === true ? k : typeof v === "number" ? `${k}={${v}}` : `${k}="${v}"`))
    .map((a) => ` ${a}`)
    .join("");
}

const ICON = "focus-visible";

/** Everything below depends on the locale: built once per locale by `registryFor`. */
function build(t: RegistryMessages, locale: Locale) {
  const tag = localeMeta[locale].tag;

  /* ----------------------------------------------------------------------------
   * Demo wrappers: each keeps the local state a live component needs.
   * ------------------------------------------------------------------------- */

  function DialogDemo({ description, footer }: { description: boolean; footer: boolean }) {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="secondary" onClick={() => setOpen(true)}>
          {t.openDialog}
        </Button>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          title={t.deleteDraftTitle}
          description={description ? t.cannotUndo : undefined}
          footer={
            footer ? (
              <>
                <Button variant="secondary" onClick={() => setOpen(false)}>
                  {t.cancel}
                </Button>
                <Button variant="danger" onClick={() => setOpen(false)}>
                  {t.deleteConfirm}
                </Button>
              </>
            ) : undefined
          }
        >
          <p className="t-body-sm text-ink-secondary">{t.deleteReportBody}</p>
        </Dialog>
      </>
    );
  }

  function SheetDemo({ side, footer }: { side: "right" | "bottom"; footer: boolean }) {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="secondary" onClick={() => setOpen(true)}>
          {t.openSheet}
        </Button>
        <Sheet
          open={open}
          onClose={() => setOpen(false)}
          side={side}
          title={t.filter}
          description={t.filterDescription}
          footer={
            footer ? (
              <>
                <Button variant="ghost" onClick={() => setOpen(false)}>
                  {t.reset}
                </Button>
                <Button onClick={() => setOpen(false)}>{t.apply}</Button>
              </>
            ) : undefined
          }
        >
          <div className="flex flex-col gap-5">
            <Input label={t.keyword} placeholder={t.keywordPlaceholder} />
            <Checkbox label={t.unreadOnly} />
            <Checkbox label={t.hasAttachments} />
          </div>
        </Sheet>
      </>
    );
  }

  function CommandMenuDemo({ groups }: { groups: number }) {
    const [open, setOpen] = useState(false);
    const all = [
      {
        heading: t.pages,
        items: [
          { id: "home", label: t.home, icon: <Home strokeWidth={1.75} />, shortcut: ["G", "H"] },
          { id: "components", label: t.components, icon: <LayoutGrid strokeWidth={1.75} />, shortcut: ["G", "C"] },
          { id: "docs", label: t.docs, icon: <FileText strokeWidth={1.75} /> },
        ],
      },
      {
        heading: t.actions,
        items: [
          { id: "new", label: t.createNew, icon: <Plus strokeWidth={1.75} />, shortcut: ["N"] },
          { id: "search", label: t.search, icon: <Search strokeWidth={1.75} />, shortcut: ["/"] },
          { id: "settings", label: t.settings, icon: <Settings strokeWidth={1.75} />, shortcut: ["⌘", ","] },
        ],
      },
      { heading: t.recent, items: [{ id: "r1", label: t.q3Report, keywords: ["report"] }, { id: "r2", label: t.invoice1043 }] },
    ];
    return (
      <>
        <Button variant="secondary" onClick={() => setOpen(true)} className="gap-3">
          {t.commandMenu} <Kbd keys={["⌘", "K"]} />
        </Button>
        <CommandMenu open={open} onClose={() => setOpen(false)} groups={all.slice(0, groups)} />
      </>
    );
  }

  function ToastButton({ tone, description }: { tone: ToastTone; description: boolean }) {
    const { push } = useToast();
    const titles: Record<ToastTone, string> = { neutral: t.exportedRows, success: t.saved, danger: t.saveFailed };
    return (
      <Button variant="secondary" onClick={() => push({ title: titles[tone], description: description ? t.checkDownloads : undefined, tone })}>
        {t.showToast}
      </Button>
    );
  }

  function SwitchDemo({ disabled }: { disabled: boolean }) {
    const [on, setOn] = useState(true);
    return <Switch label={t.receiveNotifications} checked={on} onChange={setOn} disabled={disabled} />;
  }

  function SliderDemo({ range, step, showValue, disabled }: { range: boolean; step: number; showValue: boolean; disabled: boolean }) {
    const [single, setSingle] = useState(40);
    const [pair, setPair] = useState<[number, number]>([20, 60]);
    return (
      <div className="w-72">
        {range ? (
          <Slider label={t.priceRange} value={pair} onChange={setPair} min={0} max={100} step={step} showValue={showValue} formatValue={(v) => `¥${v * 100}`} disabled={disabled} />
        ) : (
          <Slider label={t.volume} value={single} onChange={setSingle} min={0} max={100} step={step} showValue={showValue} formatValue={(v) => `${v}%`} disabled={disabled} />
        )}
      </div>
    );
  }

  const fruits = [
    { value: "apple", label: t.apple, description: t.aomori },
    { value: "grape", label: t.grape, description: t.yamanashi },
    { value: "peach", label: t.peach, description: t.okayama },
    { value: "mikan", label: t.mikan, description: t.ehime },
    { value: "melon", label: t.melon, description: t.hokkaido },
    { value: "kaki", label: t.persimmon, description: t.wakayama, disabled: true },
  ];

  function ComboboxDemo({ disabled, helper }: { disabled: boolean; helper: boolean }) {
    const [value, setValue] = useState<string | null>("grape");
    return (
      <div className="w-72">
        <Combobox label={t.regionalFruit} options={fruits} value={value} onChange={setValue} helper={helper ? t.typeToFilter : undefined} disabled={disabled} />
      </div>
    );
  }

  function TagInputDemo({ max, disabled }: { max: number; disabled: boolean }) {
    const [tags, setTags] = useState(["design", "tokens"]);
    return (
      <div className="w-72">
        <TagInput label={t.tags} value={tags} onChange={setTags} max={max > 0 ? max : undefined} helper={t.tagHelper} disabled={disabled} />
      </div>
    );
  }

  function FileUploadDemo({ withList, maxSize, disabled }: { withList: boolean; maxSize: number; disabled: boolean }) {
    const [items, setItems] = useState<UploadItem[]>(
      withList
        ? [
            { id: "a", name: "brand-guidelines.pdf", size: 2_400_000, status: "ready" },
            { id: "b", name: "logo-4k.png", size: 14_800_000, status: "error", error: t.overLimit(maxSize) },
          ]
        : [],
    );
    return (
      <div className="w-full max-w-md">
        <FileUpload label={t.uploadFiles} accept="image/*,.pdf" maxSizeMB={maxSize} value={items} onChange={setItems} disabled={disabled} />
      </div>
    );
  }

  function DatePickerDemo({ preset, disabled, error }: { preset: boolean; disabled: boolean; error: boolean }) {
    const [date, setDate] = useState<Date | null>(preset ? new Date(2026, 8, 7) : null);
    return (
      <div className="w-72">
        <DatePicker label={t.publishDate} value={date} onChange={setDate} helper={t.publishDateHelper} error={error ? t.noPastDates : undefined} disabled={disabled} />
      </div>
    );
  }

  function CalendarDemo({ weekStartsOn, limited }: { weekStartsOn: 0 | 1; limited: boolean }) {
    const [date, setDate] = useState<Date | null>(new Date(2026, 8, 7));
    const min = limited ? new Date(2026, 8, 3) : undefined;
    const max = limited ? new Date(2026, 8, 24) : undefined;
    return <Calendar value={date} onChange={setDate} defaultMonth={new Date(2026, 8, 1)} weekStartsOn={weekStartsOn} min={min} max={max} />;
  }

  function RatingDemo({ max, size, readOnly, disabled }: { max: number; size: "sm" | "md"; readOnly: boolean; disabled: boolean }) {
    const [value, setValue] = useState(3);
    return <Rating value={Math.min(value, max)} onChange={setValue} max={max} size={size} readOnly={readOnly} disabled={disabled} />;
  }

  function SegmentedDemo({ size, fullWidth, disabled, icons }: { size: "sm" | "md"; fullWidth: boolean; disabled: boolean; icons: boolean }) {
    const [view, setView] = useState<"list" | "grid" | "board">("list");
    return (
      <div className={fullWidth ? "w-72" : undefined}>
        <SegmentedControl
          label={t.view}
          value={view}
          onChange={setView}
          size={size}
          fullWidth={fullWidth}
          disabled={disabled}
          options={[
            { value: "list", label: t.list, icon: icons ? <List strokeWidth={1.75} /> : undefined },
            { value: "grid", label: t.grid, icon: icons ? <LayoutGrid strokeWidth={1.75} /> : undefined },
            { value: "board", label: t.board, icon: icons ? <Bookmark strokeWidth={1.75} /> : undefined },
          ]}
        />
      </div>
    );
  }

  function ToggleGroupDemo({ type, size, disabled }: { type: "single" | "multiple"; size: "sm" | "md"; disabled: boolean }) {
    const [align, setAlign] = useState<"left" | "center" | "right" | null>("left");
    const [styles, setStyles] = useState<Array<"bold" | "italic" | "underline">>(["bold"]);
    if (type === "single") {
      return (
        <ToggleGroup
          type="single"
          label={t.textAlign}
          value={align}
          onChange={setAlign}
          size={size}
          disabled={disabled}
          items={[
            { value: "left", label: t.alignLeft, icon: <AlignLeft strokeWidth={1.75} />, iconOnly: true },
            { value: "center", label: t.alignCenter, icon: <AlignCenter strokeWidth={1.75} />, iconOnly: true },
            { value: "right", label: t.alignRight, icon: <AlignRight strokeWidth={1.75} />, iconOnly: true },
          ]}
        />
      );
    }
    return (
      <ToggleGroup
        type="multiple"
        label={t.textStyle}
        value={styles}
        onChange={setStyles}
        size={size}
        disabled={disabled}
        items={[
          { value: "bold", label: t.bold, icon: <Bold strokeWidth={1.75} />, iconOnly: true },
          { value: "italic", label: t.italic, icon: <Italic strokeWidth={1.75} />, iconOnly: true },
          { value: "underline", label: t.underline, icon: <Underline strokeWidth={1.75} />, iconOnly: true },
        ]}
      />
    );
  }

  function ChipDemo({ removable, size, disabled }: { removable: boolean; size: "sm" | "md"; disabled: boolean }) {
    const all = [t.design, t.frontend, t.accessibility, t.motion];
    const [selected, setSelected] = useState<string[]>([t.design]);
    const [items, setItems] = useState(all);
    return (
      <div className="flex flex-wrap gap-2">
        {items.map((label) => (
          <Chip
            key={label}
            size={size}
            disabled={disabled}
            selected={selected.includes(label)}
            onSelectedChange={(on) => setSelected((s) => (on ? [...s, label] : s.filter((x) => x !== label)))}
            onRemove={removable ? () => setItems((list) => list.filter((x) => x !== label)) : undefined}
          >
            {label}
          </Chip>
        ))}
        {items.length < all.length && (
          <Button variant="ghost" size="sm" onClick={() => setItems(all)}>
            {t.restore}
          </Button>
        )}
      </div>
    );
  }

  function PaginationDemo({ total, siblings, size }: { total: number; siblings: number; size: "sm" | "md" }) {
    const [page, setPage] = useState(Math.min(5, total));
    return <Pagination page={Math.min(page, total)} total={total} onChange={setPage} siblings={siblings} size={size} />;
  }

  function StepperDemo({ orientation, current, clickable }: { orientation: "horizontal" | "vertical"; current: number; clickable: boolean }) {
    const [step, setStep] = useState(current);
    const active = clickable ? step : current;
    return (
      <div className={orientation === "horizontal" ? "w-full max-w-lg" : undefined}>
        <Stepper
          orientation={orientation}
          current={active}
          onStepClick={clickable ? setStep : undefined}
          steps={[
            { label: t.account, description: t.emailAndName },
            { label: t.plan, description: t.monthlyOrYearly },
            { label: t.payment, description: t.addCard },
            { label: t.review },
          ]}
        />
      </div>
    );
  }

  function DropdownMenuDemo({ align, withDanger }: { align: "start" | "end"; withDanger: boolean }) {
    const items: MenuItem[] = [
      { id: "edit", label: t.edit, icon: <Pencil strokeWidth={1.75} />, shortcut: "E" },
      { id: "copy", label: t.duplicate, icon: <Copy strokeWidth={1.75} />, shortcut: "⌘D" },
      { id: "share", label: t.share, icon: <Share2 strokeWidth={1.75} /> },
      { id: "archive", label: t.archive, disabled: true },
    ];
    if (withDanger) items.push({ type: "separator", id: "sep" }, { id: "delete", label: t.delete, icon: <Trash2 strokeWidth={1.75} />, danger: true });
    return (
      <DropdownMenu
        align={align}
        items={items}
        trigger={(props) => (
          <Button variant="secondary" {...props}>
            {t.actions} <MoreHorizontal strokeWidth={1.75} />
          </Button>
        )}
      />
    );
  }

  function AlertDemo({ tone, dismissible, action, body }: { tone: AlertTone; dismissible: boolean; action: boolean; body: boolean }) {
    const [shown, setShown] = useState(true);
    const copy: Record<AlertTone, [string, string]> = {
      neutral: [t.maintenanceTitle, t.maintenanceBody],
      info: [t.newVersionTitle, t.newVersionBody],
      success: [t.paymentDoneTitle, t.paymentDoneBody],
      warning: [t.storageLowTitle, t.storageLowBody],
      danger: [t.syncFailedTitle, t.syncFailedBody],
    };
    if (!shown) {
      return (
        <Button variant="ghost" size="sm" onClick={() => setShown(true)}>
          {t.showAgain}
        </Button>
      );
    }
    return (
      <div className="w-full max-w-md">
        <Alert
          tone={tone}
          title={copy[tone][0]}
          onDismiss={dismissible ? () => setShown(false) : undefined}
          action={
            action ? (
              <Button variant="secondary" size="sm">
                {tone === "danger" ? t.retry : t.viewDetails}
              </Button>
            ) : undefined
          }
        >
          {body ? copy[tone][1] : undefined}
        </Alert>
      </div>
    );
  }

  interface Invoice {
    id: string;
    customer: string;
    amount: number;
    status: "paid" | "pending" | "overdue";
    due: string;
  }

  const invoices: Invoice[] = [
    { id: "INV-1041", customer: t.cust1, amount: 128000, status: "paid", due: "2026-08-31" },
    { id: "INV-1042", customer: t.cust2, amount: 54000, status: "pending", due: "2026-09-10" },
    { id: "INV-1043", customer: t.cust3, amount: 312000, status: "overdue", due: "2026-08-20" },
    { id: "INV-1044", customer: t.cust4, amount: 98000, status: "pending", due: "2026-09-15" },
    { id: "INV-1045", customer: t.cust5, amount: 21000, status: "paid", due: "2026-09-01" },
    { id: "INV-1046", customer: t.cust6, amount: 450000, status: "pending", due: "2026-09-30" },
  ];

  const statusBadge: Record<Invoice["status"], { tone: BadgeTone; label: string }> = {
    paid: { tone: "success", label: t.paid },
    pending: { tone: "neutral", label: t.pending },
    overdue: { tone: "danger", label: t.overdue },
  };

  function DataTableDemo({ rows, selectable, sticky, empty }: { rows: number; selectable: boolean; sticky: boolean; empty: boolean }) {
    const [selected, setSelected] = useState<string[]>(["INV-1043"]);
    return (
      <div className="w-full">
        <DataTable<Invoice>
          rows={empty ? [] : invoices.slice(0, rows)}
          rowKey={(r) => r.id}
          selectable={selectable}
          selected={selected}
          onSelectionChange={setSelected}
          stickyHeader={sticky}
          maxHeight={sticky ? "220px" : undefined}
          defaultSort={{ key: "due", dir: "asc" }}
          emptyState={<EmptyState title={t.noInvoices} description={t.noInvoicesBody} action={<Button size="sm">{t.create}</Button>} />}
          columns={[
            { key: "id", header: t.number, render: (r) => <span className="font-mono text-xs">{r.id}</span>, sortable: true, sortValue: (r) => r.id },
            { key: "customer", header: t.customer, render: (r) => r.customer, sortable: true, sortValue: (r) => r.customer },
            { key: "status", header: t.status, render: (r) => <Badge tone={statusBadge[r.status].tone}>{statusBadge[r.status].label}</Badge>, sortable: true, sortValue: (r) => r.status },
            { key: "due", header: t.due, render: (r) => r.due, sortable: true, sortValue: (r) => r.due },
            { key: "amount", header: t.amount, align: "right", render: (r) => `¥${r.amount.toLocaleString(tag)}`, sortable: true, sortValue: (r) => r.amount },
          ]}
        />
        {selectable && !empty && <p className="t-caption mt-2 tabular text-ink-muted">{t.selectedCount(selected.length)}</p>}
      </div>
    );
  }

  const people = [
    { name: "Aiko Tanaka" },
    { name: "Ren Suzuki" },
    { name: "Mio Sato" },
    { name: "Kaito Ito" },
    { name: "Yui Kobayashi" },
    { name: "Sora Watanabe" },
    { name: "Hana Yamamoto" },
  ];

  /* ----------------------------------------------------------------------------
   * The registry.
   * ------------------------------------------------------------------------- */

  const groups: Array<{ id: ComponentGroup; label: string }> = [
    { id: "actions", label: t.groupActions },
    { id: "inputs", label: t.groupInputs },
    { id: "selection", label: t.select },
    { id: "navigation", label: t.groupNavigation },
    { id: "overlay", label: t.groupOverlay },
    { id: "feedback", label: t.groupFeedback },
    { id: "data", label: t.groupData },
    { id: "layout", label: t.groupLayout },
    { id: "typography", label: t.groupTypography },
  ];

  const components: ComponentEntry[] = [
    /* ------------------------------------------------------------ actions */
    {
      id: "button",
      name: "Button",
      group: "actions",
      caption: t.caption.button,
      controls: [
        { type: "select", key: "variant", label: "variant", options: ["primary", "secondary", "ghost", "danger"] },
        { type: "select", key: "size", label: "size", options: ["sm", "md", "lg"] },
        { type: "toggle", key: "icon", label: t.icon },
        { type: "toggle", key: "loading", label: "loading" },
        { type: "toggle", key: "disabled", label: "disabled" },
      ],
      initial: { variant: "primary", size: "md", icon: false, loading: false, disabled: false },
      render: (s) => (
        <Button variant={str<ButtonVariant>(s, "variant", "primary")} size={str<ButtonSize>(s, "size", "md")} loading={bool(s, "loading")} disabled={bool(s, "disabled")}>
          {bool(s, "icon") && !bool(s, "loading") && <Plus strokeWidth={1.75} />}
          {t.save}
        </Button>
      ),
      code: (s) =>
        `<Button${attrs({ variant: str(s, "variant"), size: str(s, "size") !== "md" ? str(s, "size") : undefined, loading: bool(s, "loading"), disabled: bool(s, "disabled") })}>\n${bool(s, "icon") ? `  <Plus strokeWidth={1.75} />\n` : ""}  ${t.save}\n</Button>`,
      source: ButtonSrc,
      states: ["hover", ICON, "active", "disabled", "loading"],
      tokens: ["--ds-primary", "--ds-on-primary", "--ds-primary-hover", "--ds-hairline-strong", "--ds-radius-md", "--ds-control-sm", "--ds-control-md", "--ds-control-lg", "--ds-duration-instant"],
    },
    {
      id: "dropdown-menu",
      name: "DropdownMenu",
      group: "actions",
      caption: t.caption.dropdownMenu,
      controls: [
        { type: "select", key: "align", label: "align", options: ["start", "end"] },
        { type: "toggle", key: "danger", label: t.deleteItem },
      ],
      initial: { align: "start", danger: true },
      render: (s) => <DropdownMenuDemo align={str<"start" | "end">(s, "align", "start")} withDanger={bool(s, "danger")} />,
      code: (s) =>
        `<DropdownMenu\n  align="${str(s, "align")}"\n  trigger={(props) => <Button variant="secondary" {...props}>${t.actions}</Button>}\n  items={[\n    { id: "edit", label: "${t.edit}", icon: <Pencil />, shortcut: "E" },\n    { id: "copy", label: "${t.duplicate}", icon: <Copy /> },${bool(s, "danger") ? `\n    { type: "separator", id: "sep" },\n    { id: "delete", label: "${t.delete}", icon: <Trash2 />, danger: true },` : ""}\n  ]}\n/>`,
      source: DropdownMenuSrc,
      states: ["hover", ICON, "disabled", "open"],
      tokens: ["--ds-surface", "--ds-hairline", "--ds-radius-lg", "--ds-radius-md", "--ds-shadow-2", "--ds-danger", "--ds-duration-fast", "--ds-ease-out"],
    },

    /* ------------------------------------------------------------- inputs */
    {
      id: "input",
      name: "Input",
      group: "inputs",
      caption: t.caption.input,
      controls: [
        { type: "toggle", key: "helper", label: "helper" },
        { type: "toggle", key: "error", label: "error" },
        { type: "toggle", key: "disabled", label: "disabled" },
      ],
      initial: { helper: true, error: false, disabled: false },
      render: (s) => (
        <div className="w-72">
          <Input label={t.email} placeholder="name@company.com" helper={bool(s, "helper") ? t.workEmail : undefined} error={bool(s, "error") ? t.invalidEmail : undefined} disabled={bool(s, "disabled")} />
        </div>
      ),
      code: (s) => `<Input\n  label="${t.email}"\n  placeholder="name@company.com"${bool(s, "helper") ? `\n  helper="${t.workEmail}"` : ""}${bool(s, "error") ? `\n  error="${t.invalidEmail}"` : ""}${bool(s, "disabled") ? `\n  disabled` : ""}\n/>`,
      source: InputSrc,
      states: ["hover", ICON, "error", "disabled"],
      tokens: ["--ds-surface", "--ds-hairline-strong", "--ds-radius-md", "--ds-control-md", "--ds-danger", "--ds-ink-muted"],
    },
    {
      id: "textarea",
      name: "Textarea",
      group: "inputs",
      caption: t.caption.textarea,
      controls: [
        { type: "toggle", key: "autosize", label: "autosize" },
        { type: "range", key: "minRows", label: "minRows", min: 2, max: 6 },
        { type: "toggle", key: "error", label: "error" },
        { type: "toggle", key: "disabled", label: "disabled" },
      ],
      initial: { autosize: true, minRows: 3, error: false, disabled: false },
      render: (s) => (
        <div className="w-72">
          <Textarea
            key={`${s.autosize}-${s.minRows}`}
            label={t.notes}
            placeholder={t.notesPlaceholder}
            autosize={bool(s, "autosize")}
            minRows={num(s, "minRows", 3)}
            helper={t.markdownOk}
            error={bool(s, "error") ? t.max200 : undefined}
            disabled={bool(s, "disabled")}
            defaultValue={t.notesDefault}
          />
        </div>
      ),
      code: (s) => `<Textarea\n  label="${t.notes}"\n  helper="${t.markdownOk}"${bool(s, "autosize") ? "" : `\n  autosize={false}`}${num(s, "minRows", 3) !== 3 ? `\n  minRows={${num(s, "minRows")}}` : ""}${bool(s, "error") ? `\n  error="${t.max200}"` : ""}${bool(s, "disabled") ? `\n  disabled` : ""}\n/>`,
      source: TextareaSrc,
      states: ["hover", ICON, "error", "disabled", "read-only"],
      tokens: ["--ds-surface", "--ds-hairline-strong", "--ds-radius-md", "--ds-danger", "--ds-canvas-soft"],
    },
    {
      id: "select",
      name: "Select",
      group: "inputs",
      caption: t.caption.select,
      controls: [
        { type: "toggle", key: "helper", label: "helper" },
        { type: "toggle", key: "disabled", label: "disabled" },
      ],
      initial: { helper: false, disabled: false },
      render: (s) => (
        <div className="w-72">
          <Select label={t.timeZone} defaultValue="tokyo" helper={bool(s, "helper") ? t.timeZoneHelper : undefined} disabled={bool(s, "disabled")}>
            <option value="tokyo">{t.tokyo}</option>
            <option value="london">{t.london}</option>
            <option value="ny">{t.newYork}</option>
          </Select>
        </div>
      ),
      code: (s) => `<Select label="${t.timeZone}"${bool(s, "helper") ? ` helper="${t.timeZoneHelper}"` : ""}${bool(s, "disabled") ? " disabled" : ""}>\n  <option value="tokyo">${t.tokyo}</option>\n  <option value="london">${t.london}</option>\n</Select>`,
      source: SelectSrc,
      states: ["hover", ICON, "disabled"],
      tokens: ["--ds-surface", "--ds-hairline-strong", "--ds-radius-md", "--ds-control-md", "--ds-ink-muted"],
    },
    {
      id: "combobox",
      name: "Combobox",
      group: "inputs",
      caption: t.caption.combobox,
      controls: [
        { type: "toggle", key: "helper", label: "helper" },
        { type: "toggle", key: "disabled", label: "disabled" },
      ],
      initial: { helper: true, disabled: false },
      render: (s) => <ComboboxDemo helper={bool(s, "helper")} disabled={bool(s, "disabled")} />,
      code: (s) => `const [value, setValue] = useState<string | null>("grape");\n\n<Combobox\n  label="${t.regionalFruit}"\n  options={[{ value: "apple", label: "${t.apple}", description: "${t.aomori}" }, ...]}\n  value={value}\n  onChange={setValue}${bool(s, "helper") ? `\n  helper="${t.typeToFilter}"` : ""}${bool(s, "disabled") ? `\n  disabled` : ""}\n/>`,
      source: ComboboxSrc,
      states: ["hover", ICON, "open", "active option", "selected", "disabled", "empty"],
      tokens: ["--ds-surface", "--ds-hairline-strong", "--ds-hairline", "--ds-radius-md", "--ds-radius-lg", "--ds-shadow-2", "--ds-surface-sunken", "--ds-duration-fast"],
    },
    {
      id: "tag-input",
      name: "TagInput",
      group: "inputs",
      caption: t.caption.tagInput,
      controls: [
        { type: "range", key: "max", label: t.maxNone, min: 0, max: 8 },
        { type: "toggle", key: "disabled", label: "disabled" },
      ],
      initial: { max: 5, disabled: false },
      render: (s) => <TagInputDemo max={num(s, "max", 5)} disabled={bool(s, "disabled")} />,
      code: (s) => `const [tags, setTags] = useState(["design", "tokens"]);\n\n<TagInput label="${t.tags}" value={tags} onChange={setTags}${num(s, "max") > 0 ? ` max={${num(s, "max")}}` : ""}${bool(s, "disabled") ? " disabled" : ""} />`,
      source: TagInputSrc,
      states: ["hover", ICON, "disabled", "full"],
      tokens: ["--ds-surface", "--ds-hairline-strong", "--ds-surface-sunken", "--ds-radius-md", "--ds-radius-pill", "--ds-accent"],
    },
    {
      id: "slider",
      name: "Slider",
      group: "inputs",
      caption: t.caption.slider,
      controls: [
        { type: "toggle", key: "range", label: "range" },
        { type: "range", key: "step", label: "step", min: 1, max: 25 },
        { type: "toggle", key: "showValue", label: "showValue" },
        { type: "toggle", key: "disabled", label: "disabled" },
      ],
      initial: { range: false, step: 5, showValue: true, disabled: false },
      render: (s) => <SliderDemo range={bool(s, "range")} step={num(s, "step", 5)} showValue={bool(s, "showValue")} disabled={bool(s, "disabled")} />,
      code: (s) =>
        bool(s, "range")
          ? `const [range, setRange] = useState<[number, number]>([20, 60]);\n\n<Slider label="${t.priceRange}" value={range} onChange={setRange} min={0} max={100} step={${num(s, "step")}}${bool(s, "showValue") ? " showValue" : ""} formatValue={(v) => \`¥\${v * 100}\`}${bool(s, "disabled") ? " disabled" : ""} />`
          : `const [value, setValue] = useState(40);\n\n<Slider label="${t.volume}" value={value} onChange={setValue} min={0} max={100} step={${num(s, "step")}}${bool(s, "showValue") ? " showValue" : ""} formatValue={(v) => \`\${v}%\`}${bool(s, "disabled") ? " disabled" : ""} />`,
      source: SliderSrc,
      states: ["hover", ICON, "active", "disabled"],
      tokens: ["--ds-primary", "--ds-hairline", "--ds-surface", "--ds-shadow-2", "--ds-radius-pill", "--ds-duration-instant"],
    },
    {
      id: "file-upload",
      name: "FileUpload",
      group: "inputs",
      caption: t.caption.fileUpload,
      controls: [
        { type: "toggle", key: "list", label: t.withList },
        { type: "range", key: "maxSize", label: "maxSizeMB", min: 1, max: 50, unit: " MB" },
        { type: "toggle", key: "disabled", label: "disabled" },
      ],
      initial: { list: true, maxSize: 10, disabled: false },
      render: (s) => <FileUploadDemo key={`${s.list}-${s.maxSize}`} withList={bool(s, "list")} maxSize={num(s, "maxSize", 10)} disabled={bool(s, "disabled")} />,
      code: (s) => `const [files, setFiles] = useState<UploadItem[]>([]);\n\n<FileUpload label="${t.uploadFiles}" accept="image/*,.pdf" maxSizeMB={${num(s, "maxSize")}} value={files} onChange={setFiles}${bool(s, "disabled") ? " disabled" : ""} />`,
      source: FileUploadSrc,
      states: ["hover", ICON, "drag-over", "error", "disabled"],
      tokens: ["--ds-hairline-strong", "--ds-radius-lg", "--ds-accent", "--ds-accent-soft", "--ds-surface-sunken", "--ds-danger"],
    },
    {
      id: "date-picker",
      name: "DatePicker",
      group: "inputs",
      caption: t.caption.datePicker,
      controls: [
        { type: "toggle", key: "preset", label: t.withInitial },
        { type: "toggle", key: "error", label: "error" },
        { type: "toggle", key: "disabled", label: "disabled" },
      ],
      initial: { preset: true, error: false, disabled: false },
      render: (s) => <DatePickerDemo key={String(s.preset)} preset={bool(s, "preset")} error={bool(s, "error")} disabled={bool(s, "disabled")} />,
      code: (s) => `const [date, setDate] = useState<Date | null>(${bool(s, "preset") ? "new Date(2026, 8, 7)" : "null"});\n\n<DatePicker label="${t.publishDate}" value={date} onChange={setDate} helper="${t.publishDateHelper}"${bool(s, "error") ? ` error="${t.noPastDates}"` : ""}${bool(s, "disabled") ? " disabled" : ""} />`,
      source: DatePickerSrc,
      states: ["hover", ICON, "open", "error", "disabled"],
      tokens: ["--ds-surface", "--ds-hairline-strong", "--ds-radius-md", "--ds-shadow-2", "--ds-danger", "--ds-duration-fast"],
    },
    {
      id: "rating",
      name: "Rating",
      group: "inputs",
      caption: t.caption.rating,
      controls: [
        { type: "range", key: "max", label: "max", min: 3, max: 10 },
        { type: "select", key: "size", label: "size", options: ["sm", "md"] },
        { type: "toggle", key: "readOnly", label: "readOnly" },
        { type: "toggle", key: "disabled", label: "disabled" },
      ],
      initial: { max: 5, size: "md", readOnly: false, disabled: false },
      render: (s) => <RatingDemo max={num(s, "max", 5)} size={str<"sm" | "md">(s, "size", "md")} readOnly={bool(s, "readOnly")} disabled={bool(s, "disabled")} />,
      code: (s) => `const [value, setValue] = useState(3);\n\n<Rating value={value} onChange={setValue}${attrs({ max: num(s, "max") !== 5 ? num(s, "max") : undefined, size: str(s, "size") !== "md" ? str(s, "size") : undefined, readOnly: bool(s, "readOnly"), disabled: bool(s, "disabled") })} />`,
      source: RatingSrc,
      states: ["hover", ICON, "active", "disabled", "read-only"],
      tokens: ["--ds-ink", "--ds-hairline-strong", "--ds-radius-xs", "--ds-duration-instant"],
    },

    /* ---------------------------------------------------------- selection */
    {
      id: "checkbox",
      name: "Checkbox",
      group: "selection",
      caption: t.caption.checkbox,
      controls: [
        { type: "toggle", key: "description", label: "description" },
        { type: "toggle", key: "disabled", label: "disabled" },
      ],
      initial: { description: true, disabled: false },
      render: (s) => (
        <div className="flex flex-col gap-3">
          <Checkbox label={t.weeklyReport} description={bool(s, "description") ? t.weeklyReportHelper : undefined} defaultChecked disabled={bool(s, "disabled")} />
          <Checkbox label={t.productNews} description={bool(s, "description") ? t.productNewsHelper : undefined} disabled={bool(s, "disabled")} />
        </div>
      ),
      code: (s) => `<Checkbox label="${t.weeklyReport}"${bool(s, "description") ? ` description="${t.weeklyReportHelper}"` : ""} defaultChecked${bool(s, "disabled") ? " disabled" : ""} />`,
      source: CheckboxSrc,
      states: ["hover", ICON, "checked", "disabled"],
      tokens: ["--ds-primary", "--ds-hairline-strong", "--ds-radius-xs", "--ds-duration-instant"],
    },
    {
      id: "radio",
      name: "Radio",
      group: "selection",
      caption: t.caption.radio,
      controls: [{ type: "toggle", key: "disabled", label: "disabled" }],
      initial: { disabled: false },
      render: (s) => (
        <RadioGroup legend={t.billingCycle}>
          <Radio name="cycle" label={t.monthly} defaultChecked disabled={bool(s, "disabled")} />
          <Radio name="cycle" label={t.yearlyDeal} disabled={bool(s, "disabled")} />
        </RadioGroup>
      ),
      code: (s) => `<RadioGroup legend="${t.billingCycle}">\n  <Radio name="cycle" label="${t.monthly}" defaultChecked${bool(s, "disabled") ? " disabled" : ""} />\n  <Radio name="cycle" label="${t.yearly}"${bool(s, "disabled") ? " disabled" : ""} />\n</RadioGroup>`,
      source: RadioSrc,
      states: ["hover", ICON, "checked", "disabled"],
      tokens: ["--ds-primary", "--ds-hairline-strong", "--ds-radius-pill"],
    },
    {
      id: "switch",
      name: "Switch",
      group: "selection",
      caption: t.caption.switch,
      controls: [{ type: "toggle", key: "disabled", label: "disabled" }],
      initial: { disabled: false },
      render: (s) => <SwitchDemo disabled={bool(s, "disabled")} />,
      code: (s) => `const [on, setOn] = useState(true);\n\n<Switch label="${t.receiveNotifications}" checked={on} onChange={setOn}${bool(s, "disabled") ? " disabled" : ""} />`,
      source: SwitchSrc,
      states: ["hover", ICON, "checked", "disabled"],
      tokens: ["--ds-primary", "--ds-surface-sunken", "--ds-hairline-strong", "--ds-radius-pill", "--ds-duration-fast", "--ds-ease-out"],
    },
    {
      id: "segmented-control",
      name: "SegmentedControl",
      group: "selection",
      caption: t.caption.segmented,
      controls: [
        { type: "select", key: "size", label: "size", options: ["sm", "md"] },
        { type: "toggle", key: "icons", label: t.icon },
        { type: "toggle", key: "fullWidth", label: "fullWidth" },
        { type: "toggle", key: "disabled", label: "disabled" },
      ],
      initial: { size: "md", icons: true, fullWidth: false, disabled: false },
      render: (s) => <SegmentedDemo size={str<"sm" | "md">(s, "size", "md")} icons={bool(s, "icons")} fullWidth={bool(s, "fullWidth")} disabled={bool(s, "disabled")} />,
      code: (s) => `const [view, setView] = useState("list");\n\n<SegmentedControl\n  label="${t.view}"\n  value={view}\n  onChange={setView}${attrs({ size: str(s, "size") !== "md" ? str(s, "size") : undefined, fullWidth: bool(s, "fullWidth"), disabled: bool(s, "disabled") }).replace(/ /g, "\n  ")}\n  options={[\n    { value: "list", label: "${t.list}"${bool(s, "icons") ? ", icon: <List />" : ""} },\n    { value: "grid", label: "${t.grid}"${bool(s, "icons") ? ", icon: <LayoutGrid />" : ""} },\n  ]}\n/>`,
      source: SegmentedControlSrc,
      states: ["hover", ICON, "checked", "disabled"],
      tokens: ["--ds-surface-sunken", "--ds-surface", "--ds-shadow-2", "--ds-radius-md", "--ds-radius-sm", "--ds-duration-instant"],
    },
    {
      id: "toggle-group",
      name: "ToggleGroup",
      group: "selection",
      caption: t.caption.toggleGroup,
      controls: [
        { type: "select", key: "type", label: "type", options: ["single", "multiple"] },
        { type: "select", key: "size", label: "size", options: ["sm", "md"] },
        { type: "toggle", key: "disabled", label: "disabled" },
      ],
      initial: { type: "single", size: "md", disabled: false },
      render: (s) => <ToggleGroupDemo type={str<"single" | "multiple">(s, "type", "single")} size={str<"sm" | "md">(s, "size", "md")} disabled={bool(s, "disabled")} />,
      code: (s) =>
        str(s, "type") === "single"
          ? `const [align, setAlign] = useState<"left" | "center" | "right" | null>("left");\n\n<ToggleGroup type="single" label="${t.textAlign}" value={align} onChange={setAlign}${attrs({ size: str(s, "size") !== "md" ? str(s, "size") : undefined, disabled: bool(s, "disabled") })}\n  items={[\n    { value: "left", label: "${t.alignLeft}", icon: <AlignLeft />, iconOnly: true },\n    { value: "center", label: "${t.alignCenter}", icon: <AlignCenter />, iconOnly: true },\n  ]}\n/>`
          : `const [styles, setStyles] = useState(["bold"]);\n\n<ToggleGroup type="multiple" label="${t.textStyle}" value={styles} onChange={setStyles}${attrs({ size: str(s, "size") !== "md" ? str(s, "size") : undefined, disabled: bool(s, "disabled") })}\n  items={[\n    { value: "bold", label: "${t.bold}", icon: <Bold />, iconOnly: true },\n    { value: "italic", label: "${t.italic}", icon: <Italic />, iconOnly: true },\n  ]}\n/>`,
      source: ToggleGroupSrc,
      states: ["hover", ICON, "active", "pressed", "disabled"],
      tokens: ["--ds-surface", "--ds-surface-sunken", "--ds-hairline-strong", "--ds-radius-md", "--ds-control-sm", "--ds-control-md"],
    },
    {
      id: "chip",
      name: "Chip",
      group: "selection",
      caption: t.caption.chip,
      controls: [
        { type: "select", key: "size", label: "size", options: ["sm", "md"] },
        { type: "toggle", key: "removable", label: t.removeButton },
        { type: "toggle", key: "disabled", label: "disabled" },
      ],
      initial: { size: "sm", removable: false, disabled: false },
      render: (s) => <ChipDemo size={str<"sm" | "md">(s, "size", "sm")} removable={bool(s, "removable")} disabled={bool(s, "disabled")} />,
      code: (s) => `<Chip selected={selected} onSelectedChange={setSelected}${attrs({ size: str(s, "size") !== "sm" ? str(s, "size") : undefined, disabled: bool(s, "disabled") })}${bool(s, "removable") ? ` onRemove={() => remove("${t.design}")}` : ""}>\n  ${t.design}\n</Chip>`,
      source: ChipSrc,
      states: ["hover", ICON, "active", "pressed", "disabled"],
      tokens: ["--ds-primary", "--ds-on-primary", "--ds-hairline-strong", "--ds-surface-sunken", "--ds-radius-pill", "--ds-control-sm"],
    },
    {
      id: "calendar",
      name: "Calendar",
      group: "selection",
      caption: t.caption.calendar,
      controls: [
        { type: "select", key: "weekStartsOn", label: t.weekStart, options: [t.sun, t.mon] },
        { type: "toggle", key: "limited", label: "min / max" },
      ],
      initial: { weekStartsOn: t.sun, limited: false },
      render: (s) => <CalendarDemo key={`${s.weekStartsOn}-${s.limited}`} weekStartsOn={str(s, "weekStartsOn") === t.mon ? 1 : 0} limited={bool(s, "limited")} />,
      code: (s) => `const [date, setDate] = useState<Date | null>(new Date(2026, 8, 7));\n\n<Calendar value={date} onChange={setDate} locale="${tag}"${str(s, "weekStartsOn") === t.mon ? " weekStartsOn={1}" : ""}${bool(s, "limited") ? " min={new Date(2026, 8, 3)} max={new Date(2026, 8, 24)}" : ""} />`,
      source: CalendarSrc,
      states: ["hover", ICON, "selected", "today", "outside month", "disabled"],
      tokens: ["--ds-surface", "--ds-hairline", "--ds-primary", "--ds-on-primary", "--ds-surface-sunken", "--ds-radius-lg", "--ds-radius-md"],
    },

    /* --------------------------------------------------------- navigation */
    {
      id: "tabs",
      name: "Tabs",
      group: "navigation",
      caption: t.caption.tabs,
      controls: [{ type: "range", key: "count", label: t.tabCount, min: 2, max: 6 }],
      initial: { count: 3 },
      render: (s) => (
        <div className="w-72">
          <Tabs
            key={num(s, "count", 3)}
            tabs={[t.overview, t.activity, t.settings, t.members, t.billing, t.integrations].slice(0, num(s, "count", 3)).map((label, i) => ({
              id: `t${i}`,
              label,
              content: <p className="t-body-sm text-ink-secondary">{t.tabPanel(label)}</p>,
            }))}
          />
        </div>
      ),
      code: (s) => `<Tabs\n  tabs={[\n${[t.overview, t.activity, t.settings, t.members, t.billing, t.integrations].slice(0, num(s, "count", 3)).map((l, i) => `    { id: "t${i}", label: "${l}", content: <Panel /> },`).join("\n")}\n  ]}\n/>`,
      source: TabsSrc,
      states: ["hover", ICON, "selected"],
      tokens: ["--ds-ink", "--ds-ink-secondary", "--ds-hairline", "--ds-control-md", "--ds-duration-instant"],
    },
    {
      id: "breadcrumb",
      name: "Breadcrumb",
      group: "navigation",
      caption: t.caption.breadcrumb,
      controls: [
        { type: "range", key: "depth", label: t.depth, min: 2, max: 6 },
        { type: "toggle", key: "collapse", label: t.collapseMiddle },
      ],
      initial: { depth: 4, collapse: false },
      render: (s) => {
        const trail = [t.home, t.projects, "AwesomeDS", t.components, t.groupNavigation, "Breadcrumb"];
        const depth = num(s, "depth", 4);
        const items = trail.slice(6 - depth).map((label, i, arr) => ({ label, href: i < arr.length - 1 ? "#" : undefined }));
        return <Breadcrumb items={items} maxItems={bool(s, "collapse") ? 3 : undefined} />;
      },
      code: (s) => `<Breadcrumb${bool(s, "collapse") ? " maxItems={3}" : ""}\n  items={[\n    { label: "${t.home}", href: "/" },\n    { label: "${t.projects}", href: "/projects" },\n    { label: "Breadcrumb" },\n  ]}\n/>`,
      source: BreadcrumbSrc,
      states: ["hover", ICON, "current"],
      tokens: ["--ds-ink-secondary", "--ds-ink", "--ds-ink-muted", "--ds-surface-sunken", "--ds-radius-sm"],
    },
    {
      id: "pagination",
      name: "Pagination",
      group: "navigation",
      caption: t.caption.pagination,
      controls: [
        { type: "range", key: "total", label: t.totalPages, min: 1, max: 40 },
        { type: "range", key: "siblings", label: "siblings", min: 0, max: 3 },
        { type: "select", key: "size", label: "size", options: ["sm", "md"] },
      ],
      initial: { total: 12, siblings: 1, size: "md" },
      render: (s) => <PaginationDemo total={num(s, "total", 12)} siblings={num(s, "siblings", 1)} size={str<"sm" | "md">(s, "size", "md")} />,
      code: (s) => `const [page, setPage] = useState(5);\n\n<Pagination page={page} total={${num(s, "total")}} onChange={setPage}${attrs({ siblings: num(s, "siblings") !== 1 ? num(s, "siblings") : undefined, size: str(s, "size") !== "md" ? str(s, "size") : undefined })} />`,
      source: PaginationSrc,
      states: ["hover", ICON, "active", "current", "disabled"],
      tokens: ["--ds-primary", "--ds-on-primary", "--ds-surface-sunken", "--ds-radius-md", "--ds-control-sm", "--ds-control-md"],
    },
    {
      id: "stepper",
      name: "Stepper",
      group: "navigation",
      caption: t.caption.stepper,
      controls: [
        { type: "select", key: "orientation", label: "orientation", options: ["horizontal", "vertical"] },
        { type: "range", key: "current", label: t.current, min: 0, max: 3 },
        { type: "toggle", key: "clickable", label: t.canGoBack },
      ],
      initial: { orientation: "horizontal", current: 1, clickable: true },
      render: (s) => <StepperDemo key={`${s.current}-${s.clickable}`} orientation={str<"horizontal" | "vertical">(s, "orientation", "horizontal")} current={num(s, "current", 1)} clickable={bool(s, "clickable")} />,
      code: (s) => `<Stepper\n  current={${num(s, "current")}}${str(s, "orientation") === "vertical" ? `\n  orientation="vertical"` : ""}${bool(s, "clickable") ? `\n  onStepClick={setStep}` : ""}\n  steps={[\n    { label: "${t.account}", description: "${t.emailAndName}" },\n    { label: "${t.plan}", description: "${t.monthlyOrYearly}" },\n    { label: "${t.payment}", description: "${t.addCard}" },\n    { label: "${t.review}" },\n  ]}\n/>`,
      source: StepperSrc,
      states: ["complete", "current", "upcoming", ICON],
      tokens: ["--ds-primary", "--ds-on-primary", "--ds-hairline", "--ds-hairline-strong", "--ds-radius-pill", "--ds-duration-fast"],
    },
    {
      id: "nav-bar",
      name: "NavBar",
      group: "navigation",
      caption: t.caption.navBar,
      controls: [
        { type: "range", key: "links", label: t.linkCount, min: 2, max: 5 },
        { type: "toggle", key: "action", label: t.groupActions },
      ],
      initial: { links: 4, action: true },
      render: (s) => (
        <div className="w-full overflow-hidden rounded-lg border border-hairline">
          <NavBar
            brand="AwesomeDS"
            links={[t.foundations, t.components, t.motion, t.knowledge, "About"].slice(0, num(s, "links", 4)).map((label, i) => ({ label, href: "#", current: i === 1 }))}
            actions={bool(s, "action") ? <Button size="sm">{t.getStarted}</Button> : undefined}
          />
        </div>
      ),
      code: (s) => `<NavBar\n  brand="AwesomeDS"\n  links={[\n    { label: "${t.foundations}", href: "/foundations" },\n    { label: "${t.components}", href: "/components", current: true },\n  ]}${bool(s, "action") ? `\n  actions={<Button size="sm">${t.getStarted}</Button>}` : ""}\n/>`,
      source: NavBarSrc,
      states: ["hover", ICON, "current"],
      tokens: ["--ds-canvas", "--ds-hairline", "--ds-ink-secondary", "--ds-surface-sunken", "--ds-radius-md"],
    },

    /* ------------------------------------------------------------ overlay */
    {
      id: "dialog",
      name: "Dialog",
      group: "overlay",
      caption: t.caption.dialog,
      controls: [
        { type: "toggle", key: "description", label: "description" },
        { type: "toggle", key: "footer", label: "footer" },
      ],
      initial: { description: true, footer: true },
      render: (s) => <DialogDemo description={bool(s, "description")} footer={bool(s, "footer")} />,
      code: (s) => `const [open, setOpen] = useState(false);\n\n<Dialog\n  open={open}\n  onClose={() => setOpen(false)}\n  title="${t.deleteDraftTitle}"${bool(s, "description") ? `\n  description="${t.cannotUndo}"` : ""}${bool(s, "footer") ? `\n  footer={<>\n    <Button variant="secondary" onClick={() => setOpen(false)}>${t.cancel}</Button>\n    <Button variant="danger">${t.deleteConfirm}</Button>\n  </>}` : ""}\n>\n  <p>${t.deleteReportBody}</p>\n</Dialog>`,
      source: DialogSrc,
      states: ["open", "closing", ICON],
      tokens: ["--ds-surface", "--ds-hairline", "--ds-radius-xl", "--ds-shadow-3", "--ds-duration-slow", "--ds-duration-fast", "--ds-ease-out", "--ds-ease-in"],
    },
    {
      id: "sheet",
      name: "Sheet",
      group: "overlay",
      caption: t.caption.sheet,
      controls: [
        { type: "select", key: "side", label: "side", options: ["right", "bottom"] },
        { type: "toggle", key: "footer", label: "footer" },
      ],
      initial: { side: "right", footer: true },
      render: (s) => <SheetDemo side={str<"right" | "bottom">(s, "side", "right")} footer={bool(s, "footer")} />,
      code: (s) => `const [open, setOpen] = useState(false);\n\n<Sheet\n  open={open}\n  onClose={() => setOpen(false)}${str(s, "side") === "bottom" ? `\n  side="bottom"` : ""}\n  title="${t.filter}"\n  description="${t.filterDescription}"${bool(s, "footer") ? `\n  footer={<>\n    <Button variant="ghost">${t.reset}</Button>\n    <Button>${t.apply}</Button>\n  </>}` : ""}\n>\n  <Input label="${t.keyword}" />\n</Sheet>`,
      source: SheetSrc,
      states: ["open", "closing", ICON],
      tokens: ["--ds-surface", "--ds-hairline", "--ds-radius-xl", "--ds-shadow-3", "--ds-duration-slow", "--ds-duration-fast", "--ds-ease-out", "--ds-ease-in"],
    },
    {
      id: "command-menu",
      name: "CommandMenu",
      group: "overlay",
      caption: t.caption.commandMenu,
      controls: [{ type: "range", key: "groups", label: t.groupCount, min: 1, max: 3 }],
      initial: { groups: 3 },
      render: (s) => <CommandMenuDemo groups={num(s, "groups", 3)} />,
      code: (s) => `const [open, setOpen] = useCommandMenu(); // ⌘K / Ctrl+K\n\n<CommandMenu\n  open={open}\n  onClose={() => setOpen(false)}\n  groups={[\n    { heading: "${t.pages}", items: [{ id: "home", label: "${t.home}", icon: <Home />, shortcut: ["G", "H"] }] },${num(s, "groups", 3) > 1 ? `\n    { heading: "${t.actions}", items: [{ id: "new", label: "${t.createNew}", icon: <Plus />, shortcut: ["N"] }] },` : ""}${num(s, "groups", 3) > 2 ? `\n    { heading: "${t.recent}", items: [{ id: "r1", label: "${t.q3Report}" }] },` : ""}\n  ]}\n/>`,
      source: CommandMenuSrc,
      states: ["open", "active option", "empty", ICON],
      tokens: ["--ds-surface", "--ds-hairline", "--ds-radius-xl", "--ds-shadow-3", "--ds-surface-sunken", "--ds-canvas-soft", "--ds-duration-base", "--ds-ease-out"],
    },
    {
      id: "popover",
      name: "Popover",
      group: "overlay",
      caption: t.caption.popover,
      initial: {},
      render: () => (
        <Popover
          trigger={(props) => (
            <Button variant="secondary" {...props}>
              {t.sharing}
            </Button>
          )}
        >
          <p className="t-label text-ink">{t.anyoneWithLink}</p>
          <p className="t-caption mt-1 text-ink-secondary">{t.viewOnly}</p>
          <div className="mt-3 flex gap-2">
            <Button size="sm" variant="secondary">
              {t.copyLink}
            </Button>
          </div>
        </Popover>
      ),
      code: () => `<Popover trigger={(props) => <Button variant="secondary" {...props}>${t.sharing}</Button>}>\n  <p className="t-label">${t.anyoneWithLink}</p>\n  <Button size="sm" variant="secondary">${t.copyLink}</Button>\n</Popover>`,
      source: PopoverSrc,
      states: ["open", ICON],
      tokens: ["--ds-surface", "--ds-hairline", "--ds-radius-lg", "--ds-shadow-2", "--ds-duration-fast", "--ds-ease-out"],
    },
    {
      id: "tooltip",
      name: "Tooltip",
      group: "overlay",
      caption: t.caption.tooltip,
      controls: [{ type: "select", key: "label", label: "label", options: [t.copy, t.createShareLink, t.copyShortcut] }],
      initial: { label: t.copy },
      render: (s) => (
        <Tooltip label={str(s, "label", t.copy)}>
          <Button variant="secondary" size="sm" aria-label={t.copy}>
            <Copy strokeWidth={1.75} />
          </Button>
        </Tooltip>
      ),
      code: (s) => `<Tooltip label="${str(s, "label")}">\n  <Button variant="secondary" size="sm" aria-label="${t.copy}"><Copy /></Button>\n</Tooltip>`,
      source: TooltipSrc,
      states: ["hover", ICON],
      tokens: ["--ds-surface", "--ds-hairline", "--ds-radius-sm", "--ds-shadow-2", "--ds-text-xs", "--ds-duration-instant"],
    },

    /* ----------------------------------------------------------- feedback */
    {
      id: "toast",
      name: "Toast",
      group: "feedback",
      caption: t.caption.toast,
      controls: [
        { type: "select", key: "tone", label: "tone", options: ["neutral", "success", "danger"] },
        { type: "toggle", key: "description", label: "description" },
      ],
      initial: { tone: "success", description: true },
      render: (s) => (
        <ToastProvider>
          <ToastButton tone={str<ToastTone>(s, "tone", "success")} description={bool(s, "description")} />
        </ToastProvider>
      ),
      code: (s) => `const { push } = useToast();\n\npush({ title: "${t.saved}", tone: "${str(s, "tone")}"${bool(s, "description") ? `, description: "${t.checkDownloads}"` : ""} });`,
      source: ToastSrc,
      states: ["enter", "auto-dismiss", ICON],
      tokens: ["--ds-surface", "--ds-hairline", "--ds-radius-lg", "--ds-shadow-2", "--ds-success", "--ds-danger", "--ds-duration-base", "--ds-ease-out"],
    },
    {
      id: "alert",
      name: "Alert",
      group: "feedback",
      caption: t.caption.alert,
      controls: [
        { type: "select", key: "tone", label: "tone", options: ["neutral", "info", "success", "warning", "danger"] },
        { type: "toggle", key: "body", label: t.body },
        { type: "toggle", key: "action", label: t.groupActions },
        { type: "toggle", key: "dismissible", label: t.dismissible },
      ],
      initial: { tone: "warning", body: true, action: true, dismissible: true },
      render: (s) => <AlertDemo key={str(s, "tone")} tone={str<AlertTone>(s, "tone", "warning")} body={bool(s, "body")} action={bool(s, "action")} dismissible={bool(s, "dismissible")} />,
      code: (s) => `<Alert\n  tone="${str(s, "tone")}"\n  title="${t.storageLowTitle}"${bool(s, "action") ? `\n  action={<Button variant="secondary" size="sm">${t.viewDetails}</Button>}` : ""}${bool(s, "dismissible") ? `\n  onDismiss={() => setShown(false)}` : ""}\n>${bool(s, "body") ? `\n  ${t.storageLowBody}\n` : ""}</Alert>`,
      source: AlertSrc,
      states: ["neutral", "info", "success", "warning", "danger", ICON],
      tokens: ["--ds-accent-soft", "--ds-success-soft", "--ds-warning-soft", "--ds-danger-soft", "--ds-radius-lg", "--ds-hairline"],
    },
    {
      id: "progress",
      name: "Progress",
      group: "feedback",
      caption: t.caption.progress,
      controls: [
        { type: "toggle", key: "indeterminate", label: t.indeterminate },
        { type: "range", key: "value", label: "value", min: 0, max: 100, unit: "%" },
        { type: "select", key: "size", label: "size", options: ["sm", "md"] },
        { type: "select", key: "tone", label: "tone", options: ["neutral", "success", "danger"] },
        { type: "toggle", key: "showValue", label: "showValue" },
      ],
      initial: { indeterminate: false, value: 64, size: "sm", tone: "neutral", showValue: true },
      render: (s) => (
        <div className="w-72">
          <Progress label={t.upload} value={bool(s, "indeterminate") ? undefined : num(s, "value", 64)} size={str<"sm" | "md">(s, "size", "sm")} tone={str<"neutral" | "success" | "danger">(s, "tone", "neutral")} showValue={bool(s, "showValue")} />
        </div>
      ),
      code: (s) => `<Progress label="${t.upload}"${bool(s, "indeterminate") ? "" : ` value={${num(s, "value")}}`}${attrs({ size: str(s, "size") !== "sm" ? str(s, "size") : undefined, tone: str(s, "tone") !== "neutral" ? str(s, "tone") : undefined, showValue: bool(s, "showValue") })} />`,
      source: ProgressSrc,
      states: ["determinate", "indeterminate"],
      tokens: ["--ds-primary", "--ds-surface-sunken", "--ds-radius-pill", "--ds-duration-base", "--ds-ease-out", "--ds-ease-in-out"],
    },
    {
      id: "spinner",
      name: "Spinner",
      group: "feedback",
      caption: t.caption.spinner,
      controls: [{ type: "select", key: "size", label: "size", options: ["sm", "md"] }],
      initial: { size: "sm" },
      render: (s) => (
        <div className="flex items-center gap-6">
          <Spinner size={str<"sm" | "md">(s, "size", "sm")} />
          <Button variant="secondary" disabled className="gap-2">
            <Spinner size="sm" label={t.sending} /> {t.sending}
          </Button>
        </div>
      ),
      code: (s) => `<Spinner${str(s, "size") !== "sm" ? ` size="${str(s, "size")}"` : ""} label="${t.loading}" />`,
      source: SpinnerSrc,
      states: ["spinning", "reduced-motion"],
      tokens: ["--ds-ink", "--ds-duration-slower"],
    },
    {
      id: "skeleton",
      name: "Skeleton",
      group: "feedback",
      caption: t.caption.skeleton,
      controls: [{ type: "select", key: "shape", label: "shape", options: ["card", "lines", "avatar"] }],
      initial: { shape: "card" },
      render: (s) => {
        const shape = str(s, "shape", "card");
        if (shape === "card") return <div className="w-72"><SkeletonCard /></div>;
        if (shape === "lines")
          return (
            <div className="w-72" aria-busy="true">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="mt-2 h-4 w-4/5" />
              <Skeleton className="mt-2 h-4 w-2/5" />
            </div>
          );
        return (
          <div className="flex w-72 items-center gap-3" aria-busy="true">
            <Skeleton className="size-10 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="mt-2 h-3 w-4/5" />
            </div>
          </div>
        );
      },
      code: (s) => (str(s, "shape") === "card" ? `<SkeletonCard />` : str(s, "shape") === "lines" ? `<Skeleton className="h-4 w-full" />\n<Skeleton className="mt-2 h-4 w-4/5" />\n<Skeleton className="mt-2 h-4 w-2/5" />` : `<Skeleton className="size-10 rounded-full" />\n<Skeleton className="h-4 w-1/2" />`),
      source: SkeletonSrc,
      states: ["pulse", "reduced-motion"],
      tokens: ["--ds-surface-sunken", "--ds-radius-md", "--ds-radius-pill"],
    },
    {
      id: "empty-state",
      name: "EmptyState",
      group: "feedback",
      caption: t.caption.emptyState,
      controls: [
        { type: "toggle", key: "description", label: "description" },
        { type: "toggle", key: "action", label: "action" },
      ],
      initial: { description: true, action: true },
      render: (s) => (
        <div className="w-full max-w-md">
          <EmptyState title={t.noProjects} description={bool(s, "description") ? t.noProjectsBody : undefined} action={bool(s, "action") ? <Button>{t.createProject}</Button> : undefined} />
        </div>
      ),
      code: (s) => `<EmptyState\n  title="${t.noProjects}"${bool(s, "description") ? `\n  description="${t.noProjectsBody}"` : ""}${bool(s, "action") ? `\n  action={<Button>${t.createProject}</Button>}` : ""}\n/>`,
      source: EmptyStateSrc,
      tokens: ["--ds-hairline-strong", "--ds-surface-sunken", "--ds-ink-muted", "--ds-radius-lg"],
    },
    {
      id: "error-state",
      name: "ErrorState",
      group: "feedback",
      caption: t.caption.errorState,
      controls: [
        { type: "toggle", key: "description", label: "description" },
        { type: "toggle", key: "action", label: "action" },
      ],
      initial: { description: true, action: true },
      render: (s) => (
        <div className="w-full max-w-md">
          <ErrorState title={t.loadFailed} description={bool(s, "description") ? t.loadFailedBody : undefined} action={bool(s, "action") ? <Button variant="secondary" size="sm">{t.retry}</Button> : undefined} />
        </div>
      ),
      code: (s) => `<ErrorState\n  title="${t.loadFailed}"${bool(s, "description") ? `\n  description="${t.loadFailedBody}"` : ""}${bool(s, "action") ? `\n  action={<Button variant="secondary" size="sm">${t.retry}</Button>}` : ""}\n/>`,
      source: ErrorStateSrc,
      tokens: ["--ds-danger", "--ds-danger-soft", "--ds-radius-lg"],
    },

    /* --------------------------------------------------------------- data */
    {
      id: "table",
      name: "Table",
      group: "data",
      caption: t.caption.table,
      controls: [{ type: "range", key: "rows", label: t.rows, min: 1, max: 6 }],
      initial: { rows: 4 },
      render: (s) => (
        <div className="w-full">
          <Table<Invoice>
            rows={invoices.slice(0, num(s, "rows", 4))}
            rowKey={(r) => r.id}
            columns={[
              { key: "id", header: t.number, render: (r) => <span className="font-mono text-xs">{r.id}</span> },
              { key: "customer", header: t.customer, render: (r) => r.customer },
              { key: "status", header: t.status, render: (r) => <Badge tone={statusBadge[r.status].tone}>{statusBadge[r.status].label}</Badge> },
              { key: "amount", header: t.amount, align: "right", render: (r) => `¥${r.amount.toLocaleString(tag)}` },
            ]}
          />
        </div>
      ),
      code: () => `<Table\n  rows={invoices}\n  rowKey={(r) => r.id}\n  columns={[\n    { key: "id", header: "${t.number}", render: (r) => r.id },\n    { key: "customer", header: "${t.customer}", render: (r) => r.customer },\n    { key: "amount", header: "${t.amount}", align: "right", render: (r) => yen(r.amount) },\n  ]}\n/>`,
      source: TableSrc,
      states: ["row hover"],
      tokens: ["--ds-surface-sunken", "--ds-hairline", "--ds-canvas-soft", "--ds-radius-lg", "--ds-text-sm"],
    },
    {
      id: "data-table",
      name: "DataTable",
      group: "data",
      caption: t.caption.dataTable,
      controls: [
        { type: "range", key: "rows", label: t.rows, min: 1, max: 6 },
        { type: "toggle", key: "selectable", label: t.rowSelection },
        { type: "toggle", key: "sticky", label: t.stickyHeader },
        { type: "toggle", key: "empty", label: t.emptyState },
      ],
      initial: { rows: 6, selectable: true, sticky: true, empty: false },
      render: (s) => <DataTableDemo rows={num(s, "rows", 6)} selectable={bool(s, "selectable")} sticky={bool(s, "sticky")} empty={bool(s, "empty")} />,
      code: (s) => `<DataTable\n  rows={${bool(s, "empty") ? "[]" : "invoices"}}\n  rowKey={(r) => r.id}${bool(s, "selectable") ? `\n  selectable\n  selected={selected}\n  onSelectionChange={setSelected}` : ""}${bool(s, "sticky") ? `\n  stickyHeader\n  maxHeight="220px"` : ""}\n  defaultSort={{ key: "due", dir: "asc" }}\n  emptyState={<EmptyState title="${t.noInvoices}" />}\n  columns={[\n    { key: "customer", header: "${t.customer}", render: (r) => r.customer, sortable: true, sortValue: (r) => r.customer },\n    { key: "amount", header: "${t.amount}", align: "right", render: (r) => yen(r.amount), sortable: true, sortValue: (r) => r.amount },\n  ]}\n/>`,
      source: DataTableSrc,
      states: ["row hover", "selected", "sorted", "empty", ICON],
      tokens: ["--ds-surface-sunken", "--ds-hairline", "--ds-canvas-soft", "--ds-selection", "--ds-primary", "--ds-radius-lg", "--ds-radius-xs"],
    },
    {
      id: "stat-tile",
      name: "StatTile",
      group: "data",
      caption: t.caption.statTile,
      controls: [
        { type: "select", key: "delta", label: "delta", options: ["up", "down", "neutral", "none"] },
        { type: "toggle", key: "sparkline", label: "sparkline" },
        { type: "toggle", key: "unit", label: t.unit },
      ],
      initial: { delta: "up", sparkline: true, unit: false },
      render: (s) => {
        const d = str(s, "delta", "up");
        const deltas: Record<string, { value: string; tone: DeltaTone; hint: string }> = {
          up: { value: "+12.4%", tone: "up", hint: t.vsLastMonth },
          down: { value: "-3.1%", tone: "down", hint: t.vsLastMonth },
          neutral: { value: "±0%", tone: "neutral", hint: t.vsLastMonth },
        };
        return (
          <div className="grid w-full max-w-lg gap-4 sm:grid-cols-2">
            <StatTile label={t.monthlySales} value={bool(s, "unit") ? "1,284" : "¥1,284,000"} unit={bool(s, "unit") ? t.thousandYen : undefined} delta={d === "none" ? undefined : deltas[d]} sparkline={bool(s, "sparkline") ? [38, 42, 40, 47, 51, 49, 56, 61] : undefined} />
            <StatTile label={t.activeUsers} value="8,402" delta={d === "none" ? undefined : { value: "+318", tone: d === "down" ? "down" : d === "neutral" ? "neutral" : "up", hint: t.vsLastWeek }} sparkline={bool(s, "sparkline") ? [61, 58, 60, 64, 63, 67, 70, 72] : undefined} />
          </div>
        );
      },
      code: (s) => `<StatTile\n  label="${t.monthlySales}"\n  value="${bool(s, "unit") ? "1,284" : "¥1,284,000"}"${bool(s, "unit") ? `\n  unit="${t.thousandYen}"` : ""}${str(s, "delta") !== "none" ? `\n  delta={{ value: "${str(s, "delta") === "down" ? "-3.1%" : str(s, "delta") === "neutral" ? "±0%" : "+12.4%"}", tone: "${str(s, "delta")}", hint: "${t.vsLastMonth}" }}` : ""}${bool(s, "sparkline") ? `\n  sparkline={[38, 42, 40, 47, 51, 49, 56, 61]}` : ""}\n/>`,
      source: StatTileSrc,
      tokens: ["--ds-surface", "--ds-hairline", "--ds-radius-lg", "--ds-text-2xl", "--ds-success", "--ds-danger", "--ds-ink-secondary"],
    },
    {
      id: "badge",
      name: "Badge",
      group: "data",
      caption: t.caption.badge,
      controls: [{ type: "select", key: "tone", label: "tone", options: ["neutral", "accent", "success", "warning", "danger"] }],
      initial: { tone: "success" },
      render: (s) => (
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={str<BadgeTone>(s, "tone", "success")}>{{ neutral: t.draft, accent: t.new, success: t.live, warning: t.inReview, danger: t.stopped }[str(s, "tone", "success")]}</Badge>
          <Badge>{t.draft}</Badge>
          <Badge tone="accent">{t.new}</Badge>
        </div>
      ),
      code: (s) => `<Badge tone="${str(s, "tone")}">${t.live}</Badge>`,
      source: BadgeSrc,
      tokens: ["--ds-surface-sunken", "--ds-accent-soft", "--ds-success-soft", "--ds-warning-soft", "--ds-danger-soft", "--ds-radius-pill", "--ds-text-xs"],
    },
    {
      id: "avatar",
      name: "Avatar",
      group: "data",
      caption: t.caption.avatar,
      controls: [
        { type: "select", key: "size", label: "size", options: ["sm", "md", "lg"] },
        { type: "toggle", key: "image", label: t.image },
      ],
      initial: { size: "md", image: false },
      render: (s) => (
        <div className="flex items-center gap-3">
          <Avatar name="Aiko Tanaka" size={str<"sm" | "md" | "lg">(s, "size", "md")} src={bool(s, "image") ? "https://i.pravatar.cc/96?img=47" : undefined} />
          <Avatar name="Ren Suzuki" size={str<"sm" | "md" | "lg">(s, "size", "md")} />
        </div>
      ),
      code: (s) => `<Avatar name="Aiko Tanaka"${str(s, "size") !== "md" ? ` size="${str(s, "size")}"` : ""}${bool(s, "image") ? ` src="/people/aiko.jpg"` : ""} />`,
      source: AvatarSrc,
      tokens: ["--ds-surface-sunken", "--ds-hairline", "--ds-radius-pill", "--ds-ink-secondary"],
    },
    {
      id: "avatar-group",
      name: "AvatarGroup",
      group: "data",
      caption: t.caption.avatarGroup,
      controls: [
        { type: "range", key: "count", label: t.people, min: 1, max: 7 },
        { type: "range", key: "max", label: "max", min: 2, max: 6 },
        { type: "select", key: "size", label: "size", options: ["sm", "md", "lg"] },
      ],
      initial: { count: 6, max: 4, size: "md" },
      render: (s) => <AvatarGroup people={people.slice(0, num(s, "count", 6))} max={num(s, "max", 4)} size={str<"sm" | "md" | "lg">(s, "size", "md")} />,
      code: (s) => `<AvatarGroup\n  people={[${people.slice(0, Math.min(3, num(s, "count", 6))).map((p) => `{ name: "${p.name}" }`).join(", ")}${num(s, "count", 6) > 3 ? ", ..." : ""}]}${num(s, "max", 4) !== 4 ? `\n  max={${num(s, "max")}}` : ""}${str(s, "size") !== "md" ? `\n  size="${str(s, "size")}"` : ""}\n/>`,
      source: AvatarSrc,
      tokens: ["--ds-canvas", "--ds-surface-sunken", "--ds-hairline", "--ds-radius-pill"],
    },
    {
      id: "timeline",
      name: "Timeline",
      group: "data",
      caption: t.caption.timeline,
      controls: [
        { type: "range", key: "count", label: t.items, min: 2, max: 5 },
        { type: "toggle", key: "icons", label: t.icon },
      ],
      initial: { count: 4, icons: false },
      render: (s) => {
        const items: Array<{ id: string; title: string; time: string; description?: string; tone: TimelineTone; icon?: ReactNode }> = [
          { id: "1", title: t.released, time: "09:12", description: t.releasedBody, tone: "success", icon: <Share2 strokeWidth={1.75} /> },
          { id: "2", title: t.reviewRequest, time: t.yesterday, description: t.reviewRequestBody, tone: "accent", icon: <Pencil strokeWidth={1.75} /> },
          { id: "3", title: t.buildFailed, time: "9/05", description: t.buildFailedBody, tone: "danger", icon: <Trash2 strokeWidth={1.75} /> },
          { id: "4", title: t.designReview, time: "9/03", tone: "neutral", icon: <FileText strokeWidth={1.75} /> },
          { id: "5", title: t.projectStart, time: "8/28", tone: "neutral", icon: <Home strokeWidth={1.75} /> },
        ];
        return (
          <div className="w-full max-w-md">
            <Timeline items={items.slice(0, num(s, "count", 4)).map((it) => ({ ...it, icon: bool(s, "icons") ? it.icon : undefined }))} />
          </div>
        );
      },
      code: (s) => `<Timeline\n  items={[\n    { id: "1", title: "${t.released}", time: "09:12", tone: "success"${bool(s, "icons") ? ", icon: <Share2 />" : ""} },\n    { id: "2", title: "${t.reviewRequest}", time: "${t.yesterday}", tone: "accent"${bool(s, "icons") ? ", icon: <Pencil />" : ""} },\n  ]}\n/>`,
      source: TimelineSrc,
      tokens: ["--ds-hairline", "--ds-hairline-strong", "--ds-success", "--ds-danger", "--ds-accent", "--ds-radius-pill"],
    },

    /* ------------------------------------------------------------- layout */
    {
      id: "card",
      name: "Card",
      group: "layout",
      caption: t.caption.card,
      controls: [
        { type: "select", key: "elevation", label: "elevation", options: ["1", "2"] },
        { type: "toggle", key: "description", label: "description" },
      ],
      initial: { elevation: "1", description: true },
      render: (s) => (
        <Card elevation={str(s, "elevation") === "2" ? 2 : 1} className="w-72">
          <CardTitle>{t.teamPlan}</CardTitle>
          {bool(s, "description") && <CardDescription>{t.teamPlanBody}</CardDescription>}
          <div className="mt-6 flex gap-2">
            <Button size="sm">{t.select}</Button>
            <Button size="sm" variant="ghost">
              {t.compare}
            </Button>
          </div>
        </Card>
      ),
      code: (s) => `<Card${str(s, "elevation") === "2" ? " elevation={2}" : ""}>\n  <CardTitle>${t.teamPlan}</CardTitle>${bool(s, "description") ? `\n  <CardDescription>${t.teamPlanShort}</CardDescription>` : ""}\n  <Button size="sm">${t.select}</Button>\n</Card>`,
      source: CardSrc,
      tokens: ["--ds-surface", "--ds-hairline", "--ds-radius-lg", "--ds-space-6", "--ds-shadow-2"],
    },
    {
      id: "media-card",
      name: "MediaCard",
      group: "layout",
      caption: t.caption.mediaCard,
      controls: [
        { type: "toggle", key: "link", label: t.asLink },
        { type: "toggle", key: "eyebrow", label: "eyebrow" },
        { type: "toggle", key: "footer", label: "footer" },
      ],
      initial: { link: true, eyebrow: true, footer: true },
      render: (s) => (
        <div className="w-72">
          <MediaCard
            href={bool(s, "link") ? "#media-card" : undefined}
            eyebrow={bool(s, "eyebrow") ? t.eyebrow : undefined}
            title={t.elevationTitle}
            description={t.elevationBody}
            media={
              <CardMedia ratio="16 / 9">
                <div className="grid size-full grid-cols-6 gap-1 p-4">
                  {Array.from({ length: 12 }, (_, i) => (
                    <span key={i} className={i % 3 === 0 ? "rounded-sm bg-primary" : "rounded-sm border border-hairline-strong"} />
                  ))}
                </div>
              </CardMedia>
            }
            footer={bool(s, "footer") ? <><span className="t-caption">{t.readTime}</span><Badge>elevation</Badge></> : undefined}
          />
        </div>
      ),
      code: (s) => `<MediaCard${bool(s, "link") ? `\n  href="/foundations/elevation"` : ""}${bool(s, "eyebrow") ? `\n  eyebrow="${t.eyebrow}"` : ""}\n  title="${t.elevationTitle}"\n  description="${t.elevationShort}"\n  media={<CardMedia src="/img/elevation.png" alt="" ratio="16 / 9" />}${bool(s, "footer") ? `\n  footer={<span className="t-caption">${t.readTime}</span>}` : ""}\n/>`,
      source: CardSrc,
      states: ["hover", ICON, "active"],
      tokens: ["--ds-surface", "--ds-hairline", "--ds-hairline-strong", "--ds-radius-lg", "--ds-shadow-2", "--ds-duration-fast", "--ds-ease-out"],
    },
    {
      id: "accordion",
      name: "Accordion",
      group: "layout",
      caption: t.caption.accordion,
      controls: [
        { type: "select", key: "type", label: "type", options: ["single", "multiple"] },
        { type: "toggle", key: "collapsible", label: "collapsible" },
        { type: "range", key: "count", label: t.itemCount, min: 2, max: 5 },
      ],
      initial: { type: "single", collapsible: true, count: 3 },
      render: (s) => {
        const faqs = [
          { id: "a", title: t.faq1, content: t.faq1a },
          { id: "b", title: t.faq2, content: t.faq2a },
          { id: "c", title: t.faq3, content: t.faq3a },
          { id: "d", title: t.faq4, content: t.faq4a },
          { id: "e", title: t.disabledItem, content: "", disabled: true },
        ];
        return (
          <div className="w-full max-w-md">
            <Accordion key={`${s.type}-${s.collapsible}-${s.count}`} type={str<"single" | "multiple">(s, "type", "single")} collapsible={bool(s, "collapsible")} defaultOpen={["a"]} items={faqs.slice(0, num(s, "count", 3))} />
          </div>
        );
      },
      code: (s) => `<Accordion${str(s, "type") === "multiple" ? ` type="multiple"` : ""}${!bool(s, "collapsible") ? ` collapsible={false}` : ""} defaultOpen={["a"]}\n  items={[\n    { id: "a", title: "${t.faq1}", content: <p>...</p> },\n    { id: "b", title: "${t.faq2}", content: <p>...</p> },\n  ]}\n/>`,
      source: AccordionSrc,
      states: ["hover", ICON, "expanded", "disabled"],
      tokens: ["--ds-surface", "--ds-hairline", "--ds-canvas-soft", "--ds-radius-lg", "--ds-duration-base", "--ds-ease-out"],
    },
    {
      id: "divider",
      name: "Divider",
      group: "layout",
      caption: t.caption.divider,
      controls: [
        { type: "select", key: "label", label: "label", options: [t.none, t.or, t.sep2026] },
        { type: "select", key: "orientation", label: "orientation", options: ["horizontal", "vertical"] },
      ],
      initial: { label: t.or, orientation: "horizontal" },
      render: (s) =>
        str(s, "orientation") === "vertical" ? (
          <div className="flex h-10 items-center gap-4 text-sm text-ink-secondary">
            <span>{t.draft}</span>
            <Divider orientation="vertical" />
            <span>{t.published}</span>
          </div>
        ) : (
          <div className="flex w-72 flex-col gap-4">
            <Button variant="secondary">{t.continueGoogle}</Button>
            <Divider label={str(s, "label") === t.none ? undefined : str(s, "label")} />
            <Input label={t.email} placeholder="name@company.com" />
          </div>
        ),
      code: (s) => (str(s, "orientation") === "vertical" ? `<Divider orientation="vertical" />` : `<Divider${str(s, "label") !== t.none ? ` label="${str(s, "label")}"` : ""} />`),
      source: DividerSrc,
      tokens: ["--ds-hairline", "--ds-ink-muted", "--ds-text-xs"],
    },

    /* --------------------------------------------------------- typography */
    {
      id: "link",
      name: "Link",
      group: "typography",
      caption: t.caption.link,
      controls: [
        { type: "select", key: "variant", label: "variant", options: ["inline", "standalone", "muted"] },
        { type: "toggle", key: "external", label: "external" },
      ],
      initial: { variant: "inline", external: false },
      render: (s) => {
        const v = str<LinkVariant>(s, "variant", "inline");
        if (v === "inline")
          return (
            <p className="t-body max-w-sm text-ink">
              {t.linkBefore}{" "}
              <Link href="#link" variant="inline" external={bool(s, "external")}>
                foundations/color.md
              </Link>{" "}
              {t.linkAfter}
            </p>
          );
        return (
          <Link href="#link" variant={v} external={bool(s, "external")}>
            {t.allFoundations}
          </Link>
        );
      },
      code: (s) => `<Link href="/foundations/color"${str(s, "variant") !== "inline" ? ` variant="${str(s, "variant")}"` : ""}${bool(s, "external") ? " external" : ""}>foundations/color.md</Link>`,
      source: LinkSrc,
      states: ["hover", ICON, "visited (same as rest)", "disabled"],
      tokens: ["--ds-accent", "--ds-accent-hover", "--ds-ink-secondary", "--ds-duration-instant"],
    },
    {
      id: "kbd",
      name: "Kbd",
      group: "typography",
      caption: t.caption.kbd,
      controls: [{ type: "select", key: "combo", label: "keys", options: ["⌘ K", "Ctrl Shift P", "Esc", "↑ ↓ ↵"] }],
      initial: { combo: "⌘ K" },
      render: (s) => (
        <p className="t-body-sm flex items-center gap-2 text-ink-secondary">
          <Kbd keys={str(s, "combo", "⌘ K").split(" ")} /> {t.opensSearch}
        </p>
      ),
      code: (s) => `<Kbd keys={[${str(s, "combo", "⌘ K").split(" ").map((k) => `"${k}"`).join(", ")}]} />`,
      source: KbdSrc,
      tokens: ["--ds-surface-sunken", "--ds-hairline", "--ds-radius-xs", "--ds-font-mono", "--ds-text-xs"],
    },
  ];

  return { groups, components };
}


const built = new Map<Locale, ReturnType<typeof build>>();

function registryFor(locale: Locale) {
  let r = built.get(locale);
  if (!r) {
    r = build(registryMessages[locale], locale);
    built.set(locale, r);
  }
  return r;
}

/** Entries with copy in `locale`. Demo components are created once per locale. */
export function componentsFor(locale: Locale): ComponentEntry[] {
  return registryFor(locale).components;
}

/** Group labels in `locale`, in display order. */
export function groupsFor(locale: Locale): Array<{ id: ComponentGroup; label: string }> {
  return registryFor(locale).groups;
}

/** Japanese entries, for callers that have no locale (kept for compatibility). */
export const components = componentsFor(defaultLocale);
export const groups = groupsFor(defaultLocale);

/** Look up an entry by id (URL hash). */
export function findComponent(id: string, locale: Locale = defaultLocale): ComponentEntry | undefined {
  return componentsFor(locale).find((c) => c.id === id);
}

/** Entries grouped in `groups` order. */
export function componentsByGroup(locale: Locale = defaultLocale): Array<{ group: { id: ComponentGroup; label: string }; items: ComponentEntry[] }> {
  const list = componentsFor(locale);
  return groupsFor(locale).map((g) => ({ group: g, items: list.filter((c) => c.group === g.id) }));
}
