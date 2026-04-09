import Hero from "@/components/Hero";
import Clients from "@/components/Clients";
import Approach from "@/components/Approach";
import Services from "@/components/Services";
import RecentProjects from "@/components/RecentProjects";
import Promotion from "@/components/Promotion";

const Home = () => {
  return (
    <main className="relative bg-black flex justify-center items-center flex-col overflow-hidden mx-auto sm:px-10 px-5">
      <div className="max-w-7xl w-full">
        <Hero />
        <RecentProjects />
        <Clients />
        <Services />
        <Approach />
        <Promotion />
      </div>
    </main>
  );
};

export default Home;
