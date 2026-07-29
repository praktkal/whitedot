import { useState, useEffect, useRef } from "react";

// A rotating set of Kurals — in production this cycles through all 1330.
const KURALS = [
  { n: 7, book: "Aram", chapter: "In Praise of God", tamil: "தனக்கு உவமை இல்லாதான் தாள்சேர்ந்தார்க்கு அல்லால் மனக்கவலை மாற்றல் அரிது", verse: "They alone escape the sorrows of the mind who take refuge at the feet of the incomparable one." },
  { n: 101, book: "Aram", chapter: "Gratitude", tamil: "செய்யாமல் செய்த உதவிக்கு வையகமும் வானகமும் ஆற்றல் அரிது", verse: "One may escape after slaying every goodness — but there is no escape for one who slays gratitude." },
  { n: 121, book: "Aram", chapter: "Self Control", tamil: "அடக்கம் அமரருள் உய்க்கும் அடங்காமை ஆரிருள் உய்த்து விடும்", verse: "Self control leads one among the gods. Its absence drives one into deepest darkness." },
  { n: 396, book: "Porul", chapter: "Learning", tamil: "தொட்டனைத்து ஊறும் மணற்கேணி மாந்தர்க்குக் கற்றனைத்து ஊறும் அறிவு", verse: "The more you dig a sand spring, the more it flows. The more you learn, the more wisdom flows." },
  { n: 425, book: "Porul", chapter: "Wisdom", tamil: "உலகம் தழீஇயது ஒட்பம் மலர்தலும் கூம்பலும் இல்லது அறிவு", verse: "Wisdom is to walk with the world, moving as it moves." },
  { n: 620, book: "Porul", chapter: "Perseverance", tamil: "ஊழையும் உப்பக்கம் காண்பர் உலைவின்றித் தாழாது உஞற்று பவர்", verse: "Those who tirelessly strive will even overcome the fate that stands against them." },
  { n: 1281, book: "Inbam", chapter: "(Longing)", tamil: "உள்ளக் களித்தலும் காண மகிழ்தலும் கள்ளுக்கு இல் காமத்திற்கு உண்டு", verse: "To think of love is joy. To see it is greater joy still." },
];

// A fresh Kural each visit
function kuralOfTheDay() {
  return KURALS[Math.floor(Math.random() * KURALS.length)];
}

const PRODUCTS = [
  { id: "tee-black", name: "The Tee", detail: "Black · white dot · 280gsm cotton", price: 95, kind: "garment", color: "black" },
  { id: "hoodie-black", name: "The Hooded Sweatshirt", detail: "Black · white dot · heavyweight", price: 165, kind: "garment", color: "black" },
  { id: "mug", name: "The Mug", detail: "Matte black stoneware · verse glazed inside", price: 32, kind: "mug", color: "black" },
];

