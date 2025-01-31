"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Code, Layout } from "lucide-react";
import Link from "next/link";
import { PinContainer } from "@/components/ui/Pin";
import { getAllProjects } from "@/lib/actions/project.actions";
import { Button } from "@/components/ui/button";

const categories = ["All", "WebApps", "MobileApps", "Games"];

const Page = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getAllProjects();
        setProjects(data);
      } catch (err) {
        setError("Failed to load projects");
      }
    };

    fetchProjects();
  }, []);

  // Categorize projects
  const webApps = projects.filter((p: any) => p.category === "WebApps");
  const mobileApps = projects.filter((p: any) => p.category === "MobileApps");
  const games = projects.filter((p: any) => p.category === "Games");

  // Interleave projects in the order: WebApp → MobileApp → Game
  const interleavedProjects = [];
  const maxLength = Math.max(webApps.length, mobileApps.length, games.length);
  for (let i = 0; i < maxLength; i++) {
    if (webApps[i]) interleavedProjects.push(webApps[i]);
    if (mobileApps[i]) interleavedProjects.push(mobileApps[i]);
    if (games[i]) interleavedProjects.push(games[i]);
  }

  const filteredProjects =
    selectedCategory === "All"
      ? interleavedProjects
      : projects.filter((p: any) => p.category === selectedCategory);

  return (
    <div className="py-20 bg-black-100">
      <h1 className="heading">
        Discover Our <span className="text-purple">All Projects</span>
      </h1>

      <div className="flex flex-wrap justify-center gap-4 mt-6">
        {categories.map((cat) => (
          <Button
            key={cat}
            onClick={() => {
              console.log(`Selected Category: ${cat}`); // Check if this logs correctly
              setSelectedCategory(cat);
            }}
            variant="outline"
            className={`px-4 py-2 rounded-lg transition-all ${
              selectedCategory === cat
                ? "bg-purple text-black"
                : "border border-purple text-purple"
            }`}
            style={{ zIndex: 10 }}
          >
            {cat}
          </Button>
        ))}
      </div>

      {error ? (
        <p className="text-red-500">{error}</p>
      ) : filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-center justify-center p-4 gap-16 mt-10">
          {filteredProjects.map(
            ({ _id, image, title, description, stack, url, category }: any) => (
              <Link
                href={`projects/${_id}`}
                passHref
                className="lg:min-h-[32.5rem] h-[25rem] flex items-center justify-center"
                key={_id}
              >
                <PinContainer title={url} href={`projects/${_id}`}>
                  <div className="w-72 lg:w-96 overflow-hidden h-40 lg:h-56 mb-10 rounded-lg">
                    <Image
                      src={image}
                      alt="cover"
                      width={1920}
                      height={1080}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <h1 className="font-bold lg:text-2xl md:text-xl text-base line-clamp-1">
                    {title}
                  </h1>

                  <p
                    className="lg:text-xl lg:font-normal font-light text-sm line-clamp-2"
                    style={{ color: "#BEC1DD", margin: "1vh 0" }}
                  >
                    {description}
                  </p>

                  <div className="flex items-center justify-between mt-7 mb-3">
                    <div className="flex justify-center items-center">
                      <p className="flex lg:text-xl md:text-xs text-sm text-purple">
                        {stack}
                      </p>
                      <Code className="ms-3" color="#CBACF9" />
                    </div>

                    <div className="flex justify-center items-center">
                      <p className="flex lg:text-xl md:text-xs text-sm text-purple">
                        {category}
                      </p>
                      <Layout className="ms-3" color="#CBACF9" />
                    </div>
                  </div>
                </PinContainer>
              </Link>
            )
          )}
        </div>
      ) : (
        <div className="flex justify-center p-8 w-full h-full">
          <p className="text-purple text-center">No projects found</p>
        </div>
      )}
    </div>
  );
};

export default Page;
