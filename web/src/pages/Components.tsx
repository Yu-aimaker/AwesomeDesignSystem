import { useState } from "react";
import { Bell, Search } from "lucide-react";
import { PageHeader } from "../layout/Page";
import { Preview } from "../layout/Preview";
import { Button } from "../ds/components/Button";
import { Input } from "../ds/components/Input";
import { Checkbox } from "../ds/components/Checkbox";
import { Radio, RadioGroup } from "../ds/components/Radio";
import { Switch } from "../ds/components/Switch";
import { Select } from "../ds/components/Select";
import { Card, CardDescription, CardTitle } from "../ds/components/Card";
import { Dialog } from "../ds/components/Dialog";
import { Popover } from "../ds/components/Popover";
import { Tooltip } from "../ds/components/Tooltip";
import { Tabs } from "../ds/components/Tabs";
import { Table } from "../ds/components/Table";
import { useToast } from "../ds/components/Toast";
import { Badge } from "../ds/components/Badge";
import { Avatar } from "../ds/components/Avatar";
import { Skeleton, SkeletonCard } from "../ds/components/Skeleton";
import { EmptyState } from "../ds/components/EmptyState";
import { ErrorState } from "../ds/components/ErrorState";
import { NavBar } from "../ds/components/NavBar";

import ButtonSrc from "../ds/components/Button.tsx?raw";
import InputSrc from "../ds/components/Input.tsx?raw";
import CheckboxSrc from "../ds/components/Checkbox.tsx?raw";
import RadioSrc from "../ds/components/Radio.tsx?raw";
import SwitchSrc from "../ds/components/Switch.tsx?raw";
import SelectSrc from "../ds/components/Select.tsx?raw";
import CardSrc from "../ds/components/Card.tsx?raw";
import DialogSrc from "../ds/components/Dialog.tsx?raw";
import PopoverSrc from "../ds/components/Popover.tsx?raw";
import TooltipSrc from "../ds/components/Tooltip.tsx?raw";
import TabsSrc from "../ds/components/Tabs.tsx?raw";
import TableSrc from "../ds/components/Table.tsx?raw";
import ToastSrc from "../ds/components/Toast.tsx?raw";
import BadgeSrc from "../ds/components/Badge.tsx?raw";
import AvatarSrc from "../ds/components/Avatar.tsx?raw";
import SkeletonSrc from "../ds/components/Skeleton.tsx?raw";
import EmptySrc from "../ds/components/EmptyState.tsx?raw";
import ErrorSrc from "../ds/components/ErrorState.tsx?raw";
import NavBarSrc from "../ds/components/NavBar.tsx?raw";

const rows = [
  { id: "INV-1042", customer: "北村商事", amount: 128000, status: "paid" },
  { id: "INV-1043", customer: "Sato Design", amount: 9800, status: "open" },
  { id: "INV-1044", customer: "有限会社ミナト", amount: 1540000, status: "overdue" },
];

