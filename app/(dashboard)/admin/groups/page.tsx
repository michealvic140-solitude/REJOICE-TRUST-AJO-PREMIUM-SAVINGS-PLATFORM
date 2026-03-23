import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PlusCircle, Users, Settings } from "lucide-react";

export default async function AdminGroupsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user!.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/dashboard");
  }

  const { data: groups } = await supabase
    .from("groups")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Manage Groups
          </h1>
          <p className="text-muted-foreground mt-1">
            Create and manage savings groups
          </p>
        </div>
        <Button asChild className="bg-gold hover:bg-gold/90 text-black">
          <Link href="/admin/groups/new">
            <PlusCircle className="h-4 w-4 mr-2" />
            Create Group
          </Link>
        </Button>
      </div>

      {groups && groups.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => {
            const progress = (group.filled_slots / group.total_slots) * 100;

            return (
              <Card
                key={group.id}
                className="glass-card border-border/50 hover:border-gold/30 transition-colors"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{group.name}</CardTitle>
                    <div className="flex gap-1">
                      {group.is_live ? (
                        <Badge className="bg-green-500/20 text-green-500">
                          Live
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Draft</Badge>
                      )}
                      {group.is_locked && (
                        <Badge variant="outline">Locked</Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Contribution</p>
                      <p className="font-semibold text-gold">
                        {formatCurrency(group.contribution_amount)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Cycle</p>
                      <p className="font-semibold text-foreground capitalize">
                        {group.cycle_type}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Slots</span>
                      <span className="text-foreground">
                        {group.filled_slots} / {group.total_slots}
                      </span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  <div className="text-xs text-muted-foreground">
                    Created: {formatDate(group.created_at)}
                  </div>

                  <Button asChild variant="outline" className="w-full" size="sm">
                    <Link href={`/admin/groups/${group.id}`}>
                      <Settings className="h-4 w-4 mr-2" />
                      Manage Group
                    </Link>
                  </Button>
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
              No Groups Created
            </h3>
            <p className="text-muted-foreground mb-4">
              Create your first savings group to get started.
            </p>
            <Button asChild className="bg-gold hover:bg-gold/90 text-black">
              <Link href="/admin/groups/new">
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Group
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
