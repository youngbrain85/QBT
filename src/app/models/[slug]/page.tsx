import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import ModelsWorkspace from "@/components/ModelsWorkspace";
import { findModel, models } from "@/data/models";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return models.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const m = findModel(slug);
  if (!m) return { title: "Model not found — QBTTEXAS" };
  return {
    title: `${m.name} — 3D model — QBTTEXAS`,
    description: `${m.type}. ${m.summary}`,
    openGraph: { images: [m.render] },
  };
}

export default async function ModelPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const m = findModel(slug);
  if (!m) notFound();
  return (
    <>
      <Nav compact />
      <main style={{ display: "flex", flexDirection: "column" }}>
        <ModelsWorkspace initialSlug={m.slug} />
      </main>
    </>
  );
}
