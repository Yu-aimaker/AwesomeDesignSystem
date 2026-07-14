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

export type DialogBaseProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
};

export type DialogProps = DialogBaseProps & {
  closeLabel?: string;
};

export type AlertDialogProps = DialogBaseProps & {
  onConfirm: () => void | Promise<void>;
  confirming?: boolean;
  confirmLabel?: string;
  confirmingLabel?: string;
  cancelLabel?: string;
  confirmationErrorLabel?: string;
};

type DialogFrameProps = DialogBaseProps & {
  danger: boolean;
  onConfirm?: () => void | Promise<void>;
  confirming?: boolean;
  confirmLabel?: string;
  confirmingLabel?: string;
  cancelLabel?: string;
  closeLabel?: string;
  confirmationErrorLabel?: string;
};

function DialogFrame({ open, onClose, title, children, danger, onConfirm, confirming = false, confirmLabel = "Confirm", confirmingLabel = "Confirming…", cancelLabel = "Cancel", closeLabel = "Close", confirmationErrorLabel = "Confirmation failed. Try again." }: DialogFrameProps) {
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const confirmationRequestRef = useRef<{ token: symbol; generation: number } | null>(null);
  const openGenerationRef = useRef(0);
  const previousOpenRef = useRef(open);
  const [internalConfirming, setInternalConfirming] = useState(false);
  const [confirmationFailed, setConfirmationFailed] = useState(false);
  const isConfirming = confirming || internalConfirming;
  useLayoutEffect(() => {
    if (previousOpenRef.current === open) return;
    previousOpenRef.current = open;
    openGenerationRef.current += 1;
    confirmationRequestRef.current = null;
    setInternalConfirming(false);
    setConfirmationFailed(false);
  }, [open]);
  useLayoutEffect(() => {
    if (open && !returnFocusRef.current) {
      returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    }
  }, [open]);
  function requestClose() {
    confirmationRequestRef.current = null;
    setInternalConfirming(false);
    setConfirmationFailed(false);
    onClose();
  }

  async function confirm() {
    if (!onConfirm || isConfirming) return;
    const generation = openGenerationRef.current;
    const request = { token: Symbol("confirmation-request"), generation };
    confirmationRequestRef.current = request;
    setConfirmationFailed(false);
    setInternalConfirming(true);
    try {
      await onConfirm();
      if (confirmationRequestRef.current === request && openGenerationRef.current === generation) requestClose();
    } catch {
      if (confirmationRequestRef.current === request && openGenerationRef.current === generation) {
        setConfirmationFailed(true);
        setInternalConfirming(false);
      }
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
                  {danger ? (isConfirming ? confirmingLabel : confirmLabel) : closeLabel}
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

export function Dialog(props: DialogProps) {
  return <DialogFrame {...props} danger={false} />;
}

export function AlertDialog(props: AlertDialogProps) {
  return <DialogFrame {...props} danger />;
}

Dialog.metadata = dialogMetadata;
AlertDialog.metadata = getComponentMetadata("alert-dialog");
