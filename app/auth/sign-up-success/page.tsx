import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Crown, Mail, CheckCircle2 } from "lucide-react";

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="glass-card p-8 border border-gold/20">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Mail className="h-16 w-16 text-gold" />
              <CheckCircle2 className="h-6 w-6 text-green-500 absolute -bottom-1 -right-1 bg-background rounded-full" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-2">
            Check Your Email
          </h1>
          <p className="text-muted-foreground mb-6">
            We&apos;ve sent a confirmation link to your email address. Please
            click the link to verify your account and start your premium savings
            journey.
          </p>

          <div className="bg-gold/10 border border-gold/20 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 text-sm text-gold">
              <Crown className="h-4 w-4" />
              <span>Your Rejoice Ajo account is almost ready!</span>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              asChild
              className="w-full bg-gold hover:bg-gold/90 text-black font-semibold"
            >
              <Link href="/auth/login">Go to Login</Link>
            </Button>
            <Button asChild variant="outline" className="w-full border-border">
              <Link href="/">Return Home</Link>
            </Button>
          </div>

          <p className="text-xs text-muted-foreground mt-6">
            Didn&apos;t receive the email? Check your spam folder or contact
            support.
          </p>
        </div>
      </div>
    </div>
  );
}
