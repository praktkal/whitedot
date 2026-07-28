import { useState } from "react";

// ─── Thirukural data — Book → Chapters → Verses ───
const THIRUKURAL = {
  name: "Thirukural",
  origin: "Tamil Nadu, India",
  intro: "Written by Thiruvalluvar over 2000 years ago. 1330 couplets on how to live — arranged in three books: virtue, wealth, and love. Considered one of the greatest works ever written on ethics.",
  books: [
    {
      name: "Aram",
      english: "Virtue",
      note: "Righteousness, gratitude, self-control, compassion.",
      chapters: [
        {
          chapter: "Chapter 1",
          title: "In Praise of the Divine",
          verses: [
            { kural: "Kural 7", verse: "They alone escape the sorrows of the mind who take refuge at the feet of the incomparable one." },
          ],
        },
        {
          chapter: "Chapter 11",
          title: "Gratitude",
          verses: [
            { kural: "Kural 101", verse: "One may escape after slaying every goodness — but there is no escape for one who slays gratitude." },
            { kural: "Kural 108", verse: "It is not good to forget a kindness. It is good to forget at once an unkindness done to us." },
          ],
        },
        {
          chapter: "Chapter 13",
          title: "Self Control",
          verses: [
            { kural: "Kural 121", verse: "Self control leads one among the gods. Its absence drives one into deepest darkness." },
          ],
        },
      ],
    },
    {
      name: "Porul",
      english: "Wealth",
      note: "Wisdom, learning, perseverance, leadership.",
      chapters: [
        {
          chapter: "Chapter 40",
          title: "Learning",
          verses: [
            { kural: "Kural 396", verse: "The more you dig a sand spring, the more it flows. The more you learn, the more wisdom flows." },
          ],
        },
        {
          chapter: "Chapter 43",
          title: "Wisdom",
          verses: [
            { kural: "Kural 425", verse: "Wisdom is to walk with the world, moving as it moves." },
          ],
        },
        {
          chapter: "Chapter 62",
          title: "Perseverance",
          verses: [
            { kural: "Kural 620", verse: "Those who tirelessly strive will even overcome the fate that stands against them." },
          ],
        },
      ],
    },
    {
      name: "Inbam",
      english: "Love",
      note: "Longing, tenderness, the joy of union.",
      chapters: [
        {
          chapter: "Chapter 111",
          title: "The Union",
          verses: [
            { kural: "Kural 1101", verse: "All the joys the five senses can give are found together in one who is truly loved." },
          ],
        },
        {
          chapter: "Chapter 129",
          title: "Longing to Meet",
          verses: [
            { kural: "Kural 1281", verse: "To think of love is joy. To see it is greater joy still." },
          ],
        },
      ],
    },
  ],
};

const CONCEPTS = [
  { id: "thirukural", name: "Thirukural", sub: "Tamil wisdom", status: "live" },
  { id: "nanak", name: "Guru Nanak", sub: "Punjabi wisdom", status: "soon" },
  { id: "gandhi", name: "Gandhi", sub: "Indian thought", status: "soon" },
  { id: "rumi", name: "Rumi", sub: "Sufi poetry", status: "soon" },
  { id: "nietzsche", name: "Nietzsche", sub: "Western philosophy", status: "soon" },
  { id: "kant", name: "Kant", sub: "Western philosophy", status: "soon" },
  { id: "socrates", name: "Socrates", sub: "Greek philosophy", status: "soon" },
  { id: "plato", name: "Plato", sub: "Greek philosophy", status: "soon" },
];

// Detail square — chest reference (upper left, as worn)
function ChestSquare({ book, kural, size = 300 }) {
  return (
    <div style={{
      width: size, height: size, background: "#0a0a0a",
      border: "1px solid #1e1e1e", position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.012) 0px, rgba(255,255,255,0.012) 1px, transparent 1px, transparent 3px)",
      }} />
      <div style={{
        position: "absolute", top: size * 0.22, left: size * 0.18,
        textAlign: "center", fontFamily: "'Georgia', serif",
      }}>
        <div style={{ fontSize: size * 0.045, letterSpacing: "0.25em", color: "#fff", fontWeight: 500 }}>{book.toUpperCase()}</div>
        <div style={{ width: size * 0.02, height: size * 0.02, borderRadius: "50%", background: "#fff", margin: `${size * 0.03}px auto` }} />
        <div style={{ fontSize: size * 0.035, letterSpacing: "0.18em", color: "rgba(255,255,255,0.72)" }}>{kural.toUpperCase()}</div>
      </div>
      <div style={{ position: "absolute", bottom: 14, left: 16, fontSize: 9, letterSpacing: "0.2em", color: "rgba(255,255,255,0.22)", fontFamily: "sans-serif" }}>
        LEFT CHEST · AS WORN
      </div>
    </div>
  );
}

