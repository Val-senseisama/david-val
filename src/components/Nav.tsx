import { useEffect, useState } from "react";
import { FaBars, FaMoon, FaSun, FaTimes } from "react-icons/fa";
import data from "../data/detail.json";
import { useTheme } from "../utils/theme";

const links = [
  ["Experience", "#experience"],
  ["Products", "#products"],
  ["Writing", "#blog"],
  ["Skills", "#skills"],
  ["Demos", "#labs"],
  ["Contact", "#contact"],
] as const;

export default function Nav() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const [theme, toggleTheme] = useTheme();

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <nav className={`z-nav${solid || open ? " is-solid" : ""}`} aria-label="Main">
      <div className="z-wrap z-nav__row">
        <a className="z-brand" href="#top" onClick={() => setOpen(false)}>
          <img src="/zevbii-64.webp" alt="" width={30} height={30} />
          Zevbii
        </a>
        <div className="z-nav__end">
          <ul className="z-nav__links">
            {links.map(([label, href]) => (
              <li key={href}>
                <a href={href}>{label}</a>
              </li>
            ))}
            <li className="z-nav__cta">
              <a
                className="z-btn z-btn--gold"
                href={data.resume}
                target="_blank"
                rel="noopener noreferrer"
              >
                Resume
              </a>
            </li>
          </ul>
          <button
            className="z-theme"
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            title={theme === "dark" ? "Light mode" : "Dark mode"}
            onClick={toggleTheme}
          >
            {theme === "dark" ? <FaSun size={15} /> : <FaMoon size={14} />}
          </button>
          <button
            className="z-nav__toggle"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="z-sheet"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>
      </div>
      {open && (
        <div className="z-nav__sheet" id="z-sheet">
          {links.map(([label, href]) => (
            <a key={href} href={href} onClick={() => setOpen(false)}>
              {label}
            </a>
          ))}
          <a
            className="z-btn z-btn--gold"
            href={data.resume}
            target="_blank"
            rel="noopener noreferrer"
          >
            Resume (PDF)
          </a>
        </div>
      )}
    </nav>
  );
}
