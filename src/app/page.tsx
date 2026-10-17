import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import { CTA, Footer, HowItWorks, ServicesBar, Software, Work } from "@/components/Sections";

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
        <CTA />
      </main>
      <Footer />
    </>
  );
}
