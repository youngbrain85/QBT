import type { Metadata } from "next";
import Nav from "@/components/Nav";
import ModelsWorkspace from "@/components/ModelsWorkspace";

export const metadata: Metadata = {
  title: "3D model viewer — QBTTEXAS",
  description: "Open the Wonsan–Anmyeon Bridge twin and nine Indiana highway bridge models in the browser: shaded, wireframe or point cloud, with section cuts and element dimensions.",
};

export default function ModelsPage() {
  return (
    <>
      <Nav compact />
      <main style={{ display: "flex", flexDirection: "column" }}>
        <ModelsWorkspace />
      </main>
    </>
  );
}
