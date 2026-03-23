"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ProfileFormProps {
  profile: Profile;
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);

    const updates = {
      first_name: formData.get("firstName") as string,
      middle_name: formData.get("middleName") as string || null,
      last_name: formData.get("lastName") as string,
      phone: formData.get("phone") as string || null,
      nickname: formData.get("nickname") as string || null,
      state_of_origin: formData.get("stateOfOrigin") as string || null,
      current_state: formData.get("currentState") as string || null,
      current_address: formData.get("currentAddress") as string || null,
      bank_name: formData.get("bankName") as string || null,
      account_number: formData.get("accountNumber") as string || null,
      account_name: formData.get("accountName") as string || null,
      updated_at: new Date().toISOString(),
    };

    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", profile.id);

    if (error) {
      toast.error("Failed to update profile");
      setIsLoading(false);
      return;
    }

    toast.success("Profile updated successfully");
    setIsLoading(false);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Info */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Personal Information
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              name="firstName"
              defaultValue={profile.first_name}
              required
              className="bg-background/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              name="lastName"
              defaultValue={profile.last_name}
              required
              className="bg-background/50"
            />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="middleName">Middle Name</Label>
            <Input
              id="middleName"
              name="middleName"
              defaultValue={profile.middle_name || ""}
              className="bg-background/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nickname">Nickname</Label>
            <Input
              id="nickname"
              name="nickname"
              defaultValue={profile.nickname || ""}
              className="bg-background/50"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            defaultValue={profile.phone || ""}
            className="bg-background/50"
          />
        </div>
      </div>

      {/* Location */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Location
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="stateOfOrigin">State of Origin</Label>
            <Input
              id="stateOfOrigin"
              name="stateOfOrigin"
              defaultValue={profile.state_of_origin || ""}
              className="bg-background/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="currentState">Current State</Label>
            <Input
              id="currentState"
              name="currentState"
              defaultValue={profile.current_state || ""}
              className="bg-background/50"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="currentAddress">Current Address</Label>
          <Input
            id="currentAddress"
            name="currentAddress"
            defaultValue={profile.current_address || ""}
            className="bg-background/50"
          />
        </div>
      </div>

      {/* Bank Details */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Bank Details
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="bankName">Bank Name</Label>
            <Input
              id="bankName"
              name="bankName"
              defaultValue={profile.bank_name || ""}
              className="bg-background/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="accountNumber">Account Number</Label>
            <Input
              id="accountNumber"
              name="accountNumber"
              defaultValue={profile.account_number || ""}
              className="bg-background/50"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="accountName">Account Name</Label>
          <Input
            id="accountName"
            name="accountName"
            defaultValue={profile.account_name || ""}
            className="bg-background/50"
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="bg-gold hover:bg-gold/90 text-black font-semibold"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          "Save Changes"
        )}
      </Button>
    </form>
  );
}
