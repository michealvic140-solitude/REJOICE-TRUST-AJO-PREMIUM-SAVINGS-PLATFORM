"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency, generateTransactionCode } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Loader2, Copy, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface MakePaymentDialogProps {
  groupId: string;
  groupName: string;
  contributionAmount: number;
  slots: number[];
  bankName?: string | null;
  accountNumber?: string | null;
  accountName?: string | null;
}

export function MakePaymentDialog({
  groupId,
  groupName,
  contributionAmount,
  slots,
  bankName,
  accountNumber,
  accountName,
}: MakePaymentDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  async function handleCopy(text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleSubmitPayment() {
    if (!selectedSlot) {
      toast.error("Please select a slot");
      return;
    }

    setIsLoading(true);
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error("You must be logged in");
      setIsLoading(false);
      return;
    }

    const transactionCode = generateTransactionCode();

    const { error } = await supabase.from("transactions").insert({
      code: transactionCode,
      group_id: groupId,
      user_id: user.id,
      amount: contributionAmount,
      seat_no: parseInt(selectedSlot),
      status: "pending",
    });

    if (error) {
      toast.error("Failed to submit payment");
      setIsLoading(false);
      return;
    }

    toast.success("Payment submitted for verification");
    setOpen(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="bg-gold hover:bg-gold/90 text-black font-semibold"
        >
          <CreditCard className="h-4 w-4 mr-2" />
          Make Payment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Make Payment - {groupName}</DialogTitle>
          <DialogDescription>
            Submit your contribution payment for verification.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Payment Amount */}
          <div className="p-4 rounded-lg bg-gold/10 border border-gold/20 text-center">
            <p className="text-sm text-muted-foreground mb-1">Amount to Pay</p>
            <p className="text-2xl font-bold text-gold">
              {formatCurrency(contributionAmount)}
            </p>
          </div>

          {/* Bank Details */}
          {bankName && accountNumber && (
            <div className="space-y-3 p-4 rounded-lg bg-muted/30">
              <h4 className="font-medium text-foreground">
                Transfer to this account:
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Bank</span>
                  <span className="font-medium text-foreground">{bankName}</span>
                </div>
                <Separator className="bg-border/50" />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Account No.
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-medium text-foreground">
                      {accountNumber}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleCopy(accountNumber)}
                    >
                      {copied ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                {accountName && (
                  <>
                    <Separator className="bg-border/50" />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Account Name
                      </span>
                      <span className="font-medium text-foreground">
                        {accountName}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Slot Selection */}
          <div className="space-y-2">
            <Label htmlFor="slot">Select Slot</Label>
            <Select value={selectedSlot} onValueChange={setSelectedSlot}>
              <SelectTrigger id="slot">
                <SelectValue placeholder="Choose which slot to pay for" />
              </SelectTrigger>
              <SelectContent>
                {slots.map((slot) => (
                  <SelectItem key={slot} value={slot.toString()}>
                    Slot #{slot}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <p className="text-xs text-muted-foreground">
            After making the transfer, click submit to notify the admin for
            verification. Your payment will be confirmed within 24 hours.
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 bg-gold hover:bg-gold/90 text-black font-semibold"
            onClick={handleSubmitPayment}
            disabled={isLoading || !selectedSlot}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Payment"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
