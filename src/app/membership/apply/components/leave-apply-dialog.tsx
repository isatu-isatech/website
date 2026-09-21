"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface LeaveApplyDialogProps {
  open: boolean;
  onContinue: () => void;
  onCancel: () => void;
}

/**
 * Confirmation shown when a visitor tries to leave the application mid-form
 * (browser back, the header links, or any other navigation trigger).
 * Proceeding discards the entered data; cancelling keeps the visitor on the
 * form with everything intact.
 *
 * Escape, overlay click, and the close button all map to `onCancel` (stay).
 */
export function LeaveApplyDialog({
  open,
  onContinue,
  onCancel,
}: LeaveApplyDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(next) => !next && onCancel()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Leave the application?</DialogTitle>
          <DialogDescription>
            Your entered information will be discarded and you&apos;ll need to
            start the application again.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Keep editing
          </Button>
          <Button type="button" onClick={onContinue}>
            Leave
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
