import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import { CTA, Capabilities, Footer, HowItWorks, Industries, LogoStrip, Proof, ServicesBar, Software, Work } from "@/components/Sections";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <ServicesBar />
        <LogoStrip />
        <Work />
        <HowItWorks />
        <Software />
        <Capabilities />
        <Industries />
        <Proof />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
