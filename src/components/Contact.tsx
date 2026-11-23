import { useRef, useState } from "react";
import { FaEnvelope, FaGithub, FaLinkedin, FaMapMarkerAlt, FaPhone, FaYoutube } from "react-icons/fa";
import { usePortfolioData } from "../hooks/usePortfolioData";

export default function Contact() {
  const data = usePortfolioData();
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;
    setIsSubmitting(true);
    setSubmitStatus("idle");
    const form = new FormData(formRef.current);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          message: form.get("message"),
        }),
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      setSubmitStatus("success");
      formRef.current.reset();
    } catch (error) {
      console.error("Failed to send message:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const direct = [
    { icon: <FaEnvelope size={16} />, value: data.email, href: `mailto:${data.email}` },
    { icon: <FaPhone size={16} />, value: data.phone, href: `tel:${data.phone}` },
    { icon: <FaLinkedin size={16} />, value: "LinkedIn", href: data.linkedin },
    { icon: <FaGithub size={16} />, value: "GitHub", href: data.github },
    { icon: <FaYoutube size={16} />, value: "YouTube: build logs", href: data.youtube },
    { icon: <FaMapMarkerAlt size={16} />, value: data.location, href: null },
  ];

  return (
    <section className="z-section z-contact" id="contact">
      <div className="z-wrap z-contact__grid">
        <div>
          <h2 className="z-h2" data-perch="">Have a product to build, or a role to fill?</h2>
          <p className="z-lede">
            Tell me what you're working on. I reply to every message, usually within a day.
          </p>
          <ul className="z-direct">
            {direct.map(({ icon, value, href }) => (
              <li key={value}>
                {href ? (
                  <a
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                  >
                    {icon}
                    {value}
                  </a>
                ) : (
                  <div>
                    {icon}
                    {value}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="z-form">
          <label>
            Name
            <input type="text" name="name" required maxLength={100} autoComplete="name" placeholder="Your name" />
          </label>
          <label>
            Email
            <input
              type="email"
              name="email"
              required
              maxLength={200}
              autoComplete="email"
              placeholder="you@company.com"
            />
          </label>
          <label>
            Message
            <textarea name="message" required maxLength={5000} placeholder="What are you building?" />
          </label>
          <div>
            <button type="submit" className="z-btn z-btn--gold" disabled={isSubmitting}>
              {isSubmitting ? "Sending…" : "Send message"}
            </button>
          </div>
          <p className="z-form__note" role="status" aria-live="polite">
            {submitStatus === "success" && (
              <span className="ok">Sent. I'll get back to you shortly.</span>
            )}
            {submitStatus === "error" && (
              <span className="err">
                That didn't send. Try again, or email {data.email} directly.
              </span>
            )}
          </p>
        </form>
      </div>
    </section>
  );
}
