export default function AiWidget({ context }) {
  const suggestions = [
    `Як використовувати «${context.word}» у реченні?`,
    `Чим ${context.word} відрізняється від схожих слів?`,
    `Дай 3 приклади з «${context.word}» у розмовній мові`,
  ]

  function sendToGlobalBar(text) {
    window.dispatchEvent(new CustomEvent("linguai:send-message", { detail: { text } }))
  }

  return (
    <div style={{
      background: "#fff",
      border: "0.5px solid #E5E7EB",
      borderRadius: "20px",
      overflow: "hidden",
      boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
    }}>
      <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: "7px" }}>
        <p style={{ fontSize: "11px", color: "#9CA3AF", textTransform: "uppercase", letterSpacing: ".06em", fontWeight: 500, marginBottom: "2px" }}>
          Підказки
        </p>
        {suggestions.map((s, i) => (
          <button
            key={i}
            onClick={() => sendToGlobalBar(s)}
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
    </div>
  )
}
