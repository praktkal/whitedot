import { useState } from "react";

const PRODUCTS = [
  {
    id: "aram-7",
    book: "Aram",
    chapter: "Chapter 1",
    kural: "Kural 7",
    tamil: "உற்றநோய் நீக்கி உறாஅமை முற்காக்கும் பெற்றியார்",
    verse: "They alone escape the sorrows of the mind who take refuge at the feet of the incomparable one.",
    price: 95,
  },
  {
    id: "porul-396",
    book: "Porul",
    chapter: "Chapter 40",
    kural: "Kural 396",
    tamil: "தொட்டனைத் தூறும் மணற்கேணி மாந்தர்க்குக் கற்றனைத் தூறும் அறிவு",
    verse: "The more you dig a sand spring, the more it flows. The more you learn, the more wisdom flows.",
    price: 95,
  },
  {
    id: "aram-121",
    book: "Aram",
    chapter: "Chapter 13",
    kural: "Kural 121",
    tamil: "அடக்கம் அமரருள் உய்க்கும் அடங்காமை ஆரிருள் உய்த்து விடும்",
    verse: "Self control leads one among the gods. Its absence drives one into deepest darkness.",
    price: 95,
  },
  {
    id: "porul-620",
    book: "Porul",
    chapter: "Chapter 62",
    kural: "Kural 620",
    tamil: "ஊழையும் உப்பக்கம் காண்பர் உலைவின்றித் தாழாது உஞற்று பவர்",
    verse: "Those who tirelessly strive will even overcome the fate that stands against them.",
    price: 95,
  },
  {
    id: "inbam-1281",
    book: "Inbam",
    chapter: "Chapter 129",
    kural: "Kural 1281",
    tamil: "உள்ளக் களித்தலும் காண மகிழ்தலும் கள்ளுக்கில் காமத்திற் குண்டு",
    verse: "To think of love is joy. To see it is greater joy still.",
    price: 95,
  },
  {
    id: "aram-101",
    book: "Aram",
    chapter: "Chapter 11",
    kural: "Kural 101",
    tamil: "செய்யாமல் செய்த உதவிக்கு வையகமும் வானகமும் ஆற்றல் அரிது",
    verse: "One may escape after slaying every goodness — but there is no escape for one who slays gratitude.",
    price: 95,
  },
];

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

// Detail square — the chest reference as worn (upper left)
function ChestSquare({ product, size = 300 }) {
  return (
    <div style={{
      width: size, height: size,
      background: "#0a0a0a",
      border: "1px solid #1e1e1e",
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-start",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* subtle fabric weave texture via faint lines */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.015) 0px, rgba(255,255,255,0.015) 1px, transparent 1px, transparent 3px)",
        pointerEvents: "none",
      }} />
      {/* reference — positioned upper-left as worn */}
      <div style={{
        position: "absolute",
        top: size * 0.22,
        left: size * 0.18,
        textAlign: "center",
        fontFamily: "'Georgia', serif",
      }}>
        <div style={{ fontSize: size * 0.045, letterSpacing: "0.25em", color: "#fff", fontWeight: 500 }}>
          {product.book.toUpperCase()}
        </div>
        <div style={{ width: size * 0.02, height: size * 0.02, borderRadius: "50%", background: "#fff", margin: `${size * 0.03}px auto` }} />
        <div style={{ fontSize: size * 0.035, letterSpacing: "0.18em", color: "rgba(255,255,255,0.72)" }}>
          {product.chapter.toUpperCase()}
        </div>
        <div style={{ width: size * 0.02, height: size * 0.02, borderRadius: "50%", background: "#fff", margin: `${size * 0.03}px auto` }} />
        <div style={{ fontSize: size * 0.035, letterSpacing: "0.18em", color: "rgba(255,255,255,0.72)" }}>
          {product.kural.toUpperCase()}
        </div>
      </div>
      {/* corner label */}
      <div style={{ position: "absolute", bottom: 14, left: 16, fontSize: 9, letterSpacing: "0.2em", color: "rgba(255,255,255,0.25)", fontFamily: "'Helvetica Neue', sans-serif" }}>
        LEFT CHEST
      </div>
    </div>
  );
}

