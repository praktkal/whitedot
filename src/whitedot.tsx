import { useState, useEffect, useRef } from "react";

const DB_URL = "https://whitedot-35d2c-default-rtdb.firebaseio.com";
const HEARTBEAT_INTERVAL = 25000;  // send heartbeat every 25 seconds
const PRESENCE_TTL = 60000;        // user considered gone after 60 seconds

// Generate a unique ID for this browser session
const SESSION_ID = Math.random().toString(36).slice(2) + Date.now().toString(36);

async function dbGet(path) {
  try {
    const r = await fetch(`${DB_URL}/${path}.json`);
    return r.ok ? r.json() : null;
  } catch { return null; }
}

async function dbSet(path, value) {
  try {
    await fetch(`${DB_URL}/${path}.json`, {
      method: "PUT",
      body: JSON.stringify(value),
    });
  } catch {}
}

async function dbDelete(path) {
  try {
    await fetch(`${DB_URL}/${path}.json`, { method: "DELETE" });
  } catch {}
}

async function dbIncrement(path, delta) {
  const current = (await dbGet(path)) || 0;
  const next = Math.max(0, current + delta);
  await dbSet(path, next);
  return next;
}

// Register this session as alive with a timestamp
async function heartbeat() {
  await dbSet(`presence/${SESSION_ID}`, Date.now());
}

// Count sessions that have sent a heartbeat within PRESENCE_TTL
async function countActive() {
  const presence = await dbGet("presence");
  if (!presence) return 1;
  const now = Date.now();
  const active = Object.values(presence).filter(ts => now - ts < PRESENCE_TTL);
  return Math.max(1, active.length);
}

// Remove stale sessions older than PRESENCE_TTL
async function cleanStale() {
  const presence = await dbGet("presence");
  if (!presence) return;
  const now = Date.now();
  for (const [id, ts] of Object.entries(presence)) {
    if (now - ts > PRESENCE_TTL) await dbDelete(`presence/${id}`);
  }
}

