import Link from "next/link";
import {
  Accordion, Badge, Button, Callout, Card, Checkbox, Input, Progress, Spinner, Stack, Toast,
} from "@awesome-ds/react";
import { componentCatalog } from "../../lib/components-catalog";
import { formatMessage, getDictionary, localizePathname } from "../../lib/i18n";
import { getRequestLocale } from "../../lib/i18n-server";

import { createLocalizedMetadata } from "../../lib/metadata";
import { localizeComponentContract } from "../../lib/component-localization";
import { ComponentGalleryStates } from "../../components/component-gallery-states";
export const generateMetadata = () => createLocalizedMetadata("/components", (dictionary) => dictionary.components.title, (dictionary) => dictionary.components.intro.replace("{count}", String(componentCatalog.length)));

const families = ["primitives", "forms", "overlay", "navigation", "status", "layout"] as const;

export default async function ComponentsPage() {
  const locale = await getRequestLocale();
  const d = getDictionary(locale).components;
  const t = (english: string, japanese: string) => locale === "ja" ? japanese : english;
  const familyLabels = { primitives: t("Primitives", "基本要素"), forms: t("Forms", "フォーム"), overlay: t("Overlays", "オーバーレイ"), navigation: t("Navigation", "ナビゲーション"), status: t("Status", "状態表示"), layout: t("Layout", "レイアウト") };
  return (
    <div className="ads-motion-enter">
      <h1>{d.title}</h1>
      <p className="muted">
        {formatMessage(d.intro, { count: componentCatalog.length })}
      </p>
      {families.map((family) => {
        const items = componentCatalog.filter((c) => c.family === family);
        if (!items.length) return null;
        return (
          <section key={family}>
            <h2>{familyLabels[family]}</h2>
            <div className="grid-cards">
              {items.map((sourceItem) => {
                const item = localizeComponentContract(sourceItem, locale);
                return (
                  <Link key={item.slug} className="card-link" href={localizePathname("/components/" + item.slug, locale)}>
                    <strong>{item.name}</strong>
                    <p className="meta">{item.description}</p>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}
      <h2>{d.gallery}</h2>
      <Stack gap={6}>
        <Card title={t("Actions", "アクション")}>
          <div className="ads-cluster">
            <Button>{t("Primary", "主要操作")}</Button>
            <Button variant="secondary">{t("Secondary", "副次操作")}</Button>
            <Button variant="ghost">{t("Ghost", "控えめ")}</Button>
            <Button variant="danger">{t("Danger", "危険な操作")}</Button>
            <Button loading>{t("Loading", "読み込み中")}</Button>
            <Badge tone="accent">{t("Baseline", "標準")}</Badge>
          </div>
        </Card>
        <Card title={t("Forms", "フォーム")}>
          <Input id="name" label={t("Name", "名前")} hint={t("Used on invoices", "請求書に表示されます")} />
          <Checkbox id="terms" label={t("I agree to the terms", "利用規約に同意します")} />
        </Card>
        <Card title={t("Status", "状態表示")}>
          <div className="ads-cluster">
            <Spinner label={t("Loading", "読み込み中")} />
            <Progress value={64} label={t("Upload", "アップロード")} />
            <Toast>{t("Saved just now", "たった今保存しました")}</Toast>
          </div>
          <Callout title={t("Evidence", "根拠")}>{t("Implements rule.a11y.wcag-aa and rule.components.state-matrix.", "rule.a11y.wcag-aa と rule.components.state-matrix を実装しています。")}</Callout>
        </Card>
        <ComponentGalleryStates locale={locale} />
        <Accordion items={[{ id: "a1", title: t("Catalog size", "登録数"), content: <p>{t(`${componentCatalog.length} components registered.`, `${componentCatalog.length}個のコンポーネントを登録しています。`)}</p> }]} />
      </Stack>
    </div>
  );
}
