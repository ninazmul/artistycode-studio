import ProjectFilters from "@/components/ProjectFilters";
import { getAllProjects } from "@/lib/actions/project.actions";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects | ArtistyCode Studio",
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
    title: "Projects | ArtistyCode Studio",
    description:
      "Discover ArtistyCode Studio — building scalable, enterprise-grade web and mobile solutions with precision and design excellence.",
    url: "https://artistycode.com/projects",
    siteName: "ArtistyCode Studio",
    images: [
      {
        url: "/assets/og-image.png",
        width: 1200,
        height: 630,
        alt: "ArtistyCode Studio Projects",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects | ArtistyCode Studio",
    description:
      "Scalable web, mobile, and software solutions engineered for modern businesses.",
    images: ["/assets/og-image.png"],
  },
};

export default async function Page() {
  const projects = await getAllProjects();
  return (
    <section className="bg-black-100 text-white relative overflow-hidden py-24 lg:py-32 min-h-screen">
      {/* Premium Lighting Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[50%] h-[50%] lighting-radial opacity-30" />
        <div className="absolute bottom-0 left-0 w-[50%] h-[50%] lighting-radial opacity-20" />
      </div>

      <div className="wrapper relative z-10 flex flex-col items-center">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-white/5 mb-8">
            <p className="uppercase tracking-[0.3em] text-[10px] md:text-xs font-semibold text-white/50">
              CURATED PORTFOLIO
            </p>
          </div>
          <h1 className="heading mb-6 italic">SELECTED PROJECTS</h1>
          <p className="text-white/40 max-w-xl mx-auto text-base md:text-lg font-light leading-relaxed">
            Engineering excellence across web, mobile, and complex software systems.
          </p>
        </div>
        
        <ProjectFilters projects={projects} />
      </div>
    </section>
  );
}
