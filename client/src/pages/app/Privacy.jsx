import { Link } from "react-router-dom";
import "../../styles/landing.css";

const privacySections = [
  {
    title: "Information collected",
    body: "AnonChat collects account details such as full name, username, and email address when you register.",
  },
  {
    title: "Google and Facebook authentication",
    body: "When you sign in with Google or Facebook, AnonChat receives the basic authentication information needed to create or access your account.",
  },
  {
    title: "Cookies and sessions",
    body: "We use cookies and session tokens to keep users signed in, protect authenticated pages, and maintain account security.",
  },
  {
    title: "User-generated chat content",
    body: "Messages, attachments, reports, and room activity may be stored so chat, moderation, and safety features work correctly.",
  },
  {
    title: "Security practices",
    body: "AnonChat uses password hashing, protected sessions, moderation controls, access checks, and security-focused server practices.",
  },
  {
    title: "Contact",
    body: "For privacy questions, contact supportanonchat@gmail.com.",
  },
];

export default function Privacy() {
  return (
    <main className="legal-shell">
      <LegalNav />
      <section className="legal-card">
        <p className="legal-eyebrow">Legal</p>
        <h1>AnonChat Privacy Policy</h1>
        <p className="legal-lead">
          This policy explains what AnonChat collects and how we use it to keep the service secure, private, and reliable.
        </p>

        <div className="legal-grid">
          {privacySections.map((section) => (
            <article className="legal-section" key={section.title}>
              <h2>{section.title}</h2>
              <p>
                {section.title === "Contact" ? (
                  <>
                    For privacy questions, contact{" "}
                    <a href="mailto:supportanonchat@gmail.com">supportanonchat@gmail.com</a>.
                  </>
                ) : (
                  section.body
                )}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function LegalNav() {
  return (
    <nav className="legal-nav" aria-label="Legal navigation">
      <Link className="landing-logo" to="/" aria-label="AnonChat home">
        <span><img src="/assets/logo/logo.png" alt="AnonChat logo" /></span>
        <strong>AnonChat</strong>
      </Link>
      <div>
        <Link to="/data-deletion">Data Deletion</Link>
        <Link className="landing-btn ghost" to="/login">Login</Link>
      </div>
    </nav>
  );
}
