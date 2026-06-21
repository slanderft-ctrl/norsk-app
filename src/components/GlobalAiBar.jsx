import { useEffect, useRef, useState } from "react"
import ReactMarkdown from "react-markdown"

const STORAGE_KEY = "linguai_global_ai_history"

function loadHistory() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")
    return Array.isArray(saved) ? saved : []
  } catch {
    return []
  }
}

export default function GlobalAiBar() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState(loadHistory)
  const [loading, setLoading] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [focused, setFocused] = useState(false)
  const inputRef = useRef(null)
  const endRef = useRef(null)

  const [barHovered, setBarHovered] = useState(false)
  const hasMessages = messages.length > 0
  const isSolid = focused || input.trim() || expanded || loading || barHovered

  useEffect(() => {
    const focusBar = () => {
      setExpanded(hasMessages)
      setTimeout(() => inputRef.current?.focus(), 60)
    }
    window.addEventListener("linguai:focus-assistant", focusBar)
    return () => window.removeEventListener("linguai:focus-assistant", focusBar)
  }, [hasMessages])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
  }, [messages])

  useEffect(() => {
    if (expanded) endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading, expanded])

  async function send() {
    const text = input.trim()
    if (!text || loading) return

    const nextMessages = [...messages, { role: "user", content: text }]
    setMessages(nextMessages)
    setInput("")
    setExpanded(true)
    setLoading(true)

    try {
      const res = await fetch("/api/Chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, {
        role: "assistant",
        content: data.content?.[0]?.text || "Не вдалося отримати відповідь.",
      }])
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Помилка з'єднання." }])
    } finally {
      setLoading(false)
    }
  }

  function clearChat() {
    setMessages([])
    setExpanded(false)
    setInput("")
    localStorage.removeItem(STORAGE_KEY)
  }

  return (
    <div
      className="fixed left-0 right-0 bottom-0 z-40 px-3 md:px-6 pointer-events-none"
      style={{ paddingBottom: "max(18px, calc(env(safe-area-inset-bottom) + 14px))" }}
    >
      <div className="mx-auto w-full max-w-2xl pointer-events-auto">
        {expanded && (hasMessages || loading) && (
          <div
            className="mb-3 overflow-hidden border border-white/70 shadow-2xl"
            style={{
              borderRadius: "26px",
              background: "rgba(255,255,255,0.96)",
              backdropFilter: "blur(28px) saturate(1.3)",
              WebkitBackdropFilter: "blur(28px) saturate(1.3)",
            }}
          >
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-700">
                  <img src="/star.png" className="w-4 h-4" />
                </div>
                <div>
                  <p className="m-0 text-sm font-semibold text-gray-900">AI-асистент</p>
                  <p className="m-0 text-xs text-gray-400">Історія зберігається на цьому пристрої</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {hasMessages && (
                  <button
                    type="button"
                    onClick={clearChat}
                    className="rounded-full px-3 py-1.5 text-xs font-medium text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                  >
                    очистити
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setExpanded(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
                  aria-label="Згорнути чат"
                >
                  ˅
                </button>
              </div>
            </div>

            <div className="max-h-[58vh] min-h-[220px] overflow-y-auto px-3 py-3 md:px-4">
              <div className="flex flex-col gap-2.5">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className="max-w-[86%] px-3 py-2 text-sm leading-relaxed shadow-sm"
                      style={{
                        borderRadius: message.role === "user" ? "16px 16px 5px 16px" : "16px 16px 16px 5px",
                        background: message.role === "user" ? "#0F6E56" : "#F8F7F4",
                        color: message.role === "user" ? "#fff" : "#1F2937",
                      }}
                    >
                      {message.role === "assistant" ? (
                        <div className="prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0">
                          <ReactMarkdown>{message.content}</ReactMarkdown>
                        </div>
                      ) : message.content}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-1.5 rounded-2xl bg-[#F8F7F4] px-3 py-2 shadow-sm">
                      {[0, 1, 2].map(i => (
                        <span
                          key={i}
                          className="h-1.5 w-1.5 rounded-full bg-gray-400"
                          style={{ animation: `aiBarDot .9s ease-in-out ${i * 0.16}s infinite` }}
                        />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={endRef} />
              </div>
            </div>
          </div>
        )}

        <div
          onMouseEnter={() => setBarHovered(true)}
          onMouseLeave={() => setBarHovered(false)}
          className="flex items-center gap-2 border px-2.5 py-2 shadow-2xl transition-all duration-200"
          style={{
            borderRadius: "999px",
            background: isSolid ? "rgba(255,255,255,0.97)" : "rgba(255,255,255,0.58)",
            borderColor: isSolid ? "rgba(209,250,229,0.9)" : "rgba(255,255,255,0.64)",
            backdropFilter: "blur(26px) saturate(1.5)",
            WebkitBackdropFilter: "blur(26px) saturate(1.5)",
            opacity: isSolid ? 1 : 0.82,
            boxShadow: barHovered && !isSolid ? "0 8px 32px rgba(15,110,86,0.12), 0 2px 8px rgba(0,0,0,0.08)" : undefined,
          }}
        >
          <button
            type="button"
            onClick={() => {
              if (hasMessages) setExpanded(v => !v)
              setTimeout(() => inputRef.current?.focus(), 40)
            }}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white shadow-sm transition-transform active:scale-95"
            style={{ background: "#0F6E56" }}
            aria-label="AI-асистент"
          >
            <img src="/star.png" className="w-4 h-4" />
          </button>

          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={e => {
              if (e.key === "Enter") {
                e.preventDefault()
                send()
              }
            }}
            placeholder="Запитай AI..."
            className="min-w-0 flex-1 bg-transparent px-1 text-sm text-gray-900 outline-none placeholder:text-gray-400"
          />

          {hasMessages && !expanded && (
            <span className="hidden rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-700 md:inline">
              {messages.length}
            </span>
          )}

          <button
            type="button"
            onClick={send}
            disabled={!input.trim() || loading}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-all disabled:cursor-default"
            style={{
              background: input.trim() && !loading ? "#111827" : "rgba(243,244,246,0.9)",
              color: input.trim() && !loading ? "#fff" : "#9CA3AF",
            }}
            aria-label="Надіслати"
          >
            →
          </button>
        </div>
      </div>

      <style>{`
        @keyframes aiBarDot {
          0%, 80%, 100% { transform: translateY(0); opacity: .45; }
          40% { transform: translateY(-3px); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
