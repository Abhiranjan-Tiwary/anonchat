import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore.js";
import "../../styles/landing.css";

const features = [
  ["ID", "Anonymous Identity", "No real name required in public rooms.", "violet"],
  ["RT", "Real-Time Chat", "Instant messaging with real-time typing and smooth updates.", "amber"],
  ["SC", "Safe Community", "Report, block, and moderation tools to keep you safe.", "green"],
  ["PR", "Private Rooms", "Join public chats or create private rooms with friends.", "blue"],
  ["AD", "Admin Moderation", "Admins monitor activity to ensure a safe environment.", "red"],
];

const steps = [
  ["Create Account", "Register or continue anonymously — no personal info needed."],
  ["Choose a Room", "Pick a public chat or create your own private room."],
  ["Start Chatting", "Send messages, react, reply — fully anonymous always."],
  ["Stay Safe", "Report harmful users and our admins handle the rest."],
];

export default function Landing() {
  const startGuest = useAuthStore((state) => state.startGuest);
  const navigate = useNavigate();

  function continueAsGuest() {
    startGuest();
    navigate("/dashboard");
  }

  return (
    <main className="landing-shell">
      <nav className="landing-nav">
        <Link className="landing-logo" to="/">
          <span><img src="/assets/logo/logo.png" alt="AnonChat logo" /></span>
          <strong>AnonChat</strong>
        </Link>
        <div className="landing-links">
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#safety">Safety</a>
          <a href="#about">About</a>
        </div>
        <div className="landing-actions">
          <Link className="landing-btn ghost" to="/login">Login</Link>
          <Link className="landing-btn primary" to="/register">Get Started</Link>
        </div>
      </nav>

      <section className="landing-hero" id="home">
        <div className="hero-copy">
          <div className="hero-pill">100% Anonymous Campus Chat</div>
          <h1>
            <span>Talk freely.</span>
            <span className="gradient-one">Stay anonymous.</span>
            <span className="gradient-two">Connect safely.</span>
          </h1>
          <p>
            A secure anonymous chat platform where you can connect, share your thoughts,
            and chat without revealing your identity.
          </p>
          <div className="hero-buttons">
            <Link className="landing-btn primary large" to="/register">Start Anonymous Chat</Link>
            <Link className="landing-btn ghost large" to="/login">Login / Signup</Link>
          </div>
          <button className="guest-continue-link" type="button" onClick={continueAsGuest}>
            Continue as Guest →
          </button>
          <div className="hero-stats" aria-label="AnonChat stats">
            <div><strong>Live</strong><span>MongoDB Rooms</span></div>
            <div><strong>Safe</strong><span>Moderated Chat</span></div>
            <div><strong>Fast</strong><span>Realtime Updates</span></div>
          </div>
        </div>

        <div className="chat-preview-card" aria-label="AnonChat message preview">
          <div className="preview-header">
            <span className="preview-avatar">AU</span>
            <div>
              <strong>Anonymous User</strong>
              <small><span /> Online</small>
            </div>
          </div>
          <div className="preview-messages">
            <div className="preview-bubble received">
              <p>Hey, anyone here?</p>
              <time>10:30 PM</time>
            </div>
            <div className="preview-bubble sent">
              <p>Yes, let's talk safely!</p>
              <time>10:31 PM</time>
            </div>
            <div className="preview-bubble received">
              <p>Nice to meet you!</p>
              <time>10:31 PM</time>
            </div>
          </div>
          <div className="preview-input">
            <span>Type a message...</span>
            <button type="button" aria-label="Send preview message">&gt;</button>
          </div>
        </div>
      </section>

      <section className="landing-section" id="features">
        <p className="section-label">WHY CHOOSE US</p>
        <h2>Why Choose AnonChat?</h2>
        <div className="feature-grid">
          {features.map(([icon, title, body, tone]) => (
            <article className="feature-card" key={title}>
              <span className={`feature-icon ${tone}`}>{icon}</span>
              <strong>{title}</strong>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-section" id="safety">
        <p className="section-label">HOW IT WORKS</p>
        <h2>How It Works</h2>
        <div className="steps-card">
          {steps.map(([title, body], index) => (
            <div className="step-item" key={title}>
              <span className="step-number">{index + 1}</span>
              <strong>{title}</strong>
              <p>{body}</p>
              {index < steps.length - 1 ? <i aria-hidden="true">›</i> : null}
            </div>
          ))}
        </div>
      </section>

      <footer className="landing-footer" id="about">
        <div className="footer-grid">
          <div>
            <Link className="landing-logo footer-logo" to="/">
              <span>A</span>
              <strong>AnonChat</strong>
            </Link>
            <p>A safe space for anonymous conversations. Your privacy, our priority.</p>
          </div>
          <div>
            <h3>Quick Links</h3>
            <a href="#home">Home</a>
            <a href="#features">Features</a>
            <a href="#safety">Safety</a>
            <a href="#about">About Us</a>
          </div>
          <div>
            <h3>Support</h3>
            <a href="#support">Help Center</a>
            <a href="#support">Contact Us</a>
            <a href="#support">Report a Bug</a>
            <a href="#support">Community</a>
          </div>
          <div>
            <h3>Contact</h3>
            <a href="mailto:support@anonchat.com">support@anonchat.com</a>
            <p>We're here to help 24/7</p>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 AnonChat. All rights reserved.</span>
          <span>Privacy Policy · Terms of Service</span>
        </div>
      </footer>
    </main>
  );
}
