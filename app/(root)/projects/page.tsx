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
    <section className="bg-black text-white px-6 py-8">
      <div className="text-center">
        <h1 className="text-3xl md:text-5xl font-semibold">Projects</h1>
        <p className="text-white/60 mt-4 text-sm">
          Selected work across web, mobile, and software systems
        </p>
      </div>
      <ProjectFilters projects={projects} />
    </section>
  );
}
