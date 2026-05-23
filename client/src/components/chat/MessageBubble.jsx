export default function MessageBubble({ author, text, self }) {
  return (
    <article className={`chat-bubble ${self ? "self" : ""}`}>
      <strong>{author}</strong>
      <p>{text}</p>
    </article>
  );
}
