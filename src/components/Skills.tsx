import data from "../data/detail.json";

export default function Skills() {
  return (
    <section className="z-section" id="skills" style={{ paddingTop: 0 }}>
      <div className="z-wrap">
        <div className="z-head">
          <h2 className="z-h2">The toolkit.</h2>
        </div>
        <div className="z-skills">
          {Object.entries(data.skills).map(([group, items]) => (
            <div key={group}>
              <h3>{group}</h3>
              <ul className="z-tags">
                {items.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
