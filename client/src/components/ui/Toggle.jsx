export default function Toggle({ checked, onChange, label }) {
  return (
    <label className="switch" aria-label={label}>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <span />
    </label>
  );
}
