import { useState, useRef } from "react"
import { supabase } from "../lib/supabase"

const PUNCT = /^[\s\u2013\-!?.,;:«»""]+$/
const WORD_EXPLANATION_PROMPT = `Ти вчитель норвезької мови для україномовного учня.
Відповідай ТІЛЬКИ валідним JSON без markdown у форматі:
{"explanation":"пояснення українською 1-2 речення","suggestions":["питання 1","питання 2"]}

Правила для suggestions:
- Це мають бути рівно 2 природні короткі запитання українською.
- Формат: які ще можуть виникнути запитання щодо цього слова.
- Питання мають допомагати краще зрозуміти саме це слово: значення, граматику, вимову, форму, типові фрази або різницю з близькими словами.
- Не пропонуй дивні, надто загальні, особисті або не пов'язані з текстом питання.
- Не повторюй питання "що це означає?".`

const WORD_FOLLOW_UP_PROMPT = `Ти вчитель норвезької мови для україномовного учня.
Учень питає про конкретне слово з тексту.
Відповідай коротко українською, практично й по суті.
Якщо доречно, додай 1 короткий приклад норвезькою з перекладом.`

function tokenize(text) {
  return text.split(/(\n|[ \t]+|[–\-!?.,;:«»""]+)/g).filter(Boolean)
}


