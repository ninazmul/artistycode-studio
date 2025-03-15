import MagicButton from "@/components/MagicButton";
import { getProjectById } from "@/lib/actions/project.actions";
import { Code, Layout } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FaLocationArrow } from "react-icons/fa6";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
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
    title: `${project.title} | Project`,
    description: project.description ?? "Explore this project in detail.",
    keywords: [
      project.title,
      project.stack,
      project.category,
      "web development",
      "app development",
      "game development",
      "software development",
      "software project",
      "portfolio",
      "projects",
    ],
    openGraph: {
      title: `${project.title} | Project`,
      description: project.description ?? "Explore this project in detail.",
      url: project.url,
      type: "website",
      images: project.image ? [{ url: project.image, alt: project.title }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} | Project`,
      description: project.description ?? "Explore this project in detail.",
      images: project.image ? [{ url: project.image, alt: project.title }] : [],
    },
  };
}

const ProjectDetails = async ({ params }: PageProps) => {
  const resolvedParams = await params;

  const project = await getProjectById(resolvedParams.id);

  return (
    <>
      <section className="flex justify-center bg-black-100 py-10 lg:py-20">
        <div className="grid grid-cols-1 2xl:max-w-7xl">
          <div className="relative w-3/4 mx-auto m-4 rounded-lg overflow-hidden">
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
            <Image
              src={project.image}
              alt="hero image"
              width={1920}
              height={1000}
              className="relative w-full object-cover object-center rounded-xl p-1 backdrop-blur-md"
            />
          </div>

          <div className="flex w-full flex-col gap-8 p-5 md:p-10">
            <div className="flex flex-col gap-6">
              <h2 className="text-3xl font-semibold text-purple">
                {project.title}
              </h2>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex gap-3">
                  <p className="flex items-center gap-1 font-semibold rounded-full text-purple border border-purple px-4 py-2.5 text-grey-500">
                    {project.stack}
                    <Code />
                  </p>
                  <p className="flex items-center gap-1 font-semibold rounded-full text-purple border border-purple px-4 py-2.5 text-grey-500">
                    {project.category}
                    <Layout />
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-xl text-purple font-semibold">
                Project Overview:
              </p>
              <p className="p-medium-16 lg:p-regular-18">
                {project.description}
              </p>
              <div className="flex justify-center mt-10">
                <Link href={project.url} target="_blank">
                  <MagicButton
                    title="Live Link"
                    icon={<FaLocationArrow />}
                    position="right"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProjectDetails;
