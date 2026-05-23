import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/Button.jsx";
import { useAuthStore } from "../../store/authStore.js";
import { useToast } from "../../hooks/useToast.js";

export default function Register() {
  const [form, setForm] = useState({
    fullName: "",
    contactNumber: "",
    username: "",
    email: "",
    password: "",
    campus: "Your College",
    gender: "prefer-not",
    department: "",
    studyYear: "1",
  });
  const { register, loading, error } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();

  function patch(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(event) {
    event.preventDefault();
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
          <label><span>Full name</span><input value={form.fullName} onChange={(e) => patch("fullName", e.target.value)} required /></label>
          <label><span>Phone</span><input value={form.contactNumber} onChange={(e) => patch("contactNumber", e.target.value)} required /></label>
          <label><span>Username</span><input value={form.username} onChange={(e) => patch("username", e.target.value)} required /></label>
          <label><span>Email</span><input type="email" value={form.email} onChange={(e) => patch("email", e.target.value)} required /></label>
          <label><span>Department</span><input value={form.department} onChange={(e) => patch("department", e.target.value)} /></label>
          <label><span>Study year</span><select value={form.studyYear} onChange={(e) => patch("studyYear", e.target.value)}><option value="1">1st year</option><option value="2">2nd year</option><option value="3">3rd year</option><option value="4">4th year</option></select></label>
        </div>
        <label><span>Password</span><input type="password" value={form.password} onChange={(e) => patch("password", e.target.value)} required /></label>
        {error ? <div className="inline-error">{error}</div> : null}
        <Button loading={loading} type="submit">Create Account</Button>
        <p className="auth-switch">Already have an account? <Link to="/login">Log in</Link></p>
      </form>
    </main>
  );
}
