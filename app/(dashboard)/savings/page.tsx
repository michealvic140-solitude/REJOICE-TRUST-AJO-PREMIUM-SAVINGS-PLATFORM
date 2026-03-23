import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Wallet, Users, TrendingUp, ArrowRight, PiggyBank } from "lucide-react";
import { MakePaymentDialog } from "@/components/make-payment-dialog";

export default async function SavingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [profileRes, slotsRes] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user!.id).single(),
    supabase
      .from("slots")
      .select("*, groups(*)")
      .eq("user_id", user!.id)
      .eq("status", "taken"),
  ]);

  const profile = profileRes.data;
  const userSlots = slotsRes.data || [];

  // Group slots by group
  const groupedSlots = userSlots.reduce(
    (acc, slot) => {
      const groupId = slot.group_id;
      if (!acc[groupId]) {
        acc[groupId] = {
          group: slot.groups,
          slots: [],
        };
      }
      acc[groupId].slots.push(slot);
      return acc;
    },
    {} as Record<string, { group: any; slots: typeof userSlots }>
  );

  const totalExpectedContribution = Object.values(groupedSlots).reduce(
    (sum, { group, slots }) =>
      sum + (group?.contribution_amount || 0) * slots.length,
    0
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          My Savings
        </h1>
        <p className="text-muted-foreground mt-1">
          Track your savings across all groups
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="glass-card border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Total Contributed
                </p>
                <p className="text-2xl font-bold text-gold">
                  {formatCurrency(profile?.total_paid || 0)}
                </p>
              </div>
              <Wallet className="h-8 w-8 text-gold opacity-70" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Groups</p>
                <p className="text-2xl font-bold text-foreground">
                  {Object.keys(groupedSlots).length}
                </p>
              </div>
              <Users className="h-8 w-8 text-gold opacity-70" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Slots</p>
                <p className="text-2xl font-bold text-foreground">
                  {userSlots.length}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-gold opacity-70" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Groups */}
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PiggyBank className="h-5 w-5 text-gold" />
            Active Memberships
          </CardTitle>
        </CardHeader>
        <CardContent>
          {Object.keys(groupedSlots).length > 0 ? (
            <div className="space-y-6">
              {Object.entries(groupedSlots).map(([groupId, { group, slots }]) => (
                <div
                  key={groupId}
                  className="p-4 rounded-lg bg-muted/30 space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground text-lg">
                        {group?.name || "Unknown Group"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(group?.contribution_amount || 0)} /{" "}
                        {group?.cycle_type}
                      </p>
                    </div>
                    <Badge variant="secondary" className="capitalize">
                      {group?.cycle_type}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {slots.map((slot) => (
                      <div
                        key={slot.id}
                        className={`px-3 py-2 rounded-lg text-sm ${
                          slot.is_disbursed
                            ? "bg-green-500/20 text-green-500"
                            : "bg-gold/10 text-gold border border-gold/20"
                        }`}
                      >
                        Slot #{slot.slot_number}
                        {slot.is_disbursed && " (Paid)"}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <MakePaymentDialog
                      groupId={groupId}
                      groupName={group?.name || "Group"}
                      contributionAmount={group?.contribution_amount || 0}
                      slots={slots.map((s) => s.slot_number)}
                      bankName={group?.bank_name}
                      accountNumber={group?.account_number}
                      accountName={group?.account_name}
                    />
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/groups/${groupId}`}>
                        View Group
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <PiggyBank className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No Active Memberships
              </h3>
              <p className="text-muted-foreground mb-4">
                Join a savings group to start your journey.
              </p>
              <Button asChild className="bg-gold hover:bg-gold/90 text-black">
                <Link href="/groups">Browse Groups</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
