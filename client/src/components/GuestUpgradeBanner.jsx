import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore.js";

export default function GuestUpgradeBanner({ compact = false, onDismiss }) {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  async function signUpFree() {
    await logout();
    navigate("/register");
  }

  return (
    <section className={`guest-upgrade-banner ${compact ? "compact" : ""}`}>
      <div>
        <strong>You are in Guest Mode.</strong>
        <p>Create a free account to unlock all features.</p>
      </div>
      <div className="guest-upgrade-actions">
        <button type="button" className="guest-signup-btn" onClick={signUpFree}>Sign Up Free</button>
        {onDismiss ? (
          <button type="button" className="guest-dismiss-btn" onClick={onDismiss} aria-label="Dismiss guest banner">
            x
          </button>
        ) : null}
      </div>
    </section>
  );
}
