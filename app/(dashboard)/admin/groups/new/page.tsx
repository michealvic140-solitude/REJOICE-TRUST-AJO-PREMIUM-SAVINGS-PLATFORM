"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { PlusCircle, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function NewGroupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);

    const groupData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string || null,
      contribution_amount: parseFloat(formData.get("contributionAmount") as string),
      cycle_type: formData.get("cycleType") as string,
      total_slots: parseInt(formData.get("totalSlots") as string),
      bank_name: formData.get("bankName") as string || null,
      account_number: formData.get("accountNumber") as string || null,
      account_name: formData.get("accountName") as string || null,
      terms_text: formData.get("terms") as string || null,
      is_live: isLive,
      filled_slots: 0,
    };

    const supabase = createClient();
    const { data, error } = await supabase.from("groups").insert(groupData).select().single();

    if (error) {
      toast.error("Failed to create group: " + error.message);
      setIsLoading(false);
      return;
    }

    // Create slots for the group
    const slots = Array.from({ length: groupData.total_slots }, (_, i) => ({
      group_id: data.id,
      slot_number: i + 1,
      status: "available",
    }));

    await supabase.from("slots").insert(slots);

    toast.success("Group created successfully!");
    router.push("/admin/groups");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon">
          <Link href="/admin/groups">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Create New Group
          </h1>
          <p className="text-muted-foreground mt-1">
            Set up a new savings group for your members
          </p>
        </div>
      </div>

      <Card className="glass-card border-border/50 max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlusCircle className="h-5 w-5 text-gold" />
            Group Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Group Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="e.g., Premium Monthly Savings"
                  required
                  className="bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe this savings group..."
                  rows={3}
                  className="bg-background/50"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="contributionAmount">
                    Contribution Amount (NGN)
                  </Label>
                  <Input
                    id="contributionAmount"
                    name="contributionAmount"
                    type="number"
                    min="1000"
                    step="100"
                    placeholder="50000"
                    required
                    className="bg-background/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cycleType">Contribution Cycle</Label>
                  <Select name="cycleType" defaultValue="monthly">
                    <SelectTrigger id="cycleType">
                      <SelectValue placeholder="Select cycle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalSlots">Total Slots</Label>
                <Input
                  id="totalSlots"
                  name="totalSlots"
                  type="number"
                  min="2"
                  max="100"
                  placeholder="10"
                  required
                  className="bg-background/50"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Payment Details
              </h3>

              <div className="space-y-2">
                <Label htmlFor="bankName">Bank Name</Label>
                <Input
                  id="bankName"
                  name="bankName"
                  placeholder="e.g., First Bank"
                  className="bg-background/50"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input
                    id="accountNumber"
                    name="accountNumber"
                    placeholder="0123456789"
                    className="bg-background/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accountName">Account Name</Label>
                  <Input
                    id="accountName"
                    name="accountName"
                    placeholder="Account holder name"
                    className="bg-background/50"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="terms">Terms & Conditions</Label>
              <Textarea
                id="terms"
                name="terms"
                placeholder="Enter terms and conditions for this group..."
                rows={4}
                className="bg-background/50"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
              <div>
                <Label htmlFor="isLive">Make Group Live</Label>
                <p className="text-sm text-muted-foreground">
                  Members can join immediately when live
                </p>
              </div>
              <Switch
                id="isLive"
                checked={isLive}
                onCheckedChange={setIsLive}
              />
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-gold hover:bg-gold/90 text-black font-semibold"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Group"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
