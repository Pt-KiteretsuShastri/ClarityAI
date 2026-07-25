import { ThemeProvider } from '@/components/theme-provider';
import { Navbar } from '@/components/sections/Navbar';
import { HeroSection } from '@/components/sections/HeroSection';
import { ProblemSection } from '@/components/sections/ProblemSection';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { FeaturesGrid } from '@/components/sections/FeaturesGrid';
import { StatsSection } from '@/components/sections/StatsSection';
import { DemoSection } from '@/components/sections/DemoSection';
import { WhoItsFor } from '@/components/sections/WhoItsFor';
import { TechStack } from '@/components/sections/TechStack';
import { OpenSource } from '@/components/sections/OpenSource';
import { DownloadCTA } from '@/components/sections/DownloadCTA';
import { Footer } from '@/components/sections/Footer';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="clarity-theme">
      <TooltipProvider>
        <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary/30 selection:text-primary-foreground">
          <Navbar />
          <main>
            <HeroSection />
            <ProblemSection />
            <HowItWorks />
            <FeaturesGrid />
            <StatsSection />
            <DemoSection />
            <WhoItsFor />
            <TechStack />
            <OpenSource />
            <DownloadCTA />
          </main>
          <Footer />
        </div>
        <Toaster />
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;
