"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Layout } from "lucide-react";
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

const Page = () => {
  const [resources, setResources] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [isFreeOnly, setIsFreeOnly] = useState(false);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const data = await getAllResources();
        setResources(data);
      } catch (err) {
        setError("Failed to load resources");
      }
    };

    fetchResources();
  }, []);

  const categoryMap: Record<string, any[]> = {};
  resources.forEach((resource) => {
    if (!categoryMap[resource.category]) {
      categoryMap[resource.category] = [];
    }
    categoryMap[resource.category].push(resource);
  });

  const interleavedAllResources: any[] = [];
  const allCategoryKeys = Object.keys(categoryMap);
  const maxLength = Math.max(
    ...allCategoryKeys.map((key) => categoryMap[key].length)
  );

  for (let i = 0; i < maxLength; i++) {
    for (const key of allCategoryKeys) {
      if (categoryMap[key][i]) {
        interleavedAllResources.push(categoryMap[key][i]);
      }
    }
  }

  const filteredResources =
    selectedCategory === "All"
      ? interleavedAllResources
      : categoryMap[selectedCategory] || [];

  const advancedFilteredResources = filteredResources.filter((resource) => {
    const price = parseFloat(resource.price);
    const matchesPrice = price >= minPrice && price <= maxPrice;
    const matchesFree = isFreeOnly ? resource.isFree : true;
    const matchesSearch = resource.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesPrice && matchesFree && matchesSearch;
  });

  return (
    <div className="py-20 bg-black-100 px-4 md:px-10">
      <h1 className="heading text-center">
        Discover Our <span className="text-purple">All Resources</span>
      </h1>

      <div className="flex flex-col lg:flex-row gap-10 mt-10">
        {/* Filters Sidebar */}
        <aside
          className="w-full lg:w-1/5 space-y-6 break-inside-avoid rounded-2xl border border-slate-800 p-6 hover:scale-[1.02] transition-transform duration-300"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)",
          }}
        >
          <div className="space-y-3">
            <h3 className="text-white font-semibold text-lg">Search</h3>
            <input
              type="text"
              placeholder="Search by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="p-2 w-full rounded-md bg-black-200 border border-purple text-white"
            />
          </div>
          <div className="mb-4">
            <label className="text-white block mb-1">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2 rounded-md bg-black-200 border border-purple text-white"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-3">
            <h3 className="text-white font-semibold text-lg">Price Filter</h3>

            {/* Free Only Toggle */}
            <label className="text-white flex items-center gap-2">
              <input
                type="checkbox"
                checked={isFreeOnly}
                onChange={(e) => setIsFreeOnly(e.target.checked)}
              />
              Free Only
            </label>

            {/* Min & Max Price Inputs */}
            <div className="flex gap-2">
              <input
                type="number"
                min={0}
                value={minPrice}
                onChange={(e) => setMinPrice(Number(e.target.value))}
                className="p-2 w-1/2 rounded-md bg-black-200 text-white border border-purple"
                placeholder="Min"
              />
              <input
                type="number"
                min={0}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="p-2 w-1/2 rounded-md bg-black-200 text-white border border-purple"
                placeholder="Max"
              />
            </div>
          </div>
        </aside>

        {/* Resources Content */}
        <main className="w-full lg:w-4/5">
          {error ? (
            <p className="text-red-500 text-center">{error}</p>
          ) : advancedFilteredResources.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {advancedFilteredResources.map(
                ({ _id, image, title, price, isFree, category }) => (
                  <Link
                    href={`resources/${_id}`}
                    passHref
                    key={_id}
                    className="group border border-purple/20 hover:shadow-xl hover:border-purple rounded-xl overflow-hidden bg-black-200 transition-all duration-300"
                  >
                    <div className="w-full h-52 overflow-hidden">
                      <Image
                        src={image}
                        alt={title}
                        width={800}
                        height={600}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <div className="p-5 flex flex-col justify-between h-[calc(100%-13rem)]">
                      <h2 className="font-semibold text-lg lg:text-xl text-white line-clamp-2 mb-4">
                        {title}
                      </h2>

                      <div className="flex justify-between items-center text-sm text-white">
                        <span className="text-purple font-semibold text-lg">
                          {isFree ? "Free" : <>$ {price}</>}
                        </span>

                        <div className="flex items-center gap-2 text-purple">
                          <span className="capitalize">{category}</span>
                          <Layout size={18} />
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              )}
            </div>
          ) : (
            <div className="flex justify-center p-8 w-full h-full">
              <p className="text-purple text-center">No resources found</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Page;
