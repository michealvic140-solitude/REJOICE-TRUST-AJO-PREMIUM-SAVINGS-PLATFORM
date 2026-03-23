import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import { User, Crown, Shield, Wallet, Calendar } from "lucide-react";
import { ProfileForm } from "@/components/profile-form";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user!.id)
    .single();

  if (!profile) {
    return <div>Profile not found</div>;
  }

  const trustScore = Math.min(100, Math.floor((profile.total_paid || 0) / 10000));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Profile Settings
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your account information
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Overview */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="glass-card border-border/50">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="h-20 w-20 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-gold">
                    {profile.first_name?.[0]}
                    {profile.last_name?.[0]}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-foreground">
                  {profile.first_name} {profile.middle_name} {profile.last_name}
                </h2>
                <p className="text-muted-foreground">@{profile.username}</p>
                <div className="flex items-center justify-center gap-2 mt-3">
                  {profile.is_vip && (
                    <Badge className="bg-gold/20 text-gold">
                      <Crown className="h-3 w-3 mr-1" />
                      VIP
                    </Badge>
                  )}
                  <Badge variant="secondary" className="capitalize">
                    {profile.role}
                  </Badge>
                </div>
              </div>

              <Separator className="my-6 bg-border/50" />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Trust Score
                  </span>
                  <span className="font-semibold text-gold">{trustScore}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-gold h-2 rounded-full transition-all"
                    style={{ width: `${trustScore}%` }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Total Contributed
                  </span>
                  <span className="font-semibold text-foreground">
                    {formatCurrency(profile.total_paid || 0)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Active Slots
                  </span>
                  <span className="font-semibold text-foreground">
                    {profile.active_slots || 0}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Member Since
                  </span>
                  <span className="font-semibold text-foreground">
                    {new Date(profile.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Status */}
          <Card className="glass-card border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-5 w-5 text-gold" />
                Account Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                {profile.is_banned ? (
                  <Badge variant="destructive">Banned</Badge>
                ) : profile.is_frozen ? (
                  <Badge variant="secondary">Frozen</Badge>
                ) : profile.is_restricted ? (
                  <Badge variant="secondary">Restricted</Badge>
                ) : (
                  <Badge className="bg-green-500/20 text-green-500">
                    Active
                  </Badge>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Email
                </span>
                <span className="text-sm text-foreground">{user?.email}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Form */}
        <div className="lg:col-span-2">
          <Card className="glass-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-gold" />
                Edit Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ProfileForm profile={profile} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