// Detail square — verse patch (lower right, as worn)
function PatchSquare({ verse, size = 300 }) {
  return (
    <div style={{
      width: size, height: size, background: "#0a0a0a",
      border: "1px solid #1e1e1e", position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.012) 0px, rgba(255,255,255,0.012) 1px, transparent 1px, transparent 3px)",
      }} />
      <div style={{
        position: "absolute", bottom: size * 0.16, right: size * 0.14,
        width: size * 0.46, padding: size * 0.035,
        border: "1px dashed rgba(200,185,140,0.4)",
        textAlign: "center", fontFamily: "'Georgia', serif",
      }}>
        <div style={{ fontSize: size * 0.03, color: "rgba(185,175,140,0.9)", lineHeight: 1.55, fontStyle: "italic" }}>
          {verse}
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 14, left: 16, fontSize: 9, letterSpacing: "0.2em", color: "rgba(255,255,255,0.22)", fontFamily: "sans-serif" }}>
        LOWER RIGHT · AS WORN
      </div>
    </div>
  );
}

export default function WhiteDot() {
  const [screen, setScreen] = useState("landing"); // landing | concepts | thirukural | product
  const [fade, setFade] = useState(true);
  const [selected, setSelected] = useState(null);

  const sans = "'Helvetica Neue', Arial, sans-serif";

  const go = (s) => { setScreen(s); window.scrollTo(0, 0); };

  // ─── LANDING ───
  if (screen === "landing") {
    return (
      <div style={{
        minHeight: "100vh", background: "#000",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        fontFamily: sans, gap: 48,
      }}>
        <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#fff", boxShadow: "0 0 30px rgba(255,255,255,0.25)" }} />
        <div style={{ fontSize: 15, letterSpacing: "0.35em", color: "#fff", textTransform: "uppercase" }}>White Dot</div>
        <button
          onClick={() => go("concepts")}
          style={{
            background: "transparent", border: "1px solid rgba(255,255,255,0.2)",
            color: "rgba(255,255,255,0.5)", fontSize: 11, letterSpacing: "0.3em",
            textTransform: "uppercase", padding: "16px 48px", cursor: "pointer",
            fontFamily: sans, transition: "all 0.4s",
          }}
          onMouseEnter={e => { e.target.style.borderColor = "rgba(255,255,255,0.6)"; e.target.style.color = "#fff"; }}
          onMouseLeave={e => { e.target.style.borderColor = "rgba(255,255,255,0.2)"; e.target.style.color = "rgba(255,255,255,0.5)"; }}
        >
          Enter
        </button>
      </div>
    );
  }

  // ─── Header for inner screens ───
  const Header = () => (
    <header style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "26px 40px", borderBottom: "1px solid #1a1a1a",
      position: "sticky", top: 0, background: "#000", zIndex: 10,
    }}>
      <div onClick={() => go("concepts")} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
        <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#fff" }} />
        <span style={{ fontSize: 13, letterSpacing: "0.15em", fontWeight: 500, color: "#fff" }}>WHITE DOT</span>
      </div>
      <span onClick={() => go("concepts")} style={{ fontSize: 11, letterSpacing: "0.1em", color: "#666", cursor: "pointer" }}>ALL CONCEPTS</span>
    </header>
  );

  // ─── CONCEPTS ───
  if (screen === "concepts") {
    return (
      <div style={{ minHeight: "100vh", background: "#000", color: "#e8e8e8", fontFamily: sans }}>
        <Header />
        <div style={{ textAlign: "center", padding: "80px 24px 56px", maxWidth: 560, margin: "0 auto" }}>
          <div style={{ fontSize: 20, lineHeight: 1.7, fontFamily: "'Georgia', serif", color: "#fff", fontStyle: "italic" }}>
            Concept clothing. Wisdom from cultures across the world — worn quietly.
          </div>
          <div style={{ fontSize: 13, color: "#666", marginTop: 20, lineHeight: 1.8 }}>
            Each collection draws from one tradition. The words stay close to the body. The world need not see them.
          </div>
        </div>

        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 0, borderTop: "1px solid #1a1a1a",
        }}>
          {CONCEPTS.map(c => (
            <div
              key={c.id}
              onClick={() => c.status === "live" && go(c.id)}
              style={{
                borderRight: "1px solid #1a1a1a", borderBottom: "1px solid #1a1a1a",
                padding: "56px 40px", cursor: c.status === "live" ? "pointer" : "default",
                minHeight: 220, display: "flex", flexDirection: "column",
                justifyContent: "center", alignItems: "center", textAlign: "center",
                transition: "background 0.3s", position: "relative",
              }}
              onMouseEnter={e => { if (c.status === "live") e.currentTarget.style.background = "#080808"; }}
              onMouseLeave={e => e.currentTarget.style.background = "#000"}
            >
              <div style={{ fontSize: 19, letterSpacing: "0.08em", color: c.status === "live" ? "#fff" : "#444", fontFamily: "'Georgia', serif", marginBottom: 10 }}>
                {c.name}
              </div>
              <div style={{ fontSize: 12, letterSpacing: "0.1em", color: c.status === "live" ? "#888" : "#333", textTransform: "uppercase" }}>
                {c.sub}
              </div>
              {c.status === "soon" && (
                <div style={{ fontSize: 9, letterSpacing: "0.2em", color: "#333", marginTop: 20, textTransform: "uppercase" }}>
                  Under construction
                </div>
              )}
              {c.status === "live" && (
                <div style={{ fontSize: 9, letterSpacing: "0.2em", color: "#7effc4", marginTop: 20, textTransform: "uppercase" }}>
                  Explore →
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ─── THIRUKURAL background + books ───
  if (screen === "thirukural") {
    return (
      <div style={{ minHeight: "100vh", background: "#000", color: "#e8e8e8", fontFamily: sans }}>
        <Header />

        {/* Intro */}
        <div style={{ maxWidth: 620, margin: "0 auto", padding: "80px 32px 56px", textAlign: "center" }}>
          <div style={{ fontSize: 12, letterSpacing: "0.25em", color: "#666", marginBottom: 20, textTransform: "uppercase" }}>
            {THIRUKURAL.origin}
          </div>
          <div style={{ fontSize: 30, fontFamily: "'Georgia', serif", color: "#fff", marginBottom: 28 }}>
            {THIRUKURAL.name}
          </div>
          <div style={{ fontSize: 15, lineHeight: 1.9, color: "#999", fontFamily: "'Georgia', serif" }}>
            {THIRUKURAL.intro}
          </div>
        </div>

        {/* Books → Chapters → Verses */}
        {THIRUKURAL.books.map((book, bi) => (
          <div key={bi} style={{ borderTop: "1px solid #1a1a1a" }}>
            <div style={{ maxWidth: 820, margin: "0 auto", padding: "48px 32px" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 8 }}>
                <div style={{ fontSize: 22, fontFamily: "'Georgia', serif", color: "#fff" }}>{book.name}</div>
                <div style={{ fontSize: 13, color: "#666", letterSpacing: "0.1em", textTransform: "uppercase" }}>{book.english}</div>
              </div>
              <div style={{ fontSize: 13, color: "#777", marginBottom: 40, fontStyle: "italic", fontFamily: "'Georgia', serif" }}>
                {book.note}
              </div>

              {/* Chapters */}
              <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
                {book.chapters.map((ch, ci) => (
                  <div key={ci}>
                    {/* chapter header */}
                    <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid #161616" }}>
                      <div style={{ fontSize: 11, letterSpacing: "0.15em", color: "#7effc4", textTransform: "uppercase" }}>{ch.chapter}</div>
                      <div style={{ fontSize: 14, color: "#aaa", fontFamily: "'Georgia', serif", fontStyle: "italic" }}>{ch.title}</div>
                    </div>

                    {/* verses in chapter */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                      {ch.verses.map((v, vi) => (
                        <div
                          key={vi}
                          onClick={() => { setSelected({ book: book.name, chapter: ch.chapter, title: ch.title, ...v }); go("product"); }}
                          style={{
                            display: "flex", justifyContent: "space-between", alignItems: "center",
                            padding: "20px 24px", cursor: "pointer",
                            background: "#080808", border: "1px solid #161616",
                            transition: "all 0.3s", gap: 24,
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = "#111"; e.currentTarget.style.borderColor = "#2a2a2a"; }}
                          onMouseLeave={e => { e.currentTarget.style.background = "#080808"; e.currentTarget.style.borderColor = "#161616"; }}
                        >
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 10, letterSpacing: "0.12em", color: "#666", marginBottom: 8, textTransform: "uppercase" }}>
                              {v.kural}
                            </div>
                            <div style={{ fontSize: 15, lineHeight: 1.6, color: "#ccc", fontFamily: "'Georgia', serif", fontStyle: "italic" }}>
                              {v.verse}
                            </div>
                          </div>
                          <div style={{ fontSize: 11, color: "#555", letterSpacing: "0.15em", whiteSpace: "nowrap" }}>VIEW TEE →</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        <div style={{ textAlign: "center", padding: "40px", fontSize: 11, color: "#555", letterSpacing: "0.1em", borderTop: "1px solid #1a1a1a" }}>
          MORE VERSES BEING ADDED
        </div>
      </div>
    );
  }

  // ─── PRODUCT ───
  if (screen === "product" && selected) {
    return (
      <div style={{ minHeight: "100vh", background: "#000", color: "#e8e8e8", fontFamily: sans }}>
        <Header />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "calc(100vh - 74px)" }}>
          {/* squares */}
          <div style={{
            background: "#050505", display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: 32, padding: 56,
            borderRight: "1px solid #1a1a1a",
          }}>
            <ChestSquare book={selected.book} kural={selected.kural} size={300} />
            <PatchSquare verse={selected.verse} size={300} />
          </div>

          {/* details */}
          <div style={{ padding: "64px 56px", display: "flex", flexDirection: "column", gap: 32, maxWidth: 480 }}>
            <div>
              <div onClick={() => go("thirukural")} style={{ fontSize: 11, color: "#666", letterSpacing: "0.1em", cursor: "pointer", marginBottom: 32 }}>
                ← BACK TO THIRUKURAL
              </div>
              <div style={{ fontSize: 20, letterSpacing: "0.05em", marginBottom: 8, fontFamily: "'Georgia', serif", color: "#fff" }}>
                {selected.book} · {selected.chapter} · {selected.kural}
              </div>
              <div style={{ fontSize: 14, color: "#666" }}>$95</div>
            </div>

            <div style={{ borderLeft: "2px solid #333", paddingLeft: 20, fontSize: 15, lineHeight: 1.7, fontStyle: "italic", color: "#aaa", fontFamily: "'Georgia', serif" }}>
              {selected.verse}
            </div>

            <div>
              <div style={{ fontSize: 11, letterSpacing: "0.15em", color: "#666", marginBottom: 14 }}>SIZE</div>
              <div style={{ display: "flex", gap: 8 }}>
                {["XS","S","M","L","XL","XXL"].map(s => (
                  <button key={s} style={{
                    width: 44, height: 44, border: "1px solid #333", background: "transparent",
                    color: "#ccc", fontSize: 12, cursor: "pointer", fontFamily: sans, transition: "all 0.2s",
                  }}
                    onMouseEnter={e => { e.target.style.borderColor = "#fff"; }}
                    onMouseLeave={e => { e.target.style.borderColor = "#333"; }}
                  >{s}</button>
                ))}
              </div>
            </div>

            <button style={{
              padding: "16px", background: "#fff", color: "#000", border: "none",
              fontSize: 12, letterSpacing: "0.2em", cursor: "pointer", fontFamily: sans,
            }}>
              ADD TO CART
            </button>

            <div style={{ fontSize: 12, color: "#666", lineHeight: 2, borderTop: "1px solid #1a1a1a", paddingTop: 24 }}>
              280gsm heavyweight cotton · Made in India<br />
              Reference embroidered upper left, as worn<br />
              Verse on a 2×2 patch, lower right<br />
              Free shipping worldwide
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
