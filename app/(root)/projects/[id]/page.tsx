import MagicButton from "@/components/MagicButton";
import { getProjectById } from "@/lib/actions/project.actions";
import Link from "next/link";
import { FaLocationArrow } from "react-icons/fa6";
import ProjectHero from "@/components/ProjectHero";
import type { Metadata } from "next";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const project = await getProjectById(resolvedParams.id);

  if (!project) {
    return {
      title: "Project Not Found | ArtistyCode Studio",
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
    <section className="bg-black text-white min-h-screen py-16 px-6">
      <div className="max-w-6xl mx-auto space-y-20">
        {/* Hero Section */}
        <ProjectHero
          image={project.image}
          title={project.title}
          stack={project.stack}
          category={project.category}
        />

        {/* Project Info */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Project Overview</h2>
            <p className="text-white/90 leading-relaxed whitespace-pre-line">
              {project.description}
            </p>
          </div>

          {/* Tech Stack */}
          {project.stack?.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-medium">Technologies Used</h3>
              <p className="text-white/70">
                {project.stack.join(", ")} — engineered for scalability,
                performance, and maintainability.
              </p>
            </div>
          )}

          {/* Category */}
          {project.category && (
            <div className="space-y-4">
              <h3 className="text-xl font-medium">Category</h3>
              <p className="text-white/70">{project.category}</p>
            </div>
          )}

          {/* Live Link */}
          {project.url && (
            <div className="flex justify-center mt-6">
              <Link
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MagicButton
                  title="View Live Project"
                  icon={<FaLocationArrow />}
                  position="right"
                />
              </Link>
            </div>
          )}

          {/* Internal Link */}
          <div className="mt-10 text-center">
            <Link href="/projects" className="underline hover:text-white">
              Back to All Projects
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectDetails;
