const reactions = ["👍", "❤️", "😂", "😮"];

export default function MessageReactions({ selected = [], onReact }) {
  return (
    <div className="message-reactions">
      {reactions.map((reaction) => (
        <button className={selected.includes(reaction) ? "active" : ""} type="button" key={reaction} onClick={() => onReact?.(reaction)}>
          {reaction}
        </button>
      ))}
    </div>
  );
}
