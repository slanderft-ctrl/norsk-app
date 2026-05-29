import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import questionsRaw from "../data/questions.json"

// ── CEFR mapping ────────────────────────────────────────
const LEVELS = [
  { min: 0,   max: 1.5, label: "A1", color: "#22C55E", bg: "#F0FFF4", desc: "Початківець" },
  { min: 1.5, max: 2.5, label: "A2", color: "#84CC16", bg: "#F7FEE7", desc: "Елементарний" },
  { min: 2.5, max: 3.5, label: "B1", color: "#F59E0B", bg: "#FFFBEB", desc: "Середній" },
  { min: 3.5, max: 4.3, label: "B2", color: "#0F6E56", bg: "#F0FDF4", desc: "Вище середнього" },
  { min: 4.3, max: 5.1, label: "C1", color: "#6B3FA0", bg: "#F5F3FF", desc: "Просунутий" },
]

const TOPIC_RECOMMENDATIONS = {
  A1: { topic: "Introduksjon", topicUa: "Знайомство", id: 1, sub: "1.1" },
  A2: { topic: "Hverdagen",    topicUa: "Щоденне життя", id: 2, sub: "2.1" },
  B1: { topic: "Mat og butikk",topicUa: "Їжа і магазин", id: 3, sub: "3.1" },
  B2: { topic: "Mat og butikk",topicUa: "Їжа і магазин", id: 3, sub: "3.4" },
  C1: { topic: "Mat og butikk",topicUa: "Їжа і магазин", id: 3, sub: "3.5" },
}

function getCEFR(theta) {
  return LEVELS.find(l => theta >= l.min && theta < l.max) || LEVELS[LEVELS.length - 1]
}

// ── Adaptive algorithm ──────────────────────────────────
// theta: ability estimate (1=A1 … 5=C1), starts at 3 (B1)
// Next question: closest difficulty to theta, not yet answered
function selectNext(theta, answered) {
  const remaining = questionsRaw.filter(q => !answered.has(q.id))
  if (!remaining.length) return null
  return remaining.reduce((best, q) =>
    Math.abs(q.level - theta) < Math.abs(best.level - theta) ? q : best
  )
}

function updateTheta(theta, correct, questionLevel) {
  const diff = questionLevel - theta
  const delta = correct ? 0.5 + diff * 0.05 : -(0.5 - diff * 0.05)
  return Math.max(1, Math.min(5, theta + delta))
}

// ── AI Check ────────────────────────────────────────────
async function aiCheckAnswer(question, userAnswer, correctAnswer, acceptedAnswers) {
  try {
    const res = await fetch("/api/Chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [{ role: "user", content:
          `Питання (норвезька): "${question}"
Відповідь учня: "${userAnswer}"
Еталонна відповідь: "${correctAnswer}"
Прийнятні відповіді: ${JSON.stringify(acceptedAnswers)}

Оціни відповідь учня:
- 1 = повністю правильно (або прийнятний синонім/форма)
- 0.5 = частково правильно (граматично близько, або синонім нижчого регістру)
- 0 = неправильно

Відповідай ТІЛЬКИ JSON: {"score": 0 або 0.5 або 1, "comment": "коротко чому (до 10 слів)"}`
        }],
        systemPrompt: "Ти перевіряєш відповіді на тест з норвезької мови. Відповідай ТІЛЬКИ валідним JSON."
      }),
    })
    const data = await res.json()
    const raw = data.content?.[0]?.text || ""
    const m = raw.match(/\{[\s\S]*\}/)
    if (m) {
      const p = JSON.parse(m[0])
      return { score: p.score ?? 0, comment: p.comment ?? "" }
    }
  } catch {}
  return { score: 0, comment: "" }
}

// ── Components ───────────────────────────────────────────

