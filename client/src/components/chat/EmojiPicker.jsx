export default function EmojiPicker({ onPick }) {
  return (
    <div className="emoji-picker">
      {["👍", "❤️", "😂", "😮", "🔥", "✨"].map((emoji) => (
        <button key={emoji} type="button" onClick={() => onPick?.(emoji)}>{emoji}</button>
      ))}
    </div>
  );
}
