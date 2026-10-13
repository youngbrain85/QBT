import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import MeshBackdrop from "@/components/MeshBackdrop";
import { CTA, Capabilities, Footer, HowItWorks, Industries, LogoStrip, Proof, ServicesBar, Software, Work } from "@/components/Sections";

export default function Home() {
  return (
    <>
      <MeshBackdrop />
      <Nav />
      <main className="page">
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
