import { useState } from "react";
import Button from "../../components/Button.jsx";
import { Card, CardHeader } from "../../components/Card.jsx";
import { useAuthStore } from "../../store/authStore.js";
import { useAdminStore } from "../../store/adminStore.js";
import { useToast } from "../../hooks/useToast.js";

export default function AdminSettings() {
  const { token, user } = useAuthStore();
  const { settings, updateSettings } = useAdminStore();
  const { toast } = useToast();
  const [form, setForm] = useState(settings);

  function patch(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function save() {
    await updateSettings(token, form);
    toast("Settings saved.", "success");
  }

  return (
    <div className="split-grid">
      <Card>
        <CardHeader title="Admin Profile" subtitle="Current authenticated super admin." />
        <div className="profile-summary">
          <span className="avatar avatar-violet">AD</span>
          <div>
            <strong>{user?.name || "Admin"}</strong>
            <small>Super Admin</small>
          </div>
        </div>
        <div className="form-stack">
          <label><span>Display name</span><input value={user?.name || "Admin"} readOnly /></label>
          <label><span>Role</span><input value="Super Admin" readOnly /></label>
        </div>
      </Card>
      <Card>
        <CardHeader title="Platform Settings" subtitle="Production controls for registration, safety, and capacity." action={<Button onClick={save}>Save Settings</Button>} />
        <div className="settings-list">
          <Toggle title="Maintenance Mode" body="Temporarily pause user access while admin remains online." checked={form.maintenanceMode} onChange={(value) => patch("maintenanceMode", value)} />
          <Toggle title="Registration Open" body="Allow new users to create accounts." checked={form.registrationOpen} onChange={(value) => patch("registrationOpen", value)} />
          <Toggle title="Profanity Filter" body="Flag banned terms before they reach public rooms." checked={form.profanityFilter} onChange={(value) => patch("profanityFilter", value)} />
          <label className="number-setting">
            <span>Max Room Size</span>
            <input type="number" min="10" max="1000" value={form.maxRoomSize} onChange={(event) => patch("maxRoomSize", Number(event.target.value))} />
          </label>
        </div>
      </Card>
    </div>
  );
}

function Toggle({ title, body, checked, onChange }) {
  return (
    <article className="setting-row">
      <div>
        <strong>{title}</strong>
        <p>{body}</p>
      </div>
      <label className="switch">
        <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
        <span />
      </label>
    </article>
  );
}
