import HeroCard from "@/components/HeroCard";
import HeroSection from "@/components/HeroSection";
import OverflowWrapper from "@/components/OverflowWrapper";
import ResultsSection from "@/components/ResultsSection";

export default function Home() {
  return (
    <main id="main" className="">
      <div className="">
        <HeroSection />
        <HeroCard />
        <OverflowWrapper />
        {/* <ResultsSection /> */}
        {/* <div className="h-3000 bg-[black]"></div> */}
      </div>
    </main>
  );
}
