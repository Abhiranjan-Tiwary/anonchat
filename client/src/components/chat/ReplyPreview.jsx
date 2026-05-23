export default function ReplyPreview({ message, onCancel }) {
  if (!message) return null;

  return (
    <div className="reply-preview">
      <div>
        <strong>Replying to {message.author || "Anonymous"}</strong>
        <p>{message.text}</p>
      </div>
      {onCancel ? <button type="button" onClick={onCancel}>x</button> : null}
    </div>
  );
}
