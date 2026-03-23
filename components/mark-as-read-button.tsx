"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { CheckCheck } from "lucide-react";
import { toast } from "sonner";

export function MarkAsReadButton() {
  const router = useRouter();

  async function handleMarkAllRead() {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", user.id)
      .eq("read", false);

    if (error) {
      toast.error("Failed to mark notifications as read");
      return;
    }

    toast.success("All notifications marked as read");
    router.refresh();
  }

  return (
    <Button variant="outline" onClick={handleMarkAllRead}>
      <CheckCheck className="h-4 w-4 mr-2" />
      Mark All Read
    </Button>
  );
}
