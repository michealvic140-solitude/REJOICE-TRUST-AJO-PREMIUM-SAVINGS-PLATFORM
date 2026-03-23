"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface TransactionActionsProps {
  transactionId: string;
  userId: string;
  groupId: string;
  amount: number;
}

export function TransactionActions({
  transactionId,
  userId,
  groupId,
  amount,
}: TransactionActionsProps) {
  const [isLoading, setIsLoading] = useState<"approve" | "decline" | null>(null);
  const router = useRouter();

  async function handleAction(action: "approve" | "decline") {
    setIsLoading(action);
    const supabase = createClient();

    // Update transaction status
    const { error: txError } = await supabase
      .from("transactions")
      .update({
        status: action === "approve" ? "approved" : "declined",
        updated_at: new Date().toISOString(),
      })
      .eq("id", transactionId);

    if (txError) {
      toast.error("Failed to update transaction");
      setIsLoading(null);
      return;
    }

    // If approved, update user's total_paid
    if (action === "approve") {
      const { data: profile } = await supabase
        .from("profiles")
        .select("total_paid")
        .eq("id", userId)
        .single();

      const newTotal = (profile?.total_paid || 0) + amount;

      await supabase
        .from("profiles")
        .update({ total_paid: newTotal })
        .eq("id", userId);

      // Send notification to user
      await supabase.from("notifications").insert({
        user_id: userId,
        message: `Your payment of ₦${amount.toLocaleString()} has been approved!`,
      });
    } else {
      // Send decline notification
      await supabase.from("notifications").insert({
        user_id: userId,
        message: `Your payment was declined. Please contact support for more information.`,
      });
    }

    toast.success(
      action === "approve"
        ? "Transaction approved successfully"
        : "Transaction declined"
    );
    setIsLoading(null);
    router.refresh();
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <Button
        size="sm"
        variant="outline"
        className="border-green-500/30 text-green-500 hover:bg-green-500/10"
        onClick={() => handleAction("approve")}
        disabled={isLoading !== null}
      >
        {isLoading === "approve" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <CheckCircle2 className="h-4 w-4 mr-1" />
            Approve
          </>
        )}
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="border-destructive/30 text-destructive hover:bg-destructive/10"
        onClick={() => handleAction("decline")}
        disabled={isLoading !== null}
      >
        {isLoading === "decline" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <XCircle className="h-4 w-4 mr-1" />
            Decline
          </>
        )}
      </Button>
    </div>
  );
}
