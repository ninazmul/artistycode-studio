import ResourceFilters from "@/components/ResourceFilters";
import AdSense from "@/components/AdSense";
import { cachedGetAllResources } from "@/lib/cache";
import { Metadata } from "next";

// ISR: regenerate at most every 1 hour
export const revalidate = 3600;


export const metadata: Metadata = {
  title: "Resources | ArtistyCode Studio",
  description:
    "ArtistyCode Studio is a premium full-stack software company specializing in scalable web, mobile, and cloud solutions. We deliver enterprise-grade platforms with precision, performance, and design excellence.",
  keywords: [
    "ArtistyCode Studio",
    "web development company",
    "Next.js agency",
    "MERN stack development",
    "mobile app development",
    "software solutions Bangladesh",
    "cloud-native platforms",
    "UI/UX design",
    "scalable systems",
    "digital transformation",
  ],
  openGraph: {
    title: "Resources | ArtistyCode Studio",
    description:
      "Discover ArtistyCode Studio — building scalable, enterprise-grade web and mobile solutions with precision and design excellence.",
    url: "https://artistycode.com/resources",
    siteName: "ArtistyCode Studio",
    images: [
      {
        url: "/assets/og-image.png",
        width: 1200,
        height: 630,
        alt: "ArtistyCode Studio Resources",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Resources | ArtistyCode Studio",
    description:
      "Scalable web, mobile, and software solutions engineered for modern businesses.",
    images: ["/assets/og-image.png"],
  },
};

export default async function Page() {
  const resources = await cachedGetAllResources();

  return (
    <section className="bg-black-100 text-white relative overflow-hidden pt-40 pb-32 min-h-screen">
      {/* Premium Lighting Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[50%] h-[50%] lighting-radial opacity-30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full lighting-radial opacity-10" />
      </div>

      <div className="wrapper relative z-10 flex flex-col items-center">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-white/5 mb-8">
            <p className="uppercase tracking-[0.3em] text-[10px] md:text-xs font-semibold text-white/50">
              SOFTWARE ASSETS
            </p>
          </div>
          <h1 className="heading mb-6 italic">PREMIUM RESOURCES</h1>
          <p className="text-white/40 max-w-xl mx-auto text-base md:text-lg font-light leading-relaxed">
            Professional tools, systems, and architectural templates engineered 
            to accelerate your digital product lifecycle.
          </p>
        </div>
        
        <ResourceFilters resources={resources} />

        {/* Hostinger Partner Deployment Banner */}
        <div className="w-full mt-20 rounded-2xl glass border border-purple-500/20 bg-gradient-to-r from-purple-950/30 via-white/[0.02] to-indigo-950/30 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col text-center md:text-left">
            <span className="text-[10px] uppercase font-bold tracking-widest text-purple-300 mb-1">
              Official Hosting Partner
            </span>
            <h3 className="text-xl md:text-2xl font-bold italic text-shine">
              Need reliable hosting for these templates?
            </h3>
            <p className="text-white/50 text-sm mt-1">
              Deploy with Hostinger & get up to <strong className="text-white">20% discount</strong> with coupon <code className="text-purple-300 font-mono font-bold bg-white/5 px-2 py-0.5 rounded border border-purple-500/30">ACSTUDIO</code>.
            </p>
          </div>

          <a
            href="https://www.hostinger.com?REFERRALCODE=ACSTUDIO"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-purple-600/30 transition-all hover:scale-105"
          >
            Get Hostinger Deal ↗
          </a>
        </div>
        
        <AdSense className="mt-16" />
      </div>
    </section>
  );
}
