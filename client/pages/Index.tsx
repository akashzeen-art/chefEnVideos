import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { HeroSection } from "@/components/sections/HeroSection";
import { ContinueWatchingSection } from "@/components/sections/ContinueWatchingSection";
import { TrendingSection } from "@/components/sections/TrendingSection";
import { FeaturedSection } from "@/components/sections/FeaturedSection";
import { TopPicksSection } from "@/components/sections/TopPicksSection";
import { NewReleasesSection } from "@/components/sections/NewReleasesSection";
import { PopularSection } from "@/components/sections/PopularSection";
import { ComingSoonSection } from "@/components/sections/ComingSoonSection";

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingSpinner onComplete={() => setIsLoading(false)} />;
  }

  return (
    <div className="bg-black text-foreground">
      <Navbar />
      <HeroSection />
      <ContinueWatchingSection />
      <TrendingSection />
      <FeaturedSection />
      <TopPicksSection />
      <NewReleasesSection />
      <PopularSection />
      <ComingSoonSection />
      <Footer />
    </div>
  );
}
