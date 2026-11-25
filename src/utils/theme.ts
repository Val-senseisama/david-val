import { useEffect, useState } from "react";

/*
  Light/dark theme. With nothing saved the site follows the system setting (CSS media
  query). The nav toggle saves an explicit choice and sets html[data-theme], which the
  CSS tokens in site.css key off. index.html applies a saved choice before first paint.
*/

export type Theme = "light" | "dark";
const KEY = "zevbii-theme";
const DARK = "(prefers-color-scheme: dark)";

export function currentTheme(): Theme {
  const t = document.documentElement.dataset.theme;
  if (t === "light" || t === "dark") return t;
  return window.matchMedia(DARK).matches ? "dark" : "light";
}

function syncThemeColor() {
  const ground = getComputedStyle(document.documentElement).getPropertyValue("--ground").trim();
  document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]').forEach((m) => (m.content = ground));
}

export function setTheme(t: Theme) {
  document.documentElement.dataset.theme = t;
  try {
    localStorage.setItem(KEY, t);
  } catch {
    // storage blocked: the choice just won't persist
  }
  syncThemeColor();
  window.dispatchEvent(new Event("themechange"));
}

export function useTheme(): [Theme, () => void] {
  const [theme, set] = useState<Theme>(currentTheme);
  useEffect(() => {
    syncThemeColor();
    const mq = window.matchMedia(DARK);
    const onChange = () => {
      set(currentTheme());
      syncThemeColor();
    };
    mq.addEventListener("change", onChange);
    window.addEventListener("themechange", onChange); // another component toggled it
    return () => {
      mq.removeEventListener("change", onChange);
      window.removeEventListener("themechange", onChange);
    };
  }, []);
  const toggle = () => {
    setTheme(currentTheme() === "dark" ? "light" : "dark");
  };
  return [theme, toggle];
}
