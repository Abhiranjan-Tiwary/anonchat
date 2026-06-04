const tiles = Array.from({ length: 15 }, (_, index) => ({
  id: index + 1,
  label: ["Campus", "Code", "Design", "Events", "Memes"][index % 5],
  size: index % 7 === 0 ? "large" : "normal",
}));

export default function Explore() {
  return (
    <div className="ig-page ig-single-column-page">
      <div className="ig-page-head">
        <h1>Explore</h1>
        <p>Discover trending conversations and creator-style posts.</p>
      </div>
      <section className="ig-explore-grid">
        {tiles.map((tile) => (
          <article className={`ig-explore-tile ${tile.size}`} key={tile.id}>
            <span>{tile.label}</span>
          </article>
        ))}
      </section>
    </div>
  );
}
