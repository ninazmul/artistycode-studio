import Hero from "@/components/Hero";
import RecentProjects from "@/components/RecentProjects";
import Services from "@/components/Services";
import dynamic from "next/dynamic";
import { getAllProjects } from "@/lib/actions/project.actions";

const Clients = dynamic(() => import("@/components/Clients"));
const Approach = dynamic(() => import("@/components/Approach"));
const Promotion = dynamic(() => import("@/components/Promotion"));

const Home = async () => {
  const projects = await getAllProjects();

  return (
    <main className="relative bg-black-100 flex flex-col overflow-hidden">
      <Hero />
      <RecentProjects projects={projects} />
      <Clients />
      <Services />
      <Approach />
      <Promotion />
    </main>
  );
};

export default Home;
