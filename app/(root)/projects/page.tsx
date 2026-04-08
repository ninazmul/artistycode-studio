import Image from "next/image";
import Link from "next/link";
import { getAllProjects } from "@/lib/actions/project.actions";

const categories = ["All", "WebApps", "MobileApps", "Games"];

export default async function Page({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const projects = await getAllProjects();

  const selectedCategory = searchParams.category || "All";

  const filtered =
    selectedCategory === "All"
      ? projects
      : projects.filter((p: any) => p.category === selectedCategory);

  return (
    <section className="bg-black text-white px-6">
      {/* Heading */}
      <div className="text-center">
        <h1 className="text-3xl md:text-5xl font-semibold">Projects</h1>
        <p className="text-white/60 mt-4 text-sm">
          Selected work across web, mobile, and software systems
        </p>
      </div>

      {/* Filters */}
      <div className="flex justify-center gap-3 mt-10 flex-wrap">
        {categories.map((cat) => (
          <Link
            key={cat}
            href={`/projects?category=${cat}`}
            className={`px-4 py-2 rounded-md text-sm border transition ${
              selectedCategory === cat
                ? "bg-white text-black border-white"
                : "border-white/20 text-white/60 hover:text-white"
            }`}
          >
            {cat}
          </Link>
        ))}
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 my-16 max-w-6xl mx-auto">
        {filtered.map((p: any) => (
          <Link
            key={p._id}
            href={`/projects/${p._id}`}
            className="group block border border-white/25 rounded-md overflow-hidden transition hover:shadow-lg p-4"
          >
            {/* Image */}
            <div className="relative overflow-hidden rounded-md border border-white/10">
              <Image
                src={p.image || "/assets/images/ArtistyCode Studio.jpg"}
                alt={p.title || "Project cover"}
                width={1200}
                height={800}
                className="w-full h-[220px] object-cover transition duration-500 group-hover:scale-105"
              />
            </div>

            {/* Content */}
            <div className="mt-4 space-y-2">
              <h2 className="text-lg md:text-xl font-medium group-hover:text-white/80 transition line-clamp-1">
                {p.title}
              </h2>

              <p className="text-sm text-white/50 line-clamp-2">
                {p.description}
              </p>

              {/* Meta */}
              <div className="flex items-center justify-between text-xs text-white/40 pt-2">
                <span>{p.stack}</span>
                <span>{p.category}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <p className="text-center text-white/50 mt-20">No projects found.</p>
      )}
    </section>
  );
}
