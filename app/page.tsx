import Hero from "@/components/Hero";
import Grid from "@/components/Grid";
import Footer from "@/components/Footer";
import Clients from "@/components/Clients";
import Approach from "@/components/Approach";
import Experience from "@/components/Experience";
import RecentProjects from "@/components/RecentProjects";
import Header from "@/components/Header";
import ScrollHeaderWrapper from "@/components/ScrollHeaderWrapper";
import ScrollToTops from "@/components/ScrollToTops";
import Promotion from "@/components/Promotion";

const Home = () => {
  return (
    <main className="relative bg-black-100 flex justify-center items-center flex-col overflow-hidden mx-auto sm:px-10 px-5">
      <div className="max-w-7xl w-full">
        <ScrollHeaderWrapper>
          <Header />
        </ScrollHeaderWrapper>
        <Hero />
        <Promotion/>
        <Grid />
        <RecentProjects />
        <Clients />
        <Experience />
        <Approach />
        <Footer />
        <ScrollToTops />
      </div>
    </main>
  );
};

export default Home;
