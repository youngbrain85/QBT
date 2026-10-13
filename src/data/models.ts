export type BridgeModel = {
  slug: string;
  name: string;
  region: "Korea" | "Indiana";
  county?: string;
  crosses?: string;
  type: string;
  typeTag: "cable-stayed" | "girder" | "slab" | "truss" | "culvert";
  meshes: number;
  lengthNote?: string;
  structureId?: string;
  owner?: string;
  coverage: "complete" | "needs_detail";
  render: string;
  /** Files loaded by the viewer, relative to /models. */
  files: string[];
  summary: string;
  featured?: boolean;
};

export const models: BridgeModel[] = [
  {
    slug: "wonsan-anmyeon",
    name: "Wonsan–Anmyeon Bridge (Solbit Bridge)",
    region: "Korea",
    county: "Taean, Chungcheongnam-do",
    crosses: "Cheonsu Bay",
    type: "Two-pylon steel–concrete composite cable-stayed bridge",
    typeTag: "cable-stayed",
    meshes: 1452,
    lengthNote: "104.68 + 240 + 104.68 m · pylons 105 m",
    coverage: "complete",
    render: "/renders/wonsan-anmyeon.png",
    files: [
      "wonsan/PY1.glb",
      "wonsan/PY2.glb",
      "wonsan/DECK.glb",
      "wonsan/CABLES.glb",
      "wonsan/BEARINGS.glb",
      "wonsan/FURNITURE.glb",
    ],
    summary:
      "Modeled segment by segment from the drawings and site photographs: two diamond pylons in 32 parts, 37 deck segments, 72 stay cables with guide pipes and dampers, bearings, wind shoes and deck furniture. Delivered as GLB and semantic IFC4.",
    featured: true,
  },
  {
    slug: "beechwood-road-bridge",
    name: "Beechwood Road Bridge",
    region: "Indiana",
    county: "Crawford County",
    crosses: "Little Blue River",
    type: "Prestressed bulb-tee girder bridge",
    typeTag: "girder",
    meshes: 622,
    lengthNote: "Spans 80 + 90 + 80 ft · deck 252 × 33 ft",
    structureId: "13-00043 B",
    coverage: "complete",
    render: "/renders/beechwood-road-bridge.png",
    files: ["indiana/beechwood-road-bridge.glb"],
    summary:
      "Three-span bulb-tee girder bridge reconstructed from the project sheets and INDOT standard drawings, with the 22 ft column-spacing correction applied.",
  },
  {
    slug: "21st-street-over-i465",
    name: "21st Street over I-465",
    region: "Indiana",
    county: "Marion County",
    crosses: "I-465",
    type: "2-span prestressed concrete U-girder bridge",
    typeTag: "girder",
    meshes: 1944,
    structureId: "I-465-149-8974",
    owner: "INDOT",
    coverage: "needs_detail",
    render: "/renders/21st-street-over-i465.png",
    files: ["indiana/21st-street-over-i465.glb"],
    summary: "Two-span U-girder overpass with member-level meshes for girders, pier and abutments.",
  },
  {
    slug: "us421-south-fork-wildcat-creek",
    name: "US 421 over South Fork Wildcat Creek",
    region: "Indiana",
    county: "Clinton County",
    crosses: "South Fork Wildcat Creek",
    type: "Central steel through-truss with concrete box-beam end spans",
    typeTag: "truss",
    meshes: 1057,
    structureId: "(421)39-12-01792C",
    owner: "INDOT",
    coverage: "needs_detail",
    render: "/renders/us421-south-fork-wildcat-creek.png",
    files: ["indiana/us421-south-fork-wildcat-creek.glb"],
    summary: "Steel through-truss main span with concrete box-beam approaches.",
  },
  {
    slug: "us52-mud-creek",
    name: "US 52 over Mud Creek",
    region: "Indiana",
    county: "Rush County",
    crosses: "Mud Creek",
    type: "3-span modular concrete slab bridge",
    typeTag: "slab",
    meshes: 164,
    structureId: "052-70-10277",
    owner: "INDOT",
    coverage: "needs_detail",
    render: "/renders/us52-mud-creek.png",
    files: ["indiana/us52-mud-creek.glb"],
    summary: "Three-span modular slab bridge from INDOT replacement plans.",
  },
  {
    slug: "sr58-white-creek",
    name: "SR 58 over White Creek",
    region: "Indiana",
    county: "Bartholomew County",
    crosses: "White Creek",
    type: "3-span concrete slab bridge",
    typeTag: "slab",
    meshes: 41,
    structureId: "058-03-10816",
    owner: "INDOT",
    coverage: "needs_detail",
    render: "/renders/sr58-white-creek.png",
    files: ["indiana/sr58-white-creek.glb"],
    summary: "Three-span concrete slab bridge, exterior massing from the plan set.",
  },
  {
    slug: "sr159-branch-spencer-creek",
    name: "SR 159 over Branch Spencer Creek",
    region: "Indiana",
    county: "Sullivan County",
    crosses: "Branch Spencer Creek",
    type: "Precast concrete three-sided structure",
    typeTag: "culvert",
    meshes: 45,
    structureId: "159-77-10338",
    owner: "INDOT",
    coverage: "needs_detail",
    render: "/renders/sr159-branch-spencer-creek.png",
    files: ["indiana/sr159-branch-spencer-creek.glb"],
    summary: "Precast three-sided structure with wingwalls and headwalls.",
  },
  {
    slug: "sr62-csx-railroad",
    name: "SR 62 over CSX Railroad",
    region: "Indiana",
    county: "Vanderburgh County",
    crosses: "CSX Railroad",
    type: "Bulb-tee girder bridge · left skew 45°",
    typeTag: "girder",
    meshes: 45,
    structureId: "062-82-02788",
    owner: "INDOT",
    coverage: "needs_detail",
    render: "/renders/sr62-csx-railroad.png",
    files: ["indiana/sr62-csx-railroad.glb"],
    summary: "Skewed bulb-tee girder bridge over the railroad, Evansville.",
  },
  {
    slug: "sr62-tekoppel-avenue",
    name: "SR 62 over Tekoppel Avenue",
    region: "Indiana",
    county: "Vanderburgh County",
    crosses: "Tekoppel Avenue",
    type: "Single-span bulb-tee girder bridge · skew 0°",
    typeTag: "girder",
    meshes: 45,
    structureId: "062-82-10333",
    owner: "INDOT",
    coverage: "needs_detail",
    render: "/renders/sr62-tekoppel-avenue.png",
    files: ["indiana/sr62-tekoppel-avenue.glb"],
    summary: "Single-span bulb-tee girder overpass, Evansville.",
  },
  {
    slug: "sr62-carpentier-creek",
    name: "SR 62 over Carpentier Creek",
    region: "Indiana",
    county: "Vanderburgh County",
    crosses: "Carpentier Creek",
    type: "Single-span bulb-tee girder bridge · left skew 15°",
    typeTag: "girder",
    meshes: 49,
    structureId: "062-82-10719",
    owner: "INDOT",
    coverage: "needs_detail",
    render: "/renders/sr62-carpentier-creek.png",
    files: ["indiana/sr62-carpentier-creek.glb"],
    summary: "Single-span bulb-tee girder bridge with a 15° skew, Evansville.",
  },
];

export const featuredModel = models[0];
export const indianaModels = models.filter((m) => m.region === "Indiana");

export function findModel(slug: string): BridgeModel | undefined {
  return models.find((m) => m.slug === slug);
}
