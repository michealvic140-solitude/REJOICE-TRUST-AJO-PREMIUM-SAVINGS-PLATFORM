"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export function NewTicketForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const subject = formData.get("subject") as string;
    const message = formData.get("message") as string;

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error("You must be logged in");
      setIsLoading(false);
      return;
    }

    const { error } = await supabase.from("support_tickets").insert({
      user_id: user.id,
      subject,
      message,
    });

    if (error) {
      toast.error("Failed to submit ticket");
      setIsLoading(false);
      return;
    }

    toast.success("Support ticket submitted successfully");
    e.currentTarget.reset();
    setIsLoading(false);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Input
          id="subject"
          name="subject"
          placeholder="Brief description of your issue"
          required
          className="bg-background/50"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Describe your issue in detail..."
          rows={5}
          required
          className="bg-background/50"
        />
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="bg-gold hover:bg-gold/90 text-black font-semibold"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          "Submit Ticket"
        )}
      </Button>
    </form>
  );
}
