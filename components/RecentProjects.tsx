import { FaLocationArrow } from "react-icons/fa6";
import Image from "next/image";
import { getAllProjects } from "@/lib/actions/project.actions";
import Link from "next/link";
import MagicButton from "./MagicButton";

const RecentProjects = async () => {
  const projects = await getAllProjects();

  const categories = {
    WebApps: projects.filter((p: any) => p.category === "WebApps"),
    MobileApps: projects.filter((p: any) => p.category === "MobileApps"),
    Games: projects.filter((p: any) => p.category === "Games"),
  };

  const interleavedProjects: any[] = [];
  const maxLength = Math.max(
    categories.WebApps.length,
    categories.MobileApps.length,
    categories.Games.length,
  );

  for (let i = 0; i < maxLength; i++) {
    if (categories.WebApps[i]) interleavedProjects.push(categories.WebApps[i]);
    if (categories.MobileApps[i])
      interleavedProjects.push(categories.MobileApps[i]);
    if (categories.Games[i]) interleavedProjects.push(categories.Games[i]);
  }

  const displayedProjects = interleavedProjects.slice(0, 9);

  return (
    <section id="projects" className="py-20 bg-black text-white">
      {/* Heading */}
      <div className="text-center px-6">
        <h1 className="text-3xl md:text-5xl font-semibold">Selected Work</h1>
        <p className="text-white/60 mt-3 text-sm md:text-base">
          A curated set of recent projects across web, mobile, and games.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-16 px-6 max-w-7xl mx-auto">
        {displayedProjects.map((item: any) => (
          <Link
            key={item._id}
            href={`/projects/${item._id}`}
            className="group block border border-white/25 rounded-xl overflow-hidden transition hover:shadow-lg p-4"
          >
            {/* Image */}
            <div className="relative overflow-hidden rounded-xl border border-white/10">
              <Image
                src={item.image || "/assets/images/ArtistyCode Studio.jpg"}
                alt={item.title || "Project cover"}
                width={1200}
                height={800}
                className="w-full h-[220px] object-cover transition duration-500 group-hover:scale-105"
              />
            </div>

            {/* Content */}
            <div className="mt-4 space-y-2">
              <h2 className="text-lg md:text-xl font-medium group-hover:text-white/80 transition">
                {item.title}
              </h2>

              <p className="text-sm text-white/50 line-clamp-2">
                {item.description}
              </p>

              {/* Meta */}
              <div className="flex items-center justify-between text-xs text-white/40 pt-2">
                <span>{item.stack}</span>
                <span>{item.category}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* CTA */}
      {projects.length > 9 && (
        <div className="flex justify-center mt-16">
          <Link href="/projects">
            <MagicButton
              title="View All Projects"
              icon={<FaLocationArrow />}
              position="right"
            />
          </Link>
        </div>
      )}
    </section>
  );
};

export default RecentProjects;
