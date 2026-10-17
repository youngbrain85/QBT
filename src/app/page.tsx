import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import { CTA, Capabilities, Footer, HowItWorks, Industries, Proof, ServicesBar, Software, Work } from "@/components/Sections";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="page">
        <Hero />
        <ServicesBar />
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
