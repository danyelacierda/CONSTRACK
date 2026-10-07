import { SignUp } from "@clerk/nextjs";
import { Activity } from "lucide-react";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background industrial grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293715_1px,transparent_1px),linear-gradient(to_bottom,#1f293715_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      
      {/* Brand Header */}
      <div className="mb-8 flex flex-col items-center text-center z-10">
        <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary mb-3 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
          <Activity className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-bold tracking-wider font-mono text-foreground">
          CONS<span className="text-primary">TRACK</span>
        </h1>
        <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">
          New Personnel Registration
        </p>
      </div>

      {/* Clerk Sign Up Component */}
      <div className="z-10 shadow-2xl rounded-2xl border border-border/60 backdrop-blur-sm bg-card/60 p-1">
        <SignUp
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
          fallbackRedirectUrl="/dashboard"
        />
      </div>

      <div className="mt-8 text-center text-xs text-muted-foreground z-10 font-mono">
        Authorized Personnel Only — Multi-Factor Protected
      </div>
    </div>
  );
}
