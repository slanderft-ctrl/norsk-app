import { useState } from "react"

function AiWidget({ context }) {
  const [expanded, setExpanded] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState([])

  // контекстні підказки залежно від слова
  const suggestions = [
    `Як використовувати "${context.word}" у реченні?`,
    `Різниця між "${context.word}" і схожими словами?`,
    `Приклади з "${context.word}" у повсякденній мові`,
  ]

  function sendMessage(text) {
    const messageText = text || input
    if (!messageText.trim()) return

    // додаємо повідомлення користувача
    setMessages(prev => [...prev, { role: "user", text: messageText }])
    setInput("")

    // фейкова відповідь — потім замінимо на Claude API
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: "ai",
        text: `Це чудове питання про "${context.word}"! Незабаром тут буде відповідь від Claude AI.`
      }])
    }, 600)
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") sendMessage()
  }

  return (
    <>
      {/* ЗАТЕМНЕННЯ ФОНУ */}
      {expanded && (
        <div
          className="fixed inset-0 bg-black/30 z-10"
          onClick={() => setExpanded(false)}
        />
      )}

      {/* КАРТКА */}
      <div className={`
        self-start bg-gray-900 border border-gray-800 rounded-xl p-4 flex flex-col gap-3
        transition-all duration-150
        ${expanded
          ? "w-125 -ml-65 z-30 relative shadow-2xl border-blue-700"
          : "w-60 cursor-pointer hover:border-gray-600"
        }
      `}>

        <p className="text-xs text-gray-500 uppercase tracking-wider">
          Запитати ШІ
        </p>

        {/* ПАСИВНИЙ СТАН — підказки */}
        {!expanded && (
          <div className="flex flex-col gap-2">
            <p className="text-xs text-gray-400">Можливо тебе цікавить:</p>
            {suggestions.map((s, i) => (
              <div
                key={i}
                onClick={(e) => {
                  e.stopPropagation()
                  setExpanded(true)
                  sendMessage(s)
                }}
                className="text-xs text-gray-300 bg-gray-800 hover:bg-blue-950 hover:text-blue-300 px-3 py-2 rounded-lg cursor-pointer transition-colors"
              >
                {s}
              </div>
            ))}
          </div>
        )}

        {/* АКТИВНИЙ СТАН — чат */}
        {expanded && (
          <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
            {messages.length === 0 && (
              <p className="text-xs text-gray-400">
                Вивчаєш <span className="text-blue-300 font-medium">{context.word}</span> — чим можу допомогти?
              </p>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`text-sm px-3 py-2 rounded-lg ${
                  msg.role === "user"
                    ? "bg-blue-900 text-blue-100 self-end ml-4"
                    : "bg-gray-800 text-gray-200 self-start mr-4"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>
        )}

        {/* ПОЛЕ ВВОДУ */}
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onClick={() => setExpanded(true)}
            placeholder={`Запитай про ${context.word}...`}
            className="flex-1 bg-gray-800 text-white text-xs px-3 py-2 rounded-lg outline-none border border-gray-700 focus:border-blue-500"
          />
          <button
            onClick={(e) => {
              e.stopPropagation()
              setExpanded(true)
              sendMessage()
            }}
            className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-lg text-xs transition-colors"
          >
            →
          </button>
        </div>

        {/* КНОПКА ЗАКРИТИ */}
        {expanded && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              setExpanded(false)
            }}
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors text-center"
          >
            закрити ✕
          </button>
        )}

      </div>
    </>
  )
}

export default AiWidget