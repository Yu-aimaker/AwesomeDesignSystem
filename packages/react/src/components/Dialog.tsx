"use client";

import { cx } from "@awesome-ds/core";
import { useEffect, useRef, type ReactNode } from "react";
import {
  Button as AriaButton,
  Dialog as AriaDialog,
  Heading,
  Modal,
  ModalOverlay,
} from "react-aria-components";
import { defineMetadata } from "../utils/metadata";

export const dialogMetadata = defineMetadata({
  name: "Dialog",
  ruleIds: ["rule.a11y.wcag-aa", "rule.components.state-matrix"],
  states: ["open", "closed"],
});

export type DialogProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  danger?: boolean;
};

export function Dialog({ open, onClose, title, children, danger = false }: DialogProps) {
  const returnFocusRef = useRef<HTMLElement | null>(null);
  if (open && !returnFocusRef.current && typeof document !== "undefined") {
    returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  }
  useEffect(() => {
    if (open || !returnFocusRef.current) return;
    const target = returnFocusRef.current;
    returnFocusRef.current = null;
    queueMicrotask(() => target.focus());
  }, [open]);

  return (
    <ModalOverlay
      isOpen={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose();
      }}
      isDismissable={!danger}
      className="ads-dialog-backdrop"
    >
      <Modal className="ads-dialog-modal">
        <AriaDialog
          role={danger ? "alertdialog" : "dialog"}
          className={cx("ads-dialog", "ads-motion-enter")}
        >
          {({ close }) => (
            <>
              <Heading slot="title" className="ads-dialog-title">{title}</Heading>
              <div>{children}</div>
              <div className="ads-cluster ads-dialog-actions">
                <AriaButton className={cx("ads-btn", danger ? "ads-btn--danger" : "ads-btn--primary", "ads-btn--md")} onPress={close}>
                  {danger ? "Confirm" : "Close"}
                </AriaButton>
                {danger ? <AriaButton className="ads-btn ads-btn--ghost ads-btn--md" onPress={close}>Cancel</AriaButton> : null}
              </div>
            </>
          )}
        </AriaDialog>
      </Modal>
    </ModalOverlay>
  );
}

export function AlertDialog(props: Omit<DialogProps, "danger">) {
  return <Dialog {...props} danger />;
}

Dialog.metadata = dialogMetadata;
