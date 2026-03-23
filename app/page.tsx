import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Crown,
  Shield,
  Users,
  TrendingUp,
  Star,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Lock,
  Zap,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";

async function getLeaderboard() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("id, username, first_name, last_name, total_paid, is_vip, profile_picture")
    .order("total_paid", { ascending: false })
    .limit(5);
  return data || [];
}

async function getAnnouncements() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("announcements")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(3);
  return data || [];
}

export default async function LandingPage() {
  const [leaderboard, announcements] = await Promise.all([
    getLeaderboard(),
    getAnnouncements(),
  ]);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Crown className="h-8 w-8 text-gold" />
            <span className="text-xl font-bold bg-gradient-to-r from-gold-dim via-gold to-gold-glow bg-clip-text text-transparent">
              Rejoice Ajo
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
              How It Works
            </Link>
            <Link href="#leaderboard" className="text-muted-foreground hover:text-foreground transition-colors">
              Leaderboard
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" className="text-foreground">
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button asChild className="bg-gold hover:bg-gold/90 text-black font-semibold">
              <Link href="/auth/sign-up">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 text-gold text-sm mb-6">
            <Sparkles className="h-4 w-4" />
            Nigeria&apos;s Most Trusted Ajo Platform
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            Premium Rotating Savings for{" "}
            <span className="bg-gradient-to-r from-gold-dim via-gold to-gold-glow bg-clip-text text-transparent">
              Modern Nigerians
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
            Join trusted savings circles, build your financial reputation, and access
            premium benefits with our secure digital Ajo platform.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="bg-gold hover:bg-gold/90 text-black font-semibold px-8">
              <Link href="/auth/sign-up">
                Start Saving Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-border">
              <Link href="#how-it-works">Learn More</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-gold">10K+</div>
              <div className="text-sm text-muted-foreground mt-1">Active Members</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-gold">500+</div>
              <div className="text-sm text-muted-foreground mt-1">Savings Groups</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-gold">99.9%</div>
              <div className="text-sm text-muted-foreground mt-1">Payout Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-card/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose Rejoice Ajo?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Experience the future of traditional savings with our secure, transparent,
              and rewarding platform.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Shield,
                title: "Bank-Level Security",
                description: "Your funds and data are protected with enterprise-grade encryption and security protocols.",
              },
              {
                icon: Users,
                title: "Trusted Community",
                description: "Join verified members with transparent trust scores and proven track records.",
              },
              {
                icon: TrendingUp,
                title: "Build Your Score",
                description: "Every successful contribution increases your trust score and unlocks premium benefits.",
              },
              {
                icon: Zap,
                title: "Instant Payouts",
                description: "Receive your contributions directly to your bank account within 24 hours.",
              },
              {
                icon: Lock,
                title: "Guaranteed Slots",
                description: "Your slot is secured the moment you join. No surprises, no delays.",
              },
              {
                icon: Star,
                title: "VIP Rewards",
                description: "Top contributors earn VIP status with exclusive perks and priority support.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="glass-card p-6 border border-border/50 hover:border-gold/30 transition-colors"
              >
                <div className="h-12 w-12 rounded-lg bg-gold/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-gold" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground">
              Get started in three simple steps
            </p>
          </div>
          <div className="space-y-8">
            {[
              {
                step: "01",
                title: "Create Your Account",
                description: "Sign up with your details and complete your profile verification to build trust.",
              },
              {
                step: "02",
                title: "Join a Savings Group",
                description: "Browse available groups and select a slot that matches your savings goal.",
              },
              {
                step: "03",
                title: "Contribute & Collect",
                description: "Make your contributions on time and receive your payout when your turn comes.",
              },
            ].map((item, index) => (
              <div key={index} className="flex gap-6 items-start">
                <div className="flex-shrink-0 h-14 w-14 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center">
                  <span className="text-gold font-bold">{item.step}</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leaderboard Section */}
      <section id="leaderboard" className="py-20 px-4 bg-card/30">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Top Contributors
            </h2>
            <p className="text-muted-foreground">
              Our most trusted members leading by example
            </p>
          </div>
          <div className="glass-card border border-border/50 overflow-hidden">
            {leaderboard.length > 0 ? (
              <div className="divide-y divide-border/50">
                {leaderboard.map((user, index) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-4 p-4 hover:bg-muted/20 transition-colors"
                  >
                    <div className="flex-shrink-0 w-8 text-center">
                      {index === 0 ? (
                        <Crown className="h-6 w-6 text-gold mx-auto" />
                      ) : (
                        <span className="text-muted-foreground font-medium">
                          #{index + 1}
                        </span>
                      )}
                    </div>
                    <div className="h-10 w-10 rounded-full bg-gold/20 flex items-center justify-center">
                      <span className="text-gold font-semibold">
                        {user.first_name?.[0]}{user.last_name?.[0]}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">
                          {user.first_name} {user.last_name}
                        </span>
                        {user.is_vip && (
                          <span className="px-2 py-0.5 rounded-full bg-gold/20 text-gold text-xs font-medium">
                            VIP
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        @{user.username}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gold">
                        ₦{Number(user.total_paid).toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Total Contributed
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Be the first to join and top the leaderboard!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Announcements */}
      {announcements.length > 0 && (
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Latest Updates
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {announcements.map((announcement) => (
                <div
                  key={announcement.id}
                  className="glass-card p-6 border border-border/50"
                >
                  <div className="text-xs text-gold mb-2 uppercase tracking-wide">
                    {announcement.type}
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {announcement.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {announcement.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="glass-card p-8 md:p-12 border border-gold/20 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-gold/5 via-gold/10 to-gold/5" />
            <div className="relative">
              <Crown className="h-16 w-16 text-gold mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Ready to Start Your Savings Journey?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Join thousands of Nigerians building their financial future with
                Rejoice Ajo. Your first group awaits!
              </p>
              <Button
                asChild
                size="lg"
                className="bg-gold hover:bg-gold/90 text-black font-semibold px-8"
              >
                <Link href="/auth/sign-up">
                  Create Free Account
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border/50">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Crown className="h-6 w-6 text-gold" />
              <span className="font-bold bg-gradient-to-r from-gold-dim via-gold to-gold-glow bg-clip-text text-transparent">
                Rejoice Ajo
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="/terms" className="hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              <Link href="/privacy" className="hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="/support" className="hover:text-foreground transition-colors">
                Support
              </Link>
            </div>
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Rejoice Trust Ajo. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
