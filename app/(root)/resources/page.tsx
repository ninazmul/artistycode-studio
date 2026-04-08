import Image from "next/image";
import Link from "next/link";
import { getAllResources } from "@/lib/actions/resource.actions";

const categories = [
  "All",
  "WebApps",
  "MobileApps",
  "Games",
  "WordPress",
  "CMS Themes",
  "UI Templates",
  "Other Scripts",
];

export default async function Page({
  searchParams,
}: {
  searchParams: {
    category?: string;
    type?: string; // free | paid
  };
}) {
  const resources = await getAllResources();

  const selectedCategory = searchParams.category || "All";
  const selectedType = searchParams.type || "all";

  let filtered = resources;

  // Category filter
  if (selectedCategory !== "All") {
    filtered = filtered.filter((r: any) => r.category === selectedCategory);
  }

  // Free / Paid filter
  if (selectedType === "free") {
    filtered = filtered.filter((r: any) => r.isFree);
  } else if (selectedType === "paid") {
    filtered = filtered.filter((r: any) => !r.isFree);
  }

  return (
    <section className="bg-black text-white px-6 py-8">
      {/* Heading */}
      <div className="text-center">
        <h1 className="text-3xl md:text-5xl font-semibold">Resources</h1>
        <p className="text-white/60 mt-4 text-sm">
          Premium tools, templates, and systems to accelerate your workflow
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col items-center gap-4 mt-10">
        {/* Category */}
        <div className="flex justify-center gap-3 flex-wrap">
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/resources?category=${cat}&type=${selectedType}`}
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

        {/* Type */}
        <div className="flex gap-3">
          {["all", "free", "paid"].map((type) => (
            <Link
              key={type}
              href={`/resources?category=${selectedCategory}&type=${type}`}
              className={`px-4 py-2 rounded-md text-sm border transition capitalize ${
                selectedType === type
                  ? "bg-white text-black border-white"
                  : "border-white/20 text-white/60 hover:text-white"
              }`}
            >
              {type}
            </Link>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 my-16 max-w-6xl mx-auto">
        {filtered.map((r: any) => (
          <Link
            key={r._id}
            href={`/resources/${r._id}`}
            className="group block border border-white/20 rounded-md overflow-hidden transition hover:shadow-lg p-4"
          >
            {/* Image */}
            <div className="relative overflow-hidden rounded-md border border-white/10">
              <Image
                src={r.image || "/assets/images/ArtistyCode Studio.jpg"}
                alt={r.title || "Resource cover"}
                width={1200}
                height={800}
                className="w-full h-[220px] object-cover transition duration-500 group-hover:scale-105"
              />

              {/* Price Badge */}
              <div className="absolute top-3 right-3 bg-black/70 backdrop-blur px-3 py-1 text-xs rounded-md border border-white/20">
                {r.isFree ? "Free" : `$${r.price}`}
              </div>
            </div>

            {/* Content */}
            <div className="mt-4 space-y-2">
              <h2 className="text-lg md:text-xl font-medium group-hover:text-white/80 transition line-clamp-1">
                {r.title}
              </h2>

              <p className="text-sm text-white/50 line-clamp-2">
                {r.description}
              </p>

              {/* Meta */}
              <div className="flex items-center justify-between text-xs text-white/40 pt-2">
                <span>{r.category}</span>
                <span>{r.isFree ? "Free Resource" : "Premium"}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Empty */}
      {filtered.length === 0 && (
        <p className="text-center text-white/50 mt-20">No resources found.</p>
      )}
    </section>
  );
}
