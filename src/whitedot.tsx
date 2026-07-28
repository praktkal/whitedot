import { useState } from "react";

const PRODUCTS = [
  {
    id: "aram-7",
    book: "Aram",
    chapter: "Chapter 1",
    kural: "Kural 7",
    verse: "They alone escape the sorrows of the mind who take refuge at the feet of the incomparable one.",
    price: 95,
    color: "Black",
  },
  {
    id: "porul-396",
    book: "Porul",
    chapter: "Chapter 40",
    kural: "Kural 396",
    verse: "The more you dig a sand spring, the more it flows. The more you learn, the more wisdom flows.",
    price: 95,
    color: "Black",
  },
  {
    id: "aram-121",
    book: "Aram",
    chapter: "Chapter 13",
    kural: "Kural 121",
    verse: "Self control leads one among the gods. Its absence drives one into deepest darkness.",
    price: 95,
    color: "Black",
  },
  {
    id: "porul-620",
    book: "Porul",
    chapter: "Chapter 62",
    kural: "Kural 620",
    verse: "Those who tirelessly strive will even overcome the fate that stands against them.",
    price: 95,
    color: "Black",
  },
  {
    id: "inbam-1281",
    book: "Inbam",
    chapter: "Chapter 129",
    kural: "Kural 1281",
    verse: "To think of love is joy. To see it is greater joy still.",
    price: 95,
    color: "Black",
  },
  {
    id: "aram-101",
    book: "Aram",
    chapter: "Chapter 11",
    kural: "Kural 101",
    verse: "One may escape after slaying every goodness — but there is no escape for one who slays gratitude.",
    price: 95,
    color: "Black",
  },
];

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

