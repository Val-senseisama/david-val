export interface Product {
  id: string;
  name: string;
  kind: string;
  status: string;
  line: string;
  detail: string;
  proof?: string;
  stack: string[];
  url?: string;
  linkLabel?: string;
  image?: string;
  imageAlt?: string;
  accent: string;
}

export const featured: Product = {
  id: "the-long-road",
  name: "The Long Road",
  kind: "Game · Android",
  status: "Closed test on Google Play",
  line: "A 3D action RPG built for a $100 phone.",
  detail:
    "Five free classes, a five-act story, real-time combat with block, parry and dodge, online Arena PvP and co-op boss raids. Its weapons and world are modelled by script in Blender, and it runs at around 50 fps on a budget Redmi.",
  stack: ["Godot 4", "Blender", "Node.js referee server", "Firebase push"],
  url: "https://thelongroad.zevbii.com/",
  linkLabel: "Join the test",
  image: "/products/longroad.webp",
  imageAlt: "The Long Road: a Paladin fighting in the Inner Keep, with touch controls on screen",
  accent: "#D9622B",
};

export const products: Product[] = [
  {
    id: "shard",
    name: "Shard",
    kind: "Productivity · Android",
    status: "Live on Google Play",
    line: "An AI goal planner with a friend watching.",
    detail:
      "Tell Shard a goal and it breaks it into a dated plan around your week, then puts a friend alongside you who notices if you stop.",
    stack: ["Expo", "GraphQL", "Socket.IO", "LLM planning"],
    url: "https://shard.zevbii.com/",
    linkLabel: "shard.zevbii.com",
    image: "/products/shard.webp",
    imageAlt: "Shard landing page: Finish what you actually start",
    accent: "#7C4DDB",
  },
  {
    id: "popnchat",
    name: "PopnChat",
    kind: "Fintech · Android & web",
    status: "Live",
    line: "Chat, call and pay your bills in one app.",
    detail:
      "Airtime, data, TV and electricity paid from the same naira wallet you use to send money to friends, with escrow, inside the conversation.",
    proof: "₦6M+ processed, ₦600k in the launch hours",
    stack: ["React Native", "Node.js", "WebSockets", "Wallet ledger"],
    url: "https://popnchats.com/",
    linkLabel: "popnchats.com",
    image: "/products/popnchat.webp",
    imageAlt: "PopnChat landing page with the app's bills and wallet screens",
    accent: "#4F46E5",
  },
  {
    id: "directcrib",
    name: "DirectCrib",
    kind: "Marketplace · Web",
    status: "Live",
    line: "Renters and owners, without the middleman.",
    detail:
      "A rental marketplace with escrowed rent payments and identity verification, so both sides can trust a deal they close directly.",
    stack: ["Next.js", "GraphQL", "MySQL", "Escrow payments"],
    url: "https://directcrib.com/",
    linkLabel: "directcrib.com",
    image: "/products/directcrib.webp",
    imageAlt: "DirectCrib landing page: Find a space. Rent better.",
    accent: "#0F766E",
  },
];

export const alsoBuilt: Product[] = [
  {
    id: "payments-api",
    name: "Payments API",
    kind: "Infrastructure",
    status: "Private",
    line: "A multi-tenant Go payments service.",
    detail: "Deadlock-safe ledger, PSP adapters, RBAC and audit trails.",
    stack: ["Go", "chi", "PostgreSQL", "Redis"],
    accent: "#1F2937",
  },
  {
    id: "lil-gee",
    name: "Lil Gee",
    kind: "Game · Web",
    status: "In development",
    line: "A multiplayer strategy game.",
    detail: "Authoritative Go backend with a PixiJS client.",
    stack: ["Go", "PixiJS", "WebSockets"],
    accent: "#B45309",
  },
];
