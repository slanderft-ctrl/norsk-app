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
  const [activeIdx, setActiveIdx] = useState(null)
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
    setActiveIdx(null); setPhase("idle")
    setExplanation(""); setSuggestions([]); setHistory([])
    setChatMode(false); setChatInput("")
  }

  const startHide = () => {
    hideTimer.current = setTimeout(() => { if (!chatMode) closeAll() }, 200)
  }

  const tokens = tokenize(text)
  const activeWord = activeIdx !== null ? tokens[activeIdx] : null

  const onWordEnter = (i) => {
    clearTimer()
    if (chatMode) return
    if (i !== activeIdx) {
      setPhase("idle"); setExplanation(""); setSuggestions([]); setHistory([])
    }
    setActiveIdx(i)
  }

  const askWord = async () => {
    if (!activeWord || loading) return
    setLoading(true); setPhase("loading")
    try {
      const raw = await callClaude(
        [{ role: "user", content: `Слово: "${activeWord}". Контекст: "${text}"` }],
        `Ти вчитель норвезької. Відповідай ТІЛЬКИ валідним JSON без markdown: {"explanation":"пояснення українською 1-2 речення","suggestions":["коротке питання 1","коротке питання 2"]}`
      )
      let expl = raw, sugg = []
      try {
        const m = raw.match(/\{[\s\S]*\}/)
        if (m) { const p = JSON.parse(m[0]); expl = p.explanation || raw; sugg = p.suggestions || [] }
      } catch {}
      setExplanation(expl); setSuggestions(sugg)
      setHistory([
        { role: "user", content: `Що означає «${activeWord}»?` },
        { role: "assistant", content: expl },
      ])
      setPhase("answered")
    } catch {
      setExplanation("Помилка з'єднання."); setPhase("answered")
    } finally { setLoading(false) }
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
        `Ти вчитель норвезької. Учень читає: "${text}". Питає про слово "${activeWord}". Відповідай коротко українською.`
      )
      setHistory([...newHistory, { role: "assistant", content: answer }])
    } catch {
      setHistory(h => [...h, { role: "assistant", content: "Помилка." }])
    } finally {
      setLoading(false)
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50)
    }
  }

  const PW = chatMode ? 600 : phase === "answered" ? 280 : 190

  return (
    <div style={{ position: "relative", lineHeight: 1.85, fontSize: "15px", color: "#e5e7eb", fontFamily: "system-ui, sans-serif" }}>
      {tokens.map((token, i) => {
        if (PUNCT.test(token)) return <span key={i}>{token}</span>
        const active = activeIdx === i
        return (
          <span key={i} style={{ position: "relative", display: "inline" }}>
            <span
              onMouseEnter={() => onWordEnter(i)}
              onMouseLeave={startHide}
              style={{
                borderRadius: "3px", padding: "0 2px",
                background: active ? "rgba(99,102,241,0.18)" : "transparent",
                color: active ? "#a5b4fc" : "#e5e7eb",
                cursor: "default", transition: "all .1s",
              }}
            >
              {token}
            </span>

            {/* Попап рендериться inline прямо над словом */}
            {active && (
              <span
                onMouseEnter={clearTimer}
                onMouseLeave={() => { if (!chatMode) startHide() }}
                style={{
                  position: "absolute",
                  bottom: "calc(100% + 6px)",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: `${PW}px`,
                  background: "#1e2435",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "12px",
                  zIndex: 9999,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                  display: "inline-block",
                  verticalAlign: "bottom",
                  whiteSpace: "normal",
                  transition: "width .15s ease",
                }}
              >
                {/* IDLE */}
                {phase === "idle" && (
                  <button onClick={askWord}
                    style={{ width: "100%", display: "flex", alignItems: "center", gap: "8px", background: "transparent", border: "none", padding: "10px 13px", cursor: "pointer", fontFamily: "inherit" }}
                  >
                    <span style={{ fontSize: "12px", color: "#818cf8" }}>✦</span>
                    <span style={{ fontSize: "13px", fontWeight: 500, color: "#a5b4fc" }}>Що це?</span>
                  </button>
                )}

                {/* LOADING */}
                {phase === "loading" && (
                  <div style={{ padding: "12px 13px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "12px", color: "#818cf8" }}>✦</span>
                    <span style={{ fontSize: "12px", color: "#9ca3af" }}>Думаю...</span>
                  </div>
                )}

                {/* ANSWERED */}
                {phase === "answered" && !chatMode && (
                  <div style={{ padding: "12px 13px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ fontSize: "11px", color: "#818cf8" }}>✦</span>
                        <span style={{ fontSize: "13px", fontWeight: 600, color: "#f3f4f6" }}>«{activeWord}»</span>
                      </div>
                      <button onClick={() => { setChatMode(true); clearTimer() }}
                        style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "5px", width: "22px", height: "22px", cursor: "pointer", color: "#6b7280", fontSize: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}
                      >↗</button>
                    </div>
                    <p style={{ fontSize: "12px", color: "#d1d5db", lineHeight: 1.55, margin: "0 0 10px" }}>
                      {explanation}
                    </p>
                    {history.length > 2 && (
                      <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: "8px", marginBottom: "8px" }}>
                        {history.slice(2).map((m, i) => (
                          <div key={i} style={{ fontSize: "11px", lineHeight: 1.5, marginBottom: "4px", color: m.role === "user" ? "#6b7280" : "#9ca3af" }}>
                            {m.role === "user" && <span style={{ color: "#818cf8" }}>→ </span>}{m.content}
                          </div>
                        ))}
                      </div>
                    )}
                    {loading && <div style={{ fontSize: "11px", color: "#6b7280", marginBottom: "8px" }}>✦ Думаю...</div>}
                    {!loading && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px", borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: "8px" }}>
                        {suggestions.map((s, i) => (
                          <button key={i} onClick={() => followUp(s)}
                            style={{ textAlign: "left", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "7px", padding: "5px 8px", fontSize: "11px", color: "#9ca3af", cursor: "pointer", fontFamily: "inherit", lineHeight: 1.4 }}
                          >{s}</button>
                        ))}
                        <button onClick={() => { setChatMode(true); clearTimer() }}
                          style={{ textAlign: "left", background: "transparent", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "7px", padding: "5px 8px", fontSize: "11px", color: "#6b7280", cursor: "pointer", fontFamily: "inherit" }}
                        >Запитати своє →</button>
                      </div>
                    )}
                  </div>
                )}

                {/* CHAT MODE */}
                {chatMode && (
                  <div style={{ display: "flex", flexDirection: "column", height: "320px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 13px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ fontSize: "11px", color: "#818cf8" }}>✦</span>
                        <span style={{ fontSize: "13px", fontWeight: 600, color: "#f3f4f6" }}>«{activeWord}»</span>
                      </div>
                      <button onClick={closeAll} style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: "15px", color: "#6b7280" }}>✕</button>
                    </div>
                    <div style={{ flex: 1, overflowY: "auto", padding: "10px 13px", display: "flex", flexDirection: "column", gap: "8px" }}>
                      {history.map((m, i) => (
                        <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                          <div style={{ maxWidth: "85%", fontSize: "12px", lineHeight: 1.55, padding: "7px 10px", borderRadius: "10px", background: m.role === "user" ? "#4f46e5" : "rgba(255,255,255,0.06)", color: "#f3f4f6" }}>
                            {m.content}
                          </div>
                        </div>
                      ))}
                      {loading && <div style={{ fontSize: "12px", color: "#6b7280", padding: "7px 10px", background: "rgba(255,255,255,0.04)", borderRadius: "10px", alignSelf: "flex-start" }}>✦ Думаю...</div>}
                      {!loading && suggestions.length > 0 && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          {suggestions.map((s, i) => (
                            <button key={i} onClick={() => followUp(s)}
                              style={{ textAlign: "left", background: "transparent", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "7px", padding: "5px 8px", fontSize: "11px", color: "#9ca3af", cursor: "pointer", fontFamily: "inherit" }}
                            >{s}</button>
                          ))}
                        </div>
                      )}
                      <div ref={chatEndRef} />
                    </div>
                    <div style={{ padding: "8px 10px", borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", gap: "6px" }}>
                      <input value={chatInput} onChange={e => setChatInput(e.target.value)}
                        onKeyDown={e => { if (e.key === "Enter" && chatInput.trim() && !loading) followUp(chatInput) }}
                        placeholder={`Запитай про «${activeWord}»...`}
                        style={{ flex: 1, fontSize: "12px", padding: "7px 10px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "#f3f4f6", fontFamily: "inherit", outline: "none" }}
                      />
                      <button onClick={() => { if (chatInput.trim() && !loading) followUp(chatInput) }}
                        style={{ background: "#0F6B5E", border: "none", borderRadius: "8px", padding: "7px 11px", cursor: "pointer", fontSize: "13px", color: "#fff" }}
                      >→</button>
                    </div>
                  </div>
                )}
              </span>
            )}
          </span>
        )
      })}
    </div>
  )
}