// Detail square — the verse patch as worn (lower right)
function PatchSquare({ product, size = 300 }) {
  return (
    <div style={{
      width: size, height: size,
      background: "#0a0a0a",
      border: "1px solid #1e1e1e",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.015) 0px, rgba(255,255,255,0.015) 1px, transparent 1px, transparent 3px)",
        pointerEvents: "none",
      }} />
      {/* patch — positioned lower-right as worn */}
      <div style={{
        position: "absolute",
        bottom: size * 0.16,
        right: size * 0.14,
        width: size * 0.44,
        padding: size * 0.03,
        border: "1px dashed rgba(200,185,140,0.4)",
        textAlign: "center",
        fontFamily: "'Georgia', serif",
      }}>
        <div style={{ fontSize: size * 0.032, color: "rgba(205,190,150,0.9)", lineHeight: 1.5, marginBottom: size * 0.02 }}>
          {product.tamil}
        </div>
        <div style={{ width: size * 0.015, height: size * 0.015, borderRadius: "50%", background: "rgba(205,190,150,0.7)", margin: `${size * 0.025}px auto` }} />
        <div style={{ fontSize: size * 0.024, color: "rgba(175,165,130,0.85)", lineHeight: 1.5, fontStyle: "italic" }}>
          {product.verse}
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 14, left: 16, fontSize: 9, letterSpacing: "0.2em", color: "rgba(255,255,255,0.25)", fontFamily: "'Helvetica Neue', sans-serif" }}>
        LOWER RIGHT · PATCH
      </div>
    </div>
  );
}

