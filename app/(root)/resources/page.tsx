import ResourceFilters from "@/components/ResourceFilters";
import { getAllResources } from "@/lib/actions/resource.actions";
import { Metadata } from "next";

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
  const resources = await getAllResources();
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
      </div>
    </section>
  );
}
