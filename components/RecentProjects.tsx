import { FaLocationArrow } from "react-icons/fa6";
import { PinContainer } from "./ui/Pin";
import Image from "next/image";
import { getAllProjects } from "@/lib/actions/project.actions";
import { Code } from "lucide-react";
import Link from "next/link";
import MagicButton from "./MagicButton";

const RecentProjects = async () => {
  const projects = await getAllProjects();

  // Categorize projects
  const webApps = projects.filter((p: any) => p.category === "WebApps");
  const mobileApps = projects.filter((p: any) => p.category === "MobileApps");
  const games = projects.filter((p: any) => p.category === "Games");

  // Interleave projects in the order: WebApp → MobileApp → Game
  const interleavedProjects: any[] = [];
  const maxLength = Math.max(webApps.length, mobileApps.length, games.length);

  for (let i = 0; i < maxLength; i++) {
    if (webApps[i]) interleavedProjects.push(webApps[i]);
    if (mobileApps[i]) interleavedProjects.push(mobileApps[i]);
    if (games[i]) interleavedProjects.push(games[i]);
  }

  const displayedProjects = interleavedProjects.slice(0, 9);

  return (
    <div id="projects" className="py-20">
      <h1 className="heading">
        A small selection of{" "}
        <span className="text-purple">recent projects</span>
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-center justify-center p-4 gap-16 mt-10">
        {displayedProjects.map((item: any) => (
          <Link
            href={`projects/${item._id}`}
            passHref
            className="lg:min-h-[32.5rem] h-[25rem] flex items-center justify-center"
            key={item._id}
          >
            <PinContainer title={item.url} href={`projects/${item._id}`}>
              <div className="w-72 lg:w-96 overflow-hidden h-40 lg:h-56 mb-10 rounded-lg">
                <Image
                  src={item.image}
                  alt="cover"
                  width={1920}
                  height={1080}
                  className="h-full w-full object-cover"
                />
              </div>

              <h1 className="font-bold lg:text-2xl md:text-xl text-base line-clamp-1">
                {item.title}
              </h1>

              <p
                className="lg:text-xl lg:font-normal font-light text-sm line-clamp-2"
                style={{
                  color: "#BEC1DD",
                  margin: "1vh 0",
                }}
              >
                {item.description}
              </p>

              <div className="flex items-center justify-between mt-7 mb-3">
                <div className="flex justify-center items-center">
                  <p className="flex lg:text-xl md:text-xs text-sm text-purple">
                    {item.stack}
                  </p>
                  <Code className="ms-3" color="#CBACF9" />
                </div>

                <div className="flex justify-center items-center">
                  <p className="flex lg:text-xl md:text-xs text-sm text-purple">
                    Check Live Site
                  </p>
                  <FaLocationArrow className="ms-3" color="#CBACF9" />
                </div>
              </div>
            </PinContainer>
          </Link>
        ))}
      </div>
      {projects.length > 8 && (
        <div className="flex justify-center mt-10">
          <Link href="/projects">
            <MagicButton
              title="Show All Projects"
              icon={<FaLocationArrow />}
              position="right"
            />
          </Link>
        </div>
      )}
    </div>
  );
};

export default RecentProjects;
