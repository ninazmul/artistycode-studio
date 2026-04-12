import Hero from "@/components/Hero";
import Clients from "@/components/Clients";
import Approach from "@/components/Approach";
import Services from "@/components/Services";
import RecentProjects from "@/components/RecentProjects";
import Promotion from "@/components/Promotion";
import { getAllProjects } from "@/lib/actions/project.actions";

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