export function Components() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [on, setOn] = useState(false);
  const toast = useToast();

  return (
    <div>
      <PageHeader title="コンポーネント" lead="トークンだけで実装した部品。コードタブは実際のソースを表示します。" />
      <p className="t-body-sm mb-8 max-w-[65ch] text-ink-secondary">
        製品では shadcn/ui をインストールし、これらのトークンで再スタイルします。ここでは CLI 手順を省くため同等の小さな実装を置いています。
      </p>
      <div className="flex flex-col gap-8">
        <Preview id="button" title="Button" rule="1 画面に primary は 1 つ。高さ 40 / 32 / 48。" code={ButtonSrc}>
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button disabled>Disabled</Button>
              <Button loading>Loading</Button>
              <Button variant="secondary">
                <Search strokeWidth={1.75} aria-hidden /> With icon
              </Button>
            </div>
          </div>
        </Preview>

        <Preview id="input" title="Input" rule="ラベルは上、補助文は下、エラーは danger とアイコン。" code={InputSrc}>
          <div className="grid max-w-lg gap-4">
            <Input label="メールアドレス" placeholder="you@example.com" helper="ログインに使います。" />
            <Input label="表示名" defaultValue="Yu" error="この名前はすでに使われています。" />
            <Input label="無効" disabled defaultValue="編集できません" />
          </div>
        </Preview>

        <Preview id="choice" title="Checkbox / Radio / Switch" rule="ネイティブ input が状態を持つ。" code={`${CheckboxSrc}\n\n${RadioSrc}\n\n${SwitchSrc}`}>
          <div className="grid gap-8 sm:grid-cols-3">
            <div className="flex flex-col gap-3">
              <Checkbox label="ニュースレターを受け取る" description="月に 1 回" defaultChecked />
              <Checkbox label="利用規約に同意する" />
              <Checkbox label="無効" disabled />
            </div>
            <RadioGroup legend="配送方法">
              <Radio name="ship" label="通常" defaultChecked />
              <Radio name="ship" label="速達" />
              <Radio name="ship" label="店頭受取" disabled />
            </RadioGroup>
            <Switch label="通知" checked={on} onChange={setOn} />
          </div>
        </Preview>

        <Preview id="select" title="Select" rule="ネイティブ select に入力枠を与える。" code={SelectSrc}>
          <Select label="タイムゾーン" helper="請求書の日付に使います。" className="max-w-xs" defaultValue="tokyo">
            <option value="tokyo">Asia/Tokyo</option>
            <option value="sf">America/Los_Angeles</option>
            <option value="london">Europe/London</option>
          </Select>
        </Preview>

        <Preview id="card" title="Card" rule="Level 1。hairline、12px、24px。" code={CardSrc}>
          <Card className="max-w-sm">
            <CardTitle>プロジェクト</CardTitle>
            <CardDescription>3 件の未読コメント</CardDescription>
            <div className="mt-6 flex gap-2">
              <Button size="sm">開く</Button>
              <Button size="sm" variant="ghost">
                後で
              </Button>
            </div>
          </Card>
        </Preview>

        <Preview id="dialog" title="Dialog" rule="<dialog> 要素。フォーカスは中に閉じ込められ、Esc で閉じる。" code={DialogSrc}>
          <Button variant="secondary" onClick={() => setDialogOpen(true)}>
            ダイアログを開く
          </Button>
          <Dialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            title="プロジェクトを削除しますか"
            description="この操作は取り消せません。"
            footer={
              <>
                <Button variant="secondary" onClick={() => setDialogOpen(false)}>
                  キャンセル
                </Button>
                <Button variant="danger" onClick={() => setDialogOpen(false)}>
                  削除
                </Button>
              </>
            }
          />
        </Preview>

        <Preview id="popover" title="Popover / Tooltip" rule="Level 2。4px 動いて 150ms で出る。" code={`${PopoverSrc}\n\n${TooltipSrc}`}>
          <div className="flex flex-wrap items-center gap-4">
            <Popover trigger={(p) => <Button variant="secondary" {...p}>フィルター</Button>}>
              <div className="flex flex-col gap-3">
                <Checkbox label="未完了のみ" defaultChecked />
                <Checkbox label="担当が自分" />
              </div>
            </Popover>
            <Tooltip label="通知設定">
              <Button variant="ghost" aria-label="通知設定">
                <Bell strokeWidth={1.75} aria-hidden />
              </Button>
            </Tooltip>
          </div>
        </Preview>

        <Preview id="tabs" title="Tabs" rule="矢印キーで移動。選択は太さと下線。" code={TabsSrc}>
          <Tabs
            tabs={[
              { id: "overview", label: "概要", content: <p className="t-body-sm text-ink-secondary">概要のパネル</p> },
              { id: "activity", label: "アクティビティ", content: <p className="t-body-sm text-ink-secondary">アクティビティのパネル</p> },
              { id: "settings", label: "設定", content: <p className="t-body-sm text-ink-secondary">設定のパネル</p> },
            ]}
          />
        </Preview>

        <Preview id="table" title="Table" rule="tabular-nums。数値は右揃え。" code={TableSrc}>
          <Table
            columns={[
              { key: "id", header: "請求書", render: (r) => <code>{r.id}</code> },
              { key: "customer", header: "顧客", render: (r) => r.customer },
              { key: "amount", header: "金額", align: "right", render: (r) => `${r.amount.toLocaleString("ja-JP")} 円` },
              {
                key: "status",
                header: "状態",
                render: (r) => (
                  <Badge tone={r.status === "paid" ? "success" : r.status === "overdue" ? "danger" : "neutral"}>
                    {r.status === "paid" ? "支払済" : r.status === "overdue" ? "期限超過" : "未払い"}
                  </Badge>
                ),
              },
            ]}
            rows={rows}
            rowKey={(r) => r.id}
          />
        </Preview>

        <Preview id="toast" title="Toast" rule="polite なライブリージョン。5 秒で消える。" code={ToastSrc}>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => toast.push({ tone: "success", title: "保存しました" })}>
              成功
            </Button>
            <Button variant="secondary" onClick={() => toast.push({ tone: "danger", title: "保存できませんでした", description: "接続を確認して再試行してください。" })}>
              エラー
            </Button>
            <Button variant="secondary" onClick={() => toast.push({ tone: "neutral", title: "2 件の更新があります" })}>
              情報
            </Button>
          </div>
        </Preview>

        <Preview id="badge" title="Badge / Avatar" rule="ピル。状態色にはラベルを添える。" code={`${BadgeSrc}\n\n${AvatarSrc}`}>
          <div className="flex flex-wrap items-center gap-3">
            <Badge>neutral</Badge>
            <Badge tone="accent">accent</Badge>
            <Badge tone="success">success</Badge>
            <Badge tone="warning">warning</Badge>
            <Badge tone="danger">danger</Badge>
            <Avatar name="Yu Tanaka" size="sm" />
            <Avatar name="Yu Tanaka" />
            <Avatar name="Yu Tanaka" size="lg" />
          </div>
        </Preview>

        <Preview id="states" title="Skeleton / Empty / Error" rule="データ表示は 3 つの状態を持つ。" code={`${SkeletonSrc}\n\n${EmptySrc}\n\n${ErrorSrc}`}>
          <div className="grid gap-4 lg:grid-cols-3">
            <SkeletonCard />
            <EmptyState title="まだプロジェクトがありません" description="最初のプロジェクトを作ると、ここに一覧が表示されます。" action={<Button size="sm">プロジェクトを作成</Button>} />
            <div className="flex flex-col gap-3">
              <ErrorState title="読み込めませんでした" description="ネットワークに接続できません。" action={<Button size="sm" variant="secondary">再試行</Button>} />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        </Preview>

        <Preview id="navbar" title="Navigation bar" rule="64px。折り返さない。" code={NavBarSrc} className="p-0 sm:p-0">
          <NavBar
            brand="Product"
            links={[
              { label: "ダッシュボード", href: "#navbar", current: true },
              { label: "プロジェクト", href: "#navbar" },
              { label: "設定", href: "#navbar" },
            ]}
            actions={
              <>
                <Button size="sm" variant="ghost">
                  ログイン
                </Button>
                <Avatar name="Yu Tanaka" size="sm" />
              </>
            }
          />
        </Preview>
      </div>
    </div>
  );
}
