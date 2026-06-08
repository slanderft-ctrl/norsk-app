import { useState, useRef, useEffect } from "react"
import ReactMarkdown from "react-markdown"

export default function AiWidget({ context }) {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const suggestions = [
    `Як використовувати «${context.word}» у реченні?`,
    `Чим ${context.word} відрізняється від схожих слів?`,
    `Дай 3 приклади з «${context.word}» у розмовній мові`,
  ]

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  async function send(text) {
    const msg = (text || input).trim()
    if (!msg || loading) return
    const newMessages = [...messages, { role: "user", content: msg }]
    setMessages(newMessages)
    setInput("")
    setLoading(true)
    try {
      const res = await fetch("/api/Chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          systemPrompt: `Ти AI-асистент для вивчення норвезької мови.
Зараз користувач вивчає слово: "${context.word}" (${context.partOfSpeech || ""}).
Відповідай українською мовою. Будь стислим і корисним.
Якщо пояснюєш граматику — наводь приклади норвезькою з перекладом.`,
        }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: "assistant", content: data.content?.[0]?.text || "Не вдалося отримати відповідь." }])
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Помилка з'єднання." }])
    } finally {
      setLoading(false)
    }
  }

  const isEmpty = messages.length === 0

  return (
    <div style={{
      background: "#fff",
      border: "0.5px solid #E5E7EB",
      borderRadius: "20px",
      overflow: "hidden",
      boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
      display: "flex",
      flexDirection: "column",
    }}>

      <div style={{
        padding: "13px 18px",
        borderBottom: "0.5px solid #F3F4F6",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        background: "#FAFAF9",
      }}>
        <div style={{
          width: "28px", height: "28px",
          background: "#E1F5EE", borderRadius: "8px",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "14px",
        }}>✦</div>
        <div>
          <p style={{ fontSize: "13px", fontWeight: 600, color: "#111827", margin: 0 }}>AI-асистент</p>
          <p style={{ fontSize: "11px", color: "#9CA3AF", margin: 0 }}>
            Запитай про «{context.word}»
          </p>
        </div>
      </div>

      {isEmpty && (
        <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: "7px" }}>
          <p style={{ fontSize: "11px", color: "#9CA3AF", textTransform: "uppercase", letterSpacing: ".06em", fontWeight: 500, marginBottom: "2px" }}>
            Підказки
          </p>
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => send(s)}
              style={{
                textAlign: "left",
                background: "#F8F7F4",
                border: "0.5px solid #E5E7EB",
                borderRadius: "10px",
                padding: "9px 12px",
                fontSize: "12px",
                color: "#374151",
                cursor: "pointer",
                fontFamily: "inherit",
                lineHeight: 1.4,
                transition: "all .12s",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "#E1F5EE"
                e.currentTarget.style.borderColor = "#9FE1CB"
                e.currentTarget.style.color = "#0F6E56"
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "#F8F7F4"
                e.currentTarget.style.borderColor = "#E5E7EB"
                e.currentTarget.style.color = "#374151"
              }}
            >
              <span style={{ color: "#0F6E56", marginRight: "5px" }}>✦</span>
              {s}
            </button>
          ))}
        </div>
      )}

      {!isEmpty && (
        <div style={{
          padding: "12px 14px",
          maxHeight: "320px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}>
          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: m.role === "user" ? "flex-end" : "flex-start",
              }}
            >
              {m.role === "assistant" && (
                <div style={{
                  width: "22px", height: "22px", borderRadius: "6px",
                  background: "#E1F5EE", flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "11px", color: "#0F6E56", marginRight: "7px", marginTop: "2px",
                }}>✦</div>
              )}
              <div style={{
                maxWidth: "82%",
                fontSize: "13px",
                lineHeight: 1.6,
                padding: "8px 12px",
                borderRadius: m.role === "user" ? "12px 12px 4px 12px" : "12px 12px 12px 4px",
                background: m.role === "user" ? "#0F6E56" : "#F3F4F6",
                color: m.role === "user" ? "#fff" : "#1F2937",
              }}>
                {m.role === "assistant"
                  ? <div style={{ fontSize: "13px" }}>
                      <ReactMarkdown>{m.content}</ReactMarkdown>
                    </div>
                  : m.content
                }
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{
                width: "22px", height: "22px", borderRadius: "6px",
                background: "#E1F5EE", display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: "11px", color: "#0F6E56",
              }}>✦</div>
              <div style={{
                background: "#F3F4F6", borderRadius: "12px 12px 12px 4px",
                padding: "8px 12px", display: "flex", alignItems: "center", gap: "4px",
              }}>
                {[0,1,2].map(i => (
                  <span key={i} style={{
                    width: "5px", height: "5px", borderRadius: "50%",
                    background: "#9CA3AF", display: "inline-block",
                    animation: `waDot .9s ease-in-out ${i*0.2}s infinite`,
                  }} />
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      )}

      {!isEmpty && (
        <div style={{ padding: "0 14px 6px", display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={() => setMessages([])}
            style={{
              background: "transparent", border: "none", cursor: "pointer",
              fontSize: "11px", color: "#9CA3AF",
            }}
          >
            очистити чат
          </button>
        </div>
      )}

      <div style={{
        padding: "10px 12px",
        borderTop: "0.5px solid #F3F4F6",
        display: "flex",
        gap: "7px",
        alignItems: "center",
      }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send() } }}
          placeholder={`Запитай про «${context.word}»...`}
          style={{
            flex: 1,
            background: "#F8F7F4",
            border: "0.5px solid #E5E7EB",
            borderRadius: "10px",
            padding: "8px 12px",
            fontSize: "13px",
            color: "#1F2937",
            outline: "none",
            fontFamily: "inherit",
            transition: "border-color .12s",
          }}
          onFocus={e => e.target.style.borderColor = "#0F6E56"}
          onBlur={e => e.target.style.borderColor = "#E5E7EB"}
        />
        <button
          onClick={() => send()}
          disabled={!input.trim() || loading}
          style={{
            background: input.trim() && !loading ? "#0F6E56" : "#F3F4F6",
            border: "none",
            borderRadius: "10px",
            width: "36px", height: "36px",
            cursor: input.trim() && !loading ? "pointer" : "default",
            color: input.trim() && !loading ? "#fff" : "#9CA3AF",
            fontSize: "14px",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all .12s",
            flexShrink: 0,
          }}
        >→</button>
      </div>

      <style>{`
        @keyframes waDot {
          0%,80%,100% { transform: scale(.7); opacity:.4 }
          40% { transform: scale(1.1); opacity:1 }
        }
      `}</style>
    </div>
  )
}
