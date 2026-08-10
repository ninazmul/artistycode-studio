import Hero from "@/components/Hero";
import RecentProjects from "@/components/RecentProjects";
import Services from "@/components/Services";
import AdSense from "@/components/AdSense";
import dynamic from "next/dynamic";
import { getAllProjects } from "@/lib/actions/project.actions";

const TechStack = dynamic(() => import("@/components/TechStack"));
const Stats = dynamic(() => import("@/components/Stats"));
const Clients = dynamic(() => import("@/components/Clients"));
const Approach = dynamic(() => import("@/components/Approach"));
const Promotion = dynamic(() => import("@/components/Promotion"));

const Home = async () => {
  const projects = await getAllProjects();

  return (
    <main className="relative bg-black-100 flex flex-col overflow-hidden">
      {/* 1. Cinematic Hero */}
      <Hero />

      {/* 2. Tech Stack Marquee */}
      <TechStack />

      {/* 3. Selected Work / Projects */}
      <RecentProjects projects={projects} />

      {/* 4. Core Services */}
      <Services />

      {/* 5. AdSense */}
      <AdSense />

      {/* 6. Proven Stats */}
      <Stats />

      {/* 7. Testimonials / Client Feedback */}
      <Clients />

      {/* 8. Our Approach / Process */}
      <Approach />

      {/* 9. Promotion / Partnership */}
      <Promotion />
    </main>
  );
};

export default Home;
