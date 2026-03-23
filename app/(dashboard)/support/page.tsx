import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HelpCircle, MessageSquare, Phone, Mail } from "lucide-react";
import { NewTicketForm } from "@/components/new-ticket-form";

export default async function SupportPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [ticketsRes, contactRes] = await Promise.all([
    supabase
      .from("support_tickets")
      .select("*")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false }),
    supabase.from("contact_info").select("*").eq("id", 1).single(),
  ]);

  const tickets = ticketsRes.data || [];
  const contactInfo = contactRes.data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Support
        </h1>
        <p className="text-muted-foreground mt-1">
          Get help or contact our support team
        </p>
      </div>

      <Tabs defaultValue="tickets" className="space-y-6">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="tickets">My Tickets</TabsTrigger>
          <TabsTrigger value="new">New Ticket</TabsTrigger>
          <TabsTrigger value="contact">Contact Info</TabsTrigger>
        </TabsList>

        <TabsContent value="tickets">
          <Card className="glass-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-gold" />
                Support Tickets
              </CardTitle>
            </CardHeader>
            <CardContent>
              {tickets.length > 0 ? (
                <div className="space-y-4">
                  {tickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="p-4 rounded-lg bg-muted/30 space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-foreground">
                            {ticket.subject}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {ticket.message}
                          </p>
                        </div>
                        <Badge
                          variant={
                            ticket.status === "closed"
                              ? "secondary"
                              : ticket.status === "replied"
                              ? "default"
                              : "outline"
                          }
                          className={
                            ticket.status === "replied"
                              ? "bg-green-500/20 text-green-500"
                              : ""
                          }
                        >
                          {ticket.status}
                        </Badge>
                      </div>
                      {ticket.admin_reply && (
                        <div className="p-3 rounded-lg bg-gold/5 border border-gold/20">
                          <p className="text-sm font-medium text-gold mb-1">
                            Admin Reply
                          </p>
                          <p className="text-sm text-foreground">
                            {ticket.admin_reply}
                          </p>
                          {ticket.replied_at && (
                            <p className="text-xs text-muted-foreground mt-2">
                              {formatDate(ticket.replied_at)}
                            </p>
                          )}
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Created: {formatDate(ticket.created_at)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <HelpCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No Tickets Yet
                  </h3>
                  <p className="text-muted-foreground">
                    You haven&apos;t submitted any support tickets.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="new">
          <Card className="glass-card border-border/50">
            <CardHeader>
              <CardTitle>Submit a Support Ticket</CardTitle>
            </CardHeader>
            <CardContent>
              <NewTicketForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact">
          <Card className="glass-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-gold" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {contactInfo?.email && (
                  <div className="p-4 rounded-lg bg-muted/30 flex items-center gap-3">
                    <Mail className="h-5 w-5 text-gold" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium text-foreground">
                        {contactInfo.email}
                      </p>
                    </div>
                  </div>
                )}
                {contactInfo?.whatsapp && (
                  <div className="p-4 rounded-lg bg-muted/30 flex items-center gap-3">
                    <MessageSquare className="h-5 w-5 text-gold" />
                    <div>
                      <p className="text-sm text-muted-foreground">WhatsApp</p>
                      <p className="font-medium text-foreground">
                        {contactInfo.whatsapp}
                      </p>
                    </div>
                  </div>
                )}
                {contactInfo?.call_number && (
                  <div className="p-4 rounded-lg bg-muted/30 flex items-center gap-3">
                    <Phone className="h-5 w-5 text-gold" />
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium text-foreground">
                        {contactInfo.call_number}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              {!contactInfo?.email &&
                !contactInfo?.whatsapp &&
                !contactInfo?.call_number && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Contact information not available.</p>
                  </div>
                )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
