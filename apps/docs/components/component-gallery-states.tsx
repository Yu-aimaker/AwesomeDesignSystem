"use client";

import { useState } from "react";
import { EmptyState, ErrorState, Tabs } from "@awesome-ds/react";
import type { Locale } from "../lib/i18n";

export function ComponentGalleryStates({ locale }: { locale: Locale }) {
  const [message, setMessage] = useState("");
  const t = (english: string, japanese: string) => locale === "ja" ? japanese : english;
  return <>
    <Tabs ariaLabel={t("State examples", "状態表示の例")} items={[
      {
        value: "preview",
        label: t("Preview", "プレビュー"),
        content: <EmptyState
          title={t("Nothing selected", "選択されていません")}
          description={t("Choose a row to inspect.", "確認する行を選んでください。")}
          actionLabel={t("Browse", "一覧を見る")}
          onAction={() => setMessage(t("Browse action completed.", "一覧を表示しました。"))}
        />,
      },
      {
        value: "error",
        label: t("Error", "エラー"),
        content: <ErrorState
          title={t("Could not load", "読み込めませんでした")}
          description={t("Network failed.", "通信に失敗しました。")}
          actionLabel={t("Retry", "再試行")}
          onAction={() => setMessage(t("Retry requested.", "再試行を開始しました。"))}
        />,
      },
    ]} />
    <p className="meta" role="status" aria-live="polite">{message}</p>
  </>;
}