function ProgressBar({ current, total, theta }) {
  const pct = (current / total) * 100
  const cefrNow = getCEFR(theta)
  return (
    <div style={{ marginBottom: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
        <span style={{ fontSize: "13px", color: "#6B7280" }}>Питання {current} з {total}</span>
        <span style={{ fontSize: "12px", fontWeight: 600, padding: "2px 10px", borderRadius: "20px", background: cefrNow.bg, color: cefrNow.color }}>
          ~{cefrNow.label}
        </span>
      </div>
      <div style={{ height: "4px", background: "#E5E7EB", borderRadius: "2px", overflow: "hidden" }}>
        <div style={{ height: "100%", background: "#0F6E56", borderRadius: "2px", width: `${pct}%`, transition: "width .4s ease" }} />
      </div>
    </div>
  )
}

function CategoryBadge({ category }) {
  const map = {
    grammar:    { icon: "📐", label: "Граматика",  bg: "#EFF6FF", color: "#1D4ED8" },
    morphology: { icon: "🔤", label: "Морфологія", bg: "#F5F3FF", color: "#6D28D9" },
    lexicon:    { icon: "📚", label: "Лексика",    bg: "#FEF9C3", color: "#92400E" },
  }
  const c = map[category] || map.grammar
  return (
    <span style={{ fontSize: "11px", fontWeight: 600, padding: "3px 10px", borderRadius: "20px", background: c.bg, color: c.color }}>
      {c.icon} {c.label}
    </span>
  )
}

// ── Main component ───────────────────────────────────────
const TOTAL_QUESTIONS = 15

export default function LevelTest() {
  const navigate = useNavigate()
  const [phase, setPhase] = useState("intro") // intro | test | checking | results
  const [theta, setTheta] = useState(3)
  const [answered, setAnswered] = useState(new Set())
  const [current, setCurrent] = useState(null)
  const [qIndex, setQIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [fillValue, setFillValue] = useState("")
  const [results, setResults] = useState([])
  const [aiLoading, setAiLoading] = useState(false)
  const [aiComment, setAiComment] = useState("")

  function startTest() {
    const first = selectNext(3, new Set())
    setCurrent(first)
    setPhase("test")
  }

  async function submitAnswer() {
    if (!current) return
    const userAnswer = current.type === "choice" ? selected : fillValue.trim()
    if (!userAnswer) return

    setAiLoading(true)
    setPhase("checking")

    let score = 0
    let comment = ""

    if (current.type === "choice") {
      score = userAnswer === current.answer ? 1 : 0
    } else if (current.aiCheck) {
      const res = await aiCheckAnswer(current.question, userAnswer, current.answer, current.acceptedAnswers || [current.answer])
      score = res.score
      comment = res.comment
    } else {
      const accepted = [current.answer, ...(current.acceptedAnswers || [])]
      score = accepted.map(a => a.toLowerCase()).includes(userAnswer.toLowerCase()) ? 1 : 0
    }

    setAiLoading(false)
    setAiComment(comment)

    const correct = score >= 0.5
    const newTheta = updateTheta(theta, correct, current.level)
    const newAnswered = new Set([...answered, current.id])
    const newResults = [...results, {
      question: current,
      userAnswer,
      score,
      comment,
      correct,
      thetaBefore: theta,
      thetaAfter: newTheta,
    }]

    setTheta(newTheta)
    setAnswered(newAnswered)
    setResults(newResults)

    if (newResults.length >= TOTAL_QUESTIONS || newAnswered.size >= questionsRaw.length) {
      setTimeout(() => setPhase("results"), 900)
    } else {
      setTimeout(() => {
        const next = selectNext(newTheta, newAnswered)
        setCurrent(next)
        setSelected(null)
        setFillValue("")
        setAiComment("")
        setQIndex(i => i + 1)
        setPhase("test")
      }, 900)
    }
  }

  const finalLevel = getCEFR(theta)
  const rec = TOPIC_RECOMMENDATIONS[finalLevel.label] || TOPIC_RECOMMENDATIONS["A2"]

  // ── INTRO ──────────────────────────────────────────────
  if (phase === "intro") return (
    <main style={{ flex: 1, background: "#F8F7F4", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ maxWidth: "520px", width: "100%", background: "#fff", border: "0.5px solid #E5E7EB", borderRadius: "20px", padding: "36px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <div style={{ width: "48px", height: "48px", background: "#E1F5EE", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", marginBottom: "20px" }}>
          🇳🇴
        </div>
        <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#111827", marginBottom: "8px" }}>Тест рівня норвезької</h1>
        <p style={{ fontSize: "14px", color: "#6B7280", lineHeight: 1.6, marginBottom: "24px" }}>
          Адаптивний тест визначить твій рівень за стандартом CEFR (A1–C1). 15 питань на граматику та лексику. Складність змінюється залежно від твоїх відповідей.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "28px" }}>
          {[
            { icon: "⏱", text: "~10 хвилин" },
            { icon: "🎯", text: "15 питань — граматика та лексика" },
            { icon: "✦", text: "AI перевіряє відкриті відповіді" },
            { icon: "📊", text: "Результат: орієнтовний рівень CEFR" },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", color: "#374151" }}>
              <span style={{ fontSize: "15px" }}>{item.icon}</span>
              {item.text}
            </div>
          ))}
        </div>

        <button
          onClick={startTest}
          style={{ width: "100%", background: "#0F6E56", color: "#fff", border: "none", borderRadius: "12px", padding: "13px", fontSize: "15px", fontWeight: 600, cursor: "pointer" }}
        >
          Розпочати тест →
        </button>
      </div>
    </main>
  )

  // ── RESULTS ────────────────────────────────────────────
  if (phase === "results") {
    const correct = results.filter(r => r.correct).length
    const pct = Math.round((correct / results.length) * 100)

    return (
      <main style={{ flex: 1, background: "#F8F7F4", minHeight: "100vh", padding: "32px 24px" }}>
        <div style={{ maxWidth: "560px", margin: "0 auto" }}>

          {/* Level card */}
          <div style={{ background: "#fff", border: `1.5px solid ${finalLevel.color}`, borderRadius: "20px", padding: "32px", textAlign: "center", marginBottom: "16px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <p style={{ fontSize: "12px", color: "#9CA3AF", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: "12px", fontWeight: 600 }}>
              Орієнтовний рівень
            </p>
            <div style={{ fontSize: "72px", fontWeight: 800, color: finalLevel.color, lineHeight: 1, marginBottom: "8px" }}>
              {finalLevel.label}
            </div>
            <p style={{ fontSize: "18px", color: "#374151", fontWeight: 500, marginBottom: "4px" }}>{finalLevel.desc}</p>
            <p style={{ fontSize: "13px", color: "#9CA3AF" }}>{correct} з {results.length} правильно · {pct}%</p>
          </div>

          {/* Recommendation */}
          <div style={{ background: "#fff", border: "0.5px solid #E5E7EB", borderRadius: "16px", padding: "20px 24px", marginBottom: "16px" }}>
            <p style={{ fontSize: "12px", color: "#9CA3AF", textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 600, marginBottom: "12px" }}>
              З чого почати навчання
            </p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
              <div>
                <p style={{ fontSize: "16px", fontWeight: 600, color: "#111827", marginBottom: "3px" }}>{rec.topic}</p>
                <p style={{ fontSize: "13px", color: "#6B7280" }}>{rec.topicUa}</p>
              </div>
              <button
                onClick={() => navigate(`/topic/${rec.id}/${rec.sub}`)}
                style={{ background: "#0F6E56", color: "#fff", border: "none", borderRadius: "10px", padding: "9px 18px", fontSize: "13px", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}
              >
                Почати →
              </button>
            </div>
          </div>

          {/* Answers breakdown */}
          <div style={{ background: "#fff", border: "0.5px solid #E5E7EB", borderRadius: "16px", overflow: "hidden" }}>
            <div style={{ padding: "14px 20px", borderBottom: "0.5px solid #F3F4F6" }}>
              <p style={{ fontSize: "13px", fontWeight: 600, color: "#374151", margin: 0 }}>Розбивка відповідей</p>
            </div>
            <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: "8px" }}>
              {results.map((r, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px", padding: "9px 12px", borderRadius: "10px", background: r.correct ? "#F0FFF4" : "#FFF5F5", border: `0.5px solid ${r.correct ? "#BBF7D0" : "#FECACA"}` }}>
                  <span style={{ fontSize: "14px", fontWeight: 700, flexShrink: 0, marginTop: "1px", color: r.correct ? "#16A34A" : "#DC2626" }}>
                    {r.score === 1 ? "✓" : r.score === 0.5 ? "½" : "✗"}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "2px", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "11px", fontWeight: 600, color: "#6B7280" }}>{r.question.cefrLabel}</span>
                      <CategoryBadge category={r.question.category} />
                    </div>
                    <p style={{ fontSize: "12px", color: "#374151", margin: "0 0 2px", lineHeight: 1.4 }}>{r.question.question}</p>
                    <div style={{ display: "flex", gap: "12px", fontSize: "11px", flexWrap: "wrap" }}>
                      <span style={{ color: r.correct ? "#0F6E56" : "#DC2626" }}>
                        Ти: «{r.userAnswer}»
                      </span>
                      {!r.correct && (
                        <span style={{ color: "#6B7280" }}>Правильно: «{r.question.answer}»</span>
                      )}
                    </div>
                    {r.comment && (
                      <p style={{ fontSize: "11px", color: "#6B3FA0", marginTop: "3px", fontStyle: "italic" }}>✦ {r.comment}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
            <button
              onClick={() => { setPhase("intro"); setTheta(3); setAnswered(new Set()); setCurrent(null); setQIndex(0); setSelected(null); setFillValue(""); setResults([]); setAiComment("") }}
              style={{ flex: 1, background: "#F8F7F4", border: "0.5px solid #E5E7EB", borderRadius: "12px", padding: "12px", fontSize: "14px", cursor: "pointer", color: "#374151" }}
            >
              Пройти знову
            </button>
            <button
              onClick={() => navigate("/")}
              style={{ flex: 1, background: "#0F6E56", border: "none", borderRadius: "12px", padding: "12px", fontSize: "14px", fontWeight: 600, cursor: "pointer", color: "#fff" }}
            >
              На головну
            </button>
          </div>
        </div>
      </main>
    )
  }

  // ── TEST / CHECKING ────────────────────────────────────
  if (!current) return null
  const isChecking = phase === "checking"
  const lastResult = results[results.length - 1]

  return (
    <main style={{ flex: 1, background: "#F8F7F4", minHeight: "100vh", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "32px 24px" }}>
      <div style={{ maxWidth: "560px", width: "100%" }}>

        <ProgressBar current={qIndex + 1} total={TOTAL_QUESTIONS} theta={theta} />

        <div style={{ background: "#fff", border: "0.5px solid #E5E7EB", borderRadius: "20px", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>

          {/* Question header */}
          <div style={{ padding: "16px 20px", borderBottom: "0.5px solid #F3F4F6", display: "flex", alignItems: "center", gap: "8px" }}>
            <CategoryBadge category={current.category} />
            <span style={{ fontSize: "11px", fontWeight: 600, padding: "2px 8px", borderRadius: "20px", background: "#F3F4F6", color: "#6B7280", marginLeft: "auto" }}>
              {current.cefrLabel}
            </span>
          </div>

          <div style={{ padding: "24px 24px 0" }}>
            <p style={{ fontSize: "16px", fontWeight: 500, color: "#111827", lineHeight: 1.6, marginBottom: "24px" }}>
              {current.question}
            </p>

            {/* CHOICE */}
            {current.type === "choice" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "24px" }}>
                {current.options.map((opt, i) => {
                  let bg = "#F8F7F4", border = "#E5E7EB", color = "#1F2937"
                  if (isChecking) {
                    if (opt === current.answer) { bg = "#E1F5EE"; border = "#9FE1CB"; color = "#0F6E56" }
                    else if (opt === selected && opt !== current.answer) { bg = "#FFF5F5"; border = "#FECACA"; color = "#DC2626" }
                  } else if (selected === opt) {
                    bg = "#E1F5EE"; border = "#0F6E56"; color = "#0F6E56"
                  }
                  return (
                    <button
                      key={i}
                      onClick={() => !isChecking && setSelected(opt)}
                      style={{ textAlign: "left", background: bg, border: `1.5px solid ${border}`, borderRadius: "12px", padding: "12px 16px", fontSize: "14px", color, cursor: isChecking ? "default" : "pointer", fontFamily: "inherit", transition: "all .12s" }}
                    >
                      <span style={{ fontWeight: 600, marginRight: "10px", color: "#9CA3AF" }}>{String.fromCharCode(65 + i)}</span>
                      {opt}
                    </button>
                  )
                })}
              </div>
            )}

            {/* FILL */}
            {current.type === "fill" && (
              <div style={{ marginBottom: "24px" }}>
                <input
                  value={fillValue}
                  onChange={e => !isChecking && setFillValue(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && fillValue.trim() && !isChecking) submitAnswer() }}
                  placeholder="Введи відповідь норвезькою..."
                  disabled={isChecking}
                  style={{
                    width: "100%", background: isChecking
                      ? (lastResult?.correct ? "#E1F5EE" : "#FFF5F5")
                      : "#F8F7F4",
                    border: `1.5px solid ${isChecking
                      ? (lastResult?.correct ? "#9FE1CB" : "#FECACA")
                      : (fillValue ? "#0F6E56" : "#E5E7EB")}`,
                    borderRadius: "12px", padding: "12px 16px",
                    fontSize: "15px", color: "#1F2937", outline: "none",
                    fontFamily: "inherit", boxSizing: "border-box",
                    transition: "border-color .12s",
                  }}
                />

                {/* AI loading */}
                {aiLoading && (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}>
                    <span style={{ color: "#0F6E56", fontSize: "13px" }}>✦</span>
                    <span style={{ fontSize: "12px", color: "#6B7280" }}>AI перевіряє відповідь...</span>
                  </div>
                )}

                {/* AI comment */}
                {isChecking && aiComment && !aiLoading && (
                  <div style={{ marginTop: "8px", padding: "8px 12px", background: "#F0EAFC", borderRadius: "10px", fontSize: "12px", color: "#6B3FA0" }}>
                    ✦ {aiComment}
                  </div>
                )}

                {/* Correct answer shown */}
                {isChecking && !lastResult?.correct && !aiLoading && (
                  <div style={{ marginTop: "8px", fontSize: "13px", color: "#0F6E56" }}>
                    Правильно: <strong>{current.answer}</strong>
                  </div>
                )}
              </div>
            )}

            {/* Feedback banner */}
            {isChecking && !aiLoading && (
              <div style={{ marginBottom: "20px", padding: "10px 14px", borderRadius: "10px", display: "flex", alignItems: "center", gap: "8px", background: lastResult?.correct ? "#E1F5EE" : "#FFF5F5", border: `0.5px solid ${lastResult?.correct ? "#9FE1CB" : "#FECACA"}` }}>
                <span style={{ fontSize: "16px" }}>{lastResult?.score === 1 ? "✓" : lastResult?.score === 0.5 ? "½" : "✗"}</span>
                <span style={{ fontSize: "13px", fontWeight: 600, color: lastResult?.correct ? "#0F6E56" : "#DC2626" }}>
                  {lastResult?.score === 1 ? "Правильно!" : lastResult?.score === 0.5 ? "Частково правильно" : "Неправильно"}
                </span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{ padding: "16px 24px", borderTop: "0.5px solid #F3F4F6", display: "flex", justifyContent: "flex-end" }}>
            {!isChecking ? (
              <button
                onClick={submitAnswer}
                disabled={current.type === "choice" ? !selected : !fillValue.trim()}
                style={{
                  background: (current.type === "choice" ? selected : fillValue.trim()) ? "#0F6E56" : "#F3F4F6",
                  color: (current.type === "choice" ? selected : fillValue.trim()) ? "#fff" : "#9CA3AF",
                  border: "none", borderRadius: "12px", padding: "11px 24px",
                  fontSize: "14px", fontWeight: 600, cursor: (current.type === "choice" ? selected : fillValue.trim()) ? "pointer" : "default",
                  transition: "all .15s",
                }}
              >
                Підтвердити →
              </button>
            ) : (
              !aiLoading && (
                <div style={{ fontSize: "13px", color: "#9CA3AF" }}>
                  {qIndex + 1 < TOTAL_QUESTIONS ? "Наступне питання..." : "Підраховуємо результат..."}
                </div>
              )
            )}
          </div>

        </div>
      </div>
    </main>
  )
}