// Tee thumbnail component
function TeeThumb({ product, hovered }) {
  return (
    <svg viewBox="0 0 240 280" style={{ width: "100%", height: "auto", display: "block" }}>
      <defs>
        <linearGradient id={`g-${product.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#242424" />
          <stop offset="100%" stopColor="#0d0d0d" />
        </linearGradient>
      </defs>
      {/* sleeves */}
      <path d="M78,48 L38,68 L26,124 L54,133 L64,96 L84,86 Z" fill="#161616" />
      <path d="M162,48 L202,68 L214,124 L186,133 L176,96 L156,86 Z" fill="#161616" />
      {/* body */}
      <path d="M84,42 Q104,33 118,31 Q124,27 120,27 Q136,33 156,42 L176,96 L176,264 Q176,272 168,272 L72,272 Q64,272 64,264 L64,96 Z"
        fill={`url(#g-${product.id})`} />
      {/* collar */}
      <path d="M104,34 Q118,28 132,34 Q126,46 120,47 Q114,46 104,34"
        fill="none" stroke="#2c2c2c" strokeWidth="4" strokeLinecap="round" />
      {/* left chest reference — appears on hover */}
      <g opacity={hovered ? 1 : 0.55} style={{ transition: "opacity 0.4s" }}>
        <text x="100" y="92" fill="#fff" textAnchor="middle" fontFamily="Georgia,serif" fontSize="6" letterSpacing="1" fontWeight="bold">{product.book.toUpperCase()}</text>
        <circle cx="100" cy="99" r="1.4" fill="#fff" />
        <text x="100" y="110" fill="rgba(255,255,255,0.7)" textAnchor="middle" fontFamily="Georgia,serif" fontSize="5" letterSpacing="0.5">{product.kural.toUpperCase()}</text>
      </g>
      {/* verse patch lower right */}
      <rect x="140" y="220" width="30" height="30" rx="2" fill="#1a1a12" stroke="rgba(190,180,140,0.3)" strokeWidth="0.6" strokeDasharray="1.5 1.5" opacity={hovered ? 1 : 0.6} style={{ transition: "opacity 0.4s" }} />
    </svg>
  );
}

export default function WhiteDot() {
  const [view, setView] = useState("shop"); // shop | product | about
  const [selected, setSelected] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [size, setSize] = useState(null);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  const openProduct = (p) => {
    setSelected(p);
    setSize(null);
    setView("product");
    window.scrollTo(0, 0);
  };

  const addToCart = () => {
    if (!size) return;
    setCart([...cart, { ...selected, size, cartId: Date.now() }]);
    setCartOpen(true);
  };

  const removeFromCart = (cartId) => setCart(cart.filter(c => c.cartId !== cartId));
  const cartTotal = cart.reduce((sum, i) => sum + i.price, 0);

  const mono = "'Helvetica Neue', Arial, sans-serif";

  return (
    <div style={{
      minHeight: "100vh",
      background: "#fff",
      color: "#111",
      fontFamily: mono,
      fontSize: 13,
    }}>

      {/* ─── Header ─── */}
      <header style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "28px 40px",
        borderBottom: "1px solid #eee",
        position: "sticky",
        top: 0,
        background: "#fff",
        zIndex: 10,
      }}>
        <div
          onClick={() => setView("shop")}
          style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
        >
          <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#111" }} />
          <span style={{ fontSize: 14, letterSpacing: "0.15em", fontWeight: 500 }}>WHITE DOT</span>
        </div>

        <nav style={{ display: "flex", gap: 32, alignItems: "center", fontSize: 12, letterSpacing: "0.08em" }}>
          <span onClick={() => setView("shop")} style={{ cursor: "pointer", color: view === "shop" ? "#111" : "#999" }}>SHOP</span>
          <span onClick={() => setView("about")} style={{ cursor: "pointer", color: view === "about" ? "#111" : "#999" }}>ABOUT</span>
          <span onClick={() => setCartOpen(true)} style={{ cursor: "pointer" }}>CART ({cart.length})</span>
        </nav>
      </header>

      {/* ─── SHOP ─── */}
      {view === "shop" && (
        <div>
          {/* Hero */}
          <div style={{ textAlign: "center", padding: "80px 24px 64px" }}>
            <div style={{ fontSize: 12, letterSpacing: "0.25em", color: "#999", marginBottom: 20 }}>COLLECTIVE STILLNESS</div>
            <div style={{ fontSize: 28, fontWeight: 400, letterSpacing: "0.02em", maxWidth: 520, margin: "0 auto", lineHeight: 1.5, fontFamily: "'Georgia', serif" }}>
              One tee. One verse from the Thirukural. Chosen by you.
            </div>
            <div style={{ fontSize: 13, color: "#888", marginTop: 20, letterSpacing: "0.03em" }}>
              Made in Chennai · 280gsm cotton · Embroidered
            </div>
          </div>

          {/* Product grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 0,
            borderTop: "1px solid #eee",
          }}>
            {PRODUCTS.map((p, i) => (
              <div
                key={p.id}
                onClick={() => openProduct(p)}
                onMouseEnter={() => setHoveredId(p.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  borderRight: "1px solid #eee",
                  borderBottom: "1px solid #eee",
                  padding: "40px 32px 28px",
                  cursor: "pointer",
                  background: hoveredId === p.id ? "#fafafa" : "#fff",
                  transition: "background 0.3s",
                }}
              >
                <div style={{ maxWidth: 200, margin: "0 auto 24px" }}>
                  <TeeThumb product={p} hovered={hoveredId === p.id} />
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 12, letterSpacing: "0.1em", marginBottom: 6 }}>
                    {p.book.toUpperCase()} · {p.kural.toUpperCase()}
                  </div>
                  <div style={{ fontSize: 12, color: "#999" }}>${p.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── PRODUCT ─── */}
      {view === "product" && selected && (
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          minHeight: "calc(100vh - 85px)",
        }}>
          {/* Left — image */}
          <div style={{
            background: "#fafafa",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 60,
            borderRight: "1px solid #eee",
          }}>
            <div style={{ maxWidth: 380, width: "100%" }}>
              <TeeThumb product={selected} hovered={true} />
            </div>
          </div>

          {/* Right — details */}
          <div style={{ padding: "64px 56px", display: "flex", flexDirection: "column", gap: 32, maxWidth: 480 }}>
            <div>
              <div onClick={() => setView("shop")} style={{ fontSize: 11, color: "#999", letterSpacing: "0.1em", cursor: "pointer", marginBottom: 32 }}>
                ← BACK
              </div>
              <div style={{ fontSize: 20, letterSpacing: "0.05em", marginBottom: 8, fontFamily: "'Georgia', serif" }}>
                {selected.book} · {selected.chapter} · {selected.kural}
              </div>
              <div style={{ fontSize: 14, color: "#888" }}>${selected.price}</div>
            </div>

            {/* Verse */}
            <div style={{
              borderLeft: "2px solid #111",
              paddingLeft: 20,
              fontSize: 15,
              lineHeight: 1.7,
              fontStyle: "italic",
              color: "#333",
              fontFamily: "'Georgia', serif",
            }}>
              {selected.verse}
            </div>

            {/* Size selector */}
            <div>
              <div style={{ fontSize: 11, letterSpacing: "0.15em", color: "#999", marginBottom: 14 }}>SIZE</div>
              <div style={{ display: "flex", gap: 8 }}>
                {SIZES.map(s => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    style={{
                      width: 44, height: 44,
                      border: size === s ? "1px solid #111" : "1px solid #ddd",
                      background: size === s ? "#111" : "#fff",
                      color: size === s ? "#fff" : "#111",
                      fontSize: 12,
                      cursor: "pointer",
                      fontFamily: mono,
                      transition: "all 0.2s",
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to cart */}
            <button
              onClick={addToCart}
              disabled={!size}
              style={{
                padding: "16px",
                background: size ? "#111" : "#f5f5f5",
                color: size ? "#fff" : "#bbb",
                border: "none",
                fontSize: 12,
                letterSpacing: "0.2em",
                cursor: size ? "pointer" : "default",
                fontFamily: mono,
                transition: "all 0.2s",
              }}
            >
              {size ? "ADD TO CART" : "SELECT A SIZE"}
            </button>

            {/* Details */}
            <div style={{ fontSize: 12, color: "#999", lineHeight: 2, borderTop: "1px solid #eee", paddingTop: 24 }}>
              280gsm heavyweight cotton · Made in Chennai, India<br />
              Reference embroidered on left chest<br />
              Full verse on 2×2 patch, lower right — Tamil & English<br />
              Free shipping worldwide
            </div>
          </div>
        </div>
      )}

      {/* ─── ABOUT ─── */}
      {view === "about" && (
        <div style={{ maxWidth: 620, margin: "0 auto", padding: "100px 32px", textAlign: "center" }}>
          <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#111", margin: "0 auto 40px" }} />
          <div style={{ fontSize: 22, lineHeight: 1.8, fontFamily: "'Georgia', serif", marginBottom: 40 }}>
            White Dot began as five minutes of stillness. It became something to wear.
          </div>
          <div style={{ fontSize: 14, lineHeight: 2, color: "#666", fontFamily: "'Georgia', serif" }}>
            Each tee carries one verse from the Thirukural — the 2000 year old Tamil text of 1330 couplets on how to live well. You choose the verse that speaks to you. It is embroidered in Tamil and English. The outside stays quiet. The meaning stays with you.
            <br /><br />
            Made in Chennai, from the finest Indian cotton. For people who have stopped needing to be noticed.
          </div>
        </div>
      )}

      {/* ─── CART DRAWER ─── */}
      {cartOpen && (
        <div style={{
          position: "fixed", top: 0, right: 0, bottom: 0,
          width: 380, maxWidth: "100vw",
          background: "#fff",
          borderLeft: "1px solid #eee",
          boxShadow: "-8px 0 40px rgba(0,0,0,0.08)",
          zIndex: 50,
          padding: "32px 28px",
          display: "flex",
          flexDirection: "column",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
            <span style={{ fontSize: 13, letterSpacing: "0.15em" }}>CART ({cart.length})</span>
            <span onClick={() => setCartOpen(false)} style={{ cursor: "pointer", fontSize: 18, color: "#999" }}>×</span>
          </div>

          {cart.length === 0 ? (
            <div style={{ color: "#999", fontSize: 13, textAlign: "center", marginTop: 40 }}>
              Your cart is empty.
            </div>
          ) : (
            <>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 20, overflowY: "auto" }}>
                {cart.map(item => (
                  <div key={item.cartId} style={{ display: "flex", gap: 16, borderBottom: "1px solid #f0f0f0", paddingBottom: 20 }}>
                    <div style={{ width: 60, flexShrink: 0 }}>
                      <TeeThumb product={item} hovered={false} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, letterSpacing: "0.05em", marginBottom: 4 }}>{item.book} · {item.kural}</div>
                      <div style={{ fontSize: 11, color: "#999" }}>Size {item.size} · ${item.price}</div>
                    </div>
                    <span onClick={() => removeFromCart(item.cartId)} style={{ cursor: "pointer", color: "#ccc", fontSize: 16 }}>×</span>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: "1px solid #eee", paddingTop: 20, marginTop: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20, fontSize: 13 }}>
                  <span>TOTAL</span>
                  <span>${cartTotal}</span>
                </div>
                <button style={{
                  width: "100%", padding: "16px",
                  background: "#111", color: "#fff", border: "none",
                  fontSize: 12, letterSpacing: "0.2em", cursor: "pointer", fontFamily: mono,
                }}>
                  CHECKOUT
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* ─── Footer ─── */}
      <footer style={{
        borderTop: "1px solid #eee",
        padding: "40px",
        display: "flex",
        justifyContent: "space-between",
        fontSize: 11,
        color: "#999",
        letterSpacing: "0.08em",
      }}>
        <span>WHITE DOT · CHENNAI</span>
        <span>COLLECTIVE STILLNESS</span>
      </footer>
    </div>
  );
}
