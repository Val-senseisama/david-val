import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import Nav from "./components/Nav";
import Hero3D from "./components/Hero3D";
import Products from "./components/Products";
import Experience from "./components/Experience";
import Skills from "./components/Skills";
import Showcase from "./components/Showcase";
import Blog from "./components/Blog";
import Contact from "./components/Contact";
const Inventory = lazy(() => import("./pages/Inventory"));
const SalesForecast = lazy(() => import("./pages/SalesForecast"));
const MultiVendor = lazy(() => import("./pages/MultiVendor/index"));
const GoalQuest = lazy(() => import("./pages/GoalQuest/GoalQuest"));
const MindMap = lazy(() => import("./pages/MindMap/MindMap"));
const ShardSpace = lazy(() => import("./pages/ShardSpace/ShardSpace"));
import { useSEO, personSchema, websiteSchema } from "./hooks/useSEO";
import data from "./data/detail.json";

function Home() {
  useSEO({
    title: "Zevbii — games and software by David Val-Izevbigie",
    description:
      "Zevbii is the studio of David Val-Izevbigie, a senior fullstack engineer in Lagos building SaaS platforms, payment systems, LLM tools and mobile games.",
    keywords:
      "Zevbii, David Val-Izevbigie, fullstack engineer, The Long Road, Shard, PopnChat, DirectCrib, SaaS, fintech, React, Node.js, TypeScript, Go, Godot",
    ogUrl: "https://zevbii.com/",
    ogImage: "https://zevbii.com/og-image.png",
    canonical: "https://zevbii.com/",
    jsonLd: [personSchema, websiteSchema],
  });

  return (
    <ErrorBoundary>
      <Nav />
      <Hero3D />
      <main>
        <Products />
        <Experience />
        <Skills />
        <Showcase />
        <Blog />
        <Contact />
      </main>
      <footer className="z-foot">
        <div className="z-wrap">
          <span>© {new Date().getFullYear()} Zevbii · {data.name}</span>
          <nav aria-label="Footer">
            <a href={data.github} target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href={data.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href={data.youtube} target="_blank" rel="noopener noreferrer">YouTube</a>
            <a href={data.resume} target="_blank" rel="noopener noreferrer">Resume</a>
          </nav>
        </div>
      </footer>
    </ErrorBoundary>
  );
}

export default function App() {
  return (
    <Router>
      <Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/sales-forecast" element={<SalesForecast />} />
        <Route path="/multivendor" element={<MultiVendor />} />
        <Route path="/goal-quest" element={<GoalQuest />} />
        <Route path="/mind-map" element={<MindMap />} />
        <Route path="/shardspace" element={<ShardSpace />} />
        <Route path="/shardspace/:shardId" element={<ShardSpace />} />
      </Routes>
      </Suspense>
    </Router>
  );
}
