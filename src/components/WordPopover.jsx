import { useState, useRef, useCallback } from "react"


const PUNCT = /^[\s\u2013\-!?.,;:«»""]+$/

function tokenize(text) {
  return text.split(/(\s+|[–\-!?.,;:«»""]+)/g).filter(Boolean)
}

async function callClaude(messages, systemPrompt) {
  const res = await fetch("/api/Chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages,
      systemPrompt,
    }),
  })
  const data = await res.json()
  return data.content?.[0]?.text || ""
}

export default function WordPopover({ text }) {
  const [word, setWord] = useState(null)
  const [wordPos, setWordPos] = useState({ left: 0, top: 0 })
  const [phase, setPhase] = useState("idle")
  const [explanation, setExplanation] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [history, setHistory] = useState([])
  const [chatInput, setChatInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [chatMode, setChatMode] = useState(false)

  const containerRef = useRef(null)
  const hideTimer = useRef(null)
  const chatEndRef = useRef(null)

  const clearTimer = () => clearTimeout(hideTimer.current)

  const closePopover = useCallback(() => {
    setWord(null)
    setPhase("idle")
    setExplanation("")
    setSuggestions([])
    setHistory([])
    setChatMode(false)
    setChatInput("")
  }, [])

  const startHideTimer = () => {
    hideTimer.current = setTimeout(() => {
      if (!chatMode) closePopover()
    }, 180)
  }

  const onWordEnter = (token, e) => {
    clearTimer()
    if (chatMode) return
    const rect = e.currentTarget.getBoundingClientRect()
    const cRect = containerRef.current.getBoundingClientRect()
    const left = rect.left - cRect.left + rect.width / 2
    const top = rect.top - cRect.top
    setWordPos({ left, top })
    if (token !== word) {
      setPhase("idle")
      setExplanation("")
      setSuggestions([])
      setHistory([])
    }
    setWord(token)
  }

  const onWordLeave = () => { if (!chatMode) startHideTimer() }
  const onPopoverEnter = () => clearTimer()
  const onPopoverLeave = () => { if (!chatMode) startHideTimer() }

  const askWord = async () => {
    if (!word || loading) return
    setLoading(true)
    setPhase("loading")
    try {
      const prompt = `Учень читає норвезький текст: "${text}"
Він питає про: "${word}"

Відповідай СТРОГО у JSON без markdown та пояснень:
{"explanation":"коротке пояснення українською (1-2 речення, значення + граматика якщо потрібно)","suggestions":["контекстне питання 1 українською","контекстне питання 2 українською"]}`

      const raw = await callClaude([{ role: "user", content: prompt }])
      const clean = raw.replace(/```[\s\S]*?```/g, "").trim()
      const parsed = JSON.parse(clean)
      setExplanation(parsed.explanation || "")
      setSuggestions(parsed.suggestions || [])
      setHistory([
        { role: "user", content: `Що означає «${word}»?` },
        { role: "assistant", content: parsed.explanation || "" },
      ])
      setPhase("answered")
    } catch {
      setExplanation("Помилка з'єднання. Спробуй ще раз.")
      setPhase("answered")
    } finally {
      setLoading(false)
    }
  }

  const followUp = async (question) => {
    if (loading) return
    setLoading(true)
    setSuggestions([])
    const newHistory = [...history, { role: "user", content: question }]
    setHistory(newHistory)
    setChatInput("")
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50)

    try {
      const system = `Ти вчитель норвезької мови. Учень читає текст: "${text}". Він питає про слово "${word}". Відповідай коротко (2-3 речення) і по суті, українською мовою.`
      const answer = await callClaude(newHistory, system)
      const updated = [...newHistory, { role: "assistant", content: answer }]
      setHistory(updated)
    } catch {
      setHistory(h => [...h, { role: "assistant", content: "Помилка. Спробуй ще раз." }])
    } finally {
      setLoading(false)
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50)
    }
  }

  const expandToChat = () => {
    setChatMode(true)
    clearTimer()
  }

  const tokens = tokenize(text)
  const popoverWidth = chatMode ? 300 : phase === "answered" ? 260 : 130
  const popoverHeight = chatMode ? 320 : phase === "answered" ? 200 : 44
  const rawLeft = wordPos.left - popoverWidth / 2
  const maxLeft = (containerRef.current?.offsetWidth || 600) - popoverWidth - 8
  const popoverLeft = Math.max(8, Math.min(rawLeft, maxLeft))
  const popoverTop = wordPos.top - popoverHeight - 8

  return (
    <div style={{ padding: "1.5rem 0", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <h2 className="sr-only">Текст з AI-поясненнями слів</h2>

      <div style={{ marginBottom: "14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <span style={{ fontSize: "10px", letterSpacing: ".1em", color: "var(--color-text-tertiary)", textTransform: "uppercase", fontWeight: 500 }}>
            Читання · Тема 1.1
          </span>
          <p style={{ fontSize: "12px", color: "var(--color-text-tertiary)", marginTop: "2px" }}>
            Наведи на слово — AI пояснить
          </p>
        </div>
        <span style={{ fontSize: "11px", padding: "3px 10px", borderRadius: "20px", background: "#EEEDFE", color: "#534AB7", fontWeight: 500 }}>A1</span>
      </div>

      <div ref={containerRef} style={{ position: "relative", overflowY: "visible", lineHeight: 1.7, fontSize: "15px", letterSpacing: "normal", wordSpacing: "normal"}}>
        {tokens.map((token, i) => {
          if (PUNCT.test(token)) return <span key={i} style={{ color: "var(--color-text-primary)" }}>{token}</span>
          const active = word === token
          return (
            <span
              key={i}
              onMouseEnter={e => onWordEnter(token, e)}
              onMouseLeave={onWordLeave}
              style={{
                cursor: "default",
                borderRadius: "4px",
                padding: "1px 3px",
                background: active ? "rgba(83,74,183,0.10)" : "transparent",
                color: active ? "#534AB7" : "var(--color-text-primary)",
                transition: "background .12s, color .12s",
              }}
            >
              {token}
            </span>
          )
        })}

        {/* ── POPOVER ── */}
        {word && (
          <div
            onMouseEnter={onPopoverEnter}
            onMouseLeave={onPopoverLeave}
            style={{
              position: "absolute",
              left: `${popoverLeft}px`,
              top: `${Math.max(4, popoverTop)}px`,
              width: `${popoverWidth}px`,
                background: "#1a1f2e",
                border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "14px",
              zIndex: 200,
              boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
              overflow: "hidden",
              transition: "width .18s ease, top .18s ease",
            }}
          >
            {/* Idle: just the button */}
            {phase === "idle" && (
              <button
                onClick={askWord}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: "7px",
                  background: "transparent", border: "none", padding: "10px 14px",
                  cursor: "pointer", fontFamily: "inherit",
                }}
              >
                <span style={{ fontSize: "14px" }}>✦</span>
                <span style={{ fontSize: "13px", fontWeight: 500, color: "#534AB7" }}>Що це?</span>
              </button>
            )}

            {/* Loading */}
            {phase === "loading" && (
              <div style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "13px", animation: "pulse 1s infinite" }}>✦</span>
                <span style={{ fontSize: "12px", color: "var(--color-text-tertiary)" }}>Думаю...</span>
              </div>
            )}

            {/* Answered mini */}
            {phase === "answered" && !chatMode && (
              <div style={{ padding: "12px 13px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <span style={{ fontSize: "12px", color: "#534AB7" }}>✦</span>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--color-text-primary)" }}>«{word}»</span>
                  </div>
                  <button
                    onClick={expandToChat}
                    title="Розкрити чат"
                    style={{
                      background: "transparent", border: "0.5px solid var(--color-border-tertiary)",
                      borderRadius: "6px", width: "22px", height: "22px", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "12px", color: "var(--color-text-tertiary)",
                    }}
                  >↗</button>
                </div>

                <p style={{ fontSize: "12px", color: "var(--color-text-primary)", lineHeight: 1.55, margin: "0 0 10px" }}>
                  {explanation}
                </p>

                {/* Follow-up history */}
                {history.length > 2 && (
                  <div style={{ borderTop: "0.5px solid var(--color-border-tertiary)", paddingTop: "8px", marginBottom: "8px" }}>
                    {history.slice(2).map((m, i) => (
                      <div key={i} style={{ fontSize: "11px", color: m.role === "user" ? "var(--color-text-tertiary)" : "var(--color-text-secondary)", marginBottom: "4px", lineHeight: 1.5 }}>
                        {m.role === "user" ? <span style={{ color: "#534AB7" }}>→ </span> : ""}{m.content}
                      </div>
                    ))}
                  </div>
                )}

                {loading && <div style={{ fontSize: "11px", color: "var(--color-text-tertiary)", marginBottom: "8px" }}>✦ Думаю...</div>}

                {!loading && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "5px", borderTop: "0.5px solid var(--color-border-tertiary)", paddingTop: "8px" }}>
                    {suggestions.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => followUp(s)}
                        style={{
                          textAlign: "left", background: "var(--color-background-secondary)",
                          border: "0.5px solid var(--color-border-tertiary)", borderRadius: "8px",
                          padding: "6px 9px", fontSize: "11px", color: "var(--color-text-secondary)",
                          cursor: "pointer", fontFamily: "inherit", lineHeight: 1.4,
                        }}
                      >{s}</button>
                    ))}
                    <button
                      onClick={expandToChat}
                      style={{
                        textAlign: "left", background: "transparent",
                        border: "0.5px solid var(--color-border-tertiary)", borderRadius: "8px",
                        padding: "6px 9px", fontSize: "11px", color: "var(--color-text-tertiary)",
                        cursor: "pointer", fontFamily: "inherit",
                      }}
                    >Запитати своє →</button>
                  </div>
                )}
              </div>
            )}

            {/* Full chat mode */}
            {chatMode && (
              <div style={{ display: "flex", flexDirection: "column", height: "320px" }}>
                {/* Chat header */}
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "10px 13px", borderBottom: "0.5px solid var(--color-border-tertiary)",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ fontSize: "12px", color: "#534AB7" }}>✦</span>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--color-text-primary)" }}>«{word}»</span>
                  </div>
                  <button
                    onClick={closePopover}
                    style={{
                      background: "transparent", border: "none", cursor: "pointer",
                      fontSize: "16px", color: "var(--color-text-tertiary)", lineHeight: 1,
                    }}
                  >✕</button>
                </div>

                {/* Messages */}
                <div style={{ flex: 1, overflowY: "auto", padding: "10px 13px", display: "flex", flexDirection: "column", gap: "8px" }}>
                  {history.map((m, i) => (
                    <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: m.role === "user" ? "flex-end" : "flex-start" }}>
                      <div style={{
                        maxWidth: "85%", fontSize: "12px", lineHeight: 1.55, padding: "7px 10px", borderRadius: "10px",
                        background: m.role === "user" ? "#534AB7" : "var(--color-background-secondary)",
                        color: m.role === "user" ? "#fff" : "var(--color-text-primary)",
                      }}>
                        {m.content}
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <div style={{ fontSize: "12px", color: "var(--color-text-tertiary)", padding: "7px 10px", background: "var(--color-background-secondary)", borderRadius: "10px" }}>
                        ✦ Думаю...
                      </div>
                    </div>
                  )}

                  {/* Quick suggestions in chat mode */}
                  {!loading && suggestions.length > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginTop: "4px" }}>
                      {suggestions.map((s, i) => (
                        <button
                          key={i}
                          onClick={() => followUp(s)}
                          style={{
                            textAlign: "left", background: "transparent",
                            border: "0.5px solid var(--color-border-tertiary)", borderRadius: "8px",
                            padding: "5px 9px", fontSize: "11px", color: "var(--color-text-secondary)",
                            cursor: "pointer", fontFamily: "inherit",
                          }}
                        >{s}</button>
                      ))}
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Input */}
                <div style={{ padding: "8px 10px", borderTop: "0.5px solid var(--color-border-tertiary)", display: "flex", gap: "6px" }}>
                  <input
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter" && chatInput.trim() && !loading) followUp(chatInput) }}
                    placeholder={`Запитай про «${word}»...`}
                    style={{
                      flex: 1, fontSize: "12px", padding: "7px 10px", borderRadius: "8px",
                      border: "0.5px solid var(--color-border-secondary)",
                      background: "var(--color-background-secondary)",
                      color: "var(--color-text-primary)", fontFamily: "inherit", outline: "none",
                    }}
                  />
                  <button
                    onClick={() => { if (chatInput.trim() && !loading) followUp(chatInput) }}
                    style={{
                      background: "#0F6B5E", border: "none", borderRadius: "8px",
                      padding: "7px 11px", cursor: "pointer", fontSize: "13px", color: "#fff",
                    }}
                  >→</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </div>
  )
}
