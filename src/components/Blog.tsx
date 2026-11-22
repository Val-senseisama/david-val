import { useEffect, useMemo, useRef, useState } from "react";
import { FaExternalLinkAlt, FaLinkedin, FaTimes } from "react-icons/fa";
import { SiNotion } from "react-icons/si";
import blogsData from "../data/blogs.json";

interface BlogItem {
  id: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  platform: string;
  url: string;
  embedUrl: string;
  tags: string[];
}

const posts = blogsData as BlogItem[];
const platformName: Record<string, string> = { notion: "Notion", linkedin: "LinkedIn" };
const platformIcon = (p: string) =>
  p === "linkedin" ? <FaLinkedin size={13} /> : <SiNotion size={13} />;

export default function Blog() {
  const [platform, setPlatform] = useState("all");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<BlogItem | null>(null);
  const [loading, setLoading] = useState(true);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  const platforms = useMemo(() => Array.from(new Set(posts.map((p) => p.platform))), []);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter(
      (p) =>
        (platform === "all" || p.platform === platform) &&
        (!q ||
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))),
    );
  }, [platform, query]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      lastFocus.current?.focus();
    };
  }, [open]);

  const read = (p: BlogItem, el: HTMLElement) => {
    lastFocus.current = el;
    setLoading(true);
    setOpen(p);
  };

  return (
    <section className="z-section" id="blog">
      <div className="z-wrap">
        <div className="z-head">
          <div>
            <h2 className="z-h2">Notes from production.</h2>
            <p className="z-lede">
              What broke, why, and how I fixed it: payments, fraud, real-time calling and system
              design.
            </p>
          </div>
        </div>

        <div className="z-filters">
          {["all", ...platforms].map((p) => (
            <button
              key={p}
              className="z-chip"
              aria-pressed={platform === p}
              onClick={() => setPlatform(p)}
            >
              {p === "all" ? "All" : platformName[p] ?? p}
            </button>
          ))}
          <input
            className="z-search"
            type="search"
            placeholder="Search posts"
            aria-label="Search posts"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <ul className="z-posts">
          {shown.map((p) => (
            <li key={p.id}>
              <button onClick={(e) => read(p, e.currentTarget)}>
                <span className="when">
                  {p.date}
                  <br />
                  {p.readTime}
                </span>
                <span>
                  <h3>{p.title}</h3>
                  <p>{p.description}</p>
                </span>
                <span className="where">
                  {platformIcon(p.platform)} {platformName[p.platform] ?? p.platform}
                </span>
              </button>
            </li>
          ))}
          {shown.length === 0 && (
            <li className="z-empty">No posts match “{query}”. Try a broader word, like payments.</li>
          )}
        </ul>
      </div>

      {open && (
        <div
          className="z-reader"
          role="dialog"
          aria-modal="true"
          aria-label={open.title}
          onClick={(e) => e.target === e.currentTarget && setOpen(null)}
        >
          <div className="z-reader__panel">
            <div className="z-reader__bar">
              <h3>{open.title}</h3>
              <a
                className="z-icon-btn"
                href={open.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open on ${platformName[open.platform] ?? open.platform}`}
              >
                <FaExternalLinkAlt size={13} />
              </a>
              <button
                ref={closeRef}
                className="z-icon-btn"
                aria-label="Close"
                onClick={() => setOpen(null)}
              >
                <FaTimes size={15} />
              </button>
            </div>
            <div style={{ position: "relative", flex: 1, display: "flex" }}>
              {loading && <div className="z-reader__loading">Loading…</div>}
              <iframe
                src={open.embedUrl}
                title={open.title}
                onLoad={() => setLoading(false)}
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-popups-to-escape-sandbox"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
