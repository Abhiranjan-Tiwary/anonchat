import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/Button.jsx";
import { useAuthStore } from "../../store/authStore.js";
import { useToast } from "../../hooks/useToast.js";

export default function Register() {
  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    dateOfBirth: "",
  });
  const [formError, setFormError] = useState("");
  const { register, loading, error } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();

  function patch(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
    setFormError("");
  }

  function validate() {
    if (!form.fullName.trim()) return "Full name is required.";
    if (!/^[A-Za-z0-9_]{3,24}$/.test(form.username.trim())) return "Username must be 3-24 characters using letters, numbers, or underscore.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return "Enter a valid email address.";
    if (!/^[A-Za-z0-9!@#$%^&*_\-+=.?]{8,64}$/.test(form.password)) return "Use 8-64 characters with the allowed password symbols.";
    if (!form.dateOfBirth) return "Date of birth is required.";

    const birthDate = new Date(`${form.dateOfBirth}T00:00:00.000Z`);
    const today = new Date();
    const todayUtc = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
    if (Number.isNaN(birthDate.getTime()) || birthDate.toISOString().slice(0, 10) !== form.dateOfBirth) return "Enter a valid date of birth.";
    if (birthDate.getTime() > todayUtc) return "Date of birth cannot be in the future.";

    return "";
  }

  async function submit(event) {
    event.preventDefault();
    const validationError = validate();
    if (validationError) {
      setFormError(validationError);
      return;
    }
    await register(form);
    toast("Account created.", "success");
    navigate("/dashboard", { replace: true });
  }

  return (
    <main className="auth-page">
      <form className="auth-card wide" onSubmit={submit}>
        <span className="brand-glyph">A</span>
        <h1>Create AnonChat Account</h1>
        <p>Your display name and profile stay private in public rooms.</p>
        <div className="form-grid">
          <label><span>Full Name *</span><input value={form.fullName} onChange={(e) => patch("fullName", e.target.value)} required /></label>
          <label><span>Username *</span><input value={form.username} onChange={(e) => patch("username", e.target.value)} required /></label>
          <label><span>Email *</span><input type="email" value={form.email} onChange={(e) => patch("email", e.target.value)} required /></label>
          <label><span>Date of Birth *</span><input type="date" value={form.dateOfBirth} onChange={(e) => patch("dateOfBirth", e.target.value)} required /></label>
        </div>
        <label><span>Password *</span><input type="password" value={form.password} onChange={(e) => patch("password", e.target.value)} required /></label>
        {formError || error ? <div className="inline-error">{formError || error}</div> : null}
        <Button loading={loading} type="submit">Create Account</Button>
        <p className="auth-switch">Already have an account? <Link to="/login">Log in</Link></p>
      </form>
    </main>
  );
}
