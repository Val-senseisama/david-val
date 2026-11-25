import { lazy, Suspense, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaArrowRight, FaFileAlt } from "react-icons/fa";

import data from "../data/detail.json";
import blogs from "../data/blogs.json";

const latest = blogs.find((b) => b.id === "notion-idempotent-payments")!;
const HeroDesk = lazy(() => import("./HeroDesk"));
const WIDE = "(min-width: 1100px)";

function useWide() {
  const [wide, setWide] = useState(() => window.matchMedia(WIDE).matches);
  useEffect(() => {
    const mq = window.matchMedia(WIDE);
    const on = () => setWide(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return wide;
}

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
});

export default function Hero3D() {
  const wide = useWide();
  return (
    <header className="z-hero" id="top">
      {wide && (
        <Suspense fallback={null}>
          <HeroDesk />
        </Suspense>
      )}
      <div className="z-hero__body z-wrap">
        <motion.img
          {...rise(0.1)}
          className="z-hero__photo"
          src="/val.webp"
          width={112}
          height={112}
          alt="David Val-Izevbigie"
        />
        <motion.h1 {...rise(0.2)}>
          I build payment systems and SaaS products.
        </motion.h1>
        <motion.p {...rise(0.35)} className="z-hero__sub">
          I'm <strong>{data.name}</strong>, a fullstack engineer in Lagos. I build telehealth
          software at OneStopRx, and recruiting, healthcare and clinical AI platforms at Punch
          Group.
        </motion.p>
        <motion.div {...rise(0.5)} className="z-hero__actions">
          <a className="z-btn z-btn--gold" href="#experience">
            See my work <FaArrowRight size={13} />
          </a>
          <a
            className="z-btn z-btn--line"
            href={data.resume}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFileAlt size={13} /> Resume (PDF)
          </a>
        </motion.div>
      </div>

      <motion.div
        className="z-hero__now"
        data-perch="right"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.8 }}
      >
        <div className="z-wrap">
          <a href={latest.url} target="_blank" rel="noopener noreferrer">
            <span>
              <span className="dim">Latest post · </span>
              <strong>{latest.title}</strong>
            </span>
            <FaArrowRight className="z-arrow" size={13} />
          </a>
        </div>
      </motion.div>
    </header>
  );
}
