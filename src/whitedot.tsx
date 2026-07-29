import { useState, useEffect, useRef } from "react";

// A rotating set of Kurals — in production this cycles through all 1330.
const KURALS = [
  { n: 7, book: "Aram", chapter: "In Praise of God", tamil: "தனக்கு உவமை இல்லாதான் தாள்சேர்ந்தார்க்கு அல்லால் மனக்கவலை மாற்றல் அரிது", verse: "They alone escape the sorrows of the mind who take refuge at the feet of the incomparable one." },
  { n: 101, book: "Aram", chapter: "Gratitude", tamil: "செய்யாமல் செய்த உதவிக்கு வையகமும் வானகமும் ஆற்றல் அரிது", verse: "One may escape after slaying every goodness — but there is no escape for one who slays gratitude." },
  { n: 121, book: "Aram", chapter: "Self Control", tamil: "அடக்கம் அமரருள் உய்க்கும் அடங்காமை ஆரிருள் உய்த்து விடும்", verse: "Self control leads one among the gods. Its absence drives one into deepest darkness." },
  { n: 396, book: "Porul", chapter: "Learning", tamil: "தொட்டனைத்து ஊறும் மணற்கேணி மாந்தர்க்குக் கற்றனைத்து ஊறும் அறிவு", verse: "The more you dig a sand spring, the more it flows. The more you learn, the more wisdom flows." },
  { n: 425, book: "Porul", chapter: "Wisdom", tamil: "உலகம் தழீஇயது ஒட்பம் மலர்தலும் கூம்பலும் இல்லது அறிவு", verse: "Wisdom is to walk with the world, moving as it moves." },
  { n: 620, book: "Porul", chapter: "Perseverance", tamil: "ஊழையும் உப்பக்கம் காண்பர் உலைவின்றித் தாழாது உஞற்று பவர்", verse: "Those who tirelessly strive will even overcome the fate that stands against them." },
  { n: 1281, book: "Inbam", chapter: "Longing", tamil: "உள்ளக் களித்தலும் காண மகிழ்தலும் கள்ளுக்கு இல் காமத்திற்கு உண்டு", verse: "To think of love is joy. To see it is greater joy still." },
];

// Which Kural today — same for everyone, rotates by date
function kuralOfTheDay() {
  const dayNumber = Math.floor(Date.now() / (24 * 60 * 60 * 1000));
  return KURALS[dayNumber % KURALS.length];
}

const PRODUCTS = [
  { id: "tee", name: "The Tee", detail: "Black · 280gsm cotton · verse embroidered", price: 95, kind: "tee" },
  { id: "mug", name: "The Mug", detail: "Matte black stoneware · verse glazed inside", price: 32, kind: "mug" },
];

export default function WhiteDot() {
  const [screen, setScreen] = useState("landing"); // landing | timer | kural | shop
  const [fade, setFade] = useState(false);
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const [dotBreath, setDotBreath] = useState(false);
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

      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: "0.25em", textTransform: "uppercase" }}>
        Today · Kural {today.n}
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

        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", marginTop: 4 }}>
          {today.book} · {today.chapter}
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

      <div style={{ textAlign: "center", padding: "72px 24px 48px", maxWidth: 520, margin: "0 auto" }}>
        <div style={{ fontSize: 20, lineHeight: 1.6, fontFamily: "'Georgia', serif", color: "#fff" }}>
          Carry the wisdom with you.
        </div>
        <div style={{ fontSize: 13, color: "#666", marginTop: 16 }}>
          Each piece carries a verse from the Thirukural. Made in Chennai.
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 0, borderTop: "1px solid #1a1a1a" }}>
        {PRODUCTS.map(p => (
          <div key={p.id} style={{
            borderRight: "1px solid #1a1a1a", borderBottom: "1px solid #1a1a1a",
            padding: "48px 40px", display: "flex", flexDirection: "column", alignItems: "center", gap: 28,
          }}>
            {/* product visual */}
            {p.kind === "tee" ? (
              <div style={{ width: 200, height: 200, background: "#0a0a0a", border: "1px solid #1e1e1e", position: "relative" }}>
                <div style={{ position: "absolute", top: 40, left: 34, fontFamily: "'Georgia',serif", textAlign: "center" }}>
                  <div style={{ fontSize: 9, letterSpacing: "0.2em", color: "#fff", fontWeight: 600 }}>ARAM</div>
                  <div style={{ width: 3, height: 3, borderRadius: "50%", background: "#fff", margin: "5px auto" }} />
                  <div style={{ fontSize: 7, letterSpacing: "0.15em", color: "rgba(255,255,255,0.7)" }}>KURAL {today.n}</div>
                </div>
                <div style={{ position: "absolute", bottom: 34, right: 30, width: 70, padding: 8, border: "1px dashed rgba(200,185,140,0.4)", fontFamily: "'Georgia',serif" }}>
                  <div style={{ fontSize: 6, color: "rgba(185,175,140,0.9)", lineHeight: 1.4, fontStyle: "italic", textAlign: "center" }}>the verse, embroidered</div>
                </div>
              </div>
            ) : (
              <div style={{ width: 200, height: 200, background: "#0a0a0a", border: "1px solid #1e1e1e", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                {/* mug silhouette */}
                <svg viewBox="0 0 120 120" width="130" height="130">
                  <rect x="30" y="34" width="50" height="58" rx="4" fill="#141414" stroke="#2a2a2a" strokeWidth="1"/>
                  <path d="M80,46 q22,2 22,20 q0,18 -22,20" fill="none" stroke="#2a2a2a" strokeWidth="3"/>
                  <ellipse cx="55" cy="34" rx="25" ry="5" fill="#1c1c1c" stroke="#2a2a2a" strokeWidth="1"/>
                  <circle cx="55" cy="30" r="3" fill="#fff"/>
                </svg>
              </div>
            )}
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 15, letterSpacing: "0.08em", color: "#fff", fontFamily: "'Georgia', serif", marginBottom: 8 }}>{p.name}</div>
              <div style={{ fontSize: 12, color: "#888", marginBottom: 6, lineHeight: 1.6 }}>{p.detail}</div>
              <div style={{ fontSize: 13, color: "#aaa" }}>${p.price}</div>
            </div>
            <button style={{
              padding: "14px 40px", background: "#fff", color: "#000", border: "none",
              fontSize: 11, letterSpacing: "0.2em", cursor: "pointer", fontFamily: sans,
            }}>
              ADD TO CART
            </button>
          </div>
        ))}
      </div>

      <footer style={{ borderTop: "1px solid #1a1a1a", padding: "40px", display: "flex", justifyContent: "space-between", fontSize: 11, color: "#555", letterSpacing: "0.08em" }}>
        <span>WHITE DOT · CHENNAI</span>
        <span>WISDOM, WORN</span>
      </footer>
    </div>
  );

  return null;
}
