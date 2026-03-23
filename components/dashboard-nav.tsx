"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import type { Profile } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Crown,
  LayoutDashboard,
  Users,
  Wallet,
  History,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
  Menu,
  ChevronDown,
  Shield,
} from "lucide-react";
import { toast } from "sonner";

interface DashboardNavProps {
  user: User;
  profile: Profile;
}

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/groups", label: "My Groups", icon: Users },
  { href: "/savings", label: "Savings", icon: Wallet },
  { href: "/transactions", label: "Transactions", icon: History },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/support", label: "Support", icon: HelpCircle },
  { href: "/profile", label: "Profile", icon: Settings },
];

const adminItems = [
  { href: "/admin", label: "Admin Panel", icon: Shield },
];

export function DashboardNav({ user, profile }: DashboardNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isAdmin = profile.role === "admin";
  const allNavItems = isAdmin ? [...navItems, ...adminItems] : navItems;

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    router.push("/");
    router.refresh();
  }

  const NavContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-border/50">
        <Link href="/" className="flex items-center gap-2">
          <Crown className="h-8 w-8 text-gold" />
          <span className="text-xl font-bold bg-gradient-to-r from-gold-dim via-gold to-gold-glow bg-clip-text text-transparent">
            Rejoice Ajo
          </span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {allNavItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-gold/10 text-gold border border-gold/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-full bg-gold/20 flex items-center justify-center">
            <span className="text-gold font-semibold">
              {profile.first_name?.[0]}{profile.last_name?.[0]}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-foreground truncate">
              {profile.first_name} {profile.last_name}
            </div>
            <div className="text-xs text-muted-foreground truncate">
              @{profile.username}
            </div>
          </div>
          {profile.is_vip && (
            <span className="px-2 py-0.5 rounded-full bg-gold/20 text-gold text-xs font-medium">
              VIP
            </span>
          )}
        </div>
        <Button
          variant="outline"
          className="w-full border-border"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-72 bg-card/50 backdrop-blur-xl border-r border-border/50">
        <NavContent />
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 bg-card/80 backdrop-blur-xl border-b border-border/50">
        <div className="flex items-center justify-between h-full px-4">
          <Link href="/" className="flex items-center gap-2">
            <Crown className="h-6 w-6 text-gold" />
            <span className="font-bold bg-gradient-to-r from-gold-dim via-gold to-gold-glow bg-clip-text text-transparent">
              Rejoice Ajo
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <div className="h-8 w-8 rounded-full bg-gold/20 flex items-center justify-center">
                    <span className="text-gold text-sm font-semibold">
                      {profile.first_name?.[0]}{profile.last_name?.[0]}
                    </span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{profile.first_name} {profile.last_name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <Settings className="h-4 w-4 mr-2" />
                    Profile Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-72">
                <NavContent />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  );
}
