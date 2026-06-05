import { Link } from "react-router-dom";
import "../../styles/landing.css";

export default function DataDeletion() {
  return (
    <main className="legal-shell">
      <nav className="legal-nav" aria-label="Legal navigation">
        <Link className="landing-logo" to="/" aria-label="AnonChat home">
          <span><img src="/assets/logo/logo.png" alt="AnonChat logo" /></span>
          <strong>AnonChat</strong>
        </Link>
        <div>
          <Link to="/privacy">Privacy Policy</Link>
          <Link className="landing-btn ghost" to="/login">Login</Link>
        </div>
      </nav>

      <section className="legal-card legal-card-narrow">
        <p className="legal-eyebrow">Account control</p>
        <h1>User Data Deletion</h1>
        <p className="legal-lead">
          If you would like your account and associated data removed from AnonChat, please send a request to:
        </p>

        <p className="legal-callout">
          <a href="mailto:supportanonchat@gmail.com">supportanonchat@gmail.com</a>
        </p>

        <div className="legal-section">
          <h2>Subject</h2>
          <p><strong>Data Deletion Request</strong></p>
        </div>

        <div className="legal-section">
          <h2>Include</h2>
          <ul>
            <li>Registered Email Address</li>
            <li>Username</li>
          </ul>
        </div>

        <p className="legal-callout">We will process deletion requests within 30 days.</p>
      </section>
    </main>
  );
}
