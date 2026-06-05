import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore.js";
import "../../styles/landing.css";

const highlights = [
  { value: "Live", label: "Realtime social feed" },
  { value: "DMs", label: "Socket powered chats" },
  { value: "Safe", label: "Reports & moderation" },
];

const features = [
  ["Stories", "Share quick campus moments with a clean Instagram-style story row."],
  ["Feed", "Post updates, images, thoughts and conversations in one premium feed."],
  ["Messages", "Keep your existing realtime room chat system as modern social DMs."],
  ["Profile", "Show avatar, bio, posts, followers and following in a social profile."],
];

const previewPosts = [
  ["Campus Circle", "Late night coding, chai and new ideas.", "1.2k"],
  ["Dev Room", "Realtime chat now feels more social.", "846"],
  ["Anon Vibes", "Share safely. Connect beautifully.", "2.4k"],
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
        <Link className="landing-logo" to="/" aria-label="AnonChat home">
          <span><img src="/assets/logo/logo.png" alt="AnonChat logo" /></span>
          <strong>AnonChat</strong>
        </Link>

        <div className="landing-links">
          <a href="#features">Features</a>
          <a href="#preview">Preview</a>
          <a href="#safety">Safety</a>
        </div>

        <div className="landing-actions">
          <Link className="landing-btn ghost" to="/login">Login</Link>
          <Link className="landing-btn primary" to="/register">Get Started</Link>
        </div>
      </nav>

      <section className="landing-hero" id="home">
        <div className="hero-copy">
          <div className="hero-pill">AnonChat Social Beta</div>
          <h1>
            <span>Anonymous chat,</span>
            <span className="gradient-one">now redesigned</span>
            <span className="gradient-two">like a social app.</span>
          </h1>
          <p>
            A premium Instagram-style experience with feed, stories, messages,
            notifications, reels and profile — while keeping your existing secure
            authentication, socket chat, uploads and moderation systems.
          </p>

          <div className="hero-buttons">
            <Link className="landing-btn primary large" to="/register">Create Account</Link>
            <button className="landing-btn ghost large" type="button" onClick={continueAsGuest}>Continue as Guest</button>
          </div>

          <div className="hero-stats" aria-label="AnonChat highlights">
            {highlights.map((item) => (
              <div key={item.label}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="social-preview" id="preview" aria-label="AnonChat social preview">
          <div className="preview-topbar">
            <div>
              <strong>Home Feed</strong>
              <span>@anonchat.social</span>
            </div>
            <Link to="/login">Open</Link>
          </div>

          <div className="story-strip">
            {["You", "Code", "Campus", "Events", "Music"].map((story) => (
              <div className="story-dot" key={story}>
                <span>{story.slice(0, 1)}</span>
                <small>{story}</small>
              </div>
            ))}
          </div>

          <div className="preview-feed">
            {previewPosts.map(([name, text, likes], index) => (
              <article className="preview-post" key={name}>
                <div className="post-head">
                  <span className={`post-avatar tone-${index + 1}`}>{name.slice(0, 1)}</span>
                  <div>
                    <strong>{name}</strong>
                    <small>Just now</small>
                  </div>
                </div>
                <div className={`post-media tone-${index + 1}`} />
                <p>{text}</p>
                <div className="post-actions">
                  <span>♡ {likes}</span>
                  <span>💬</span>
                  <span>↗</span>
                  <span>🔖</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-section" id="features">
        <p className="section-label">Modern social architecture</p>
        <h2>Built for feed, DMs, stories and profiles.</h2>
        <div className="feature-grid">
          {features.map(([title, body]) => (
            <article className="feature-card" key={title}>
              <strong>{title}</strong>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-section safety-section" id="safety">
        <p className="section-label">Protected by existing systems</p>
        <h2>Your old features are preserved.</h2>
        <p>
          Authentication, Socket.io events, uploads, reports, notifications,
          profiles and admin moderation remain part of the app while the UI moves
          toward a production-ready Instagram-style social platform.
        </p>
      </section>

      <footer className="landing-legal-footer">
        <Link to="/privacy">Privacy Policy</Link>
        <Link to="/data-deletion">Data Deletion</Link>
        <a href="mailto:supportanonchat@gmail.com">Contact</a>
      </footer>
    </main>
  );
}
