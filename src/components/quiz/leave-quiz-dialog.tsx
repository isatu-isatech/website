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

interface LeaveQuizDialogProps {
  open: boolean;
  onContinue: () => void;
  onCancel: () => void;
}

/**
 * Confirmation shown when a visitor tries to leave the quiz mid-attempt
 * (browser back, the header "Back to Home" links, or any other navigation
 * trigger). Proceeding permanently discards the in-progress quiz and resets
 * it; cancelling keeps the visitor on the quiz to resume where they left off.
 *
 * Escape, overlay click, and the close button all map to `onCancel` (stay).
 */
export function LeaveQuizDialog({
  open,
  onContinue,
  onCancel,
}: LeaveQuizDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(next) => !next && onCancel()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Leave the quiz?</DialogTitle>
          <DialogDescription>
            Your current quiz progress will be permanently lost and the quiz
            will be reset.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="button" onClick={onContinue}>
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
