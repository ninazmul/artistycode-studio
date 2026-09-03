"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error caught by root boundary:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center px-5 py-12">
      <div className="max-w-md w-full rounded-2xl border border-red-500/20 bg-[#0d0d0d] p-8 text-center space-y-6 shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto text-red-400">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-white tracking-tight">
            Something went wrong
          </h2>
          <p className="text-sm text-white/50 leading-relaxed">
            {error?.message || "An unexpected server error occurred."}
          </p>
          {error?.digest && (
            <p className="text-[11px] font-mono text-white/30 pt-1">
              Error Digest: {error.digest}
            </p>
          )}
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Button
            onClick={() => reset()}
            className="gap-2 bg-white/10 hover:bg-white/15 text-white border border-white/10 rounded-xl px-5 h-10 text-sm font-medium transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Reload Page
          </Button>
          <Link href="/">
            <Button
              variant="outline"
              className="gap-2 border-white/10 bg-transparent hover:bg-white/5 text-white/70 hover:text-white rounded-xl px-5 h-10 text-sm font-medium transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
