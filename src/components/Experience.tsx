import data from "../data/detail.json";

export default function Experience() {
  return (
    <section className="z-section" id="experience">
      <div className="z-wrap">
        <div className="z-head">
          <div>
            <h2 className="z-h2" data-perch="">Experience</h2>
          </div>
          <a className="z-btn z-btn--ink" href={data.resume} target="_blank" rel="noopener noreferrer">
            Full resume (PDF)
          </a>
        </div>
        <ol className="z-exp">
          {data.experience.map((e) => (
            <li key={e.company}>
              <div className="z-exp__when">
                <strong>{e.company}</strong>
                {e.duration}
                <br />
                {e.location}
              </div>
              <div>
                <p className="z-exp__role">{e.role}</p>
                <p className="z-exp__ctx">{e.context}</p>
                {e.achievements.length > 0 && (
                  <ul className="z-bullets">
                    {e.achievements.map((a) => (
                      <li key={a}>{a}</li>
                    ))}
                  </ul>
                )}
                <ul className="z-tags">
                  {e.technologies.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
        <p className="z-edu">
          {data.education.degree} {data.education.field}, {data.education.institution} ·{" "}
          {data.education.duration} · GPA {data.education.gpa}
        </p>
      </div>
    </section>
  );
}
