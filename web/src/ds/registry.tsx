import { useState, type ReactNode } from "react";
import {
  AlignCenter, AlignLeft, AlignRight, Bold, Bookmark, Copy, FileText, Home, Italic, LayoutGrid, List, MoreHorizontal, Pencil, Plus, Search, Settings, Share2, Trash2, Underline,
} from "lucide-react";
import type { PlaygroundState } from "../layout/Playground";
import type { ComponentEntry, ComponentGroup } from "./registry.types";
export type { ComponentEntry, ComponentGroup } from "./registry.types";

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

/* ----------------------------------------------------------------------------
 * Demo wrappers: each keeps the local state a live component needs.
 * ------------------------------------------------------------------------- */

function DialogDemo({ description, footer }: { description: boolean; footer: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        ダイアログを開く
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="下書きを削除しますか"
        description={description ? "この操作は元に戻せません。" : undefined}
        footer={
          footer ? (
            <>
              <Button variant="secondary" onClick={() => setOpen(false)}>
                キャンセル
              </Button>
              <Button variant="danger" onClick={() => setOpen(false)}>
                削除する
              </Button>
            </>
          ) : undefined
        }
      >
        <p className="t-body-sm text-ink-secondary">「2026 年 Q3 のレポート」を削除します。</p>
      </Dialog>
    </>
  );
}

function SheetDemo({ side, footer }: { side: "right" | "bottom"; footer: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        シートを開く
      </Button>
      <Sheet
        open={open}
        onClose={() => setOpen(false)}
        side={side}
        title="フィルタ"
        description="結果を絞り込みます。"
        footer={
          footer ? (
            <>
              <Button variant="ghost" onClick={() => setOpen(false)}>
                リセット
              </Button>
              <Button onClick={() => setOpen(false)}>適用</Button>
            </>
          ) : undefined
        }
      >
        <div className="flex flex-col gap-5">
          <Input label="キーワード" placeholder="例: 請求書" />
          <Checkbox label="未読のみ" />
          <Checkbox label="添付ファイルあり" />
        </div>
      </Sheet>
    </>
  );
}

function CommandMenuDemo({ groups }: { groups: number }) {
  const [open, setOpen] = useState(false);
  const all = [
    {
      heading: "ページ",
      items: [
        { id: "home", label: "ホーム", icon: <Home strokeWidth={1.75} />, shortcut: ["G", "H"] },
        { id: "components", label: "コンポーネント", icon: <LayoutGrid strokeWidth={1.75} />, shortcut: ["G", "C"] },
        { id: "docs", label: "ドキュメント", icon: <FileText strokeWidth={1.75} /> },
      ],
    },
    {
      heading: "操作",
      items: [
        { id: "new", label: "新規作成", icon: <Plus strokeWidth={1.75} />, shortcut: ["N"] },
        { id: "search", label: "検索", icon: <Search strokeWidth={1.75} />, shortcut: ["/"] },
        { id: "settings", label: "設定", icon: <Settings strokeWidth={1.75} />, shortcut: ["⌘", ","] },
      ],
    },
    { heading: "最近", items: [{ id: "r1", label: "2026 年 Q3 レポート", keywords: ["report"] }, { id: "r2", label: "請求書 No.1043" }] },
  ];
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)} className="gap-3">
        コマンドメニュー <Kbd keys={["⌘", "K"]} />
      </Button>
      <CommandMenu open={open} onClose={() => setOpen(false)} groups={all.slice(0, groups)} />
    </>
  );
}

function ToastButton({ tone, description }: { tone: ToastTone; description: boolean }) {
  const { push } = useToast();
  const titles: Record<ToastTone, string> = { neutral: "24 行を書き出しました", success: "保存しました", danger: "保存できませんでした" };
  return (
    <Button variant="secondary" onClick={() => push({ title: titles[tone], description: description ? "ダウンロードフォルダを確認してください。" : undefined, tone })}>
      トーストを表示
    </Button>
  );
}

function SwitchDemo({ disabled }: { disabled: boolean }) {
  const [on, setOn] = useState(true);
  return <Switch label="通知を受け取る" checked={on} onChange={setOn} disabled={disabled} />;
}

function SliderDemo({ range, step, showValue, disabled }: { range: boolean; step: number; showValue: boolean; disabled: boolean }) {
  const [single, setSingle] = useState(40);
  const [pair, setPair] = useState<[number, number]>([20, 60]);
  return (
    <div className="w-72">
      {range ? (
        <Slider label="価格帯" value={pair} onChange={setPair} min={0} max={100} step={step} showValue={showValue} formatValue={(v) => `¥${v * 100}`} disabled={disabled} />
      ) : (
        <Slider label="音量" value={single} onChange={setSingle} min={0} max={100} step={step} showValue={showValue} formatValue={(v) => `${v}%`} disabled={disabled} />
      )}
    </div>
  );
}

const fruits = [
  { value: "apple", label: "りんご", description: "青森" },
  { value: "grape", label: "ぶどう", description: "山梨" },
  { value: "peach", label: "もも", description: "岡山" },
  { value: "mikan", label: "みかん", description: "愛媛" },
  { value: "melon", label: "メロン", description: "北海道" },
  { value: "kaki", label: "かき", description: "和歌山", disabled: true },
];

function ComboboxDemo({ disabled, helper }: { disabled: boolean; helper: boolean }) {
  const [value, setValue] = useState<string | null>("grape");
  return (
    <div className="w-72">
      <Combobox label="産地の果物" options={fruits} value={value} onChange={setValue} helper={helper ? "入力すると絞り込めます" : undefined} disabled={disabled} />
    </div>
  );
}

function TagInputDemo({ max, disabled }: { max: number; disabled: boolean }) {
  const [tags, setTags] = useState(["design", "tokens"]);
  return (
    <div className="w-72">
      <TagInput label="タグ" value={tags} onChange={setTags} max={max > 0 ? max : undefined} helper="Enter か , で追加" disabled={disabled} />
    </div>
  );
}

function FileUploadDemo({ withList, maxSize, disabled }: { withList: boolean; maxSize: number; disabled: boolean }) {
  const [items, setItems] = useState<UploadItem[]>(
    withList
      ? [
          { id: "a", name: "brand-guidelines.pdf", size: 2_400_000, status: "ready" },
          { id: "b", name: "logo-4k.png", size: 14_800_000, status: "error", error: `${maxSize} MB を超えています` },
        ]
      : [],
  );
  return (
    <div className="w-full max-w-md">
      <FileUpload label="ファイルをアップロード" accept="image/*,.pdf" maxSizeMB={maxSize} value={items} onChange={setItems} disabled={disabled} />
    </div>
  );
}

function DatePickerDemo({ preset, disabled, error }: { preset: boolean; disabled: boolean; error: boolean }) {
  const [date, setDate] = useState<Date | null>(preset ? new Date(2026, 8, 7) : null);
  return (
    <div className="w-72">
      <DatePicker label="公開日" value={date} onChange={setDate} helper="公開後に変更できます" error={error ? "過去の日付は選べません" : undefined} disabled={disabled} />
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
        label="表示"
        value={view}
        onChange={setView}
        size={size}
        fullWidth={fullWidth}
        disabled={disabled}
        options={[
          { value: "list", label: "リスト", icon: icons ? <List strokeWidth={1.75} /> : undefined },
          { value: "grid", label: "グリッド", icon: icons ? <LayoutGrid strokeWidth={1.75} /> : undefined },
          { value: "board", label: "ボード", icon: icons ? <Bookmark strokeWidth={1.75} /> : undefined },
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
        label="文字揃え"
        value={align}
        onChange={setAlign}
        size={size}
        disabled={disabled}
        items={[
          { value: "left", label: "左揃え", icon: <AlignLeft strokeWidth={1.75} />, iconOnly: true },
          { value: "center", label: "中央揃え", icon: <AlignCenter strokeWidth={1.75} />, iconOnly: true },
          { value: "right", label: "右揃え", icon: <AlignRight strokeWidth={1.75} />, iconOnly: true },
        ]}
      />
    );
  }
  return (
    <ToggleGroup
      type="multiple"
      label="文字スタイル"
      value={styles}
      onChange={setStyles}
      size={size}
      disabled={disabled}
      items={[
        { value: "bold", label: "太字", icon: <Bold strokeWidth={1.75} />, iconOnly: true },
        { value: "italic", label: "斜体", icon: <Italic strokeWidth={1.75} />, iconOnly: true },
        { value: "underline", label: "下線", icon: <Underline strokeWidth={1.75} />, iconOnly: true },
      ]}
    />
  );
}

function ChipDemo({ removable, size, disabled }: { removable: boolean; size: "sm" | "md"; disabled: boolean }) {
  const all = ["デザイン", "フロントエンド", "アクセシビリティ", "モーション"];
  const [selected, setSelected] = useState<string[]>(["デザイン"]);
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
          元に戻す
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
          { label: "アカウント", description: "メールと名前" },
          { label: "プラン", description: "月額または年額" },
          { label: "支払い", description: "カードを登録" },
          { label: "確認" },
        ]}
      />
    </div>
  );
}

