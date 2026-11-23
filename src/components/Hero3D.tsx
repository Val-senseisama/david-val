import { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { FaArrowRight, FaFileAlt } from "react-icons/fa";

const HeroCanvas = lazy(() => import("./HeroCanvas"));
import data from "../data/detail.json";
import { featured } from "../data/products";

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 24, filter: "blur(6px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { delay, duration: 0.9, ease: [0.16, 1, 0.3, 1] as const },
});

export default function Hero3D() {
  return (
    <header className="z-hero" id="top">
      <div className="z-hero__canvas" aria-hidden="true">
        <Suspense fallback={null}>
          <HeroCanvas />
        </Suspense>
      </div>
      <div className="z-hero__veil" />

      <div className="z-hero__body z-wrap">
        <motion.img
          {...rise(0.1)}
          className="z-hero__mark"
          src="/zevbii.webp"
          width={64}
          height={64}
          alt=""
        />
        <motion.h1 {...rise(0.2)}>
          Games and software, <em>built to ship.</em>
        </motion.h1>
        <motion.p {...rise(0.35)} className="z-hero__sub">
          Zevbii is the studio of <strong>{data.name}</strong>, a senior fullstack engineer in
          Lagos. I design, build and run products end to end: SaaS platforms, payment systems,
          LLM tools and mobile games.
        </motion.p>
        <motion.div {...rise(0.5)} className="z-hero__actions">
          <a className="z-btn z-btn--gold" href="#products">
            See the products <FaArrowRight size={13} />
          </a>
          <a
            className="z-btn z-btn--ghost-night"
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
          <a href={featured.url} target="_blank" rel="noopener noreferrer">
            <span className="z-pulse" aria-hidden="true" />
            <span>
              <strong>{featured.name}</strong>{" "}
              <span className="dim">· {featured.status}. Testers wanted.</span>
            </span>
            <FaArrowRight className="z-arrow" size={13} />
          </a>
        </div>
      </motion.div>
    </header>
  );
}
