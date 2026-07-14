"use client";

import { useState } from "react";
import {
  Accordion, Badge, Button, Callout, Card, Checkbox, EmptyState, ErrorState, IconButton, Input, Link,
  Pagination, Progress, RadioGroup, Select, Skeleton, Spinner, Switch, Tabs, Textarea, Toast, Breadcrumb, Popover, Tooltip, DropdownMenu, Dialog, AlertDialog, Stack, Cluster, Grid, Container, VisuallyHidden,
} from "@awesome-ds/react";
import type { Locale } from "../lib/i18n";

export function ComponentLive({ slug, locale }: { slug: string; locale: Locale }) {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(2);
  const [on, setOn] = useState(false);
  const [radio, setRadio] = useState("a");
  const [feedback, setFeedback] = useState("");
  const t = (english: string, japanese: string) => locale === "ja" ? japanese : english;
  switch (slug) {
    case "button":
      return <div className="ads-cluster"><Button>{t("Primary", "主要操作")}</Button><Button loading>{t("Loading", "読み込み中")}</Button><Button disabled>{t("Disabled", "無効")}</Button><Button variant="danger">{t("Danger", "危険な操作")}</Button></div>;
    case "icon-button":
      return <IconButton label={t("Settings", "設定")}>⚙</IconButton>;
    case "link":
      return <Link href={`/${locale}/references`}>{t("Open Atlas", "リファレンスを開く")}</Link>;
    case "badge":
      return <div className="ads-cluster"><Badge>{t("Neutral", "標準")}</Badge><Badge tone="accent">{t("Accent", "強調")}</Badge></div>;
    case "input":
      return <Input id="live-input" label={t("Email", "メールアドレス")} hint={t("We never share this", "第三者には共有しません")} />;
    case "textarea":
      return <Textarea id="live-ta" label={t("Notes", "メモ")} />;
    case "checkbox":
      return <Checkbox id="live-cb" label={t("Subscribe", "更新を受け取る")} />;
    case "switch":
      return <Switch id="live-sw" label={t("Notifications", "通知")} checked={on} onChange={setOn} />;
    case "radio-group":
      return <RadioGroup legend={t("Size", "サイズ")} name="size" value={radio} onChange={setRadio} options={[{ value: "a", label: "S" }, { value: "b", label: "M" }]} />;
    case "select":
      return <Select id="live-sel" label={t("Role", "権限")}><option>{t("Admin", "管理者")}</option><option>{t("Editor", "編集者")}</option></Select>;
    case "dialog":
      return (
        <>
          <Button onClick={() => setOpen(true)}>{t("Open dialog", "ダイアログを開く")}</Button>
          <Dialog open={open} title={t("Dialog", "確認")} closeLabel={t("Close", "閉じる")} onClose={() => setOpen(false)}>
            {t("Confirm this action.", "この操作の内容を確認してください。")}
          </Dialog>
        </>
      );
    case "alert-dialog":
      return (
        <>
          <Button variant="danger" onClick={() => setOpen(true)}>{t("Delete item", "項目を削除")}</Button>
          <AlertDialog open={open} title={t("Delete item", "項目を削除")} confirmLabel={t("Delete", "削除する")} confirmingLabel={t("Deleting…", "削除中…")} cancelLabel={t("Cancel", "キャンセル")} confirmationErrorLabel={t("Deletion failed. Try again.", "削除できませんでした。もう一度お試しください。")} onClose={() => setOpen(false)} onConfirm={() => setOpen(false)}>
            {t("This action cannot be undone.", "この操作は元に戻せません。")}
          </AlertDialog>
        </>
      );
    case "popover":
      return <Popover label={t("Open popover", "ポップオーバーを開く")}>{t("Popover body", "補足内容")}</Popover>;
    case "tooltip":
      return <Tooltip label={t("More info", "詳しい情報")}><Button variant="secondary">{t("Hover/focus", "ホバー・フォーカス")}</Button></Tooltip>;
    case "dropdown-menu":
      return <><DropdownMenu label={t("Menu", "メニュー")} items={[{ id: "1", label: t("Edit", "編集"), onSelect: () => setFeedback(t("Edit selected.", "編集を選択しました。")) }, { id: "2", label: t("Share", "共有"), onSelect: () => setFeedback(t("Share selected.", "共有を選択しました。")) }]} />{feedback ? <p role="status">{feedback}</p> : null}</>;
    case "tabs":
      return <Tabs items={[{ value: "one", label: t("One", "概要"), content: t("Panel one", "概要の内容") }, { value: "two", label: t("Two", "詳細"), content: t("Panel two", "詳細の内容") }]} />;
    case "accordion":
      return <Accordion items={[{ id: "1", title: t("Details", "詳細"), content: t("Hidden until expanded", "展開すると表示されます") }]} />;
    case "breadcrumb":
      return <Breadcrumb ariaLabel={t("Breadcrumb", "パンくずリスト")} items={[{ label: t("Home", "ホーム"), href: `/${locale}` }, { label: t("Components", "コンポーネント"), href: `/${locale}/components` }, { label: t("Current", "現在地") }]} />;
    case "pagination":
      return <Pagination page={page} pageCount={5} onChange={setPage} ariaLabel={t("Pagination", "ページ送り")} previousLabel={t("Previous", "前へ")} nextLabel={t("Next", "次へ")} formatPageStatus={(current, total) => t(`Page ${current} of ${total}`, `${total}ページ中${current}ページ目`)} />;
    case "card":
      return <Card title={t("Card title", "カードの見出し")}>{t("Card body content.", "カードの本文です。")}</Card>;
    case "callout":
      return <Callout title={t("Tip", "ヒント")}>{t("Prefer semantic tokens.", "セマンティックトークンを優先します。")}</Callout>;
    case "skeleton":
      return <Skeleton height="1.25rem" />;
    case "spinner":
      return <Spinner label={t("Loading", "読み込み中")} />;
    case "progress":
      return <Progress value={55} label={t("Progress", "進捗")} />;
    case "toast":
      return <Toast>{t("Changes saved", "変更を保存しました")}</Toast>;
    case "empty-state":
      return <><EmptyState title={t("No results", "結果がありません")} description={t("Try another filter.", "別の条件をお試しください。")} actionLabel={t("Reset", "条件をリセット")} onAction={() => setFeedback(t("Filters reset.", "条件をリセットしました。"))} />{feedback ? <p role="status">{feedback}</p> : null}</>;
    case "error-state":
      return <><ErrorState title={t("Request failed", "読み込めませんでした")} description={t("Check the network and retry.", "通信状況を確認して、もう一度お試しください。")} actionLabel={t("Retry", "再試行")} onAction={() => setFeedback(t("Retried.", "再試行しました。"))} />{feedback ? <p role="status">{feedback}</p> : null}</>;
    case "stack":
      return <Stack gap={2}><Button size="sm">{t("One", "第一")}</Button><Button size="sm" variant="secondary">{t("Two", "第二")}</Button></Stack>;
    case "cluster":
      return <Cluster><Badge>A</Badge><Badge>B</Badge><Badge>C</Badge></Cluster>;
    case "grid":
      return <Grid><Card title="1">A</Card><Card title="2">B</Card></Grid>;
    case "container":
      return <Container><p>{t("Constrained width container.", "読みやすい幅に制限したコンテナです。")}</p></Container>;
    case "visually-hidden":
      return <p>{t("Visible text ", "表示される文言 ")}<VisuallyHidden>{t("plus screen-reader-only context", "スクリーンリーダー専用の補足")}</VisuallyHidden></p>;
    default:
      return <p className="meta">{t("No live preview for this slug.", "この項目のライブ表示はありません。")}</p>;
  }
}
