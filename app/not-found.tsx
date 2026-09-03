import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col items-center justify-center px-4 text-center">
      <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-400 mb-2">
        404 — Page Not Found
      </span>
      <h1 className="text-4xl sm:text-6xl font-black italic tracking-tight text-white mb-3">
        Lost in Cyberspace
      </h1>
      <p className="text-sm text-white/50 max-w-md mb-8">
        The requested page could not be located or may have been moved. Return to the homepage to continue exploring.
      </p>
      <Button asChild className="rounded-xl bg-white text-black hover:bg-white/90 font-semibold text-xs px-6 h-10">
        <Link href="/" className="flex items-center gap-2">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Homepage
        </Link>
      </Button>
    </div>
  );
}