export default function WhiteDot() {
  const [screen, setScreen] = useState("entry");
  const [liveCount, setLiveCount] = useState(null);
  const [totalSessions, setTotalSessions] = useState(null);
  const [fade, setFade] = useState(false);
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const [dotBreath, setDotBreath] = useState(false);
  const [manifestoFade, setManifestoFade] = useState(false);
  const [sessionFade, setSessionFade] = useState(false);
  const [doneFade, setDoneFade] = useState(false);
  const [toasts, setToasts] = useState([]);
  const toastRef = useRef(null);

  const LOCATIONS = [
    { city: "Tokyo", flag: "🇯🇵" },
    { city: "London", flag: "🇬🇧" },
    { city: "New York", flag: "🇺🇸" },
    { city: "Mumbai", flag: "🇮🇳" },
    { city: "São Paulo", flag: "🇧🇷" },
    { city: "Sydney", flag: "🇦🇺" },
    { city: "Paris", flag: "🇫🇷" },
    { city: "Dubai", flag: "🇦🇪" },
    { city: "Singapore", flag: "🇸🇬" },
    { city: "Toronto", flag: "🇨🇦" },
    { city: "Berlin", flag: "🇩🇪" },
    { city: "Lagos", flag: "🇳🇬" },
    { city: "Seoul", flag: "🇰🇷" },
    { city: "Mexico City", flag: "🇲🇽" },
    { city: "Cairo", flag: "🇪🇬" },
    { city: "Amsterdam", flag: "🇳🇱" },
    { city: "Bangkok", flag: "🇹🇭" },
    { city: "Chennai", flag: "🇮🇳" },
    { city: "Nairobi", flag: "🇰🇪" },
    { city: "Stockholm", flag: "🇸🇪" },
  ];

  const showToast = () => {
    const loc = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
    const id = Date.now();
    const messages = [
      `${loc.flag} ${loc.city} just joined`,
      `${loc.flag} Someone in ${loc.city} is here`,
      `${loc.flag} ${loc.city} is still`,
    ];
    const text = messages[Math.floor(Math.random() * messages.length)];
    setToasts(prev => [...prev.slice(-2), { id, text }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  const startToasts = () => {
    setTimeout(showToast, 1500);
    const schedule = () => {
      const delay = 6000 + Math.random() * 10000;
      toastRef.current = setTimeout(() => { showToast(); schedule(); }, delay);
    };
    schedule();
  };

  const stopToasts = () => clearTimeout(toastRef.current);
  const timerRef = useRef(null);
  const pollRef = useRef(null);
  const heartbeatRef = useRef(null);
  const wakeLockRef = useRef(null);

  const requestWakeLock = async () => {
    try {
      if ("wakeLock" in navigator) {
        wakeLockRef.current = await navigator.wakeLock.request("screen");
      }
    } catch {}
  };

  const releaseWakeLock = async () => {
    try {
      if (wakeLockRef.current) {
        await wakeLockRef.current.release();
        wakeLockRef.current = null;
      }
    } catch {}
  };

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      // Register presence immediately
      await heartbeat();
      await cleanStale();

      // Poll live count every 10 seconds
      const poll = async () => {
        if (!mounted) return;
        const active = await countActive();
        const total = await dbGet("totalVisitors");
        if (mounted) {
          setLiveCount(active);
          setTotalSessions(total || 0);
        }
      };

      await poll();
      pollRef.current = setInterval(poll, 10000);

      // Send heartbeat every 25 seconds to stay alive
      heartbeatRef.current = setInterval(async () => {
        await heartbeat();
      }, HEARTBEAT_INTERVAL);
    };

    init();
    setTimeout(() => setFade(true), 120);

    // On leave — remove this session from presence immediately
    const onLeave = () => dbDelete(`presence/${SESSION_ID}`);
    window.addEventListener("beforeunload", onLeave);
    window.addEventListener("pagehide", onLeave);

    return () => {
      mounted = false;
      clearInterval(pollRef.current);
      clearInterval(heartbeatRef.current);
      onLeave();
      window.removeEventListener("beforeunload", onLeave);
      window.removeEventListener("pagehide", onLeave);
    };
  }, []);

  const goToManifesto = async () => {
    // Seed to 357 if this is the very first visitor ever
    const current = await dbGet("totalVisitors");
    if (!current || current < 357) await dbSet("totalVisitors", 357);
    await dbIncrement("totalVisitors", 1);
    const updated = await dbGet("totalVisitors");
    setTotalSessions(updated || 357);
    setManifestoFade(false);
    setScreen("manifesto");
    setTimeout(() => setManifestoFade(true), 100);
  };

  const goToSession = () => {
    setSessionFade(false);
    setScreen("session");
    setTimeout(() => setSessionFade(true), 100);
  };

  const startTimer = () => {
    if (started) return;
    setStarted(true);
    setDotBreath(true);
    requestWakeLock();
    startToasts();
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          releaseWakeLock();
          stopToasts();
          playBell();
          dbIncrement("totalSessions", 1);
          setTimeout(() => {
            setDoneFade(false);
            setScreen("done");
            setTimeout(() => setDoneFade(true), 100);
          }, 800);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const playBell = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      // Three gentle bell strikes
      [0, 1.2, 2.2].forEach((delay, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        // Singing bowl / bell frequency
        osc.frequency.value = 528 - i * 24;
        osc.type = "sine";
        const start = ctx.currentTime + delay;
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.35, start + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 3.5);
        osc.start(start);
        osc.stop(start + 3.5);
      });
    } catch {}
  };

  useEffect(() => () => { clearInterval(timerRef.current); releaseWakeLock(); }, []);

  const fmt = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  const progress = ((300 - timeLeft) / 300) * 100;
  const count = liveCount ?? "...";

  // ── ENTRY ──────────────────────────────────────────────
  if (screen === "entry") return (
    <div style={{
      minHeight: "100vh", background: "#000",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      opacity: fade ? 1 : 0, transition: "opacity 1.6s ease",
      fontFamily: "'Georgia', serif", padding: "48px 32px",
      textAlign: "center",
    }}>

      {/* Dot + wordmark + tagline + poetic lines */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, marginBottom: 20 }}>
        <div style={{
          width: 13, height: 13, borderRadius: "50%", background: "#fff",
          boxShadow: "0 0 28px rgba(255,255,255,0.2)",
        }} />
        <div style={{ fontSize: 24, fontWeight: "400", color: "#fff", letterSpacing: "0.18em", textTransform: "uppercase" }}>
          White Dot
        </div>
        <div style={{ fontSize: 16, color: "rgba(255,255,255,0.35)", fontStyle: "italic", letterSpacing: "0.06em" }}>
          Collective Stillness
        </div>
        <div style={{ height: 1, width: 32, background: "rgba(255,255,255,0.08)", margin: "6px 0" }} />
        <div style={{ fontSize: 15, color: "rgba(255,255,255,0.28)", fontStyle: "italic", letterSpacing: "0.04em", lineHeight: 1.8, maxWidth: 280 }}>
          In a world of noise, we chose silence — together.
          <br />
          Not a tribe. Not a following. Just people, still.
        </div>
      </div>

      {/* Continent dots */}
      <div style={{ margin: "36px 0 44px", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "12px 24px" }}>
          {[
            { label: "Asia", delay: "0s" },
            { label: "Europe", delay: "0.4s" },
            { label: "Americas", delay: "0.8s" },
            { label: "Africa", delay: "1.2s" },
            { label: "Oceania", delay: "1.6s" },
          ].map((c, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{
                width: 7, height: 7, borderRadius: "50%",
                background: "#7effc4",
                boxShadow: "0 0 8px rgba(126,255,196,0.9)",
                animation: `glow 2.5s ease-in-out infinite`,
                animationDelay: c.delay,
                flexShrink: 0,
              }} />
              <div style={{
                fontSize: 12, color: "rgba(255,255,255,0.4)",
                letterSpacing: "0.18em", textTransform: "uppercase",
              }}>
                {c.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live count */}
      <div style={{ marginBottom: 44, textAlign: "center" }}>
        <div style={{
          fontSize: 48, fontWeight: "200", color: "#fff",
          letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 10,
        }}>
          {totalSessions > 0 ? totalSessions.toLocaleString() : "..."}
        </div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", letterSpacing: "0.14em" }}>
          people have sat here
        </div>
      </div>

      {/* Join button */}
      <button
        onClick={goToManifesto}
        style={{
          background: "transparent",
          border: "1px solid rgba(255,255,255,0.2)",
          color: "rgba(255,255,255,0.55)",
          fontSize: 12, letterSpacing: "0.28em", textTransform: "uppercase",
          padding: "18px 56px", borderRadius: "1px",
          cursor: "pointer", fontFamily: "'Georgia', serif", transition: "all 0.4s",
        }}
        onMouseEnter={e => { e.target.style.borderColor = "rgba(255,255,255,0.6)"; e.target.style.color = "#fff"; }}
        onMouseLeave={e => { e.target.style.borderColor = "rgba(255,255,255,0.2)"; e.target.style.color = "rgba(255,255,255,0.55)"; }}
      >
        join
      </button>

      <style>{`
        @keyframes pd { 0%,100%{opacity:.15;transform:scale(1)} 50%{opacity:.65;transform:scale(1.5)} }
        @keyframes glow { 0%,100%{opacity:0.5;transform:scale(1)} 50%{opacity:1;transform:scale(1.3)} }
      `}</style>
    </div>
  );

  // ── MANIFESTO ──────────────────────────────────────────
  if (screen === "manifesto") return (
    <div style={{
      minHeight: "100vh", background: "#000",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      opacity: manifestoFade ? 1 : 0, transition: "opacity 1.2s ease",
      fontFamily: "'Georgia', serif", padding: "48px 36px",
      textAlign: "center",
    }}>

      {/* Live count — subtle top */}
      <div style={{
        position: "absolute", top: 36,
        fontSize: 11, color: "rgba(255,255,255,0.18)",
        letterSpacing: "0.15em",
      }}>
        {typeof count === "number" ? count.toLocaleString() : count} here with you
      </div>

      {/* Manifesto lines */}
      <div style={{ display: "flex", flexDirection: "column", gap: 28, maxWidth: 300, marginBottom: 72 }}>
        {[
          "There is nothing to do.",
          "No content.",
          "No notifications.",
          "No scrolling.",
          "Just be here.",
        ].map((line, i) => (
          <div key={i} style={{
            fontSize: i === 0 || i === 4 ? 22 : 17,
            fontWeight: "200",
            color: i === 0 || i === 4 ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.38)",
            letterSpacing: "0.03em",
            lineHeight: 1.4,
            fontStyle: i === 4 ? "italic" : "normal",
            animation: `fadeUp 0.8s ease ${i * 0.18}s both`,
          }}>
            {line}
          </div>
        ))}
      </div>

      {/* Begin */}
      <button
        onClick={goToSession}
        style={{
          background: "transparent",
          border: "1px solid rgba(255,255,255,0.15)",
          color: "rgba(255,255,255,0.4)",
          fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase",
          padding: "16px 48px", borderRadius: "1px",
          cursor: "pointer", fontFamily: "'Georgia', serif", transition: "all 0.4s",
          animation: "fadeUp 0.8s ease 1s both",
        }}
        onMouseEnter={e => { e.target.style.borderColor = "rgba(255,255,255,0.5)"; e.target.style.color = "#fff"; }}
        onMouseLeave={e => { e.target.style.borderColor = "rgba(255,255,255,0.15)"; e.target.style.color = "rgba(255,255,255,0.4)"; }}
      >
        I'm ready
      </button>

      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </div>
  );

  // ── SESSION ────────────────────────────────────────────
  if (screen === "session") return (
    <div
      onClick={!started ? startTimer : undefined}
      style={{
        minHeight: "100vh", background: "#000",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        cursor: started ? "default" : "pointer",
        opacity: sessionFade ? 1 : 0, transition: "opacity 1s ease",
        fontFamily: "'Georgia', serif",
        position: "relative", userSelect: "none",
      }}
    >
      {/* Home button */}
      <button
        onClick={() => {
          clearInterval(timerRef.current);
          releaseWakeLock();
          stopToasts();
          setStarted(false);
          setDotBreath(false);
          setTimeLeft(300);
          setSessionFade(false);
          setFade(false);
          setScreen("entry");
          setTimeout(() => setFade(true), 100);
        }}
        style={{
          position: "absolute", top: 28, left: 28,
          background: "transparent", border: "none",
          color: "rgba(255,255,255,0.2)", fontSize: 11,
          letterSpacing: "0.2em", textTransform: "uppercase",
          cursor: "pointer", fontFamily: "'Georgia', serif",
          transition: "color 0.3s", padding: "4px 0",
        }}
        onMouseEnter={e => e.target.style.color = "rgba(255,255,255,0.6)"}
        onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.2)"}
      >
        ← home
      </button>

      {/* Progress line */}
      {started && (
        <div style={{
          position: "absolute", top: 0, left: 0,
          height: "1px", width: `${progress}%`,
          background: "rgba(255,255,255,0.2)", transition: "width 1s linear",
        }} />
      )}

      {/* Live count — top */}
      <div style={{
        position: "absolute", top: 32,
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <div style={{
          width: 5, height: 5, borderRadius: "50%",
          background: "#7effc4",
          boxShadow: "0 0 6px rgba(126,255,196,0.8)",
          animation: "livepulse 2s ease-in-out infinite",
        }} />
        <div style={{
          fontSize: 12, color: "rgba(255,255,255,0.7)",
          letterSpacing: "0.12em",
        }}>
          {liveCount && liveCount > 1
            ? `${liveCount.toLocaleString()} sitting with you right now`
            : "just you right now"}
        </div>
      </div>

      {/* The dot */}
      <div style={{
        width: 13, height: 13, borderRadius: "50%", background: "#fff",
        animation: dotBreath ? "breathe 7s ease-in-out infinite" : "none",
        marginBottom: started ? 52 : 36, transition: "margin-bottom 0.6s ease",
      }} />

      {/* Timer or tap */}
      {!started ? (
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.18)", letterSpacing: "0.3em", textTransform: "uppercase" }}>
          tap to begin
        </div>
      ) : (
        <div style={{
          fontSize: 44, fontWeight: "200", color: "rgba(255,255,255,0.75)",
          letterSpacing: "0.06em", animation: "fadeUp 0.8s ease forwards",
        }}>
          {fmt(timeLeft)}
        </div>
      )}

      {/* Wordmark */}
      <div style={{
        position: "absolute", bottom: 32, fontSize: 10,
        color: "rgba(255,255,255,0.08)", letterSpacing: "0.35em", textTransform: "uppercase",
      }}>
        white dot
      </div>

      <style>{`
        @keyframes breathe { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(2.6);opacity:0.35} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes livepulse { 0%,100%{opacity:0.6;transform:scale(1)} 50%{opacity:1;transform:scale(1.4)} }
        @keyframes toastIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </div>
  );

  // ── DONE ───────────────────────────────────────────────
  return (
    <div style={{
      minHeight: "100vh", background: "#000",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      opacity: doneFade ? 1 : 0, transition: "opacity 1.8s ease",
      fontFamily: "'Georgia', serif",
      gap: 28, padding: "48px 32px", textAlign: "center",
    }}>
      <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#fff", opacity: 0.45, marginBottom: 8 }} />

      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.22)", letterSpacing: "0.28em", textTransform: "uppercase" }}>
        5 minutes · complete
      </div>

      <div style={{ fontSize: 23, fontWeight: "200", color: "rgba(255,255,255,0.7)", lineHeight: 1.7, maxWidth: 300 }}>
        You gave yourself five minutes the world couldn't have.
      </div>

      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.18)", letterSpacing: "0.08em" }}>
        {liveCount && `${liveCount.toLocaleString()} were still with you`}
      </div>

      {totalSessions > 0 && (
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.1)", letterSpacing: "0.08em" }}>
          session #{totalSessions.toLocaleString()} ever
        </div>
      )}

      <button
        onClick={() => {
          setTimeLeft(300); setStarted(false); setDotBreath(false);
          setSessionFade(false); setScreen("session");
          setTimeout(() => setSessionFade(true), 100);
        }}
        style={{
          marginTop: 16, background: "transparent",
          border: "1px solid rgba(255,255,255,0.12)",
          color: "rgba(255,255,255,0.3)", fontSize: 11,
          letterSpacing: "0.28em", textTransform: "uppercase",
          padding: "16px 44px", borderRadius: "1px",
          cursor: "pointer", fontFamily: "'Georgia', serif", transition: "all 0.4s",
        }}
        onMouseEnter={e => { e.target.style.borderColor = "rgba(255,255,255,0.45)"; e.target.style.color = "#fff"; }}
        onMouseLeave={e => { e.target.style.borderColor = "rgba(255,255,255,0.12)"; e.target.style.color = "rgba(255,255,255,0.3)"; }}
      >
        go again
      </button>

      {/* Waiting list — quiet and unhurried */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, marginTop: 8 }}>
        <div style={{ width: 24, height: 1, background: "rgba(255,255,255,0.06)" }} />
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.15)", fontStyle: "italic", letterSpacing: "0.06em" }}>
          We are making something quiet.
        </div>
        <a
          href="https://docs.google.com/forms/d/e/1FAIpQLScl8VGnwlRILPy7Z-_6Eddl8xwUhBHagCo35Si775rxYZI8fw/viewform?usp=publish-editor"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: 11, color: "rgba(255,255,255,0.25)",
            letterSpacing: "0.2em", textTransform: "uppercase",
            textDecoration: "none", borderBottom: "1px solid rgba(255,255,255,0.1)",
            paddingBottom: 2, transition: "all 0.3s",
          }}
          onMouseEnter={e => { e.target.style.color = "#fff"; e.target.style.borderBottomColor = "rgba(255,255,255,0.4)"; }}
          onMouseLeave={e => { e.target.style.color = "rgba(255,255,255,0.25)"; e.target.style.borderBottomColor = "rgba(255,255,255,0.1)"; }}
        >
          Carry the stillness with you →
        </a>
      </div>

      <div style={{ position: "fixed", bottom: 32, fontSize: 10, color: "rgba(255,255,255,0.07)", letterSpacing: "0.35em", textTransform: "uppercase" }}>
        white dot
      </div>
    </div>
  );
}
