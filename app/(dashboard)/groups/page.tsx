import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { Users, Lock, ArrowRight } from "lucide-react";

export default async function GroupsPage() {
  const supabase = await createClient();

  const { data: groups } = await supabase
    .from("groups")
    .select("*")
    .eq("is_live", true)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Savings Groups
        </h1>
        <p className="text-muted-foreground mt-1">
          Join a group and start your savings journey
        </p>
      </div>

      {groups && groups.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => {
            const progress = (group.filled_slots / group.total_slots) * 100;
            const availableSlots = group.total_slots - group.filled_slots;

            return (
              <Card
                key={group.id}
                className="glass-card border-border/50 hover:border-gold/30 transition-colors"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg text-foreground">
                        {group.name}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {group.description || "Premium savings group"}
                      </p>
                    </div>
                    {group.is_locked && (
                      <Lock className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Contribution
                    </span>
                    <span className="font-semibold text-gold">
                      {formatCurrency(group.contribution_amount)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Cycle</span>
                    <Badge variant="secondary" className="capitalize">
                      {group.cycle_type}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Slots Filled</span>
                      <span className="text-foreground">
                        {group.filled_slots} / {group.total_slots}
                      </span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  <div className="pt-2">
                    {availableSlots > 0 && !group.is_locked ? (
                      <Button
                        asChild
                        className="w-full bg-gold hover:bg-gold/90 text-black font-semibold"
                      >
                        <Link href={`/groups/${group.id}`}>
                          View Details
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    ) : (
                      <Button
                        disabled
                        className="w-full"
                        variant="secondary"
                      >
                        {group.is_locked ? "Group Locked" : "Fully Booked"}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="glass-card border-border/50">
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No Groups Available
            </h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              There are no active savings groups at the moment. Please check back
              later or contact support.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
