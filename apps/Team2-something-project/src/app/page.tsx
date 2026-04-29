import {
  CtaSection,
  CsvPlaygroundSection,
  FeaturesSection,
  HeroSection,
  HowItWorksSection,
  LandingFooter,
  LandingNav,
  UseCasesSection,
} from './components';

export default function Page() {
  return (
    <main className="landing-page">
      <LandingNav />
      <HeroSection />
      <HowItWorksSection />
      <FeaturesSection />
      <CsvPlaygroundSection />
      <UseCasesSection />
      <CtaSection />
      <LandingFooter />
    </main>
  );
}
