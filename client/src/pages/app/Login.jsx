import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../lib/api.js";
import { useAuthStore } from "../../store/authStore.js";
import { useToast } from "../../hooks/useToast.js";
import "../../styles/login.css";

const emptyForm = {
  identifier: "",
  fullName: "",
  contactNumber: "",
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  gender: "prefer-not",
  department: "",
  studyYear: "1",
  campus: "Quantum University",
};

const modeCopy = {
  login: {
    title: "Welcome back",
    subtitle: "Sign in to continue your anonymous journey",
    button: "Login to AnonChat →",
    footer: "Don't have an account?",
    action: "Sign up free",
    target: "register",
  },
  register: {
    title: "Create account",
    subtitle: "Join AnonChat — it's free and anonymous",
    button: "Create My Account →",
    footer: "Already have an account?",
    action: "Log in",
    target: "login",
  },
  admin: {
    title: "Admin login",
    subtitle: "Restricted to authorized personnel only",
    button: "Open Admin Console →",
    footer: "",
    action: "Back to user login",
    target: "login",
  },
};

const registerFields = [
  ["fullName", "Full Name", "text", "Your full name", "✦"],
  ["contactNumber", "Contact Number", "tel", "Phone number", "☎"],
  ["username", "Username", "text", "Choose a username", "@"],
  ["email", "Email", "email", "student@college.edu", "✉"],
  ["password", "Password", "password", "Create a password", "🔑"],
  ["confirmPassword", "Confirm Password", "password", "Repeat your password", "🔑"],
  ["department", "Department", "text", "CSE", "⌘"],
];

function validateEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function Login({ initialMode = "login" }) {
  const [mode, setMode] = useState(initialMode);
  const [form, setForm] = useState(emptyForm);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [resetStep, setResetStep] = useState("email");
  const [resetForm, setResetForm] = useState({ email: "", otp: "", resetToken: "", password: "" });
  const [resetError, setResetError] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const { login, register, adminLogin, loading } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  const copy = modeCopy[mode];

  useEffect(() => {
    switchMode(initialMode);
  }, [initialMode]);

  const fields = useMemo(() => {
    if (mode === "login") {
      return [
        ["identifier", "Username or Email", "text", "Enter your username or email", "@"],
        ["password", "Password", "password", "Enter your password", "🔑"],
      ];
    }

    if (mode === "admin") {
      return [
        ["identifier", "Admin Username", "text", "Enter admin username", "@"],
        ["password", "Password", "password", "Enter admin password", "🔑"],
      ];
    }

    return registerFields;
  }, [mode]);

  function patch(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
    setFieldErrors((current) => ({ ...current, [key]: "" }));
    setFormError("");
  }

  function switchMode(nextMode) {
    setMode(nextMode);
    setFieldErrors({});
    setFormError("");
  }

  function validate() {
    const errors = {};

    if (mode === "login" || mode === "admin") {
      if (!form.identifier.trim()) errors.identifier = mode === "admin" ? "Admin username is required." : "Username or email is required.";
      if (!form.password) errors.password = "Password is required.";
    }

    if (mode === "register") {
      if (!form.fullName.trim()) errors.fullName = "Full name is required.";
      if (!form.contactNumber.trim()) errors.contactNumber = "Contact number is required.";
      if (!/^[A-Za-z0-9_]{3,24}$/.test(form.username.trim())) errors.username = "Use 3-24 letters, numbers, or underscore.";
      if (!validateEmail(form.email.trim())) errors.email = "Enter a valid email address.";
      if (!/^[A-Za-z0-9!@#$%^&*_\-+=.?]{8,64}$/.test(form.password)) errors.password = "Use 8-64 characters with the allowed password symbols.";
      if (form.confirmPassword !== form.password) errors.confirmPassword = "Passwords do not match.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function submit(event) {
    event.preventDefault();
    if (!validate()) return;

    try {
      if (mode === "admin") {
        await adminLogin({ identifier: form.identifier, password: form.password });
        toast("Admin signed in.", "success");
        navigate("/admin/dashboard", { replace: true });
        return;
      }

      if (mode === "register") {
        await register({
          fullName: form.fullName,
          contactNumber: form.contactNumber,
          username: form.username,
          email: form.email,
          password: form.password,
          campus: form.campus,
          gender: form.gender,
          department: form.department,
          studyYear: form.studyYear,
        });
        toast("Account created.", "success");
        navigate("/chat", { replace: true });
        return;
      }

      await login({ identifier: form.identifier, password: form.password });
      toast("Logged in successfully.", "success");
      navigate("/chat", { replace: true });
    } catch (error) {
      setFormError(error.message);
    }
  }

  async function socialLogin(provider) {
    try {
      await api(`/api/auth/social/${provider}`, { method: "POST", body: {} });
    } catch (error) {
      setFormError(error.message);
    }
  }

  async function requestReset(event) {
    event.preventDefault();
    setResetError("");
    setResetSuccess(false);

    if (!validateEmail(resetForm.email)) {
      setResetError("Enter a valid email address.");
      return;
    }

    setResetLoading(true);
    try {
      const result = await api("/api/auth/password-reset/request", {
        method: "POST",
        body: { email: resetForm.email },
      });
      setResetForm((current) => ({
        ...current,
        otp: result.devOtp || "",
        resetToken: result.devResetToken || "",
      }));
      setResetStep("otp");
      toast(result.message || "Reset OTP sent.", "success");
    } catch (error) {
      setResetError(error.message);
    } finally {
      setResetLoading(false);
    }
  }

  function verifyResetOtp(event) {
    event.preventDefault();
    setResetError("");

    if (!resetForm.otp.trim()) {
      setResetError("OTP is required.");
      return;
    }

    if (!resetForm.resetToken.trim()) {
      setResetError("Reset token is missing. Request a fresh OTP.");
      return;
    }

    setResetStep("password");
  }

  async function confirmReset(event) {
    event.preventDefault();
    setResetError("");

    if (!resetForm.otp.trim()) {
      setResetError("OTP is required. Go back and enter the OTP.");
      return;
    }

    if (!resetForm.resetToken.trim()) {
      setResetError("Reset token is missing. Request a fresh OTP.");
      return;
    }

    if (!/^[A-Za-z0-9!@#$%^&*_\-+=.?]{8,64}$/.test(resetForm.password)) {
      setResetError("Use 8-64 characters with the allowed password symbols.");
      return;
    }

    setResetLoading(true);
    try {
      await api("/api/auth/password-reset/confirm", {
        method: "POST",
        body: {
          email: resetForm.email,
          otp: resetForm.otp,
          resetToken: resetForm.resetToken,
          password: resetForm.password,
        },
      });
      setResetSuccess(true);
      toast("Password reset successfully.", "success");
      window.setTimeout(() => {
        setResetOpen(false);
        setResetStep("email");
        setResetSuccess(false);
        setResetForm({ email: "", otp: "", resetToken: "", password: "" });
        switchMode("login");
      }, 2000);
    } catch (error) {
      setResetError(error.message);
    } finally {
      setResetLoading(false);
    }
  }

  function closeResetModal() {
    setResetOpen(false);
    setResetStep("email");
    setResetError("");
    setResetSuccess(false);
    setResetForm({ email: "", otp: "", resetToken: "", password: "" });
  }

  return (
    <main className="auth-premium-page">
      <span className="auth-orb orb-one" />
      <span className="auth-orb orb-two" />
      <span className="auth-orb orb-three" />

      <section className="auth-brand-panel">
        <Link className="auth-brand-row" to="/">
          <span><img src="/assets/logo/logo.png" alt="AnonChat logo" /></span>
          <strong>AnonChat</strong>
        </Link>

        <div className="auth-brand-content">
          <div className="online-pill"><span />2,482 users online right now</div>
          <h1>
            <span>Your identity,</span>
            <span>your rules.</span>
          </h1>
          <p>Join thousands of students chatting freely and safely. No real name. No judgment. Just real conversations.</p>

          <div className="auth-feature-list">
            <AuthFeature icon="🔒" title="100% Anonymous" text="Your real identity is never exposed to other users" tone="violet" />
            <AuthFeature icon="⚡" title="Real-time Messaging" text="Socket-powered instant chat with typing indicators" tone="green" />
            <AuthFeature icon="🛡️" title="Admin Protected" text="24/7 moderation keeps every room safe" tone="amber" />
          </div>

          <article className="testimonial-card">
            <p>"AnonChat gave me a safe space to share my thoughts without fear. The anonymity feature is brilliant."</p>
            <div>
              <span>AU</span>
              <div>
                <strong>Anonymous User #7821</strong>
                <small>CSE Student · Quantum University</small>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="auth-card-panel">
        <form className="premium-auth-card" onSubmit={submit} noValidate>
          <div className="auth-tabs" role="tablist" aria-label="Auth mode">
            {["login", "register", "admin"].map((tab) => (
              <button
                type="button"
                role="tab"
                aria-selected={mode === tab}
                className={mode === tab ? "active" : ""}
                key={tab}
                onClick={() => switchMode(tab)}
              >
                {tab === "login" ? "Login" : tab === "register" ? "Register" : "Admin"}
              </button>
            ))}
          </div>

          <h1>{copy.title}</h1>
          <p className="auth-subtitle">{copy.subtitle}</p>

          {mode !== "admin" ? (
            <>
              <div className="social-grid">
                <button type="button" onClick={() => socialLogin("google")}><span className="google-icon">G</span> Google</button>
                <button type="button" onClick={() => socialLogin("facebook")}><span className="facebook-icon">f</span> Facebook</button>
              </div>
              <div className="auth-divider"><span>or continue with email</span></div>
            </>
          ) : null}

          <div className={mode === "register" ? "auth-field-grid" : "auth-field-stack"}>
            {fields.map(([name, label, type, placeholder, icon]) => (
              <AuthField
                key={name}
                name={name}
                label={label}
                type={type}
                placeholder={placeholder}
                icon={icon}
                value={form[name]}
                error={fieldErrors[name]}
                showPassword={name === "confirmPassword" ? showConfirm : showPassword}
                onTogglePassword={name === "confirmPassword" ? () => setShowConfirm((value) => !value) : () => setShowPassword((value) => !value)}
                onChange={(value) => patch(name, value)}
              />
            ))}

            {mode === "register" ? (
              <>
                <SelectField name="gender" label="Gender" icon="◌" value={form.gender} onChange={(value) => patch("gender", value)}>
                  <option value="prefer-not">Prefer not to say</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                </SelectField>
                <SelectField name="studyYear" label="Study Year" icon="#" value={form.studyYear} onChange={(value) => patch("studyYear", value)}>
                  <option value="1">1st year</option>
                  <option value="2">2nd year</option>
                  <option value="3">3rd year</option>
                  <option value="4">4th year</option>
                </SelectField>
                <SelectField name="campus" label="Campus" icon="⌂" value={form.campus} onChange={(value) => patch("campus", value)}>
                  <option value="Quantum University">Quantum University</option>
                  <option value="Your College">Your College</option>
                  <option value="Campus Community">Campus Community</option>
                </SelectField>
              </>
            ) : null}
          </div>

          {mode === "login" ? (
            <div className="remember-row">
              <label><input type="checkbox" /> Remember me</label>
              <button type="button" onClick={() => setResetOpen(true)}>Forgot password?</button>
            </div>
          ) : null}

          {formError ? <div className="auth-form-error">{formError}</div> : null}

          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? "Please wait..." : copy.button}
          </button>

          <p className="auth-card-footer">
            {copy.footer ? `${copy.footer} ` : ""}
            <button type="button" onClick={() => switchMode(copy.target)}>{copy.action}</button>
          </p>
        </form>
      </section>

      {resetOpen ? (
        <div className="reset-modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && closeResetModal()}>
          <form className="reset-modal" onSubmit={resetStep === "email" ? requestReset : resetStep === "otp" ? verifyResetOtp : confirmReset}>
            <div className="reset-modal-head">
              <div>
                <h2>Password reset</h2>
                <p>{resetSuccess ? "Redirecting you back to login..." : resetStepCopy(resetStep).caption}</p>
              </div>
              <button type="button" onClick={closeResetModal} aria-label="Close password reset">×</button>
            </div>

            <ResetStepIndicator step={resetStep} success={resetSuccess} />

            {resetSuccess ? (
              <div className="reset-success-state">
                <span>✅</span>
                <h3>Password reset successfully!</h3>
                <p>You can now log in with your new password.</p>
              </div>
            ) : null}

            {!resetSuccess && resetStep === "email" ? (
              <div className="reset-step-panel">
                <h3>Enter your email</h3>
                <p>We will send a secure OTP to your registered email.</p>
                <AuthField
                  name="resetEmail"
                  label="Email"
                  type="email"
                  placeholder="student@college.edu"
                  icon="✉"
                  value={resetForm.email}
                  error={resetError}
                  onChange={(value) => setResetForm((current) => ({ ...current, email: value }))}
                />
              </div>
            ) : null}

            {!resetSuccess && resetStep === "otp" ? (
              <div className="reset-step-panel">
                <h3>Enter OTP</h3>
                <p>Use the OTP sent to {resetForm.email || "your email"}.</p>
                <AuthField
                  name="otp"
                  label="OTP"
                  type="text"
                  placeholder="6-digit OTP"
                  icon="#"
                  value={resetForm.otp}
                  error={resetError}
                  onChange={(value) => setResetForm((current) => ({ ...current, otp: value }))}
                />
                <button className="reset-back-link" type="button" onClick={() => { setResetError(""); setResetStep("email"); }}>
                  Back to email
                </button>
              </div>
            ) : null}

            {!resetSuccess && resetStep === "password" ? (
              <div className="reset-step-panel">
                <h3>New Password</h3>
                <p>Create a strong password for your AnonChat account.</p>
                <AuthField
                  name="resetPassword"
                  label="New Password"
                  type="password"
                  placeholder="Create new password"
                  icon="🔑"
                  value={resetForm.password}
                  error={resetError}
                  showPassword={showPassword}
                  onTogglePassword={() => setShowPassword((value) => !value)}
                  onChange={(value) => setResetForm((current) => ({ ...current, password: value }))}
                />
                <button className="reset-back-link" type="button" onClick={() => { setResetError(""); setResetStep("otp"); }}>
                  Back to OTP
                </button>
              </div>
            ) : null}

            {!resetSuccess ? (
              <button className="auth-submit reset-primary-btn" type="submit" disabled={resetLoading}>
                {resetLoading ? "Please wait..." : resetStepCopy(resetStep).button}
              </button>
            ) : null}
          </form>
        </div>
      ) : null}
    </main>
  );
}

function resetStepCopy(step) {
  return {
    email: {
      caption: "Step 1 of 3 · Enter your account email to receive a reset OTP.",
      button: "Send OTP",
    },
    otp: {
      caption: "Step 2 of 3 · Verify the OTP sent to your email.",
      button: "Verify OTP",
    },
    password: {
      caption: "Step 3 of 3 · Choose a new secure password.",
      button: "Reset Password",
    },
  }[step];
}

function ResetStepIndicator({ step, success }) {
  const activeIndex = success ? 3 : ["email", "otp", "password"].indexOf(step);

  return (
    <div className="reset-step-indicator" aria-label="Password reset progress">
      {[0, 1, 2].map((index) => (
        <div className="reset-step-node-wrap" key={index}>
          <span className={index <= activeIndex ? "filled" : ""} />
          {index < 2 ? <i className={index < activeIndex ? "filled" : ""} /> : null}
        </div>
      ))}
    </div>
  );
}

function AuthFeature({ icon, title, text, tone }) {
  return (
    <div className="auth-feature-item">
      <span className={tone}>{icon}</span>
      <div>
        <strong>{title}</strong>
        <small>{text}</small>
      </div>
    </div>
  );
}

function AuthField({ name, label, type, placeholder, icon, value, error, showPassword, onTogglePassword, onChange }) {
  const isPassword = type === "password";

  return (
    <label className={`premium-field ${error ? "invalid" : ""}`} htmlFor={name}>
      <span>{label}</span>
      <i>{icon}</i>
      <input
        id={name}
        type={isPassword && showPassword ? "text" : type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={isPassword ? "current-password" : name === "email" ? "email" : "off"}
      />
      {isPassword ? (
        <button type="button" onClick={onTogglePassword}>{showPassword ? "Hide" : "Show"}</button>
      ) : null}
      {error ? <em>{error}</em> : null}
    </label>
  );
}

function SelectField({ name, label, icon, value, onChange, children }) {
  return (
    <label className="premium-field" htmlFor={name}>
      <span>{label}</span>
      <i>{icon}</i>
      <select id={name} value={value} onChange={(event) => onChange(event.target.value)}>
        {children}
      </select>
    </label>
  );
}
