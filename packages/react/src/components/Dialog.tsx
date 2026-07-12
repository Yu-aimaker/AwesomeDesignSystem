"use client";

import { cx } from "@awesome-ds/core";
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import {
  Button as AriaButton,
  Dialog as AriaDialog,
  Heading,
  Modal,
  ModalOverlay,
} from "react-aria-components";
import { getComponentMetadata } from "../contracts";

export const dialogMetadata = getComponentMetadata("dialog");

export type DialogProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  danger?: boolean;
  onConfirm?: () => void | Promise<void>;
  confirming?: boolean;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmationErrorLabel?: string;
};

export function Dialog({ open, onClose, title, children, danger = false, onConfirm, confirming = false, confirmLabel = "Confirm", cancelLabel = "Cancel", confirmationErrorLabel = "Confirmation failed. Try again." }: DialogProps) {
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const [internalConfirming, setInternalConfirming] = useState(false);
  const [confirmationFailed, setConfirmationFailed] = useState(false);
  const isConfirming = confirming || internalConfirming;
  useLayoutEffect(() => {
    if (open && !returnFocusRef.current) {
      returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    }
  }, [open]);
  function requestClose() {
    setInternalConfirming(false);
    setConfirmationFailed(false);
    onClose();
  }

  async function confirm() {
    if (!onConfirm || isConfirming) return;
    setConfirmationFailed(false);
    setInternalConfirming(true);
    try {
      await onConfirm();
      requestClose();
    } catch {
      setConfirmationFailed(true);
    } finally {
      setInternalConfirming(false);
    }
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
        if (!nextOpen) requestClose();
      }}
      isDismissable={!danger && !isConfirming}
      className="ads-dialog-backdrop"
    >
      <Modal className="ads-dialog-modal">
        <AriaDialog
          role={danger ? "alertdialog" : "dialog"}
          className={cx("ads-dialog", "ads-motion-enter")}
        >
          {({ close }) => (
            <div
              onKeyDown={(event) => {
                if (danger && event.key === "Escape") {
                  event.preventDefault();
                  if (!isConfirming) requestClose();
                }
              }}
            >
              <Heading slot="title" className="ads-dialog-title">{title}</Heading>
              <div>{children}</div>
              {confirmationFailed ? <p role="alert">{confirmationErrorLabel}</p> : null}
              <div className="ads-cluster ads-dialog-actions">
                <AriaButton
                  className={cx("ads-btn", danger ? "ads-btn--danger" : "ads-btn--primary", "ads-btn--md")}
                  isDisabled={isConfirming}
                  onPress={danger ? () => { void confirm(); } : close}
                >
                  {danger ? (isConfirming ? "Confirming…" : confirmLabel) : "Close"}
                </AriaButton>
                {danger ? <AriaButton className="ads-btn ads-btn--ghost ads-btn--md" isDisabled={isConfirming} onPress={requestClose}>{cancelLabel}</AriaButton> : null}
              </div>
            </div>
          )}
        </AriaDialog>
      </Modal>
    </ModalOverlay>
  );
}

export function AlertDialog(props: Omit<DialogProps, "danger"> & { onConfirm: NonNullable<DialogProps["onConfirm"]> }) {
  return <Dialog {...props} danger />;
}

Dialog.metadata = dialogMetadata;
