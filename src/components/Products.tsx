import type { CSSProperties } from "react";
import { products, alsoBuilt } from "../data/products";

const accent = (c: string) => ({ "--accent": c }) as CSSProperties;

export default function Products() {
  return (
    <section className="z-section" id="products">
      <div className="z-wrap">
        <div className="z-head">
          <div>
            <h2 className="z-h2" data-perch="">Products</h2>
            <p className="z-lede">Apps I built and still run myself, plus a game in testing.</p>
          </div>
        </div>

        <div className="z-products">
          {products.map((p) => (
            <article className="z-product" id={p.id} key={p.id} style={accent(p.accent)}>
              <div className="z-product__text">
                <div className="z-meta">
                  <span className="z-status">{p.status}</span>
                  <span>{p.kind}</span>
                </div>
                <h3 className="z-product__name" data-perch="">{p.name}</h3>
                <p className="z-product__line">{p.line}</p>
                <p>{p.detail}</p>
                {p.proof && <span className="z-proof">{p.proof}</span>}
                <div className="z-product__foot">
                  <ul className="z-tags">
                    {p.stack.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                  {p.url && (
                    <a className="z-link" href={p.url} target="_blank" rel="noopener noreferrer">
                      {p.linkLabel}
                    </a>
                  )}
                </div>
              </div>
              {p.image && (
                <a
                  className="z-product__media"
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  tabIndex={-1}
                >
                  <img src={p.image} alt={p.imageAlt} loading="lazy" width={1280} height={800} />
                </a>
              )}
            </article>
          ))}
        </div>

        <div className="z-also">
          <h3>Also built</h3>
          <ul>
            {alsoBuilt.map((p) => (
              <li key={p.id}>
                <strong>{p.name}</strong>
                <span>
                  {p.line} {p.detail} <em style={{ color: "var(--ink-3)", fontStyle: "normal" }}>
                    {p.stack.join(" · ")}
                  </em>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
