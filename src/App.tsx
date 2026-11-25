import { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { IconContext } from "react-icons";
import ErrorBoundary from "./components/ErrorBoundary";
import Nav from "./components/Nav";
import Hero3D from "./components/Hero3D";
import Products from "./components/Products";
import Experience from "./components/Experience";
import Skills from "./components/Skills";
import Showcase from "./components/Showcase";
import Blog from "./components/Blog";
import Contact from "./components/Contact";
const Mascot = lazy(() => import("./components/Mascot"));
const Inventory = lazy(() => import("./pages/Inventory"));
const SalesForecast = lazy(() => import("./pages/SalesForecast"));
const MultiVendor = lazy(() => import("./pages/MultiVendor/index"));
const GoalQuest = lazy(() => import("./pages/GoalQuest/GoalQuest"));
const MindMap = lazy(() => import("./pages/MindMap/MindMap"));
const ShardSpace = lazy(() => import("./pages/ShardSpace/ShardSpace"));
import { useSEO, personSchema, websiteSchema } from "./hooks/useSEO";
import data from "./data/detail.json";
import { smoothHashLinks } from "./utils/smoothScroll";

function Home() {
  const [mascot, setMascot] = useState(false);
  useEffect(() => {
    // Wide screens: Val arrives with the hero desk. Narrower screens have no desk, so the
    // mascot's 3D code (~250 KB gzipped) waits until the visitor first scrolls or touches,
    // then for an idle moment, keeping it off the first load.
    if (window.matchMedia("(min-width: 1100px)").matches) {
      const t = window.setTimeout(() => setMascot(true), 300);
      return () => window.clearTimeout(t);
    }
    const events = ["scroll", "pointerdown", "touchstart", "keydown"] as const;
    let idle = 0;
    const start = () => {
      events.forEach((e) => window.removeEventListener(e, start));
      const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200));
      idle = ric(() => setMascot(true));
    };
    events.forEach((e) => window.addEventListener(e, start, { passive: true, once: true }));
    return () => {
      events.forEach((e) => window.removeEventListener(e, start));
      (window.cancelIdleCallback ?? window.clearTimeout)(idle);
    };
  }, []);
  useEffect(() => smoothHashLinks(), []);
  useSEO({
    title: "David Val-Izevbigie · Fullstack engineer, payments and SaaS",
    description:
      "David Val-Izevbigie is a senior fullstack engineer in Lagos who builds payment systems, multi-tenant SaaS and LLM-powered products.",
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
        <Experience />
        <Products />
        <Blog />
        <Skills />
        <Showcase />
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
      {mascot && (
        <Suspense fallback={null}>
          <Mascot />
        </Suspense>
      )}
    </ErrorBoundary>
  );
}

export default function App() {
  return (
    // every react-icons icon on the site is decorative (icon-only buttons carry aria-label)
    <IconContext.Provider value={{ attr: { "aria-hidden": true } }}>
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
    </IconContext.Provider>
  );
}
