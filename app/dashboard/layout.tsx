import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { isAdmin } from "@/lib/actions/admin.actions";
import { getUserEmailById } from "@/lib/actions/user.actions";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import AdminSidebar from "./components/AdminSidebar";
import { cookies } from "next/headers";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { isModerator } from "@/lib/actions/moderator.actions";
import { Toaster } from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";
export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";

  const { sessionClaims } = await auth();
  const userId = sessionClaims?.userId as string;

  // Parallelize auth checks — was sequential (2 DB round-trips), now 1 parallel batch
  const email = await getUserEmailById(userId);
  const [adminStatus, moderatorStatus] = await Promise.all([
    isAdmin(email),
    isModerator(email),
  ]);

  if (!adminStatus && !moderatorStatus) {
    redirect("/");
  }

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AdminSidebar adminStatus={adminStatus} moderatorStatus={moderatorStatus} />
      <main className="flex-1 h-screen mx-auto overflow-y-auto bg-[#080808]">
        {/* Premium Topbar */}
        <header className="sticky top-0 z-50 flex items-center justify-between px-5 py-3 border-b border-white/[0.06] bg-[#0a0a0a]/90 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="text-white/60 hover:text-white transition-colors" />
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-medium tracking-widest text-white/40 uppercase">
                Control Panel
              </span>
            </div>
          </div>

          <Link href="/" className="absolute left-1/2 -translate-x-1/2">
            <Image
              src="/assets/images/logo.png"
              width={120}
              height={30}
              alt="ArtistyCode Studio"
              className="opacity-80 hover:opacity-100 transition-opacity"
            />
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-medium text-white/50 tracking-wide">
              {adminStatus ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  Admin
                </>
              ) : (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  Moderator
                </>
              )}
            </div>
            <SignedIn>
              <UserButton afterSwitchSessionUrl="/" />
            </SignedIn>
          </div>
        </header>

        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#111",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px",
              fontSize: "13px",
            },
          }}
        />
        {children}
      </main>
    </SidebarProvider>
  );
}
