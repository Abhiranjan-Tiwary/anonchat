import { Link } from "react-router-dom";
import Button from "../../components/Button.jsx";

export default function NotFound() {
  return (
    <main className="auth-page">
      <section className="auth-card">
        <span className="brand-glyph">404</span>
        <h1>Page not found</h1>
        <p>This AnonChat route does not exist.</p>
        <Link to="/">
          <Button>Go back</Button>
        </Link>
      </section>
    </main>
  );
}
