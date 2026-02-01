import HeroSection from "@/components/HeroSection";
import BrandHistory from "@/components/BrandHistory";
import F1Racing from "@/components/F1Racing";
import CarModels from "@/components/CarModels";
import ScrollCanvas from "@/components/ScrollCanvas";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-transparent">
      <ScrollCanvas />

      {/* Content wrapper with z-index to sit above canvas */}
      <div className="relative z-10 w-full">
        <HeroSection />
        {/* Next sections must have background colors to cover the fixed canvas */}
        <div className="bg-carbon-black relative z-20">
          <BrandHistory />
          <F1Racing />
          <CarModels />

          <footer className="py-10 text-center text-white/20 border-t border-white/5 text-xs uppercase tracking-widest">
            © 2026 McLaren Automotive.
          </footer>
        </div>
      </div>
    </main>
  );
}
