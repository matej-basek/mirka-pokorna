import Navbar from '@/components/Navbar';
import IntroOverlay from '@/components/IntroOverlay';
import SpinningFlowerBackground from '@/components/SpinningFlowerBackground';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import ServicesSection from '@/components/ServicesSection';
import ProcessSection from '@/components/ProcessSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import EventsSection from '@/components/EventsSection';
import ScheduleSection from '@/components/ScheduleSection';
import ContactSection from '@/components/ContactSection';
import CookieBanner from '@/components/CookieBanner';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">

      {/* LAYER 0: Cinematic Intro Overlay on First Visit */}
      <IntroOverlay />

      {/* LAYER 1: Dynamic 3D Parallax & Scroll-Reactive Cosmic Background */}
      <SpinningFlowerBackground />

      {/* LAYER 10: High-End Content Sections */}
      <div className="relative z-10">
        <Navbar />
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <ProcessSection />
        <TestimonialsSection />
        <EventsSection />
        <ScheduleSection />
        <ContactSection />
        <CookieBanner />
      </div>
    </main>
  );
}