function DropdownMenuDemo({ align, withDanger }: { align: "start" | "end"; withDanger: boolean }) {
  const items: MenuItem[] = [
    { id: "edit", label: "編集", icon: <Pencil strokeWidth={1.75} />, shortcut: "E" },
    { id: "copy", label: "複製", icon: <Copy strokeWidth={1.75} />, shortcut: "⌘D" },
    { id: "share", label: "共有", icon: <Share2 strokeWidth={1.75} /> },
    { id: "archive", label: "アーカイブ", disabled: true },
  ];
  if (withDanger) items.push({ type: "separator", id: "sep" }, { id: "delete", label: "削除", icon: <Trash2 strokeWidth={1.75} />, danger: true });
  return (
    <DropdownMenu
      align={align}
      items={items}
      trigger={(props) => (
        <Button variant="secondary" {...props}>
          操作 <MoreHorizontal strokeWidth={1.75} />
        </Button>
      )}
    />
  );
}

function AlertDemo({ tone, dismissible, action, body }: { tone: AlertTone; dismissible: boolean; action: boolean; body: boolean }) {
  const [shown, setShown] = useState(true);
  const copy: Record<AlertTone, [string, string]> = {
    neutral: ["メンテナンスのお知らせ", "9 月 12 日 2:00 から 30 分ほど停止します。"],
    info: ["新しいバージョンがあります", "再読み込みすると最新の内容に更新されます。"],
    success: ["支払いが完了しました", "領収書はメールで届きます。"],
    warning: ["容量が残り 10% です", "古いファイルを整理すると空きが増えます。"],
    danger: ["同期に失敗しました", "ネットワークを確認してもう一度お試しください。"],
  };
  if (!shown) {
    return (
      <Button variant="ghost" size="sm" onClick={() => setShown(true)}>
        もう一度表示
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
              {tone === "danger" ? "再試行" : "詳細を見る"}
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
  { id: "INV-1041", customer: "北山商店", amount: 128000, status: "paid", due: "2026-08-31" },
  { id: "INV-1042", customer: "ミナト製作所", amount: 54000, status: "pending", due: "2026-09-10" },
  { id: "INV-1043", customer: "青葉デザイン", amount: 312000, status: "overdue", due: "2026-08-20" },
  { id: "INV-1044", customer: "ハルカ通信", amount: 98000, status: "pending", due: "2026-09-15" },
  { id: "INV-1045", customer: "つばさ物流", amount: 21000, status: "paid", due: "2026-09-01" },
  { id: "INV-1046", customer: "セイワ建設", amount: 450000, status: "pending", due: "2026-09-30" },
];

const statusBadge: Record<Invoice["status"], { tone: BadgeTone; label: string }> = {
  paid: { tone: "success", label: "支払済" },
  pending: { tone: "neutral", label: "未払い" },
  overdue: { tone: "danger", label: "期限超過" },
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
        emptyState={<EmptyState title="請求書がありません" description="最初の請求書を作成すると、ここに一覧が表示されます。" action={<Button size="sm">作成</Button>} />}
        columns={[
          { key: "id", header: "番号", render: (r) => <span className="font-mono text-xs">{r.id}</span>, sortable: true, sortValue: (r) => r.id },
          { key: "customer", header: "顧客", render: (r) => r.customer, sortable: true, sortValue: (r) => r.customer },
          { key: "status", header: "状態", render: (r) => <Badge tone={statusBadge[r.status].tone}>{statusBadge[r.status].label}</Badge>, sortable: true, sortValue: (r) => r.status },
          { key: "due", header: "期限", render: (r) => r.due, sortable: true, sortValue: (r) => r.due },
          { key: "amount", header: "金額", align: "right", render: (r) => `¥${r.amount.toLocaleString("ja-JP")}`, sortable: true, sortValue: (r) => r.amount },
        ]}
      />
      {selectable && !empty && <p className="t-caption mt-2 tabular text-ink-muted">{selected.length} 件を選択中</p>}
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

export const groups: Array<{ id: ComponentGroup; label: string }> = [
  { id: "actions", label: "アクション" },
  { id: "inputs", label: "入力" },
  { id: "selection", label: "選択" },
  { id: "navigation", label: "ナビゲーション" },
  { id: "overlay", label: "オーバーレイ" },
  { id: "feedback", label: "フィードバック" },
  { id: "data", label: "データ" },
  { id: "layout", label: "レイアウト" },
  { id: "typography", label: "タイポグラフィ" },
];

export const components: ComponentEntry[] = [
  /* ------------------------------------------------------------ actions */
  {
    id: "button",
    name: "Button",
    group: "actions",
    caption: "1 画面に primary は 1 つ。アクセントは塗らない。",
    controls: [
      { type: "select", key: "variant", label: "variant", options: ["primary", "secondary", "ghost", "danger"] },
      { type: "select", key: "size", label: "size", options: ["sm", "md", "lg"] },
      { type: "toggle", key: "icon", label: "アイコン" },
      { type: "toggle", key: "loading", label: "loading" },
      { type: "toggle", key: "disabled", label: "disabled" },
    ],
    initial: { variant: "primary", size: "md", icon: false, loading: false, disabled: false },
    render: (s) => (
      <Button variant={str<ButtonVariant>(s, "variant", "primary")} size={str<ButtonSize>(s, "size", "md")} loading={bool(s, "loading")} disabled={bool(s, "disabled")}>
        {bool(s, "icon") && !bool(s, "loading") && <Plus strokeWidth={1.75} />}
        保存する
      </Button>
    ),
    code: (s) =>
      `<Button${attrs({ variant: str(s, "variant"), size: str(s, "size") !== "md" ? str(s, "size") : undefined, loading: bool(s, "loading"), disabled: bool(s, "disabled") })}>\n${bool(s, "icon") ? `  <Plus strokeWidth={1.75} />\n` : ""}  保存する\n</Button>`,
    source: ButtonSrc,
    states: ["hover", ICON, "active", "disabled", "loading"],
    tokens: ["--ds-primary", "--ds-on-primary", "--ds-primary-hover", "--ds-hairline-strong", "--ds-radius-md", "--ds-control-sm", "--ds-control-md", "--ds-control-lg", "--ds-duration-instant"],
  },
  {
    id: "dropdown-menu",
    name: "DropdownMenu",
    group: "actions",
    caption: "クリックで開く。破壊的な項目は最後に danger で置く。",
    controls: [
      { type: "select", key: "align", label: "align", options: ["start", "end"] },
      { type: "toggle", key: "danger", label: "削除項目" },
    ],
    initial: { align: "start", danger: true },
    render: (s) => <DropdownMenuDemo align={str<"start" | "end">(s, "align", "start")} withDanger={bool(s, "danger")} />,
    code: (s) =>
      `<DropdownMenu\n  align="${str(s, "align")}"\n  trigger={(props) => <Button variant="secondary" {...props}>操作</Button>}\n  items={[\n    { id: "edit", label: "編集", icon: <Pencil />, shortcut: "E" },\n    { id: "copy", label: "複製", icon: <Copy /> },${bool(s, "danger") ? `\n    { type: "separator", id: "sep" },\n    { id: "delete", label: "削除", icon: <Trash2 />, danger: true },` : ""}\n  ]}\n/>`,
    source: DropdownMenuSrc,
    states: ["hover", ICON, "disabled", "open"],
    tokens: ["--ds-surface", "--ds-hairline", "--ds-radius-lg", "--ds-radius-md", "--ds-shadow-2", "--ds-danger", "--ds-duration-fast", "--ds-ease-out"],
  },

  /* ------------------------------------------------------------- inputs */
  {
    id: "input",
    name: "Input",
    group: "inputs",
    caption: "ラベルは上、補足は下。プレースホルダをラベルにしない。",
    controls: [
      { type: "toggle", key: "helper", label: "helper" },
      { type: "toggle", key: "error", label: "error" },
      { type: "toggle", key: "disabled", label: "disabled" },
    ],
    initial: { helper: true, error: false, disabled: false },
    render: (s) => (
      <div className="w-72">
        <Input label="メールアドレス" placeholder="name@company.com" helper={bool(s, "helper") ? "仕事用のアドレスを入力" : undefined} error={bool(s, "error") ? "有効なメールアドレスを入力してください" : undefined} disabled={bool(s, "disabled")} />
      </div>
    ),
    code: (s) => `<Input\n  label="メールアドレス"\n  placeholder="name@company.com"${bool(s, "helper") ? `\n  helper="仕事用のアドレスを入力"` : ""}${bool(s, "error") ? `\n  error="有効なメールアドレスを入力してください"` : ""}${bool(s, "disabled") ? `\n  disabled` : ""}\n/>`,
    source: InputSrc,
    states: ["hover", ICON, "error", "disabled"],
    tokens: ["--ds-surface", "--ds-hairline-strong", "--ds-radius-md", "--ds-control-md", "--ds-danger", "--ds-ink-muted"],
  },
  {
    id: "textarea",
    name: "Textarea",
    group: "inputs",
    caption: "最小 3 行。内容に合わせて伸び、縦だけリサイズする。",
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
          label="メモ"
          placeholder="打ち合わせの要点を書く"
          autosize={bool(s, "autosize")}
          minRows={num(s, "minRows", 3)}
          helper="Markdown が使えます"
          error={bool(s, "error") ? "200 文字以内で入力してください" : undefined}
          disabled={bool(s, "disabled")}
          defaultValue={"来週のレビューで確認する点:\n- トークンの命名\n- ダークモードの階調"}
        />
      </div>
    ),
    code: (s) => `<Textarea\n  label="メモ"\n  helper="Markdown が使えます"${bool(s, "autosize") ? "" : `\n  autosize={false}`}${num(s, "minRows", 3) !== 3 ? `\n  minRows={${num(s, "minRows")}}` : ""}${bool(s, "error") ? `\n  error="200 文字以内で入力してください"` : ""}${bool(s, "disabled") ? `\n  disabled` : ""}\n/>`,
    source: TextareaSrc,
    states: ["hover", ICON, "error", "disabled", "read-only"],
    tokens: ["--ds-surface", "--ds-hairline-strong", "--ds-radius-md", "--ds-danger", "--ds-canvas-soft"],
  },
  {
    id: "select",
    name: "Select",
    group: "inputs",
    caption: "ネイティブ select を使う。検索が要るなら Combobox。",
    controls: [
      { type: "toggle", key: "helper", label: "helper" },
      { type: "toggle", key: "disabled", label: "disabled" },
    ],
    initial: { helper: false, disabled: false },
    render: (s) => (
      <div className="w-72">
        <Select label="タイムゾーン" defaultValue="tokyo" helper={bool(s, "helper") ? "請求書の日付に使います" : undefined} disabled={bool(s, "disabled")}>
          <option value="tokyo">東京 (UTC+9)</option>
          <option value="london">ロンドン (UTC+0)</option>
          <option value="ny">ニューヨーク (UTC-4)</option>
        </Select>
      </div>
    ),
    code: (s) => `<Select label="タイムゾーン"${bool(s, "helper") ? ` helper="請求書の日付に使います"` : ""}${bool(s, "disabled") ? " disabled" : ""}>\n  <option value="tokyo">東京 (UTC+9)</option>\n  <option value="london">ロンドン (UTC+0)</option>\n</Select>`,
    source: SelectSrc,
    states: ["hover", ICON, "disabled"],
    tokens: ["--ds-surface", "--ds-hairline-strong", "--ds-radius-md", "--ds-control-md", "--ds-ink-muted"],
  },
  {
    id: "combobox",
    name: "Combobox",
    group: "inputs",
    caption: "入力で絞り込み、矢印で選ぶ。長いリストに使う。",
    controls: [
      { type: "toggle", key: "helper", label: "helper" },
      { type: "toggle", key: "disabled", label: "disabled" },
    ],
    initial: { helper: true, disabled: false },
    render: (s) => <ComboboxDemo helper={bool(s, "helper")} disabled={bool(s, "disabled")} />,
    code: (s) => `const [value, setValue] = useState<string | null>("grape");\n\n<Combobox\n  label="産地の果物"\n  options={[{ value: "apple", label: "りんご", description: "青森" }, ...]}\n  value={value}\n  onChange={setValue}${bool(s, "helper") ? `\n  helper="入力すると絞り込めます"` : ""}${bool(s, "disabled") ? `\n  disabled` : ""}\n/>`,
    source: ComboboxSrc,
    states: ["hover", ICON, "open", "active option", "selected", "disabled", "empty"],
    tokens: ["--ds-surface", "--ds-hairline-strong", "--ds-hairline", "--ds-radius-md", "--ds-radius-lg", "--ds-shadow-2", "--ds-surface-sunken", "--ds-duration-fast"],
  },
  {
    id: "tag-input",
    name: "TagInput",
    group: "inputs",
    caption: "Enter で追加、Backspace で削除。重複は無視する。",
    controls: [
      { type: "range", key: "max", label: "max (0 = なし)", min: 0, max: 8 },
      { type: "toggle", key: "disabled", label: "disabled" },
    ],
    initial: { max: 5, disabled: false },
    render: (s) => <TagInputDemo max={num(s, "max", 5)} disabled={bool(s, "disabled")} />,
    code: (s) => `const [tags, setTags] = useState(["design", "tokens"]);\n\n<TagInput label="タグ" value={tags} onChange={setTags}${num(s, "max") > 0 ? ` max={${num(s, "max")}}` : ""}${bool(s, "disabled") ? " disabled" : ""} />`,
    source: TagInputSrc,
    states: ["hover", ICON, "disabled", "full"],
    tokens: ["--ds-surface", "--ds-hairline-strong", "--ds-surface-sunken", "--ds-radius-md", "--ds-radius-pill", "--ds-accent"],
  },
  {
    id: "slider",
    name: "Slider",
    group: "inputs",
    caption: "つまみはボタン。矢印で刻み、Home/End で端へ。",
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
        ? `const [range, setRange] = useState<[number, number]>([20, 60]);\n\n<Slider label="価格帯" value={range} onChange={setRange} min={0} max={100} step={${num(s, "step")}}${bool(s, "showValue") ? " showValue" : ""} formatValue={(v) => \`¥\${v * 100}\`}${bool(s, "disabled") ? " disabled" : ""} />`
        : `const [value, setValue] = useState(40);\n\n<Slider label="音量" value={value} onChange={setValue} min={0} max={100} step={${num(s, "step")}}${bool(s, "showValue") ? " showValue" : ""} formatValue={(v) => \`\${v}%\`}${bool(s, "disabled") ? " disabled" : ""} />`,
    source: SliderSrc,
    states: ["hover", ICON, "active", "disabled"],
    tokens: ["--ds-primary", "--ds-hairline", "--ds-surface", "--ds-shadow-2", "--ds-radius-pill", "--ds-duration-instant"],
  },
  {
    id: "file-upload",
    name: "FileUpload",
    group: "inputs",
    caption: "ドロップ領域は label。クリック、キーボード、ドロップで動く。",
    controls: [
      { type: "toggle", key: "list", label: "一覧あり" },
      { type: "range", key: "maxSize", label: "maxSizeMB", min: 1, max: 50, unit: " MB" },
      { type: "toggle", key: "disabled", label: "disabled" },
    ],
    initial: { list: true, maxSize: 10, disabled: false },
    render: (s) => <FileUploadDemo key={`${s.list}-${s.maxSize}`} withList={bool(s, "list")} maxSize={num(s, "maxSize", 10)} disabled={bool(s, "disabled")} />,
    code: (s) => `const [files, setFiles] = useState<UploadItem[]>([]);\n\n<FileUpload label="ファイルをアップロード" accept="image/*,.pdf" maxSizeMB={${num(s, "maxSize")}} value={files} onChange={setFiles}${bool(s, "disabled") ? " disabled" : ""} />`,
    source: FileUploadSrc,
    states: ["hover", ICON, "drag-over", "error", "disabled"],
    tokens: ["--ds-hairline-strong", "--ds-radius-lg", "--ds-accent", "--ds-accent-soft", "--ds-surface-sunken", "--ds-danger"],
  },
  {
    id: "date-picker",
    name: "DatePicker",
    group: "inputs",
    caption: "表示は Intl に任せる。Escape で閉じ、フォーカスを戻す。",
    controls: [
      { type: "toggle", key: "preset", label: "初期値あり" },
      { type: "toggle", key: "error", label: "error" },
      { type: "toggle", key: "disabled", label: "disabled" },
    ],
    initial: { preset: true, error: false, disabled: false },
    render: (s) => <DatePickerDemo key={String(s.preset)} preset={bool(s, "preset")} error={bool(s, "error")} disabled={bool(s, "disabled")} />,
    code: (s) => `const [date, setDate] = useState<Date | null>(${bool(s, "preset") ? "new Date(2026, 8, 7)" : "null"});\n\n<DatePicker label="公開日" value={date} onChange={setDate} helper="公開後に変更できます"${bool(s, "error") ? ` error="過去の日付は選べません"` : ""}${bool(s, "disabled") ? " disabled" : ""} />`,
    source: DatePickerSrc,
    states: ["hover", ICON, "open", "error", "disabled"],
    tokens: ["--ds-surface", "--ds-hairline-strong", "--ds-radius-md", "--ds-shadow-2", "--ds-danger", "--ds-duration-fast"],
  },
  {
    id: "rating",
    name: "Rating",
    group: "inputs",
    caption: "星はラジオ。値をテキストでも添え、色だけにしない。",
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
    caption: "複数から 0 個以上。ラベル全体がクリック領域。",
    controls: [
      { type: "toggle", key: "description", label: "description" },
      { type: "toggle", key: "disabled", label: "disabled" },
    ],
    initial: { description: true, disabled: false },
    render: (s) => (
      <div className="flex flex-col gap-3">
        <Checkbox label="週次レポートを受け取る" description={bool(s, "description") ? "毎週月曜の朝に届きます" : undefined} defaultChecked disabled={bool(s, "disabled")} />
        <Checkbox label="製品のお知らせ" description={bool(s, "description") ? "新機能とメンテナンス" : undefined} disabled={bool(s, "disabled")} />
      </div>
    ),
    code: (s) => `<Checkbox label="週次レポートを受け取る"${bool(s, "description") ? ` description="毎週月曜の朝に届きます"` : ""} defaultChecked${bool(s, "disabled") ? " disabled" : ""} />`,
    source: CheckboxSrc,
    states: ["hover", ICON, "checked", "disabled"],
    tokens: ["--ds-primary", "--ds-hairline-strong", "--ds-radius-xs", "--ds-duration-instant"],
  },
  {
    id: "radio",
    name: "Radio",
    group: "selection",
    caption: "2〜5 個から 1 つ。全部見せたいときに使う。",
    controls: [{ type: "toggle", key: "disabled", label: "disabled" }],
    initial: { disabled: false },
    render: (s) => (
      <RadioGroup legend="請求サイクル">
        <Radio name="cycle" label="月額" defaultChecked disabled={bool(s, "disabled")} />
        <Radio name="cycle" label="年額 (2 か月分お得)" disabled={bool(s, "disabled")} />
      </RadioGroup>
    ),
    code: (s) => `<RadioGroup legend="請求サイクル">\n  <Radio name="cycle" label="月額" defaultChecked${bool(s, "disabled") ? " disabled" : ""} />\n  <Radio name="cycle" label="年額"${bool(s, "disabled") ? " disabled" : ""} />\n</RadioGroup>`,
    source: RadioSrc,
    states: ["hover", ICON, "checked", "disabled"],
    tokens: ["--ds-primary", "--ds-hairline-strong", "--ds-radius-pill"],
  },
  {
    id: "switch",
    name: "Switch",
    group: "selection",
    caption: "即時に反映される設定だけ。保存ボタンのある画面では使わない。",
    controls: [{ type: "toggle", key: "disabled", label: "disabled" }],
    initial: { disabled: false },
    render: (s) => <SwitchDemo disabled={bool(s, "disabled")} />,
    code: (s) => `const [on, setOn] = useState(true);\n\n<Switch label="通知を受け取る" checked={on} onChange={setOn}${bool(s, "disabled") ? " disabled" : ""} />`,
    source: SwitchSrc,
    states: ["hover", ICON, "checked", "disabled"],
    tokens: ["--ds-primary", "--ds-surface-sunken", "--ds-hairline-strong", "--ds-radius-pill", "--ds-duration-fast", "--ds-ease-out"],
  },
  {
    id: "segmented-control",
    name: "SegmentedControl",
    group: "selection",
    caption: "2〜5 個の短い選択で表示を即切替。矢印で移動。",
    controls: [
      { type: "select", key: "size", label: "size", options: ["sm", "md"] },
      { type: "toggle", key: "icons", label: "アイコン" },
      { type: "toggle", key: "fullWidth", label: "fullWidth" },
      { type: "toggle", key: "disabled", label: "disabled" },
    ],
    initial: { size: "md", icons: true, fullWidth: false, disabled: false },
    render: (s) => <SegmentedDemo size={str<"sm" | "md">(s, "size", "md")} icons={bool(s, "icons")} fullWidth={bool(s, "fullWidth")} disabled={bool(s, "disabled")} />,
    code: (s) => `const [view, setView] = useState("list");\n\n<SegmentedControl\n  label="表示"\n  value={view}\n  onChange={setView}${attrs({ size: str(s, "size") !== "md" ? str(s, "size") : undefined, fullWidth: bool(s, "fullWidth"), disabled: bool(s, "disabled") }).replace(/ /g, "\n  ")}\n  options={[\n    { value: "list", label: "リスト"${bool(s, "icons") ? ", icon: <List />" : ""} },\n    { value: "grid", label: "グリッド"${bool(s, "icons") ? ", icon: <LayoutGrid />" : ""} },\n  ]}\n/>`,
    source: SegmentedControlSrc,
    states: ["hover", ICON, "checked", "disabled"],
    tokens: ["--ds-surface-sunken", "--ds-surface", "--ds-shadow-2", "--ds-radius-md", "--ds-radius-sm", "--ds-duration-instant"],
  },
  {
    id: "toggle-group",
    name: "ToggleGroup",
    group: "selection",
    caption: "ツールバー向き。single は全部オフにもできる。",
    controls: [
      { type: "select", key: "type", label: "type", options: ["single", "multiple"] },
      { type: "select", key: "size", label: "size", options: ["sm", "md"] },
      { type: "toggle", key: "disabled", label: "disabled" },
    ],
    initial: { type: "single", size: "md", disabled: false },
    render: (s) => <ToggleGroupDemo type={str<"single" | "multiple">(s, "type", "single")} size={str<"sm" | "md">(s, "size", "md")} disabled={bool(s, "disabled")} />,
    code: (s) =>
      str(s, "type") === "single"
        ? `const [align, setAlign] = useState<"left" | "center" | "right" | null>("left");\n\n<ToggleGroup type="single" label="文字揃え" value={align} onChange={setAlign}${attrs({ size: str(s, "size") !== "md" ? str(s, "size") : undefined, disabled: bool(s, "disabled") })}\n  items={[\n    { value: "left", label: "左揃え", icon: <AlignLeft />, iconOnly: true },\n    { value: "center", label: "中央揃え", icon: <AlignCenter />, iconOnly: true },\n  ]}\n/>`
        : `const [styles, setStyles] = useState(["bold"]);\n\n<ToggleGroup type="multiple" label="文字スタイル" value={styles} onChange={setStyles}${attrs({ size: str(s, "size") !== "md" ? str(s, "size") : undefined, disabled: bool(s, "disabled") })}\n  items={[\n    { value: "bold", label: "太字", icon: <Bold />, iconOnly: true },\n    { value: "italic", label: "斜体", icon: <Italic />, iconOnly: true },\n  ]}\n/>`,
    source: ToggleGroupSrc,
    states: ["hover", ICON, "active", "pressed", "disabled"],
    tokens: ["--ds-surface", "--ds-surface-sunken", "--ds-hairline-strong", "--ds-radius-md", "--ds-control-sm", "--ds-control-md"],
  },
  {
    id: "chip",
    name: "Chip",
    group: "selection",
    caption: "押せるならチップ、読むだけならバッジ。選択にチェックを添える。",
    controls: [
      { type: "select", key: "size", label: "size", options: ["sm", "md"] },
      { type: "toggle", key: "removable", label: "削除ボタン" },
      { type: "toggle", key: "disabled", label: "disabled" },
    ],
    initial: { size: "sm", removable: false, disabled: false },
    render: (s) => <ChipDemo size={str<"sm" | "md">(s, "size", "sm")} removable={bool(s, "removable")} disabled={bool(s, "disabled")} />,
    code: (s) => `<Chip selected={selected} onSelectedChange={setSelected}${attrs({ size: str(s, "size") !== "sm" ? str(s, "size") : undefined, disabled: bool(s, "disabled") })}${bool(s, "removable") ? ` onRemove={() => remove("デザイン")}` : ""}>\n  デザイン\n</Chip>`,
    source: ChipSrc,
    states: ["hover", ICON, "active", "pressed", "disabled"],
    tokens: ["--ds-primary", "--ds-on-primary", "--ds-hairline-strong", "--ds-surface-sunken", "--ds-radius-pill", "--ds-control-sm"],
  },
  {
    id: "calendar",
    name: "Calendar",
    group: "selection",
    caption: "月グリッドは role=grid。矢印で日、PageUp/Down で月を移動。",
    controls: [
      { type: "select", key: "weekStartsOn", label: "週の始まり", options: ["日", "月"] },
      { type: "toggle", key: "limited", label: "min / max" },
    ],
    initial: { weekStartsOn: "日", limited: false },
    render: (s) => <CalendarDemo key={`${s.weekStartsOn}-${s.limited}`} weekStartsOn={str(s, "weekStartsOn") === "月" ? 1 : 0} limited={bool(s, "limited")} />,
    code: (s) => `const [date, setDate] = useState<Date | null>(new Date(2026, 8, 7));\n\n<Calendar value={date} onChange={setDate} locale="ja-JP"${str(s, "weekStartsOn") === "月" ? " weekStartsOn={1}" : ""}${bool(s, "limited") ? " min={new Date(2026, 8, 3)} max={new Date(2026, 8, 24)}" : ""} />`,
    source: CalendarSrc,
    states: ["hover", ICON, "selected", "today", "outside month", "disabled"],
    tokens: ["--ds-surface", "--ds-hairline", "--ds-primary", "--ds-on-primary", "--ds-surface-sunken", "--ds-radius-lg", "--ds-radius-md"],
  },

  /* --------------------------------------------------------- navigation */
  {
    id: "tabs",
    name: "Tabs",
    group: "navigation",
    caption: "3〜7 個、同じ種類の内容。手順には Stepper。",
    controls: [{ type: "range", key: "count", label: "タブ数", min: 2, max: 6 }],
    initial: { count: 3 },
    render: (s) => (
      <div className="w-72">
        <Tabs
          key={num(s, "count", 3)}
          tabs={["概要", "アクティビティ", "設定", "メンバー", "請求", "連携"].slice(0, num(s, "count", 3)).map((label, i) => ({
            id: `t${i}`,
            label,
            content: <p className="t-body-sm text-ink-secondary">{label}の内容がここに入ります。</p>,
          }))}
        />
      </div>
    ),
    code: (s) => `<Tabs\n  tabs={[\n${["概要", "アクティビティ", "設定", "メンバー", "請求", "連携"].slice(0, num(s, "count", 3)).map((l, i) => `    { id: "t${i}", label: "${l}", content: <Panel /> },`).join("\n")}\n  ]}\n/>`,
    source: TabsSrc,
    states: ["hover", ICON, "selected"],
    tokens: ["--ds-ink", "--ds-ink-secondary", "--ds-hairline", "--ds-control-md", "--ds-duration-instant"],
  },
  {
    id: "breadcrumb",
    name: "Breadcrumb",
    group: "navigation",
    caption: "14px、区切りは 16px のシェブロン。現在地に aria-current。",
    controls: [
      { type: "range", key: "depth", label: "階層", min: 2, max: 6 },
      { type: "toggle", key: "collapse", label: "中間を省略" },
    ],
    initial: { depth: 4, collapse: false },
    render: (s) => {
      const trail = ["ホーム", "プロジェクト", "AwesomeDS", "コンポーネント", "ナビゲーション", "Breadcrumb"];
      const depth = num(s, "depth", 4);
      const items = trail.slice(6 - depth).map((label, i, arr) => ({ label, href: i < arr.length - 1 ? "#" : undefined }));
      return <Breadcrumb items={items} maxItems={bool(s, "collapse") ? 3 : undefined} />;
    },
    code: (s) => `<Breadcrumb${bool(s, "collapse") ? " maxItems={3}" : ""}\n  items={[\n    { label: "ホーム", href: "/" },\n    { label: "プロジェクト", href: "/projects" },\n    { label: "Breadcrumb" },\n  ]}\n/>`,
    source: BreadcrumbSrc,
    states: ["hover", ICON, "current"],
    tokens: ["--ds-ink-secondary", "--ds-ink", "--ds-ink-muted", "--ds-surface-sunken", "--ds-radius-sm"],
  },
  {
    id: "pagination",
    name: "Pagination",
    group: "navigation",
    caption: "現在ページはインクで塗り、端では前後を無効にする。",
    controls: [
      { type: "range", key: "total", label: "総ページ", min: 1, max: 40 },
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
    caption: "順番のある手順に。完了はチェック、現在はリング。",
    controls: [
      { type: "select", key: "orientation", label: "orientation", options: ["horizontal", "vertical"] },
      { type: "range", key: "current", label: "現在", min: 0, max: 3 },
      { type: "toggle", key: "clickable", label: "戻れる" },
    ],
    initial: { orientation: "horizontal", current: 1, clickable: true },
    render: (s) => <StepperDemo key={`${s.current}-${s.clickable}`} orientation={str<"horizontal" | "vertical">(s, "orientation", "horizontal")} current={num(s, "current", 1)} clickable={bool(s, "clickable")} />,
    code: (s) => `<Stepper\n  current={${num(s, "current")}}${str(s, "orientation") === "vertical" ? `\n  orientation="vertical"` : ""}${bool(s, "clickable") ? `\n  onStepClick={setStep}` : ""}\n  steps={[\n    { label: "アカウント", description: "メールと名前" },\n    { label: "プラン", description: "月額または年額" },\n    { label: "支払い", description: "カードを登録" },\n    { label: "確認" },\n  ]}\n/>`,
    source: StepperSrc,
    states: ["complete", "current", "upcoming", ICON],
    tokens: ["--ds-primary", "--ds-on-primary", "--ds-hairline", "--ds-hairline-strong", "--ds-radius-pill", "--ds-duration-fast"],
  },
  {
    id: "nav-bar",
    name: "NavBar",
    group: "navigation",
    caption: "64px、下にヘアライン。リンクは折り返さない。",
    controls: [
      { type: "range", key: "links", label: "リンク数", min: 2, max: 5 },
      { type: "toggle", key: "action", label: "アクション" },
    ],
    initial: { links: 4, action: true },
    render: (s) => (
      <div className="w-full overflow-hidden rounded-lg border border-hairline">
        <NavBar
          brand="AwesomeDS"
          links={["基盤", "コンポーネント", "モーション", "ナレッジ", "About"].slice(0, num(s, "links", 4)).map((label, i) => ({ label, href: "#", current: i === 1 }))}
          actions={bool(s, "action") ? <Button size="sm">始める</Button> : undefined}
        />
      </div>
    ),
    code: (s) => `<NavBar\n  brand="AwesomeDS"\n  links={[\n    { label: "基盤", href: "/foundations" },\n    { label: "コンポーネント", href: "/components", current: true },\n  ]}${bool(s, "action") ? `\n  actions={<Button size="sm">始める</Button>}` : ""}\n/>`,
    source: NavBarSrc,
    states: ["hover", ICON, "current"],
    tokens: ["--ds-canvas", "--ds-hairline", "--ds-ink-secondary", "--ds-surface-sunken", "--ds-radius-md"],
  },

  /* ------------------------------------------------------------ overlay */
  {
    id: "dialog",
    name: "Dialog",
    group: "overlay",
    caption: "応答が必要なときだけ。ネイティブ dialog に任せる。",
    controls: [
      { type: "toggle", key: "description", label: "description" },
      { type: "toggle", key: "footer", label: "footer" },
    ],
    initial: { description: true, footer: true },
    render: (s) => <DialogDemo description={bool(s, "description")} footer={bool(s, "footer")} />,
    code: (s) => `const [open, setOpen] = useState(false);\n\n<Dialog\n  open={open}\n  onClose={() => setOpen(false)}\n  title="下書きを削除しますか"${bool(s, "description") ? `\n  description="この操作は元に戻せません。"` : ""}${bool(s, "footer") ? `\n  footer={<>\n    <Button variant="secondary" onClick={() => setOpen(false)}>キャンセル</Button>\n    <Button variant="danger">削除する</Button>\n  </>}` : ""}\n>\n  <p>「2026 年 Q3 のレポート」を削除します。</p>\n</Dialog>`,
    source: DialogSrc,
    states: ["open", "closing", ICON],
    tokens: ["--ds-surface", "--ds-hairline", "--ds-radius-xl", "--ds-shadow-3", "--ds-duration-slow", "--ds-duration-fast", "--ds-ease-out", "--ds-ease-in"],
  },
  {
    id: "sheet",
    name: "Sheet",
    group: "overlay",
    caption: "背面を参照する編集に。8px だけ動かし、画面外からは出さない。",
    controls: [
      { type: "select", key: "side", label: "side", options: ["right", "bottom"] },
      { type: "toggle", key: "footer", label: "footer" },
    ],
    initial: { side: "right", footer: true },
    render: (s) => <SheetDemo side={str<"right" | "bottom">(s, "side", "right")} footer={bool(s, "footer")} />,
    code: (s) => `const [open, setOpen] = useState(false);\n\n<Sheet\n  open={open}\n  onClose={() => setOpen(false)}${str(s, "side") === "bottom" ? `\n  side="bottom"` : ""}\n  title="フィルタ"\n  description="結果を絞り込みます。"${bool(s, "footer") ? `\n  footer={<>\n    <Button variant="ghost">リセット</Button>\n    <Button>適用</Button>\n  </>}` : ""}\n>\n  <Input label="キーワード" />\n</Sheet>`,
    source: SheetSrc,
    states: ["open", "closing", ICON],
    tokens: ["--ds-surface", "--ds-hairline", "--ds-radius-xl", "--ds-shadow-3", "--ds-duration-slow", "--ds-duration-fast", "--ds-ease-out", "--ds-ease-in"],
  },
  {
    id: "command-menu",
    name: "CommandMenu",
    group: "overlay",
    caption: "⌘K は近道。すべてのコマンドは見える UI にもある。",
    controls: [{ type: "range", key: "groups", label: "グループ数", min: 1, max: 3 }],
    initial: { groups: 3 },
    render: (s) => <CommandMenuDemo groups={num(s, "groups", 3)} />,
    code: (s) => `const [open, setOpen] = useCommandMenu(); // ⌘K / Ctrl+K\n\n<CommandMenu\n  open={open}\n  onClose={() => setOpen(false)}\n  groups={[\n    { heading: "ページ", items: [{ id: "home", label: "ホーム", icon: <Home />, shortcut: ["G", "H"] }] },${num(s, "groups", 3) > 1 ? `\n    { heading: "操作", items: [{ id: "new", label: "新規作成", icon: <Plus />, shortcut: ["N"] }] },` : ""}${num(s, "groups", 3) > 2 ? `\n    { heading: "最近", items: [{ id: "r1", label: "2026 年 Q3 レポート" }] },` : ""}\n  ]}\n/>`,
    source: CommandMenuSrc,
    states: ["open", "active option", "empty", ICON],
    tokens: ["--ds-surface", "--ds-hairline", "--ds-radius-xl", "--ds-shadow-3", "--ds-surface-sunken", "--ds-canvas-soft", "--ds-duration-base", "--ds-ease-out"],
  },
  {
    id: "popover",
    name: "Popover",
    group: "overlay",
    caption: "レベル 2。Escape と外側クリックで閉じ、フォーカスは閉じ込めない。",
    initial: {},
    render: () => (
      <Popover
        trigger={(props) => (
          <Button variant="secondary" {...props}>
            共有設定
          </Button>
        )}
      >
        <p className="t-label text-ink">リンクを知っている人</p>
        <p className="t-caption mt-1 text-ink-secondary">閲覧のみ。編集は招待した人だけ。</p>
        <div className="mt-3 flex gap-2">
          <Button size="sm" variant="secondary">
            リンクをコピー
          </Button>
        </div>
      </Popover>
    ),
    code: () => `<Popover trigger={(props) => <Button variant="secondary" {...props}>共有設定</Button>}>\n  <p className="t-label">リンクを知っている人</p>\n  <Button size="sm" variant="secondary">リンクをコピー</Button>\n</Popover>`,
    source: PopoverSrc,
    states: ["open", ICON],
    tokens: ["--ds-surface", "--ds-hairline", "--ds-radius-lg", "--ds-shadow-2", "--ds-duration-fast", "--ds-ease-out"],
  },
  {
    id: "tooltip",
    name: "Tooltip",
    group: "overlay",
    caption: "ホバーとフォーカスで出る 1 行。必須情報は入れない。",
    controls: [{ type: "select", key: "label", label: "label", options: ["コピー", "共有リンクを作成", "⌘C でもコピーできます"] }],
    initial: { label: "コピー" },
    render: (s) => (
      <Tooltip label={str(s, "label", "コピー")}>
        <Button variant="secondary" size="sm" aria-label="コピー">
          <Copy strokeWidth={1.75} />
        </Button>
      </Tooltip>
    ),
    code: (s) => `<Tooltip label="${str(s, "label")}">\n  <Button variant="secondary" size="sm" aria-label="コピー"><Copy /></Button>\n</Tooltip>`,
    source: TooltipSrc,
    states: ["hover", ICON],
    tokens: ["--ds-surface", "--ds-hairline", "--ds-radius-sm", "--ds-shadow-2", "--ds-text-xs", "--ds-duration-instant"],
  },

  /* ----------------------------------------------------------- feedback */
  {
    id: "toast",
    name: "Toast",
    group: "feedback",
    caption: "裏で終わった結果に。フォームのエラーは行内で見せる。",
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
    code: (s) => `const { push } = useToast();\n\npush({ title: "保存しました", tone: "${str(s, "tone")}"${bool(s, "description") ? `, description: "ダウンロードフォルダを確認してください。"` : ""} });`,
    source: ToastSrc,
    states: ["enter", "auto-dismiss", ICON],
    tokens: ["--ds-surface", "--ds-hairline", "--ds-radius-lg", "--ds-shadow-2", "--ds-success", "--ds-danger", "--ds-duration-base", "--ds-ease-out"],
  },
  {
    id: "alert",
    name: "Alert",
    group: "feedback",
    caption: "行内バナー。アイコンと見出しを必ず添え、色だけにしない。",
    controls: [
      { type: "select", key: "tone", label: "tone", options: ["neutral", "info", "success", "warning", "danger"] },
      { type: "toggle", key: "body", label: "本文" },
      { type: "toggle", key: "action", label: "アクション" },
      { type: "toggle", key: "dismissible", label: "閉じられる" },
    ],
    initial: { tone: "warning", body: true, action: true, dismissible: true },
    render: (s) => <AlertDemo key={str(s, "tone")} tone={str<AlertTone>(s, "tone", "warning")} body={bool(s, "body")} action={bool(s, "action")} dismissible={bool(s, "dismissible")} />,
    code: (s) => `<Alert\n  tone="${str(s, "tone")}"\n  title="容量が残り 10% です"${bool(s, "action") ? `\n  action={<Button variant="secondary" size="sm">詳細を見る</Button>}` : ""}${bool(s, "dismissible") ? `\n  onDismiss={() => setShown(false)}` : ""}\n>${bool(s, "body") ? `\n  古いファイルを整理すると空きが増えます。\n` : ""}</Alert>`,
    source: AlertSrc,
    states: ["neutral", "info", "success", "warning", "danger", ICON],
    tokens: ["--ds-accent-soft", "--ds-success-soft", "--ds-warning-soft", "--ds-danger-soft", "--ds-radius-lg", "--ds-hairline"],
  },
  {
    id: "progress",
    name: "Progress",
    group: "feedback",
    caption: "ループが許されるのは進行表示だけ。値があれば数字も出す。",
    controls: [
      { type: "toggle", key: "indeterminate", label: "不定" },
      { type: "range", key: "value", label: "value", min: 0, max: 100, unit: "%" },
      { type: "select", key: "size", label: "size", options: ["sm", "md"] },
      { type: "select", key: "tone", label: "tone", options: ["neutral", "success", "danger"] },
      { type: "toggle", key: "showValue", label: "showValue" },
    ],
    initial: { indeterminate: false, value: 64, size: "sm", tone: "neutral", showValue: true },
    render: (s) => (
      <div className="w-72">
        <Progress label="アップロード" value={bool(s, "indeterminate") ? undefined : num(s, "value", 64)} size={str<"sm" | "md">(s, "size", "sm")} tone={str<"neutral" | "success" | "danger">(s, "tone", "neutral")} showValue={bool(s, "showValue")} />
      </div>
    ),
    code: (s) => `<Progress label="アップロード"${bool(s, "indeterminate") ? "" : ` value={${num(s, "value")}}`}${attrs({ size: str(s, "size") !== "sm" ? str(s, "size") : undefined, tone: str(s, "tone") !== "neutral" ? str(s, "tone") : undefined, showValue: bool(s, "showValue") })} />`,
    source: ProgressSrc,
    states: ["determinate", "indeterminate"],
    tokens: ["--ds-primary", "--ds-surface-sunken", "--ds-radius-pill", "--ds-duration-base", "--ds-ease-out", "--ds-ease-in-out"],
  },
  {
    id: "spinner",
    name: "Spinner",
    group: "feedback",
    caption: "ボタン内などの行内だけ。ページの読み込みは Skeleton。",
    controls: [{ type: "select", key: "size", label: "size", options: ["sm", "md"] }],
    initial: { size: "sm" },
    render: (s) => (
      <div className="flex items-center gap-6">
        <Spinner size={str<"sm" | "md">(s, "size", "sm")} />
        <Button variant="secondary" disabled className="gap-2">
          <Spinner size="sm" label="送信中" /> 送信中
        </Button>
      </div>
    ),
    code: (s) => `<Spinner${str(s, "size") !== "sm" ? ` size="${str(s, "size")}"` : ""} label="読み込み中" />`,
    source: SpinnerSrc,
    states: ["spinning", "reduced-motion"],
    tokens: ["--ds-ink", "--ds-duration-slower"],
  },
  {
    id: "skeleton",
    name: "Skeleton",
    group: "feedback",
    caption: "最終レイアウトの形で。400ms 未満なら何も出さない。",
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
    caption: "何が表れるか、どう追加するかを 1 文で。",
    controls: [
      { type: "toggle", key: "description", label: "description" },
      { type: "toggle", key: "action", label: "action" },
    ],
    initial: { description: true, action: true },
    render: (s) => (
      <div className="w-full max-w-md">
        <EmptyState title="まだプロジェクトがありません" description={bool(s, "description") ? "作成すると、ここに一覧が表示されます。" : undefined} action={bool(s, "action") ? <Button>プロジェクトを作成</Button> : undefined} />
      </div>
    ),
    code: (s) => `<EmptyState\n  title="まだプロジェクトがありません"${bool(s, "description") ? `\n  description="作成すると、ここに一覧が表示されます。"` : ""}${bool(s, "action") ? `\n  action={<Button>プロジェクトを作成</Button>}` : ""}\n/>`,
    source: EmptyStateSrc,
    tokens: ["--ds-hairline-strong", "--ds-surface-sunken", "--ds-ink-muted", "--ds-radius-lg"],
  },
  {
    id: "error-state",
    name: "ErrorState",
    group: "feedback",
    caption: "原因と次の一手を平易に。再試行ボタンを添える。",
    controls: [
      { type: "toggle", key: "description", label: "description" },
      { type: "toggle", key: "action", label: "action" },
    ],
    initial: { description: true, action: true },
    render: (s) => (
      <div className="w-full max-w-md">
        <ErrorState title="データを読み込めませんでした" description={bool(s, "description") ? "接続が切れた可能性があります。もう一度お試しください。" : undefined} action={bool(s, "action") ? <Button variant="secondary" size="sm">再試行</Button> : undefined} />
      </div>
    ),
    code: (s) => `<ErrorState\n  title="データを読み込めませんでした"${bool(s, "description") ? `\n  description="接続が切れた可能性があります。もう一度お試しください。"` : ""}${bool(s, "action") ? `\n  action={<Button variant="secondary" size="sm">再試行</Button>}` : ""}\n/>`,
    source: ErrorStateSrc,
    tokens: ["--ds-danger", "--ds-danger-soft", "--ds-radius-lg"],
  },

  /* --------------------------------------------------------------- data */
  {
    id: "table",
    name: "Table",
    group: "data",
    caption: "数字は右揃えの等幅。セルは折り返さず横にスクロール。",
    controls: [{ type: "range", key: "rows", label: "行数", min: 1, max: 6 }],
    initial: { rows: 4 },
    render: (s) => (
      <div className="w-full">
        <Table<Invoice>
          rows={invoices.slice(0, num(s, "rows", 4))}
          rowKey={(r) => r.id}
          columns={[
            { key: "id", header: "番号", render: (r) => <span className="font-mono text-xs">{r.id}</span> },
            { key: "customer", header: "顧客", render: (r) => r.customer },
            { key: "status", header: "状態", render: (r) => <Badge tone={statusBadge[r.status].tone}>{statusBadge[r.status].label}</Badge> },
            { key: "amount", header: "金額", align: "right", render: (r) => `¥${r.amount.toLocaleString("ja-JP")}` },
          ]}
        />
      </div>
    ),
    code: () => `<Table\n  rows={invoices}\n  rowKey={(r) => r.id}\n  columns={[\n    { key: "id", header: "番号", render: (r) => r.id },\n    { key: "customer", header: "顧客", render: (r) => r.customer },\n    { key: "amount", header: "金額", align: "right", render: (r) => yen(r.amount) },\n  ]}\n/>`,
    source: TableSrc,
    states: ["row hover"],
    tokens: ["--ds-surface-sunken", "--ds-hairline", "--ds-canvas-soft", "--ds-radius-lg", "--ds-text-sm"],
  },
  {
    id: "data-table",
    name: "DataTable",
    group: "data",
    caption: "探す、比べる、選ぶ、操作する。空状態はヘッダーの下に。",
    controls: [
      { type: "range", key: "rows", label: "行数", min: 1, max: 6 },
      { type: "toggle", key: "selectable", label: "行選択" },
      { type: "toggle", key: "sticky", label: "固定ヘッダー" },
      { type: "toggle", key: "empty", label: "空状態" },
    ],
    initial: { rows: 6, selectable: true, sticky: true, empty: false },
    render: (s) => <DataTableDemo rows={num(s, "rows", 6)} selectable={bool(s, "selectable")} sticky={bool(s, "sticky")} empty={bool(s, "empty")} />,
    code: (s) => `<DataTable\n  rows={${bool(s, "empty") ? "[]" : "invoices"}}\n  rowKey={(r) => r.id}${bool(s, "selectable") ? `\n  selectable\n  selected={selected}\n  onSelectionChange={setSelected}` : ""}${bool(s, "sticky") ? `\n  stickyHeader\n  maxHeight="220px"` : ""}\n  defaultSort={{ key: "due", dir: "asc" }}\n  emptyState={<EmptyState title="請求書がありません" />}\n  columns={[\n    { key: "customer", header: "顧客", render: (r) => r.customer, sortable: true, sortValue: (r) => r.customer },\n    { key: "amount", header: "金額", align: "right", render: (r) => yen(r.amount), sortable: true, sortValue: (r) => r.amount },\n  ]}\n/>`,
    source: DataTableSrc,
    states: ["row hover", "selected", "sorted", "empty", ICON],
    tokens: ["--ds-surface-sunken", "--ds-hairline", "--ds-canvas-soft", "--ds-selection", "--ds-primary", "--ds-radius-lg", "--ds-radius-xs"],
  },
  {
    id: "stat-tile",
    name: "StatTile",
    group: "data",
    caption: "1 タイル 1 つの数字。増減は矢印と文字で、色だけにしない。",
    controls: [
      { type: "select", key: "delta", label: "delta", options: ["up", "down", "neutral", "none"] },
      { type: "toggle", key: "sparkline", label: "sparkline" },
      { type: "toggle", key: "unit", label: "単位" },
    ],
    initial: { delta: "up", sparkline: true, unit: false },
    render: (s) => {
      const d = str(s, "delta", "up");
      const deltas: Record<string, { value: string; tone: DeltaTone; hint: string }> = {
        up: { value: "+12.4%", tone: "up", hint: "前月比" },
        down: { value: "-3.1%", tone: "down", hint: "前月比" },
        neutral: { value: "±0%", tone: "neutral", hint: "前月比" },
      };
      return (
        <div className="grid w-full max-w-lg gap-4 sm:grid-cols-2">
          <StatTile label="月間売上" value={bool(s, "unit") ? "1,284" : "¥1,284,000"} unit={bool(s, "unit") ? "千円" : undefined} delta={d === "none" ? undefined : deltas[d]} sparkline={bool(s, "sparkline") ? [38, 42, 40, 47, 51, 49, 56, 61] : undefined} />
          <StatTile label="有効ユーザー" value="8,402" delta={d === "none" ? undefined : { value: "+318", tone: d === "down" ? "down" : d === "neutral" ? "neutral" : "up", hint: "先週比" }} sparkline={bool(s, "sparkline") ? [61, 58, 60, 64, 63, 67, 70, 72] : undefined} />
        </div>
      );
    },
    code: (s) => `<StatTile\n  label="月間売上"\n  value="${bool(s, "unit") ? "1,284" : "¥1,284,000"}"${bool(s, "unit") ? `\n  unit="千円"` : ""}${str(s, "delta") !== "none" ? `\n  delta={{ value: "${str(s, "delta") === "down" ? "-3.1%" : str(s, "delta") === "neutral" ? "±0%" : "+12.4%"}", tone: "${str(s, "delta")}", hint: "前月比" }}` : ""}${bool(s, "sparkline") ? `\n  sparkline={[38, 42, 40, 47, 51, 49, 56, 61]}` : ""}\n/>`,
    source: StatTileSrc,
    tokens: ["--ds-surface", "--ds-hairline", "--ds-radius-lg", "--ds-text-2xl", "--ds-success", "--ds-danger", "--ds-ink-secondary"],
  },
  {
    id: "badge",
    name: "Badge",
    group: "data",
    caption: "読むだけ。ホバーしない。16 文字以内、色と文字を対で。",
    controls: [{ type: "select", key: "tone", label: "tone", options: ["neutral", "accent", "success", "warning", "danger"] }],
    initial: { tone: "success" },
    render: (s) => (
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone={str<BadgeTone>(s, "tone", "success")}>{{ neutral: "下書き", accent: "新着", success: "公開中", warning: "確認待ち", danger: "停止" }[str(s, "tone", "success")]}</Badge>
        <Badge>下書き</Badge>
        <Badge tone="accent">新着</Badge>
      </div>
    ),
    code: (s) => `<Badge tone="${str(s, "tone")}">公開中</Badge>`,
    source: BadgeSrc,
    tokens: ["--ds-surface-sunken", "--ds-accent-soft", "--ds-success-soft", "--ds-warning-soft", "--ds-danger-soft", "--ds-radius-pill", "--ds-text-xs"],
  },
  {
    id: "avatar",
    name: "Avatar",
    group: "data",
    caption: "24 / 32 / 40。画像がなければ頭文字、1 行に 1 サイズ。",
    controls: [
      { type: "select", key: "size", label: "size", options: ["sm", "md", "lg"] },
      { type: "toggle", key: "image", label: "画像" },
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
    caption: "8px 重ね、2px のキャンバスリング。4 人まで、残りは +N。",
    controls: [
      { type: "range", key: "count", label: "人数", min: 1, max: 7 },
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
    caption: "1px のレール、8px の点。状態は見出しの文字でも伝える。",
    controls: [
      { type: "range", key: "count", label: "件数", min: 2, max: 5 },
      { type: "toggle", key: "icons", label: "アイコン" },
    ],
    initial: { count: 4, icons: false },
    render: (s) => {
      const items: Array<{ id: string; title: string; time: string; description?: string; tone: TimelineTone; icon?: ReactNode }> = [
        { id: "1", title: "リリース v2.3 を公開", time: "09:12", description: "ダークモードのコントラストを修正。", tone: "success", icon: <Share2 strokeWidth={1.75} /> },
        { id: "2", title: "レビュー依頼", time: "昨日", description: "Mio Sato がトークン命名の変更を提案。", tone: "accent", icon: <Pencil strokeWidth={1.75} /> },
        { id: "3", title: "ビルド失敗", time: "9/05", description: "型エラー 2 件。修正済み。", tone: "danger", icon: <Trash2 strokeWidth={1.75} /> },
        { id: "4", title: "デザインレビュー", time: "9/03", tone: "neutral", icon: <FileText strokeWidth={1.75} /> },
        { id: "5", title: "プロジェクト開始", time: "8/28", tone: "neutral", icon: <Home strokeWidth={1.75} /> },
      ];
      return (
        <div className="w-full max-w-md">
          <Timeline items={items.slice(0, num(s, "count", 4)).map((it) => ({ ...it, icon: bool(s, "icons") ? it.icon : undefined }))} />
        </div>
      );
    },
    code: (s) => `<Timeline\n  items={[\n    { id: "1", title: "リリース v2.3 を公開", time: "09:12", tone: "success"${bool(s, "icons") ? ", icon: <Share2 />" : ""} },\n    { id: "2", title: "レビュー依頼", time: "昨日", tone: "accent"${bool(s, "icons") ? ", icon: <Pencil />" : ""} },\n  ]}\n/>`,
    source: TimelineSrc,
    tokens: ["--ds-hairline", "--ds-hairline-strong", "--ds-success", "--ds-danger", "--ds-accent", "--ds-radius-pill"],
  },

  /* ------------------------------------------------------------- layout */
  {
    id: "card",
    name: "Card",
    group: "layout",
    caption: "ヘアライン 1px、角丸 12、余白 24。静止時に影なし。",
    controls: [
      { type: "select", key: "elevation", label: "elevation", options: ["1", "2"] },
      { type: "toggle", key: "description", label: "description" },
    ],
    initial: { elevation: "1", description: true },
    render: (s) => (
      <Card elevation={str(s, "elevation") === "2" ? 2 : 1} className="w-72">
        <CardTitle>チームプラン</CardTitle>
        {bool(s, "description") && <CardDescription>10 人までのワークスペース。月額 ¥4,800。</CardDescription>}
        <div className="mt-6 flex gap-2">
          <Button size="sm">選択</Button>
          <Button size="sm" variant="ghost">
            比較する
          </Button>
        </div>
      </Card>
    ),
    code: (s) => `<Card${str(s, "elevation") === "2" ? " elevation={2}" : ""}>\n  <CardTitle>チームプラン</CardTitle>${bool(s, "description") ? `\n  <CardDescription>10 人までのワークスペース。</CardDescription>` : ""}\n  <Button size="sm">選択</Button>\n</Card>`,
    source: CardSrc,
    tokens: ["--ds-surface", "--ds-hairline", "--ds-radius-lg", "--ds-space-6", "--ds-shadow-2"],
  },
  {
    id: "media-card",
    name: "MediaCard",
    group: "layout",
    caption: "カード全体が 1 つのリンク。ホバーで 1 段浮く。",
    controls: [
      { type: "toggle", key: "link", label: "リンクにする" },
      { type: "toggle", key: "eyebrow", label: "eyebrow" },
      { type: "toggle", key: "footer", label: "footer" },
    ],
    initial: { link: true, eyebrow: true, footer: true },
    render: (s) => (
      <div className="w-72">
        <MediaCard
          href={bool(s, "link") ? "#media-card" : undefined}
          eyebrow={bool(s, "eyebrow") ? "基盤 · 2026-09-07" : undefined}
          title="奥行きは影ではなく境界で"
          description="レベル 1 はヘアライン、レベル 2 から影。浮くものだけが影を持つ。"
          media={
            <CardMedia ratio="16 / 9">
              <div className="grid size-full grid-cols-6 gap-1 p-4">
                {Array.from({ length: 12 }, (_, i) => (
                  <span key={i} className={i % 3 === 0 ? "rounded-sm bg-primary" : "rounded-sm border border-hairline-strong"} />
                ))}
              </div>
            </CardMedia>
          }
          footer={bool(s, "footer") ? <><span className="t-caption">読了 3 分</span><Badge>elevation</Badge></> : undefined}
        />
      </div>
    ),
    code: (s) => `<MediaCard${bool(s, "link") ? `\n  href="/foundations/elevation"` : ""}${bool(s, "eyebrow") ? `\n  eyebrow="基盤 · 2026-09-07"` : ""}\n  title="奥行きは影ではなく境界で"\n  description="レベル 1 はヘアライン、レベル 2 から影。"\n  media={<CardMedia src="/img/elevation.png" alt="" ratio="16 / 9" />}${bool(s, "footer") ? `\n  footer={<span className="t-caption">読了 3 分</span>}` : ""}\n/>`,
    source: CardSrc,
    states: ["hover", ICON, "active"],
    tokens: ["--ds-surface", "--ds-hairline", "--ds-hairline-strong", "--ds-radius-lg", "--ds-shadow-2", "--ds-duration-fast", "--ds-ease-out"],
  },
  {
    id: "accordion",
    name: "Accordion",
    group: "layout",
    caption: "見出しはボタン。高さは grid-rows で 200ms ease-out。",
    controls: [
      { type: "select", key: "type", label: "type", options: ["single", "multiple"] },
      { type: "toggle", key: "collapsible", label: "collapsible" },
      { type: "range", key: "count", label: "項目数", min: 2, max: 5 },
    ],
    initial: { type: "single", collapsible: true, count: 3 },
    render: (s) => {
      const faqs = [
        { id: "a", title: "トークンはどう更新しますか", content: "AwesomeDS/tokens/tokens.json を変更し、sync-tokens を実行します。CSS 変数と Tailwind のテーマが同時に更新されます。" },
        { id: "b", title: "ダークモードはどこで切り替わりますか", content: "html の data-theme 属性です。system の場合は prefers-color-scheme に従います。" },
        { id: "c", title: "アクセントをボタンに使えますか", content: "使いません。アクセントはリンク、フォーカス、選択に限ります。" },
        { id: "d", title: "フォントは差し替えられますか", content: "--ds-font-sans を上書きします。日本語の代替は Noto Sans JP のままにします。" },
        { id: "e", title: "無効な項目", content: "", disabled: true },
      ];
      return (
        <div className="w-full max-w-md">
          <Accordion key={`${s.type}-${s.collapsible}-${s.count}`} type={str<"single" | "multiple">(s, "type", "single")} collapsible={bool(s, "collapsible")} defaultOpen={["a"]} items={faqs.slice(0, num(s, "count", 3))} />
        </div>
      );
    },
    code: (s) => `<Accordion${str(s, "type") === "multiple" ? ` type="multiple"` : ""}${!bool(s, "collapsible") ? ` collapsible={false}` : ""} defaultOpen={["a"]}\n  items={[\n    { id: "a", title: "トークンはどう更新しますか", content: <p>...</p> },\n    { id: "b", title: "ダークモードはどこで切り替わりますか", content: <p>...</p> },\n  ]}\n/>`,
    source: AccordionSrc,
    states: ["hover", ICON, "expanded", "disabled"],
    tokens: ["--ds-surface", "--ds-hairline", "--ds-canvas-soft", "--ds-radius-lg", "--ds-duration-base", "--ds-ease-out"],
  },
  {
    id: "divider",
    name: "Divider",
    group: "layout",
    caption: "1px のヘアライン。ラベルはキャプション、ink-muted。",
    controls: [
      { type: "select", key: "label", label: "label", options: ["なし", "または", "2026 年 9 月"] },
      { type: "select", key: "orientation", label: "orientation", options: ["horizontal", "vertical"] },
    ],
    initial: { label: "または", orientation: "horizontal" },
    render: (s) =>
      str(s, "orientation") === "vertical" ? (
        <div className="flex h-10 items-center gap-4 text-sm text-ink-secondary">
          <span>下書き</span>
          <Divider orientation="vertical" />
          <span>公開</span>
        </div>
      ) : (
        <div className="flex w-72 flex-col gap-4">
          <Button variant="secondary">Google で続ける</Button>
          <Divider label={str(s, "label") === "なし" ? undefined : str(s, "label")} />
          <Input label="メールアドレス" placeholder="name@company.com" />
        </div>
      ),
    code: (s) => (str(s, "orientation") === "vertical" ? `<Divider orientation="vertical" />` : `<Divider${str(s, "label") !== "なし" ? ` label="${str(s, "label")}"` : ""} />`),
    source: DividerSrc,
    tokens: ["--ds-hairline", "--ds-ink-muted", "--ds-text-xs"],
  },

  /* --------------------------------------------------------- typography */
  {
    id: "link",
    name: "Link",
    group: "typography",
    caption: "アクセントの仕事はリンク。行内では下線を残す。",
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
            色の理由は{" "}
            <Link href="#link" variant="inline" external={bool(s, "external")}>
              foundations/color.md
            </Link>{" "}
            にまとめてあります。
          </p>
        );
      return (
        <Link href="#link" variant={v} external={bool(s, "external")}>
          すべての基盤を見る
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
    caption: "等幅 12px のキーキャップ。組み合わせはキーごとに分ける。",
    controls: [{ type: "select", key: "combo", label: "keys", options: ["⌘ K", "Ctrl Shift P", "Esc", "↑ ↓ ↵"] }],
    initial: { combo: "⌘ K" },
    render: (s) => (
      <p className="t-body-sm flex items-center gap-2 text-ink-secondary">
        <Kbd keys={str(s, "combo", "⌘ K").split(" ")} /> で検索を開く
      </p>
    ),
    code: (s) => `<Kbd keys={[${str(s, "combo", "⌘ K").split(" ").map((k) => `"${k}"`).join(", ")}]} />`,
    source: KbdSrc,
    tokens: ["--ds-surface-sunken", "--ds-hairline", "--ds-radius-xs", "--ds-font-mono", "--ds-text-xs"],
  },
];


/** Look up an entry by id (URL hash). */
export function findComponent(id: string): ComponentEntry | undefined {
  return components.find((c) => c.id === id);
}

/** Entries grouped in `groups` order. */
export function componentsByGroup(): Array<{ group: (typeof groups)[number]; items: ComponentEntry[] }> {
  return groups.map((g) => ({ group: g, items: components.filter((c) => c.group === g.id) }));
}
