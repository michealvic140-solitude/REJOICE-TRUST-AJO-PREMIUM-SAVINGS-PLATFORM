import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Wallet,
  Users,
  TrendingUp,
  Clock,
  ArrowRight,
  Bell,
  Crown,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [profileRes, groupsRes, transactionsRes, notificationsRes, slotsRes] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user!.id).single(),
    supabase.from("groups").select("*").eq("is_live", true).limit(5),
    supabase.from("transactions").select("*, groups(name)").eq("user_id", user!.id).order("created_at", { ascending: false }).limit(5),
    supabase.from("notifications").select("*").eq("user_id", user!.id).eq("read", false).order("created_at", { ascending: false }).limit(5),
    supabase.from("slots").select("*, groups(*)").eq("user_id", user!.id),
  ]);

  const profile = profileRes.data;
  const groups = groupsRes.data || [];
  const transactions = transactionsRes.data || [];
  const notifications = notificationsRes.data || [];
  const userSlots = slotsRes.data || [];

  const trustScore = Math.min(100, Math.floor((profile?.total_paid || 0) / 10000));

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Welcome back, {profile?.first_name}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Here&apos;s an overview of your savings journey
          </p>
        </div>
        <Button asChild className="bg-gold hover:bg-gold/90 text-black font-semibold w-fit">
          <Link href="/groups">
            Join New Group
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass-card border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Contributed
            </CardTitle>
            <Wallet className="h-4 w-4 text-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {formatCurrency(profile?.total_paid || 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Lifetime contributions
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Slots
            </CardTitle>
            <Users className="h-4 w-4 text-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {userSlots.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Across {new Set(userSlots.map(s => s.group_id)).size} groups
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Trust Score
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{trustScore}%</div>
            <div className="w-full bg-muted rounded-full h-2 mt-2">
              <div
                className="bg-gold h-2 rounded-full transition-all"
                style={{ width: `${trustScore}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Status
            </CardTitle>
            <Crown className="h-4 w-4 text-gold" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {profile?.is_vip ? (
                <Badge className="bg-gold/20 text-gold hover:bg-gold/30">VIP Member</Badge>
              ) : (
                <Badge variant="secondary">Standard</Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {profile?.is_vip ? "Premium benefits active" : "Upgrade for perks"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Active Groups */}
        <Card className="glass-card border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">Active Groups</CardTitle>
            <Button asChild variant="ghost" size="sm" className="text-gold">
              <Link href="/groups">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {groups.length > 0 ? (
              <div className="space-y-4">
                {groups.slice(0, 3).map((group) => (
                  <Link
                    key={group.id}
                    href={`/groups/${group.id}`}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <div className="font-medium text-foreground">{group.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatCurrency(group.contribution_amount)} / {group.cycle_type}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-foreground">
                        {group.filled_slots}/{group.total_slots} slots
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {group.cycle_type}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-10 w-10 mx-auto mb-3 opacity-50" />
                <p>No active groups available</p>
                <Button asChild variant="link" className="text-gold mt-2">
                  <Link href="/groups">Browse Groups</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="glass-card border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">Recent Transactions</CardTitle>
            <Button asChild variant="ghost" size="sm" className="text-gold">
              <Link href="/transactions">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {transactions.length > 0 ? (
              <div className="space-y-4">
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                  >
                    <div className="flex items-center gap-3">
                      {tx.status === "approved" ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : tx.status === "declined" ? (
                        <AlertCircle className="h-5 w-5 text-destructive" />
                      ) : (
                        <Clock className="h-5 w-5 text-yellow-500" />
                      )}
                      <div>
                        <div className="font-medium text-foreground">{tx.code}</div>
                        <div className="text-xs text-muted-foreground">
                          {tx.groups?.name || "Unknown Group"}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-foreground">
                        {formatCurrency(tx.amount)}
                      </div>
                      <Badge
                        variant={
                          tx.status === "approved"
                            ? "default"
                            : tx.status === "declined"
                            ? "destructive"
                            : "secondary"
                        }
                        className="text-xs"
                      >
                        {tx.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-10 w-10 mx-auto mb-3 opacity-50" />
                <p>No transactions yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Notifications */}
      {notifications.length > 0 && (
        <Card className="glass-card border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Bell className="h-5 w-5 text-gold" />
              Recent Notifications
            </CardTitle>
            <Button asChild variant="ghost" size="sm" className="text-gold">
              <Link href="/notifications">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="p-3 rounded-lg bg-gold/5 border border-gold/10"
                >
                  <p className="text-sm text-foreground">{notification.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(notification.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
