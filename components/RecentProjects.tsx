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
    <section id="projects" className="py-32 bg-black-100 text-white relative">
      <div className="absolute top-0 right-0 w-[50%] h-[50%] lighting-radial opacity-20 pointer-events-none" />

      {/* Heading */}
      <div className="wrapper relative z-10 text-center mb-24 px-6">
        <h2 className="heading mb-6 tracking-tighter uppercase italic">SELECTED WORK</h2>
        <p className="text-white/40 max-w-xl mx-auto text-base md:text-lg font-light leading-relaxed">
          A curated selection of enterprise-grade solutions engineered for scale and efficiency.
        </p>
      </div>

      {/* Grid */}
      <div className="wrapper relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayedProjects.map((item: any) => (
          <Link
            key={item._id}
            href={`/projects/${item._id}`}
            className="group block glass rounded-2xl p-4 transition-all duration-500 ease-premium hover:-translate-y-2 hover:bg-white/[0.05] hover:border-white/20"
          >
            {/* Image Container */}
            <div className="relative overflow-hidden rounded-xl border border-white/5 aspect-[4/3]">
              <Image
                src={item.image || "/assets/images/ArtistyCode Studio.jpg"}
                alt={item.title || "Project cover"}
                fill
                className="object-cover transition duration-700 ease-premium group-hover:scale-110 group-hover:rotate-1"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black-100/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            {/* Content */}
            <div className="px-4 py-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/30 px-3 py-1 rounded-md border border-white/5 bg-white/[0.02]">
                  {item.category}
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40">
                  {new Date().getFullYear()}
                </span>
              </div>

              <h3 className="text-xl md:text-2xl font-bold tracking-tight mb-3 group-hover:text-white transition-colors">
                {item.title}
              </h3>

              <p className="text-sm text-white/50 leading-relaxed font-light line-clamp-2">
                {item.description}
              </p>

              <div className="mt-6 flex items-center justify-between">
                <div className="flex -space-x-2">
                  {/* Mock stack icons or just text if stack is a string */}
                  <span className="text-[10px] font-mono text-white/30">{item.stack}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-white/40 group-hover:text-white transition-colors">
                  <span>View Case Study</span>
                  <FaLocationArrow className="text-xs -rotate-45" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* CTA */}
      {projects.length > 9 && (
        <div className="flex justify-center mt-24">
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