export default function WhiteDot() {
  const [view, setView] = useState("shop");
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

  const sans = "'Helvetica Neue', Arial, sans-serif";

  return (
    <div style={{
      minHeight: "100vh",
      background: "#000",
      color: "#e8e8e8",
      fontFamily: sans,
      fontSize: 13,
    }}>

      {/* ─── Header ─── */}
      <header style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "28px 40px",
        borderBottom: "1px solid #1a1a1a",
        position: "sticky",
        top: 0,
        background: "#000",
        zIndex: 10,
      }}>
        <div onClick={() => setView("shop")} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
          <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#fff" }} />
          <span style={{ fontSize: 14, letterSpacing: "0.15em", fontWeight: 500, color: "#fff" }}>WHITE DOT</span>
        </div>
        <nav style={{ display: "flex", gap: 32, alignItems: "center", fontSize: 12, letterSpacing: "0.08em" }}>
          <span onClick={() => setView("shop")} style={{ cursor: "pointer", color: view === "shop" ? "#fff" : "#666" }}>SHOP</span>
          <span onClick={() => setView("about")} style={{ cursor: "pointer", color: view === "about" ? "#fff" : "#666" }}>ABOUT</span>
          <span onClick={() => setCartOpen(true)} style={{ cursor: "pointer", color: "#999" }}>CART ({cart.length})</span>
        </nav>
      </header>

      {/* ─── SHOP ─── */}
      {view === "shop" && (
        <div>
          <div style={{ textAlign: "center", padding: "88px 24px 64px" }}>
            <div style={{ fontSize: 12, letterSpacing: "0.3em", color: "#666", marginBottom: 22 }}>COLLECTIVE STILLNESS</div>
            <div style={{ fontSize: 27, fontWeight: 400, maxWidth: 540, margin: "0 auto", lineHeight: 1.55, fontFamily: "'Georgia', serif", color: "#fff" }}>
              One tee. One verse from the Thirukural. Chosen by you.
            </div>
            <div style={{ fontSize: 12, color: "#666", marginTop: 22, letterSpacing: "0.05em" }}>
              Made in Chennai · 280gsm cotton · Embroidered
            </div>
          </div>

          {/* Product grid — chest squares */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 0,
            borderTop: "1px solid #1a1a1a",
          }}>
            {PRODUCTS.map((p) => (
              <div
                key={p.id}
                onClick={() => openProduct(p)}
                onMouseEnter={() => setHoveredId(p.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  borderRight: "1px solid #1a1a1a",
                  borderBottom: "1px solid #1a1a1a",
                  padding: "44px 44px 32px",
                  cursor: "pointer",
                  background: hoveredId === p.id ? "#080808" : "#000",
                  transition: "background 0.3s",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <ChestSquare product={p} size={240} />
                <div style={{ textAlign: "center", marginTop: 24 }}>
                  <div style={{ fontSize: 12, letterSpacing: "0.1em", marginBottom: 6, color: "#ddd" }}>
                    {p.book.toUpperCase()} · {p.kural.toUpperCase()}
                  </div>
                  <div style={{ fontSize: 12, color: "#666" }}>${p.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── PRODUCT ─── */}
      {view === "product" && selected && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "calc(100vh - 85px)" }}>
          {/* Left — two detail squares */}
          <div style={{
            background: "#050505",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 32,
            padding: 56,
            borderRight: "1px solid #1a1a1a",
          }}>
            <ChestSquare product={selected} size={300} />
            <PatchSquare product={selected} size={300} />
          </div>

          {/* Right — details */}
          <div style={{ padding: "64px 56px", display: "flex", flexDirection: "column", gap: 32, maxWidth: 480 }}>
            <div>
              <div onClick={() => setView("shop")} style={{ fontSize: 11, color: "#666", letterSpacing: "0.1em", cursor: "pointer", marginBottom: 32 }}>
                ← BACK
              </div>
              <div style={{ fontSize: 20, letterSpacing: "0.05em", marginBottom: 8, fontFamily: "'Georgia', serif", color: "#fff" }}>
                {selected.book} · {selected.chapter} · {selected.kural}
              </div>
              <div style={{ fontSize: 14, color: "#666" }}>${selected.price}</div>
            </div>

            <div style={{
              borderLeft: "2px solid #333",
              paddingLeft: 20,
              display: "flex", flexDirection: "column", gap: 14,
            }}>
              <div style={{ fontSize: 15, lineHeight: 1.7, color: "rgba(205,190,150,0.9)", fontFamily: "'Georgia', serif" }}>
                {selected.tamil}
              </div>
              <div style={{ fontSize: 14, lineHeight: 1.7, fontStyle: "italic", color: "#999", fontFamily: "'Georgia', serif" }}>
                {selected.verse}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 11, letterSpacing: "0.15em", color: "#666", marginBottom: 14 }}>SIZE</div>
              <div style={{ display: "flex", gap: 8 }}>
                {SIZES.map(s => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    style={{
                      width: 44, height: 44,
                      border: size === s ? "1px solid #fff" : "1px solid #333",
                      background: size === s ? "#fff" : "transparent",
                      color: size === s ? "#000" : "#ccc",
                      fontSize: 12, cursor: "pointer", fontFamily: sans,
                      transition: "all 0.2s",
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={addToCart}
              disabled={!size}
              style={{
                padding: "16px",
                background: size ? "#fff" : "#111",
                color: size ? "#000" : "#555",
                border: "none",
                fontSize: 12, letterSpacing: "0.2em",
                cursor: size ? "pointer" : "default",
                fontFamily: sans, transition: "all 0.2s",
              }}
            >
              {size ? "ADD TO CART" : "SELECT A SIZE"}
            </button>

            <div style={{ fontSize: 12, color: "#666", lineHeight: 2, borderTop: "1px solid #1a1a1a", paddingTop: 24 }}>
              280gsm heavyweight cotton · Made in Chennai, India<br />
              Reference embroidered upper left, as worn<br />
              Verse on a 2×2 patch, lower right — Tamil & English<br />
              Free shipping worldwide
            </div>
          </div>
        </div>
      )}

      {/* ─── ABOUT ─── */}
      {view === "about" && (
        <div style={{ maxWidth: 620, margin: "0 auto", padding: "100px 32px", textAlign: "center" }}>
          <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#fff", margin: "0 auto 40px" }} />
          <div style={{ fontSize: 22, lineHeight: 1.8, fontFamily: "'Georgia', serif", marginBottom: 40, color: "#fff" }}>
            White Dot began as five minutes of stillness. It became something to wear.
          </div>
          <div style={{ fontSize: 14, lineHeight: 2, color: "#888", fontFamily: "'Georgia', serif" }}>
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
          background: "#0a0a0a",
          borderLeft: "1px solid #1a1a1a",
          zIndex: 50,
          padding: "32px 28px",
          display: "flex", flexDirection: "column",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
            <span style={{ fontSize: 13, letterSpacing: "0.15em", color: "#fff" }}>CART ({cart.length})</span>
            <span onClick={() => setCartOpen(false)} style={{ cursor: "pointer", fontSize: 18, color: "#666" }}>×</span>
          </div>

          {cart.length === 0 ? (
            <div style={{ color: "#555", fontSize: 13, textAlign: "center", marginTop: 40 }}>Your cart is empty.</div>
          ) : (
            <>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 20, overflowY: "auto" }}>
                {cart.map(item => (
                  <div key={item.cartId} style={{ display: "flex", gap: 16, borderBottom: "1px solid #1a1a1a", paddingBottom: 20, alignItems: "center" }}>
                    <div style={{ flexShrink: 0 }}>
                      <ChestSquare product={item} size={56} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, letterSpacing: "0.05em", marginBottom: 4, color: "#ddd" }}>{item.book} · {item.kural}</div>
                      <div style={{ fontSize: 11, color: "#666" }}>Size {item.size} · ${item.price}</div>
                    </div>
                    <span onClick={() => removeFromCart(item.cartId)} style={{ cursor: "pointer", color: "#555", fontSize: 16 }}>×</span>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: "1px solid #1a1a1a", paddingTop: 20, marginTop: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20, fontSize: 13, color: "#fff" }}>
                  <span>TOTAL</span>
                  <span>${cartTotal}</span>
                </div>
                <button style={{
                  width: "100%", padding: "16px",
                  background: "#fff", color: "#000", border: "none",
                  fontSize: 12, letterSpacing: "0.2em", cursor: "pointer", fontFamily: sans,
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
        borderTop: "1px solid #1a1a1a",
        padding: "40px",
        display: "flex",
        justifyContent: "space-between",
        fontSize: 11,
        color: "#555",
        letterSpacing: "0.08em",
      }}>
        <span>WHITE DOT · CHENNAI</span>
        <span>COLLECTIVE STILLNESS</span>
      </footer>
    </div>
  );
}
