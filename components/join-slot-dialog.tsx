"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency } from "@/lib/utils";
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
import { ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface JoinSlotDialogProps {
  groupId: string;
  groupName: string;
  contributionAmount: number;
  availableSlots: number[];
  totalSlots: number;
  takenSlots: number[];
}

export function JoinSlotDialog({
  groupId,
  groupName,
  contributionAmount,
  availableSlots,
  totalSlots,
  takenSlots,
}: JoinSlotDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Generate all slots and mark available ones
  const allSlots = Array.from({ length: totalSlots }, (_, i) => i + 1);
  const actuallyAvailable = allSlots.filter((s) => !takenSlots.includes(s));

  async function handleJoin() {
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

    // Check if slot already exists
    const { data: existingSlot } = await supabase
      .from("slots")
      .select("id")
      .eq("group_id", groupId)
      .eq("slot_number", parseInt(selectedSlot))
      .single();

    if (existingSlot) {
      // Update existing slot
      const { error } = await supabase
        .from("slots")
        .update({ user_id: user.id, status: "taken" })
        .eq("id", existingSlot.id);

      if (error) {
        toast.error("Failed to join slot");
        setIsLoading(false);
        return;
      }
    } else {
      // Create new slot
      const { error } = await supabase.from("slots").insert({
        group_id: groupId,
        user_id: user.id,
        slot_number: parseInt(selectedSlot),
        status: "taken",
      });

      if (error) {
        toast.error("Failed to join slot");
        setIsLoading(false);
        return;
      }
    }

    // Update filled_slots count
    await supabase.rpc("increment_filled_slots", { group_id: groupId });

    toast.success("Successfully joined the group!");
    setOpen(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-gold hover:bg-gold/90 text-black font-semibold">
          Join This Group
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Join {groupName}</DialogTitle>
          <DialogDescription>
            Select your preferred slot to join this savings group.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="p-4 rounded-lg bg-gold/10 border border-gold/20">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Contribution Amount
              </span>
              <span className="font-bold text-gold">
                {formatCurrency(contributionAmount)}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="slot">Select Slot Number</Label>
            <Select value={selectedSlot} onValueChange={setSelectedSlot}>
              <SelectTrigger id="slot">
                <SelectValue placeholder="Choose a slot" />
              </SelectTrigger>
              <SelectContent>
                {actuallyAvailable.map((slot) => (
                  <SelectItem key={slot} value={slot.toString()}>
                    Slot #{slot}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {actuallyAvailable.length} slots available
            </p>
          </div>

          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-gold mt-0.5" />
            <p>
              By joining, you agree to make your contributions on time according
              to the group schedule.
            </p>
          </div>
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
            onClick={handleJoin}
            disabled={isLoading || !selectedSlot}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Joining...
              </>
            ) : (
              "Confirm & Join"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
