import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { JoinSlotDialog } from "@/components/join-slot-dialog";
import {
  Users,
  Wallet,
  Calendar,
  Lock,
  CheckCircle2,
  User,
  Crown,
  Building2,
} from "lucide-react";

interface GroupPageProps {
  params: Promise<{ id: string }>;
}

export default async function GroupPage({ params }: GroupPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [groupRes, slotsRes] = await Promise.all([
    supabase.from("groups").select("*").eq("id", id).single(),
    supabase
      .from("slots")
      .select("*, profile:profiles(*)")
      .eq("group_id", id)
      .order("slot_number", { ascending: true }),
  ]);

  if (!groupRes.data) {
    notFound();
  }

  const group = groupRes.data;
  const slots = slotsRes.data || [];

  // Check if user already has a slot in this group
  const userSlot = slots.find((s) => s.user_id === user?.id);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            {group.name}
          </h1>
          {group.is_locked && (
            <Badge variant="secondary">
              <Lock className="h-3 w-3 mr-1" />
              Locked
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground">
          {group.description || "Premium rotating savings group"}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Group Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="glass-card border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Group Details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                <Wallet className="h-5 w-5 text-gold" />
                <div>
                  <p className="text-sm text-muted-foreground">Contribution</p>
                  <p className="font-semibold text-foreground">
                    {formatCurrency(group.contribution_amount)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                <Calendar className="h-5 w-5 text-gold" />
                <div>
                  <p className="text-sm text-muted-foreground">Cycle</p>
                  <p className="font-semibold text-foreground capitalize">
                    {group.cycle_type}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                <Users className="h-5 w-5 text-gold" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Slots</p>
                  <p className="font-semibold text-foreground">
                    {group.total_slots} slots
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                <CheckCircle2 className="h-5 w-5 text-gold" />
                <div>
                  <p className="text-sm text-muted-foreground">Filled</p>
                  <p className="font-semibold text-foreground">
                    {group.filled_slots} / {group.total_slots}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Info */}
          {group.bank_name && (
            <Card className="glass-card border-border/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-gold" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bank</span>
                  <span className="font-medium text-foreground">
                    {group.bank_name}
                  </span>
                </div>
                <Separator className="bg-border/50" />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Account Number</span>
                  <span className="font-medium text-foreground font-mono">
                    {group.account_number}
                  </span>
                </div>
                <Separator className="bg-border/50" />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Account Name</span>
                  <span className="font-medium text-foreground">
                    {group.account_name}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Terms */}
          {group.terms_text && (
            <Card className="glass-card border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Terms & Conditions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {group.terms_text}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Slots */}
        <div className="space-y-6">
          <Card className="glass-card border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Available Slots</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                {Array.from({ length: group.total_slots }, (_, i) => {
                  const slot = slots.find((s) => s.slot_number === i + 1);
                  const isAvailable = !slot || slot.status === "available";
                  const isTaken = slot?.status === "taken";
                  const isUserSlot = slot?.user_id === user?.id;

                  return (
                    <div
                      key={i + 1}
                      className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                        isUserSlot
                          ? "bg-gold/10 border border-gold/30"
                          : isTaken
                          ? "bg-muted/30"
                          : "bg-muted/20 hover:bg-muted/40"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${
                            isTaken
                              ? "bg-gold/20 text-gold"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {i + 1}
                        </div>
                        <div>
                          {isTaken && slot?.profile ? (
                            <div className="flex items-center gap-1">
                              <span className="text-sm font-medium text-foreground">
                                {slot.profile.first_name} {slot.profile.last_name?.[0]}.
                              </span>
                              {slot.profile.is_vip && (
                                <Crown className="h-3 w-3 text-gold" />
                              )}
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">
                              Available
                            </span>
                          )}
                          {slot?.is_disbursed && (
                            <Badge variant="secondary" className="text-xs mt-1">
                              Paid Out
                            </Badge>
                          )}
                        </div>
                      </div>
                      {isUserSlot && (
                        <Badge className="bg-gold/20 text-gold">Your Slot</Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Join Action */}
          <Card className="glass-card border-gold/20">
            <CardContent className="pt-6">
              {userSlot ? (
                <div className="text-center">
                  <CheckCircle2 className="h-10 w-10 text-gold mx-auto mb-3" />
                  <p className="font-medium text-foreground mb-1">
                    You&apos;re in this group!
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Slot #{userSlot.slot_number}
                  </p>
                </div>
              ) : group.is_locked ? (
                <div className="text-center">
                  <Lock className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="font-medium text-foreground mb-1">
                    Group is Locked
                  </p>
                  <p className="text-sm text-muted-foreground">
                    New members cannot join
                  </p>
                </div>
              ) : group.filled_slots >= group.total_slots ? (
                <div className="text-center">
                  <Users className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="font-medium text-foreground mb-1">
                    Group is Full
                  </p>
                  <p className="text-sm text-muted-foreground">
                    All slots have been taken
                  </p>
                </div>
              ) : (
                <JoinSlotDialog
                  groupId={group.id}
                  groupName={group.name}
                  contributionAmount={group.contribution_amount}
                  availableSlots={slots
                    .filter((s) => s.status === "available" || !s.user_id)
                    .map((s) => s.slot_number)}
                  totalSlots={group.total_slots}
                  takenSlots={slots.filter((s) => s.status === "taken").map((s) => s.slot_number)}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
