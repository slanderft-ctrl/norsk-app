import { useState, useRef } from "react"

const PUNCT = /^[\s\u2013\-!?.,;:«»""]+$/

function tokenize(text) {
  return text.split(/(\s+|[–\-!?.,;:«»""]+)/g).filter(Boolean)
}

async function callClaude(messages, systemPrompt) {
  const res = await fetch("/api/Chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, systemPrompt }),
  })
  const data = await res.json()
  return data.content?.[0]?.text || ""
}

export default function WordPopover({ text }) {
  const [word, setWord] = useState(null)
  const [rect, setRect] = useState(null)
  const [phase, setPhase] = useState("idle")
  const [explanation, setExplanation] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [history, setHistory] = useState([])
  const [chatInput, setChatInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [chatMode, setChatMode] = useState(false)

  const hideTimer = useRef(null)
  const chatEndRef = useRef(null)

  const clearTimer = () => clearTimeout(hideTimer.current)

  const closeAll = () => {
    setWord(null); setRect(null); setPhase("idle")
    setExplanation(""); setSuggestions([]); setHistory([])
    setChatMode(false); setChatInput("")
  }

  const startHide = () => {
    hideTimer.current = setTimeout(() => {
      if (!chatMode) closeAll()
    }, 200)
  }

  const onWordEnter = (token, e) => {
    clearTimer()
    if (chatMode) return
    const r = e.currentTarget.getBoundingClientRect()
    if (token !== word) {
      setPhase("idle"); setExplanation(""); setSuggestions([]); setHistory([])
    }
    setWord(token)
    setRect({ left: r.left + r.width / 2, top: r.top })
  }

  const askWord = async () => {
    if (!word || loading) return
    setLoading(true); setPhase("loading")
    try {
      const raw = await callClaude(
        [{ role: "user", content: `Слово: "${word}". Контекст: "${text}"` }],
        `Ти вчитель норвезької. Відповідай ТІЛЬКИ валідним JSON без markdown або пояснень: {"explanation":"пояснення українською 1-2 речення","suggestions":["коротке питання 1","коротке питання 2"]}`
      )
      try {
        const clean = raw.replace(/```[\s\S]*?```/g, "").replace(/^[^{]*/, "").replace(/[^}]*$/, "")
        const parsed = JSON.parse(clean)
        setExplanation(parsed.explanation || raw)
        setSuggestions(parsed.suggestions || [])
        setHistory([
          { role: "user", content: `Що означає «${word}»?` },
          { role: "assistant", content: parsed.explanation || raw },
        ])
      } catch {
        setExplanation(raw)
        setSuggestions([])
        setHistory([
          { role: "user", content: `Що означає «${word}»?` },
          { role: "assistant", content: raw },
        ])
      }
      setPhase("answered")
    } catch {
      setExplanation("Помилка з'єднання.")
      setPhase("answered")
    } finally {
      setLoading(false)
    }
  }

  const followUp = async (question) => {
    if (loading) return
    setLoading(true); setSuggestions([])
    const newHistory = [...history, { role: "user", content: question }]
    setHistory(newHistory); setChatInput("")
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50)
    try {
      const answer = await callClaude(
        newHistory,
        `Ти вчитель норвезької. Учень читає текст: "${text}". Питає про слово "${word}". Відповідай коротко українською.`
      )
      setHistory([...newHistory, { role: "assistant", content: answer }])
    } catch {
      setHistory(h => [...h, { role: "assistant", content: "Помилка." }])
    } finally {
      setLoading(false)
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50)
    }
  }

  // Popover dimensions
  const PW = chatMode ? 300 : phase === "answered" ? 260 : 130
  const PH = chatMode ? 340 : phase === "answered" ? 210 : 44

  // Position: fixed, above the word
  const popLeft = rect
    ? Math.max(8, Math.min(rect.left - PW / 2, (typeof window !== "undefined" ? window.innerWidth : 800) - PW - 8))
    : 0
  const popTop = rect ? Math.max(8, rect.top - PH - 10) : 0

  const tokens = tokenize(text)

  return (
    <div style={{ fontFamily: "system-ui, sans-serif" }}>
      {/* TEXT */}
      <p style={{ lineHeight: 1.85, fontSize: "15px", color: "#e5e7eb" }}>
        {tokens.map((token, i) => {
          if (PUNCT.test(token)) return <span key={i}>{token}</span>
          const active = word === token
          return (
            <span
              key={i}
              onMouseEnter={e => onWordEnter(token, e)}
              onMouseLeave={startHide}
              style={{
                borderRadius: "3px",
                padding: "0 2px",
                background: active ? "rgba(99,102,241,0.18)" : "transparent",
                color: active ? "#a5b4fc" : "#e5e7eb",
                cursor: "default",
                transition: "all .1s",
              }}
            >
              {token}
            </span>
          )
        })}
      </p>

      {/* POPOVER — position: fixed so it escapes any overflow:hidden */}
      {word && rect && (
        <div
          onMouseEnter={clearTimer}
          onMouseLeave={() => { if (!chatMode) startHide() }}
          style={{
            position: "fixed",
            left: `${popLeft}px`,
            top: `${popTop}px`,
            width: `${PW}px`,
            background: "#1e2435",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "14px",
            zIndex: 9999,
            boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
            overflow: "hidden",
            transition: "width .18s ease",
          }}
        >
          {/* IDLE */}
          {phase === "idle" && (
            <button
              onClick={askWord}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: "8px",
                background: "transparent", border: "none", padding: "11px 14px",
                cursor: "pointer", fontFamily: "inherit",
              }}
            >
              <span style={{ fontSize: "13px", color: "#818cf8" }}>✦</span>
              <span style={{ fontSize: "13px", fontWeight: 500, color: "#a5b4fc" }}>Що це?</span>
            </button>
          )}

          {/* LOADING */}
          {phase === "loading" && (
            <div style={{ padding: "13px 14px", display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "13px", color: "#818cf8" }}>✦</span>
              <span style={{ fontSize: "12px", color: "#9ca3af" }}>Думаю...</span>
            </div>
          )}

          {/* ANSWERED */}
          {phase === "answered" && !chatMode && (
            <div style={{ padding: "12px 13px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ fontSize: "12px", color: "#818cf8" }}>✦</span>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "#f3f4f6" }}>«{word}»</span>
                </div>
                <button
                  onClick={() => { setChatMode(true); clearTimer() }}
                  title="Розкрити чат"
                  style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "6px", width: "22px", height: "22px", cursor: "pointer", color: "#6b7280", fontSize: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}
                >↗</button>
              </div>
              <p style={{ fontSize: "12px", color: "#d1d5db", lineHeight: 1.55, margin: "0 0 10px" }}>
                {explanation}
              </p>
              {history.length > 2 && (
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "8px", marginBottom: "8px" }}>
                  {history.slice(2).map((m, i) => (
                    <div key={i} style={{ fontSize: "11px", lineHeight: 1.5, marginBottom: "4px", color: m.role === "user" ? "#6b7280" : "#9ca3af" }}>
                      {m.role === "user" && <span style={{ color: "#818cf8" }}>→ </span>}{m.content}
                    </div>
                  ))}
                </div>
              )}
              {loading && <div style={{ fontSize: "11px", color: "#6b7280", marginBottom: "8px" }}>✦ Думаю...</div>}
              {!loading && (
                <div style={{ display: "flex", flexDirection: "column", gap: "5px", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "8px" }}>
                  {suggestions.map((s, i) => (
                    <button key={i} onClick={() => followUp(s)}
                      style={{ textAlign: "left", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "6px 9px", fontSize: "11px", color: "#9ca3af", cursor: "pointer", fontFamily: "inherit", lineHeight: 1.4 }}
                    >{s}</button>
                  ))}
                  <button onClick={() => { setChatMode(true); clearTimer() }}
                    style={{ textAlign: "left", background: "transparent", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "6px 9px", fontSize: "11px", color: "#6b7280", cursor: "pointer", fontFamily: "inherit" }}
                  >Запитати своє →</button>
                </div>
              )}
            </div>
          )}

          {/* CHAT MODE */}
          {chatMode && (
            <div style={{ display: "flex", flexDirection: "column", height: "340px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 13px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ fontSize: "12px", color: "#818cf8" }}>✦</span>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "#f3f4f6" }}>«{word}»</span>
                </div>
                <button onClick={closeAll}
                  style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: "16px", color: "#6b7280" }}
                >✕</button>
              </div>
              <div style={{ flex: 1, overflowY: "auto", padding: "10px 13px", display: "flex", flexDirection: "column", gap: "8px" }}>
                {history.map((m, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                    <div style={{ maxWidth: "85%", fontSize: "12px", lineHeight: 1.55, padding: "7px 10px", borderRadius: "10px", background: m.role === "user" ? "#4f46e5" : "rgba(255,255,255,0.06)", color: "#f3f4f6" }}>
                      {m.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div style={{ fontSize: "12px", color: "#6b7280", padding: "7px 10px", background: "rgba(255,255,255,0.04)", borderRadius: "10px", alignSelf: "flex-start" }}>✦ Думаю...</div>
                )}
                {!loading && suggestions.length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    {suggestions.map((s, i) => (
                      <button key={i} onClick={() => followUp(s)}
                        style={{ textAlign: "left", background: "transparent", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "5px 9px", fontSize: "11px", color: "#9ca3af", cursor: "pointer", fontFamily: "inherit" }}
                      >{s}</button>
                    ))}
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
              <div style={{ padding: "8px 10px", borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", gap: "6px" }}>
                <input
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && chatInput.trim() && !loading) followUp(chatInput) }}
                  placeholder={`Запитай про «${word}»...`}
                  style={{ flex: 1, fontSize: "12px", padding: "7px 10px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "#f3f4f6", fontFamily: "inherit", outline: "none" }}
                />
                <button
                  onClick={() => { if (chatInput.trim() && !loading) followUp(chatInput) }}
                  style={{ background: "#0F6B5E", border: "none", borderRadius: "8px", padding: "7px 11px", cursor: "pointer", fontSize: "13px", color: "#fff" }}
                >→</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