async function callClaude(messages, systemPrompt) {
  const { data: { session } } = await supabase.auth.getSession()
  const res = await fetch("/api/Chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(session?.access_token ? { "Authorization": `Bearer ${session.access_token}` } : {}),
    },
    body: JSON.stringify({ messages, systemPrompt }),
  })
  if (!res.ok) throw new Error("API error")
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
    hideTimer.current = setTimeout(() => { if (!chatMode) closeAll() }, 220)
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
        WORD_EXPLANATION_PROMPT
      )
      let expl = raw, sugg = []
      try {
        const m = raw.match(/\{[\s\S]*\}/)
        if (m) { const p = JSON.parse(m[0]); expl = p.explanation || raw; sugg = p.suggestions || [] }
      } catch {
      }
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
    const contextualQuestion = `Слово: "${activeWord}". Контекст: "${text}". Питання учня: ${question}`
    const newHistory = [...history, { role: "user", content: question }]
    const requestHistory = [...history, { role: "user", content: contextualQuestion }]
    setHistory(newHistory); setChatInput("")
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50)
    try {
      const answer = await callClaude(
        requestHistory,
        WORD_FOLLOW_UP_PROMPT
      )
      setHistory([...newHistory, { role: "assistant", content: answer }])
    } catch {
      setHistory(h => [...h, { role: "assistant", content: "Помилка." }])
    } finally {
      setLoading(false)
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50)
    }
  }

  const popoverWidth = chatMode
    ? "min(320px, calc(100vw - 32px))"
    : phase === "answered"
    ? "min(360px, calc(100vw - 32px))"
    : "max-content"

  return (
    <div style={{
      position: "relative",
      lineHeight: 1.9,
      fontSize: "15px",
      color: "#1F2937",
      fontFamily: "system-ui, -apple-system, sans-serif",
    }}>
      {tokens.map((token, i) => {
        if (token === "\n") return <br key={i} />
        if (PUNCT.test(token)) return (
          <span key={i} style={{ color: "#374151" }}>{token}</span>
        )
        const active = activeIdx === i
        return (
          <span key={i} style={{ position: "relative", display: "inline" }}>
            <span
              onMouseEnter={() => onWordEnter(i)}
              onMouseLeave={startHide}
              style={{
                borderRadius: "4px",
                padding: "1px 3px",
                cursor: "default",
                transition: "all .12s",
                background: active ? "rgba(15,110,86,0.08)" : "transparent",
                color: active ? "#0F6E56" : "#1F2937",
                borderBottom: active ? "1.5px solid #0F6E56" : "1.5px solid transparent",
              }}
            >
              {token}
            </span>

            {active && (
              <span
                onMouseEnter={clearTimer}
                onMouseLeave={() => { if (!chatMode) startHide() }}
                style={{
                  position: "absolute",
                  bottom: "calc(100% + 8px)",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: popoverWidth,
                  minWidth: phase === "idle" ? "120px" : "auto",
                  maxWidth: "calc(100vw - 32px)",
                  background: "#ffffff",
                  border: "0.5px solid #E5E7EB",
                  borderRadius: "14px",
                  zIndex: 9999,
                  boxShadow: "0 4px 24px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)",
                  display: "inline-block",
                  verticalAlign: "bottom",
                  whiteSpace: phase === "idle" || phase === "loading" ? "nowrap" : "normal",
                  transition: "width .15s ease",
                }}
              >
                {phase === "idle" && (
                  <button onClick={askWord} style={{
                    width: "100%", display: "flex", alignItems: "center", gap: "7px",
                    background: "transparent", border: "none", padding: "10px 13px",
                    cursor: "pointer", fontFamily: "inherit", borderRadius: "14px",
                    whiteSpace: "nowrap",
                  }}>
                    <span style={{ fontSize: "13px", color: "#0F6E56" }}>✦</span>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "#0F6E56" }}>Що це?</span>
                    <span style={{ fontSize: "11px", color: "#D1D5DB", marginLeft: "auto", fontStyle: "italic" }}>{token}</span>
                  </button>
                )}

                {phase === "loading" && (
                  <div style={{ padding: "11px 13px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "13px", color: "#0F6E56" }}>✦</span>
                    <span style={{ fontSize: "12px", color: "#6B7280" }}>Думаю...</span>
                    <span style={{
                      marginLeft: "auto", width: "14px", height: "14px",
                      border: "2px solid #E5E7EB", borderTopColor: "#0F6E56",
                      borderRadius: "50%", display: "inline-block",
                      animation: "wpSpin .7s linear infinite",
                    }} />
                  </div>
                )}

                {phase === "answered" && !chatMode && (
                  <div style={{ padding: "12px 13px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ fontSize: "12px", color: "#0F6E56" }}>✦</span>
                        <span style={{ fontSize: "13px", fontWeight: 600, color: "#111827" }}>«{activeWord}»</span>
                      </div>
                      <button onClick={() => { setChatMode(true); clearTimer() }} style={{
                        background: "#F8F7F4", border: "0.5px solid #E5E7EB",
                        borderRadius: "6px", width: "24px", height: "24px",
                        cursor: "pointer", color: "#6B7280", fontSize: "12px",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>↗</button>
                    </div>

                    <p style={{ fontSize: "12px", color: "#374151", lineHeight: 1.6, margin: "0 0 10px" }}>
                      {explanation}
                    </p>

                    {history.length > 2 && (
                      <div style={{ borderTop: "0.5px solid #F3F4F6", paddingTop: "8px", marginBottom: "8px" }}>
                        {history.slice(2).map((m, i) => (
                          <div key={i} style={{ fontSize: "11px", lineHeight: 1.5, marginBottom: "4px", color: m.role === "user" ? "#9CA3AF" : "#374151" }}>
                            {m.role === "user" && <span style={{ color: "#0F6E56", marginRight: "3px" }}>→</span>}
                            {m.content}
                          </div>
                        ))}
                      </div>
                    )}

                    {loading && <div style={{ fontSize: "11px", color: "#9CA3AF", marginBottom: "8px" }}>✦ Думаю...</div>}

                    {!loading && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px", borderTop: "0.5px solid #F3F4F6", paddingTop: "8px" }}>
                        {suggestions.map((s, i) => (
                          <button key={i} onClick={() => followUp(s)} style={{
                            textAlign: "left", background: "#F8F7F4",
                            border: "0.5px solid #E5E7EB", borderRadius: "8px",
                            padding: "6px 9px", fontSize: "11px", color: "#374151",
                            cursor: "pointer", fontFamily: "inherit", lineHeight: 1.4,
                          }}>{s}</button>
                        ))}
                        <button onClick={() => { setChatMode(true); clearTimer() }} style={{
                          textAlign: "left", background: "transparent",
                          border: "0.5px solid #E5E7EB", borderRadius: "8px",
                          padding: "6px 9px", fontSize: "11px", color: "#9CA3AF",
                          cursor: "pointer", fontFamily: "inherit",
                        }}>Запитати своє →</button>
                      </div>
                    )}
                  </div>
                )}

                {chatMode && (
                  <div style={{ display: "flex", flexDirection: "column", height: "340px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 13px", borderBottom: "0.5px solid #F3F4F6" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ fontSize: "12px", color: "#0F6E56" }}>✦</span>
                        <span style={{ fontSize: "13px", fontWeight: 600, color: "#111827" }}>«{activeWord}»</span>
                      </div>
                      <button onClick={closeAll} style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: "16px", color: "#9CA3AF", lineHeight: 1 }}>✕</button>
                    </div>

                    <div style={{ flex: 1, overflowY: "auto", padding: "10px 13px", display: "flex", flexDirection: "column", gap: "8px" }}>
                      {history.map((m, i) => (
                        <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                          <div style={{
                            maxWidth: "86%", fontSize: "12px", lineHeight: 1.55,
                            padding: "7px 10px", borderRadius: "10px",
                            background: m.role === "user" ? "#0F6E56" : "#F3F4F6",
                            color: m.role === "user" ? "#fff" : "#1F2937",
                          }}>{m.content}</div>
                        </div>
                      ))}
                      {loading && (
                        <div style={{ alignSelf: "flex-start", fontSize: "12px", color: "#6B7280", padding: "7px 10px", background: "#F3F4F6", borderRadius: "10px", display: "flex", alignItems: "center", gap: "6px" }}>
                          <span style={{ color: "#0F6E56" }}>✦</span> Думаю...
                        </div>
                      )}
                      {!loading && suggestions.length > 0 && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          {suggestions.map((s, i) => (
                            <button key={i} onClick={() => followUp(s)} style={{
                              textAlign: "left", background: "#F8F7F4",
                              border: "0.5px solid #E5E7EB", borderRadius: "8px",
                              padding: "5px 9px", fontSize: "11px", color: "#374151",
                              cursor: "pointer", fontFamily: "inherit",
                            }}>{s}</button>
                          ))}
                        </div>
                      )}
                      <div ref={chatEndRef} />
                    </div>

                    <div style={{ padding: "8px 10px", borderTop: "0.5px solid #F3F4F6", display: "flex", gap: "6px" }}>
                      <input
                        value={chatInput}
                        onChange={e => setChatInput(e.target.value)}
                        onKeyDown={e => { if (e.key === "Enter" && chatInput.trim() && !loading) followUp(chatInput) }}
                        placeholder={`Запитай про «${activeWord}»...`}
                        style={{
                          flex: 1, fontSize: "12px", padding: "7px 10px",
                          borderRadius: "8px", border: "0.5px solid #E5E7EB",
                          background: "#F8F7F4", color: "#1F2937",
                          fontFamily: "inherit", outline: "none",
                        }}
                        onFocus={e => e.target.style.borderColor = "#0F6E56"}
                        onBlur={e => e.target.style.borderColor = "#E5E7EB"}
                      />
                      <button
                        onClick={() => { if (chatInput.trim() && !loading) followUp(chatInput) }}
                        style={{ background: "#0F6E56", border: "none", borderRadius: "8px", padding: "7px 12px", cursor: "pointer", fontSize: "13px", color: "#fff" }}
                      >→</button>
                    </div>
                  </div>
                )}
              </span>
            )}
          </span>
        )
      })}

      <style>{`@keyframes wpSpin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
