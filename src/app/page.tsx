import HeroSection from "@/components/HeroSection";
import CategorySection from "@/components/CategorySection";
import HowItWorks from "@/components/HowItWorks";
import LatestServices from "@/components/LatestServices";
import WhyChooseFixMate from "@/components/WhyChooseFixMate";


export default function Home() {
  return (
    <main className="min-h-screen text-white">
      <HeroSection />
      <CategorySection />
      <HowItWorks />
      <LatestServices />
      <WhyChooseFixMate />
    </main>
  );
}