export default function WhiteDot() {
  const [screen, setScreen] = useState("landing"); // landing | timer | kural | shop
  const [fade, setFade] = useState(false);
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const [dotBreath, setDotBreath] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const timerRef = useRef(null);
  const wakeLockRef = useRef(null);
  const today = kuralOfTheDay();

  useEffect(() => { setTimeout(() => setFade(true), 120); }, []);

  const requestWakeLock = async () => {
    try { if ("wakeLock" in navigator) wakeLockRef.current = await navigator.wakeLock.request("screen"); } catch {}
  };
  const releaseWakeLock = async () => {
    try { if (wakeLockRef.current) { await wakeLockRef.current.release(); wakeLockRef.current = null; } } catch {}
  };

  const playBell = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      [0, 1.2, 2.2].forEach((delay, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.frequency.value = 528 - i * 24; osc.type = "sine";
        const start = ctx.currentTime + delay;
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.3, start + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 3.5);
        osc.start(start); osc.stop(start + 3.5);
      });
    } catch {}
  };

  const startTimer = () => {
    if (started) return;
    setStarted(true); setDotBreath(true); requestWakeLock();
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          releaseWakeLock(); playBell();
          setTimeout(() => { setScreen("close"); window.scrollTo(0,0); }, 800);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const skipToKural = () => {
    clearInterval(timerRef.current); releaseWakeLock();
    setScreen("close"); window.scrollTo(0,0);
  };

  useEffect(() => () => { clearInterval(timerRef.current); releaseWakeLock(); }, []);

  const fmt = s => `${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`;
  const progress = ((300 - timeLeft) / 300) * 100;
  const sans = "'Helvetica Neue', Arial, sans-serif";

  // ─── LANDING ───
  if (screen === "landing") return (
    <div style={{
      minHeight: "100vh", background: "#000",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      opacity: fade ? 1 : 0, transition: "opacity 1.4s ease",
      fontFamily: "'Georgia', serif", gap: 40, padding: "48px 32px", textAlign: "center",
      position: "relative",
    }}>
      {/* quiet shop link top right */}
      <div onClick={() => { setScreen("shop"); window.scrollTo(0,0); }}
        style={{ position: "absolute", top: 28, right: 32, fontSize: 11, letterSpacing: "0.2em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", cursor: "pointer", fontFamily: sans }}>
        Shop
      </div>

      <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#fff", boxShadow: "0 0 30px rgba(255,255,255,0.25)" }} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
        <div style={{ fontSize: 22, fontWeight: 400, color: "#fff", letterSpacing: "0.2em", textTransform: "uppercase" }}>White Dot</div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", fontStyle: "italic" }}>A moment of stillness. A verse of wisdom.</div>
      </div>

      <button
        onClick={() => { setScreen("kural"); window.scrollTo(0,0); }}
        style={{
          background: "transparent", border: "1px solid rgba(255,255,255,0.2)",
          color: "rgba(255,255,255,0.55)", fontSize: 11, letterSpacing: "0.3em",
          textTransform: "uppercase", padding: "18px 52px", cursor: "pointer",
          fontFamily: sans, transition: "all 0.4s", marginTop: 8,
        }}
        onMouseEnter={e => { e.target.style.borderColor = "rgba(255,255,255,0.6)"; e.target.style.color = "#fff"; }}
        onMouseLeave={e => { e.target.style.borderColor = "rgba(255,255,255,0.2)"; e.target.style.color = "rgba(255,255,255,0.55)"; }}
      >
        Begin
      </button>
    </div>
  );

  // ─── TIMER ───
  if (screen === "timer") return (
    <div
      onClick={!started ? startTimer : undefined}
      style={{
        minHeight: "100vh", background: "#000",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        cursor: started ? "default" : "pointer",
        fontFamily: "'Georgia', serif", position: "relative", userSelect: "none",
      }}
    >
      {started && (
        <div style={{ position: "absolute", top: 0, left: 0, height: "1px", width: `${progress}%`, background: "rgba(255,255,255,0.2)", transition: "width 1s linear" }} />
      )}

      <button
        onClick={(e) => { e.stopPropagation(); clearInterval(timerRef.current); releaseWakeLock(); setStarted(false); setDotBreath(false); setTimeLeft(300); setScreen("landing"); }}
        style={{ position: "absolute", top: 28, left: 28, background: "transparent", border: "none", color: "rgba(255,255,255,0.2)", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", cursor: "pointer", fontFamily: "'Georgia', serif" }}
      >← back</button>

      <div style={{ width: 13, height: 13, borderRadius: "50%", background: "#fff", animation: dotBreath ? "breathe 7s ease-in-out infinite" : "none", marginBottom: started ? 52 : 36, transition: "margin-bottom 0.6s ease" }} />

      {!started ? (
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.18)", letterSpacing: "0.3em", textTransform: "uppercase" }}>tap to begin · five minutes</div>
      ) : (
        <>
          <div style={{ fontSize: 44, fontWeight: 200, color: "rgba(255,255,255,0.75)", letterSpacing: "0.06em" }}>{fmt(timeLeft)}</div>
          <div onClick={skipToKural} style={{ position: "absolute", bottom: 40, fontSize: 10, color: "rgba(255,255,255,0.25)", letterSpacing: "0.2em", textTransform: "uppercase", cursor: "pointer" }}>
            end early →
          </div>
        </>
      )}

      <style>{`@keyframes breathe { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(2.6);opacity:0.35} }`}</style>
    </div>
  );

  // ─── CLOSE (after stillness) ───
  if (screen === "close") return (
    <div style={{
      minHeight: "100vh", background: "#000",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      fontFamily: "'Georgia', serif", gap: 32, padding: "48px 36px", textAlign: "center",
    }}>
      <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#fff", opacity: 0.5 }} />

      <div style={{ fontSize: 22, lineHeight: 1.7, color: "rgba(255,255,255,0.75)", fontWeight: 300, maxWidth: 360 }}>
        Carry {today.book === "Inbam" ? "it" : "the day's wisdom"} with you.
      </div>

      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", fontStyle: "italic", letterSpacing: "0.05em", maxWidth: 340, lineHeight: 1.7 }}>
        "{today.verse}"
      </div>

      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", letterSpacing: "0.12em", fontStyle: "italic", marginTop: 8 }}>
        Return tomorrow for another.
      </div>

      <div style={{ display: "flex", gap: 24, marginTop: 12 }}>
        <div onClick={() => setScreen("landing")}
          style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer" }}>
          Home
        </div>
        <div onClick={() => { setScreen("shop"); window.scrollTo(0,0); }}
          style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer", borderBottom: "1px solid rgba(255,255,255,0.15)", paddingBottom: 3 }}>
          Wear this verse →
        </div>
      </div>
    </div>
  );

  // ─── KURAL (shown first, to reflect on) ───
  if (screen === "kural") return (
    <div style={{
      minHeight: "100vh", background: "#000",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      fontFamily: "'Georgia', serif", gap: 36, padding: "48px 36px", textAlign: "center",
      position: "relative",
      opacity: fade ? 1 : 0, transition: "opacity 1.2s ease",
    }}>
      <button
        onClick={() => setScreen("landing")}
        style={{ position: "absolute", top: 28, left: 28, background: "transparent", border: "none", color: "rgba(255,255,255,0.25)", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", cursor: "pointer", fontFamily: "'Georgia', serif" }}
      >← home</button>

      <div onClick={() => { setScreen("shop"); window.scrollTo(0,0); }}
        style={{ position: "absolute", top: 28, right: 32, fontSize: 11, letterSpacing: "0.2em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", cursor: "pointer", fontFamily: sans }}>
        Shop
      </div>

      <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#fff", opacity: 0.6 }} />

      <div style={{ fontSize: 11, color: "rgba(160,190,255,0.55)", letterSpacing: "0.2em", textTransform: "uppercase", lineHeight: 1.8 }}>
        Today<br/>
        {today.book} · {today.chapter} · Kural {today.n}
      </div>

      {/* Tamil — the hero */}
      <div style={{ maxWidth: 520, display: "flex", flexDirection: "column", gap: 28 }}>
        <div style={{ fontSize: 22, lineHeight: 1.9, color: "rgba(255,255,255,0.9)", fontWeight: 300 }}>
          {today.tamil}
        </div>

        {/* small dot divider */}
        <div style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(255,255,255,0.35)", margin: "0 auto" }} />

        {/* English translation */}
        <div style={{ fontSize: 16, lineHeight: 1.7, color: "rgba(255,255,255,0.55)", fontStyle: "italic" }}>
          "{today.verse}"
        </div>
      </div>

      {/* invitation to reflect, then sit */}
      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", fontStyle: "italic", marginTop: 8 }}>
        Sit with it. Then be still for five minutes.
      </div>

      <button
        onClick={() => { setScreen("timer"); setStarted(false); setTimeLeft(300); window.scrollTo(0,0); }}
        style={{
          background: "transparent", border: "1px solid rgba(255,255,255,0.2)",
          color: "rgba(255,255,255,0.55)", fontSize: 11, letterSpacing: "0.3em",
          textTransform: "uppercase", padding: "16px 48px", cursor: "pointer",
          fontFamily: sans, transition: "all 0.4s", marginTop: 4,
        }}
        onMouseEnter={e => { e.target.style.borderColor = "rgba(255,255,255,0.6)"; e.target.style.color = "#fff"; }}
        onMouseLeave={e => { e.target.style.borderColor = "rgba(255,255,255,0.2)"; e.target.style.color = "rgba(255,255,255,0.55)"; }}
      >
        Begin stillness
      </button>

      {/* subtle wear this verse */}
      <div onClick={() => { setScreen("shop"); window.scrollTo(0,0); }}
        style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer" }}>
        Wear this verse →
      </div>
    </div>
  );

  // ─── SHOP ───
  if (screen === "shop") return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#e8e8e8", fontFamily: sans }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "26px 40px", borderBottom: "1px solid #1a1a1a" }}>
        <div onClick={() => setScreen("landing")} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
          <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#fff" }} />
          <span style={{ fontSize: 13, letterSpacing: "0.15em", fontWeight: 500, color: "#fff" }}>WHITE DOT</span>
        </div>
        <span onClick={() => setScreen("landing")} style={{ fontSize: 11, letterSpacing: "0.1em", color: "#666", cursor: "pointer" }}>HOME</span>
      </header>

      <div style={{ textAlign: "center", padding: "72px 24px 48px", maxWidth: 560, margin: "0 auto" }}>
        <div style={{ fontSize: 20, lineHeight: 1.6, fontFamily: "'Georgia', serif", color: "#fff" }}>
          Carry the wisdom with you.
        </div>
        <div style={{ fontSize: 13, color: "#666", marginTop: 16, fontStyle: "italic", fontFamily: "'Georgia', serif" }}>
          Sourced from Chennai, came to life in America.
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 0, borderTop: "1px solid #1a1a1a" }}>
        {PRODUCTS.map(p => (
          <div
            key={p.id}
            onClick={() => { if (p.kind === "garment") { setSelectedProduct(p); setScreen("product"); window.scrollTo(0,0); } }}
            style={{
              borderRight: "1px solid #1a1a1a", borderBottom: "1px solid #1a1a1a",
              padding: "48px 40px", display: "flex", flexDirection: "column", alignItems: "center", gap: 24,
              cursor: p.kind === "garment" ? "pointer" : "default",
              transition: "background 0.3s",
            }}
            onMouseEnter={e => { if (p.kind === "garment") e.currentTarget.style.background = "#080808"; }}
            onMouseLeave={e => e.currentTarget.style.background = "#000"}
          >
            {/* product visual — a plain garment swatch square */}
            <div style={{
              width: 200, height: 200,
              background: p.color === "navy" ? "#10182c" : "#0a0a0a",
              border: "1px solid #1e1e1e",
              display: "flex", alignItems: "center", justifyContent: "center", position: "relative",
            }}>
              {p.kind === "mug" ? (
                <svg viewBox="0 0 120 120" width="130" height="130">
                  <rect x="30" y="34" width="50" height="58" rx="4" fill="#141414" stroke="#2a2a2a" strokeWidth="1"/>
                  <path d="M80,46 q22,2 22,20 q0,18 -22,20" fill="none" stroke="#2a2a2a" strokeWidth="3"/>
                  <ellipse cx="55" cy="34" rx="25" ry="5" fill="#1c1c1c" stroke="#2a2a2a" strokeWidth="1"/>
                  <circle cx="55" cy="30" r="3" fill="#fff"/>
                </svg>
              ) : (
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#fff", boxShadow: "0 0 14px rgba(255,255,255,0.2)" }} />
              )}
              {p.kind === "garment" && (
                <div style={{ position: "absolute", bottom: 12, right: 14, fontSize: 9, letterSpacing: "0.15em", color: "rgba(255,255,255,0.3)" }}>VIEW →</div>
              )}
            </div>

            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 15, letterSpacing: "0.08em", color: "#fff", fontFamily: "'Georgia', serif", marginBottom: 8 }}>{p.name}</div>
              <div style={{ fontSize: 12, color: "#888", marginBottom: 6, lineHeight: 1.6 }}>{p.detail}</div>
              <div style={{ fontSize: 13, color: "#aaa" }}>${p.price}</div>
              {p.kind === "garment" && (
                <div style={{ fontSize: 9, letterSpacing: "0.2em", color: "#7effc4", marginTop: 14, textTransform: "uppercase" }}>
                  Under construction · by request
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <footer style={{ borderTop: "1px solid #1a1a1a", padding: "40px", display: "flex", justifyContent: "space-between", fontSize: 11, color: "#555", letterSpacing: "0.08em" }}>
        <span>WHITE DOT</span>
        <span>SOURCED FROM CHENNAI · CAME TO LIFE IN AMERICA</span>
      </footer>
    </div>
  );

  // ─── PRODUCT DETAIL (garment) ───
  if (screen === "product" && selectedProduct) {
    const p = selectedProduct;
    const bg = p.color === "navy" ? "#10182c" : "#0a0a0a";
    return (
      <div style={{ minHeight: "100vh", background: "#000", color: "#e8e8e8", fontFamily: sans }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "26px 40px", borderBottom: "1px solid #1a1a1a" }}>
          <div onClick={() => setScreen("landing")} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
            <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#fff" }} />
            <span style={{ fontSize: 13, letterSpacing: "0.15em", fontWeight: 500, color: "#fff" }}>WHITE DOT</span>
          </div>
          <span onClick={() => { setScreen("shop"); window.scrollTo(0,0); }} style={{ fontSize: 11, letterSpacing: "0.1em", color: "#666", cursor: "pointer" }}>← SHOP</span>
        </header>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "calc(100vh - 74px)" }}>
          {/* Left — two detail squares */}
          <div style={{ background: "#050505", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 32, padding: 56, borderRight: "1px solid #1a1a1a" }}>
            {/* upper-left chest reference */}
            <div style={{ width: 300, height: 300, background: bg, border: "1px solid #1e1e1e", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 66, left: 54, textAlign: "center", fontFamily: "'Georgia',serif" }}>
                <div style={{ fontSize: 14, letterSpacing: "0.25em", color: "#fff", fontWeight: 600 }}>{today.book.toUpperCase()}</div>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff", margin: "9px auto" }} />
                <div style={{ fontSize: 11, letterSpacing: "0.18em", color: "rgba(255,255,255,0.72)" }}>KURAL {today.n}</div>
              </div>
              <div style={{ position: "absolute", bottom: 14, left: 16, fontSize: 9, letterSpacing: "0.2em", color: "rgba(255,255,255,0.25)" }}>LEFT CHEST · AS WORN</div>
            </div>
            {/* lower-right verse patch */}
            <div style={{ width: 300, height: 300, background: bg, border: "1px solid #1e1e1e", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", bottom: 48, right: 42, width: 132, padding: 12, border: "1px dashed rgba(200,185,140,0.4)", textAlign: "center", fontFamily: "'Georgia',serif" }}>
                <div style={{ fontSize: 9, color: "rgba(185,175,140,0.9)", lineHeight: 1.5, marginBottom: 6 }}>{today.tamil}</div>
                <div style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(185,175,140,0.7)", margin: "6px auto" }} />
                <div style={{ fontSize: 7, color: "rgba(175,165,130,0.85)", lineHeight: 1.5, fontStyle: "italic" }}>{today.verse}</div>
              </div>
              <div style={{ position: "absolute", bottom: 14, left: 16, fontSize: 9, letterSpacing: "0.2em", color: "rgba(255,255,255,0.25)" }}>LOWER RIGHT · AS WORN</div>
            </div>
          </div>

          {/* Right — details */}
          <div style={{ padding: "64px 56px", display: "flex", flexDirection: "column", gap: 28, maxWidth: 480 }}>
            <div>
              <div style={{ fontSize: 20, letterSpacing: "0.05em", marginBottom: 8, fontFamily: "'Georgia', serif", color: "#fff" }}>
                {p.name} · {p.color === "navy" ? "Navy" : "Black"}
              </div>
              <div style={{ fontSize: 14, color: "#666" }}>${p.price}</div>
            </div>

            <div style={{ borderLeft: "2px solid #333", paddingLeft: 20, display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ fontSize: 14, lineHeight: 1.6, color: "rgba(185,175,140,0.9)", fontFamily: "'Georgia', serif" }}>{today.tamil}</div>
              <div style={{ fontSize: 13, lineHeight: 1.6, fontStyle: "italic", color: "#999", fontFamily: "'Georgia', serif" }}>{today.verse}</div>
            </div>

            <div style={{ fontSize: 12, color: "#888", lineHeight: 2 }}>
              {today.book} · {today.chapter} · Kural {today.n}<br/>
              Reference embroidered upper left, as worn<br/>
              Verse on a 2×2 patch, lower right — Tamil &amp; English
            </div>

            {/* Under construction / by request */}
            <div style={{ border: "1px solid #1e1e1e", padding: "24px", background: "#080808" }}>
              <div style={{ fontSize: 11, letterSpacing: "0.2em", color: "#7effc4", textTransform: "uppercase", marginBottom: 12 }}>
                Under construction
              </div>
              <div style={{ fontSize: 13, color: "#999", lineHeight: 1.7 }}>
                This piece is made to order. Each one is embroidered by hand with the verse of your choosing. To request yours, write to us and we will begin.
              </div>
              <button style={{
                marginTop: 20, padding: "14px 36px", background: "#fff", color: "#000", border: "none",
                fontSize: 11, letterSpacing: "0.2em", cursor: "pointer", fontFamily: sans,
              }}>
                REQUEST BY EMAIL
              </button>
            </div>

            <div style={{ fontSize: 11, color: "#555", lineHeight: 1.8, letterSpacing: "0.03em", fontStyle: "italic", fontFamily: "'Georgia', serif" }}>
              Sourced from Chennai, came to life in America.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
