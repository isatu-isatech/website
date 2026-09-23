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
  /**
   * `leave` — visitor navigates away mid-form (browser back, header links).
   * `reset` — visitor pressed "Start over" mid-form; confirming returns to
   * the intro screen instead of navigating.
   */
  mode?: "leave" | "reset";
  onContinue: () => void;
  onCancel: () => void;
}

/**
 * Confirmation shown when a visitor tries to leave the application mid-form
 * (browser back, the header links, or any other navigation trigger), or when
 * they explicitly start over. Proceeding discards the entered data (and, for
 * `reset`, returns to the intro screen); cancelling keeps the visitor on the
 * form with everything intact.
 *
 * Escape, overlay click, and the close button all map to `onCancel` (stay).
 */
export function LeaveApplyDialog({
  open,
  mode = "leave",
  onContinue,
  onCancel,
}: LeaveApplyDialogProps) {
  const isReset = mode === "reset";
  return (
    <Dialog open={open} onOpenChange={(next) => !next && onCancel()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isReset ? "Start over?" : "Leave the application?"}
          </DialogTitle>
          <DialogDescription>
            {isReset ? (
              <>
                Your entered information will be discarded and you&apos;ll
                return to the start.
              </>
            ) : (
              <>
                Your entered information will be discarded and you&apos;ll need
                to start the application again.
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Keep editing
          </Button>
          <Button type="button" onClick={onContinue}>
            {isReset ? "Start over" : "Leave"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
