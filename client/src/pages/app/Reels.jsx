import { useState } from "react";

const reels = [
  { id: "r1", title: "Campus night reel", author: "@campus.circle", likes: "12.8K", comments: "821" },
  { id: "r2", title: "Build in public", author: "@dev.room", likes: "8.4K", comments: "312" },
  { id: "r3", title: "Anon vibes", author: "@anon.vibes", likes: "21K", comments: "1.4K" },
];

export default function Reels() {
  const [index, setIndex] = useState(0);
  const reel = reels[index];

  function next() {
    setIndex((current) => (current + 1) % reels.length);
  }

  function previous() {
    setIndex((current) => (current - 1 + reels.length) % reels.length);
  }

  return (
    <div className="ig-page ig-reels-page">
      <button className="ig-reel-nav up" type="button" onClick={previous}>⌃</button>
      <section className="ig-reel-phone">
        <div className="ig-reel-progress"><span style={{ width: `${((index + 1) / reels.length) * 100}%` }} /></div>
        <div className="ig-reel-content">
          <div>
            <strong>{reel.title}</strong>
            <span>{reel.author}</span>
            <p>Realtime counters and backend reels can connect here after Reel APIs are added.</p>
          </div>
          <aside>
            <button type="button">♡<span>{reel.likes}</span></button>
            <button type="button">💬<span>{reel.comments}</span></button>
            <button type="button">↗<span>Share</span></button>
          </aside>
        </div>
      </section>
      <button className="ig-reel-nav down" type="button" onClick={next}>⌄</button>
    </div>
  );
}
