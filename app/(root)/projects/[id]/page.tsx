import MagicButton from "@/components/MagicButton";
import AdSense from "@/components/AdSense";
import { getProjectById } from "@/lib/actions/project.actions";
import Link from "next/link";
import { FaLocationArrow } from "react-icons/fa6";
import ProjectHero from "@/components/ProjectHero";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params;
  const project = await getProjectById(resolvedParams.id);

  if (!project) {
    return {
      title: "Project Not Found | Projects",
      description: "This project does not exist or has been removed.",
    };
  }

  return {
    title: `${project.title} | ArtistyCode Studio Project`,
    description: project.description ?? "Explore this project in detail.",
    keywords: [
      project.title,
      project.category,
      ...(project.stack || []),
      "ArtistyCode Studio projects",
      "Next.js development",
      "MERN stack applications",
      "cloud solutions",
      "software company Bangladesh",
    ],
    openGraph: {
      title: `${project.title} | ArtistyCode Studio`,
      description: project.description ?? "Explore this project in detail.",
      url: `https://artistycode.com/projects/${project._id}`,
      siteName: "ArtistyCode Studio",
      images: project.image
        ? [{ url: project.image, width: 1200, height: 630, alt: project.title }]
        : [],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} | ArtistyCode Studio`,
      description: project.description ?? "Explore this project in detail.",
      images: project.image ? [project.image] : [],
    },
  };
}

const ProjectDetails = async ({ params }: PageProps) => {
  const resolvedParams = await params;
  const project = await getProjectById(resolvedParams.id);

  if (!project) {
    return (
      <section className="flex justify-center items-center h-[70vh] bg-black text-white">
        <p className="text-xl">Project not found.</p>
      </section>
    );
  }

  return (
    <section className="bg-black-100 text-white min-h-screen relative overflow-hidden pt-40 pb-32">
      {/* Premium Lighting Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[50%] h-[50%] lighting-radial opacity-30" />
        <div className="absolute bottom-0 left-0 w-[50%] h-[50%] lighting-radial opacity-20" />
      </div>

      <div className="wrapper relative z-10 space-y-24">
        {/* Back Link */}
        <div className="flex justify-start">
          <Link href="/projects" className="text-xs font-bold tracking-[0.2em] text-white/30 hover:text-white transition-all transition-all flex items-center gap-2 group">
            <span className="group-hover:-translate-x-1 transition-transform">←</span> BACK TO PROJECTS
          </Link>
        </div>

        {/* Hero Section */}
        <ProjectHero
          image={project.image}
          title={project.title}
          stack={project.stack}
          category={project.category}
        />

        {/* Project Info */}
        <div className="grid lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-8">
            <h2 className="text-2xl md:text-4xl font-black italic tracking-tighter text-shine">OVERVIEW</h2>
            <p className="text-white/60 leading-relaxed text-lg font-light whitespace-pre-line">
              {project.description}
            </p>
          </div>

          <div className="space-y-12">
            <div className="glass p-8 rounded-[2rem] border border-white/5">
              <h3 className="text-sm font-bold tracking-[0.3em] text-white/20 uppercase mb-6 italic">PROJECT LINK</h3>
              {project.url ? (
                <Link
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <MagicButton
                    title="Live Preview"
                    icon={<FaLocationArrow />}
                    position="right"
                    otherClasses="w-full"
                  />
                </Link>
              ) : (
                <p className="text-white/30 italic text-sm font-light">Internal/Sensitive Project</p>
              )}
            </div>

            <div className="flex flex-col gap-2 px-4">
              <p className="text-[10px] font-bold tracking-[0.3em] text-white/20 uppercase mb-2">TECHNICAL STACK</p>
              <div className="flex flex-wrap gap-2">
                {(project.stack || "").split(",").map((s: string) => (
                  <span key={s} className="px-3 py-1 glass rounded text-[10px] uppercase font-bold text-white/40 tracking-widest">{s.trim()}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* AdSense Placement */}
        <AdSense className="mt-16" />
      </div>
    </section>
  );
};

export default ProjectDetails;
