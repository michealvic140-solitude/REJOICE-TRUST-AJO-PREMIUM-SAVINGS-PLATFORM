import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  Wallet,
  History,
  MessageSquare,
  Settings,
  PlusCircle,
  Shield,
  Bell,
  ArrowRight,
} from "lucide-react";

export default async function AdminPage() {
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

  // Fetch admin stats
  const [usersCount, groupsCount, pendingTxCount, openTicketsCount, totalContributions] =
    await Promise.all([
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("groups").select("id", { count: "exact", head: true }),
      supabase
        .from("transactions")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending"),
      supabase
        .from("support_tickets")
        .select("id", { count: "exact", head: true })
        .eq("status", "open"),
      supabase.from("profiles").select("total_paid"),
    ]);

  const totalAmount =
    totalContributions.data?.reduce((sum, p) => sum + Number(p.total_paid || 0), 0) || 0;

  const stats = [
    {
      title: "Total Users",
      value: usersCount.count || 0,
      icon: Users,
      href: "/admin/users",
    },
    {
      title: "Active Groups",
      value: groupsCount.count || 0,
      icon: Wallet,
      href: "/admin/groups",
    },
    {
      title: "Pending Transactions",
      value: pendingTxCount.count || 0,
      icon: History,
      href: "/admin/transactions",
    },
    {
      title: "Open Tickets",
      value: openTicketsCount.count || 0,
      icon: MessageSquare,
      href: "/admin/tickets",
    },
  ];

  const quickActions = [
    {
      title: "Create Group",
      description: "Add a new savings group",
      icon: PlusCircle,
      href: "/admin/groups/new",
    },
    {
      title: "Manage Users",
      description: "View and manage user accounts",
      icon: Users,
      href: "/admin/users",
    },
    {
      title: "Verify Transactions",
      description: "Approve or decline payments",
      icon: History,
      href: "/admin/transactions",
    },
    {
      title: "Announcements",
      description: "Post announcements to users",
      icon: Bell,
      href: "/admin/announcements",
    },
    {
      title: "Support Tickets",
      description: "Respond to user inquiries",
      icon: MessageSquare,
      href: "/admin/tickets",
    },
    {
      title: "Platform Settings",
      description: "Configure platform settings",
      icon: Settings,
      href: "/admin/settings",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="h-8 w-8 text-gold" />
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage your Rejoice Ajo platform
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.href} href={stat.href}>
            <Card className="glass-card border-border/50 hover:border-gold/30 transition-colors cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-gold" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {stat.value}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Total Platform Value */}
      <Card className="glass-card border-gold/20">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Total Platform Contributions
              </p>
              <p className="text-3xl font-bold text-gold">
                {formatCurrency(totalAmount)}
              </p>
            </div>
            <Wallet className="h-12 w-12 text-gold opacity-50" />
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Quick Actions
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href}>
              <Card className="glass-card border-border/50 hover:border-gold/30 transition-colors cursor-pointer h-full">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0">
                      <action.icon className="h-5 w-5 text-gold" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">
                        {action.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {action.description}
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
