import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import Clients from "@/components/Clients";
import Approach from "@/components/Approach";
import Services from "@/components/Services";
import RecentProjects from "@/components/RecentProjects";
import Header from "@/components/Header";
import ScrollHeaderWrapper from "@/components/ScrollHeaderWrapper";
import Promotion from "@/components/Promotion";

const Home = () => {
  return (
    <main className="relative bg-black flex justify-center items-center flex-col overflow-hidden mx-auto sm:px-10 px-5">
      <div className="max-w-7xl w-full">
        <Hero />
        <Promotion />
        <RecentProjects />
        <Clients />
        <Services />
        <Approach />
        <Footer />
      </div>
    </main>
  );
};

export default Home;
