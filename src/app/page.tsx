import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CategorySection from "@/components/CategorySection";
import HowItWorks from "@/components/HowItWorks";

export default function Home() {
  return (
    <main className="min-h-screen text-white">
      <Navbar />
      <HeroSection />
      <CategorySection />
      <HowItWorks />
    </main>
  );
}