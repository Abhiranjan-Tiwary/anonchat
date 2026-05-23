export default function MembersList({ members = [] }) {
  return (
    <div className="members-list">
      {members.map((member) => (
        <div key={member.id || member.name}>
          <span className="status-dot" />
          <strong>{member.name}</strong>
        </div>
      ))}
    </div>
  );
}
