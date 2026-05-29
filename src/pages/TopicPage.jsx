import { useState, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { topics } from "../data/topics"
import WordPopover from "../components/WordPopover"

const STAGES = { READ: "read", QUIZ: "quiz" }

const TYPE_CONFIG = {
  question:  { label: "Питання до тексту", icon: "💬", accent: "#185FA5", bg: "#E6F1FB", border: "#B8D6F5" },
  fill:      { label: "Заповни пропуск",   icon: "✏️",  accent: "#6B3FA0", bg: "#F0EAFC", border: "#CDB8F0" },
  translate: { label: "Переклад",           icon: "🌐",  accent: "#854F0B", bg: "#FAEEDA", border: "#F0C97A" },
}

export default function TopicPage() {
  const { topicId, subtopicId } = useParams()
  const navigate = useNavigate()

  const topic = topics.find(t => t.id === Number(topicId))
  const subtopic = topic?.subtopics.find(s => s.id === subtopicId)

  const [stage, setStage] = useState(STAGES.READ)
  const [showResults, setShowResults] = useState(false)
  const [flipping, setFlipping] = useState(false)
  const [quizIndex, setQuizIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [speaking, setSpeaking] = useState(false)
  const [aiFeedback, setAiFeedback] = useState({})
  const [aiFeedbackLoading, setAiFeedbackLoading] = useState({})

  async function checkWithAI(idx, exercise) {
    const userAnswer = answers[idx]?.trim()
    if (!userAnswer) return
    setAiFeedbackLoading(prev => ({ ...prev, [idx]: true }))
    const correctAnswer =
      exercise.type === "question" ? exercise.a :
      exercise.type === "fill" ? exercise.answer : exercise.no
    const prompt =
      exercise.type === "question"
        ? `Питання: "${exercise.q}"\nВідповідь учня: "${userAnswer}"\nПравильна відповідь: "${correctAnswer}"`
        : exercise.type === "fill"
        ? `Речення: "${exercise.sentence}"\nВідповідь учня: "${userAnswer}"\nПравильна відповідь: "${correctAnswer}"`
        : `Переклади норвезькою: "${exercise.ua}"\nВідповідь учня: "${userAnswer}"\nПравильний переклад: "${correctAnswer}"`
    try {
      const res = await fetch("/api/Chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: prompt }],
          systemPrompt: `Ти вчитель норвезької мови. Оціни відповідь учня коротко (2-3 речення) українською:
- Чи правильна відповідь? (повністю / частково / ні)
- Якщо є помилки — поясни конкретно що не так
- Якщо правильно — коротко похвали і додай цікавий факт`
        }),
      })
      const data = await res.json()
      setAiFeedback(prev => ({ ...prev, [idx]: data.content?.[0]?.text || "" }))
    } catch {
      setAiFeedback(prev => ({ ...prev, [idx]: "Помилка з'єднання." }))
    } finally {
      setAiFeedbackLoading(prev => ({ ...prev, [idx]: false }))
    }
  }

  if (!topic || !subtopic) return (
    <div className="flex-1 bg-[#F8F7F4] flex items-center justify-center text-gray-400">
      Тему не знайдено
    </div>
  )

  function speak() {
    if (speaking) { speechSynthesis.cancel(); setSpeaking(false); return }
    const utt = new SpeechSynthesisUtterance(subtopic.text)
    utt.lang = "nb-NO"; utt.rate = 0.85
    const voices = speechSynthesis.getVoices()
    const nora = voices.find(v => v.lang === "nb-NO")
    if (nora) utt.voice = nora
    utt.onend = () => setSpeaking(false)
    utt.onstart = () => setSpeaking(true)
    speechSynthesis.speak(utt)
  }

  function goQuiz() {
    setFlipping(true)
    setTimeout(() => { setStage(STAGES.QUIZ); setFlipping(false) }, 300)
  }

  function nextSubtopic() {
    const idx = topic.subtopics.findIndex(s => s.id === subtopicId)
    if (idx < topic.subtopics.length - 1) {
      const next = topic.subtopics[idx + 1]
      localStorage.setItem("topicProgress", JSON.stringify({ topicId: Number(topicId), subtopicId: next.id }))
      setStage(STAGES.READ); setQuizIndex(0); setAnswers({})
      setShowResults(false); setAiFeedback({}); setAiFeedbackLoading({})
      navigate(`/topic/${topicId}/${next.id}`)
    } else {
      localStorage.removeItem("topicProgress")
      navigate("/")
    }
  }

  const subtopicIdx = topic.subtopics.findIndex(s => s.id === subtopicId)
  const progress = ((subtopicIdx + (stage === STAGES.QUIZ ? 0.5 : 0)) / topic.subtopics.length) * 100

  // ── EXERCISES ──────────────────────────────────────────
  const allExercises = [
    ...(subtopic.questions || []).map(q => ({ type: "question", ...q })),
    ...(subtopic.fillGaps  || []).map(q => ({ type: "fill",     ...q })),
    ...(subtopic.translate || []).map(q => ({ type: "translate",...q })),
  ]
  const total = allExercises.length
  const current = allExercises[quizIndex]
  const isLast = quizIndex === total - 1

  const getCorrect = ex =>
    ex.type === "question" ? ex.a : ex.type === "fill" ? ex.answer : ex.no

  const isCorrect = (ex, idx) =>
    (answers[idx] || "").trim().toLowerCase() === getCorrect(ex).trim().toLowerCase()

  const correctCount = allExercises.filter((ex, i) => isCorrect(ex, i)).length

  // ── RENDER ─────────────────────────────────────────────
  return (
    <main className="flex-1 min-h-screen p-4 md:p-8" style={{ background: "#F8F7F4" }}>
      <div className="max-w-3xl mx-auto">

        {/* HEADER */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/")}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors mb-3 flex items-center gap-1"
          >
            ← Назад до тем
          </button>
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-gray-900 font-semibold text-base">{topic.title}</h1>
            <span className="text-xs text-gray-400 font-medium">
              {subtopicIdx + 1} / {topic.subtopics.length}
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, background: "#0F6E56" }}
            />
          </div>
          {/* Stage pills */}
          <div className="flex items-center gap-2 mt-3">
            {[
              { key: STAGES.READ, icon: "📖", label: "Читання" },
              { key: STAGES.QUIZ, icon: "✏️", label: "Вправи" },
            ].map(s => (
              <div
                key={s.key}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all"
                style={stage === s.key
                  ? { background: "#E1F5EE", color: "#0F6E56", border: "0.5px solid #9FE1CB" }
                  : { background: "#fff", color: "#9CA3AF", border: "0.5px solid #E5E7EB" }
                }
              >
                <span>{s.icon}</span> {s.label}
              </div>
            ))}
          </div>
        </div>

        {/* CARD */}
        <div className={`transition-all duration-300 ${flipping ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}>

          {/* Subtopic header */}
          <div className="bg-white border border-gray-200 rounded-2xl px-5 py-4 mb-4 flex items-center gap-3 shadow-sm">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-semibold shrink-0"
              style={{ background: "#E1F5EE", color: "#0F6E56" }}
            >
              {subtopicIdx + 1}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-gray-900 font-medium text-sm">{subtopic.title}</p>
              <p className="text-xs text-gray-400">{subtopic.titleUa}</p>
            </div>
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-full shrink-0"
              style={{ background: "#E1F5EE", color: "#0F6E56" }}
            >
              {topic.level}
            </span>
          </div>

          {/* ══ STAGE: READ ══════════════════════════════════ */}
          {stage === STAGES.READ && (
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-visible">
              <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base">📖</span>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Читання</span>
                </div>
                <button
                  onClick={speak}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border"
                  style={speaking
                    ? { background: "#FEE2E2", borderColor: "#FCA5A5", color: "#DC2626" }
                    : { background: "#F8F7F4", borderColor: "#E5E7EB", color: "#6B7280" }
                  }
                >
                  {speaking ? "⏹ Стоп" : "▶ Слухати"}
                </button>
              </div>

              <div className="flex gap-0">
                {/* Vocabulary sidebar */}
                {subtopic.vocabulary?.length > 0 && (
                  <div className="w-36 shrink-0 border-r border-gray-100 px-3 py-4">
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-3 font-medium">Фокус</p>
                    <div className="flex flex-col gap-1">
                      {subtopic.vocabulary.map((item, i) => {
                        const w = typeof item === "string" ? item : item.word
                        return (
                          <button
                            key={i}
                            onClick={() => navigate(`/dictionary/${w.replace(/^(en|ei|et|å)\s+/i, "").trim()}`)}
                            className="text-left text-xs text-gray-600 px-2 py-1.5 rounded-lg transition-all flex items-center gap-1.5 group hover:bg-gray-50"
                          >
                            <span className="text-teal-500 group-hover:text-teal-600 text-xs">→</span>
                            <span className="group-hover:text-gray-900">{w}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Text */}
                <div className="flex-1 p-5" style={{ overflow: "visible" }}>
                  <WordPopover text={subtopic.text} />
                </div>
              </div>

              <div className="px-5 py-4 border-t border-gray-100 flex justify-between items-center">
                <p className="text-xs text-gray-400">
                  Наведи на слово для пояснення ✦
                </p>
                <button
                  onClick={goQuiz}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium text-white transition-colors"
                  style={{ background: "#0F6E56" }}
                  onMouseEnter={e => e.target.style.background = "#0D5E48"}
                  onMouseLeave={e => e.target.style.background = "#0F6E56"}
                >
                  ✏️ До вправ →
                </button>
              </div>
            </div>
          )}

          {/* ══ STAGE: QUIZ ══════════════════════════════════ */}
          {stage === STAGES.QUIZ && (() => {

            // ── RESULTS ──────────────────────────────────────
            if (showResults) {
              const pct = Math.round((correctCount / total) * 100)
              const emoji = pct === 100 ? "🏆" : pct >= 70 ? "👍" : "💪"
              return (
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                  {/* Results header */}
                  <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
                    <span className="text-xl">{emoji}</span>
                    <div>
                      <p className="text-gray-900 font-semibold text-sm">Результати вправ</p>
                      <p className="text-xs text-gray-400">{correctCount} з {total} правильно · {pct}%</p>
                    </div>
                    {/* Score bar */}
                    <div className="flex-1 ml-2">
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-2 rounded-full transition-all duration-700"
                          style={{
                            width: `${pct}%`,
                            background: pct === 100 ? "#0F6E56" : pct >= 70 ? "#22C55E" : "#F59E0B"
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Results list */}
                  <div className="p-5 flex flex-col gap-3">
                    {allExercises.map((ex, idx) => {
                      const correct = isCorrect(ex, idx)
                      const userAns = answers[idx] || "—"
                      const cfg = TYPE_CONFIG[ex.type]
                      return (
                        <div
                          key={idx}
                          className="rounded-xl border p-4"
                          style={{
                            borderColor: correct ? "#BBF7D0" : "#FECACA",
                            background: correct ? "#F0FFF4" : "#FFF5F5",
                          }}
                        >
                          {/* Type badge + question */}
                          <div className="flex items-center gap-2 mb-2">
                            <span
                              className="text-xs font-medium px-2 py-0.5 rounded-full"
                              style={{ background: cfg.bg, color: cfg.accent }}
                            >
                              {cfg.icon} {cfg.label}
                            </span>
                            <span className={`text-sm font-bold ml-auto ${correct ? "text-green-500" : "text-red-400"}`}>
                              {correct ? "✓" : "✗"}
                            </span>
                          </div>

                          <p className="text-gray-700 text-sm mb-3 leading-relaxed">
                            {ex.type === "question" && ex.q}
                            {ex.type === "fill" && ex.sentence}
                            {ex.type === "translate" && <><span className="text-gray-400 text-xs block mb-0.5">Перекласти:</span>{ex.ua}</>}
                          </p>

                          <div className="flex flex-col gap-1">
                            <div className="flex gap-2 text-sm items-baseline">
                              <span className="text-gray-400 text-xs shrink-0">Твоя відповідь:</span>
                              <span
                                className="font-medium"
                                style={{ color: correct ? "#0F6E56" : "#DC2626" }}
                              >{userAns}</span>
                            </div>
                            {!correct && (
                              <div className="flex gap-2 text-sm items-baseline">
                                <span className="text-gray-400 text-xs shrink-0">Правильно:</span>
                                <span className="text-green-600 font-medium">{getCorrect(ex)}</span>
                              </div>
                            )}
                          </div>

                          {/* AI feedback */}
                          {aiFeedback[idx] ? (
                            <div className="mt-3 rounded-lg px-3 py-2.5" style={{ background: "#F0EAFC" }}>
                              <p className="text-xs font-medium mb-1" style={{ color: "#6B3FA0" }}>✦ AI пояснення</p>
                              <p className="text-gray-700 text-sm leading-relaxed">{aiFeedback[idx]}</p>
                            </div>
                          ) : aiFeedbackLoading[idx] ? (
                            <div className="flex items-center gap-2 mt-3">
                              <span style={{ color: "#6B3FA0" }} className="text-sm">✦</span>
                              <span className="text-gray-400 text-sm">Аналізую...</span>
                            </div>
                          ) : (
                            <button
                              onClick={() => checkWithAI(idx, ex)}
                              className="mt-3 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all"
                              style={{ color: "#6B3FA0", borderColor: "#CDB8F0", background: "#F0EAFC" }}
                            >
                              ✦ Чому?
                            </button>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  <div className="px-5 py-4 border-t border-gray-100 flex justify-between items-center">
                    <button
                      onClick={() => { setShowResults(false); setQuizIndex(0); setAnswers({}) }}
                      className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      ← Спробувати ще раз
                    </button>
                    <button
                      onClick={nextSubtopic}
                      className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium text-white transition-colors"
                      style={{ background: "#0F6E56" }}
                      onMouseEnter={e => e.target.style.background = "#0D5E48"}
                      onMouseLeave={e => e.target.style.background = "#0F6E56"}
                    >
                      ✓ Наступна підтема
                    </button>
                  </div>
                </div>
              )
            }

            // ── QUIZ CARD ─────────────────────────────────────
            const cfg = current ? TYPE_CONFIG[current.type] : null
            return (
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

                {/* Quiz header */}
                <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {cfg && (
                      <span
                        className="text-xs font-medium px-2.5 py-1 rounded-full"
                        style={{ background: cfg.bg, color: cfg.accent }}
                      >
                        {cfg.icon} {cfg.label}
                      </span>
                    )}
                  </div>
                  {/* Progress dots */}
                  <div className="flex items-center gap-1.5">
                    {allExercises.map((_, i) => (
                      <div
                        key={i}
                        className="rounded-full transition-all"
                        style={{
                          width: i === quizIndex ? "20px" : "6px",
                          height: "6px",
                          background: i < quizIndex
                            ? "#0F6E56"
                            : i === quizIndex
                            ? "#0F6E56"
                            : "#E5E7EB"
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-400 font-medium">{quizIndex + 1} / {total}</span>
                </div>

                {/* Question */}
                {total > 0 && current ? (
                  <>
                    <div className="p-6">

                      {current.type === "question" && (
                        <>
                          <p className="text-gray-900 font-medium text-base leading-relaxed mb-5">
                            {current.q}
                          </p>
                          <textarea
                            value={answers[quizIndex] || ""}
                            onChange={e => setAnswers(prev => ({ ...prev, [quizIndex]: e.target.value }))}
                            placeholder="Введи відповідь норвезькою..."
                            className="w-full rounded-xl px-4 py-3 text-gray-900 text-sm outline-none resize-none min-h-[90px] transition-all"
                            style={{
                              background: "#F8F7F4",
                              border: `1.5px solid ${answers[quizIndex] ? "#0F6E56" : "#E5E7EB"}`,
                            }}
                            onFocus={e => e.target.style.borderColor = "#0F6E56"}
                            onBlur={e => e.target.style.borderColor = answers[quizIndex] ? "#0F6E56" : "#E5E7EB"}
                          />
                        </>
                      )}

                      {current.type === "fill" && (
                        <>
                          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
                            Заповни пропуск
                          </p>
                          <p className="text-gray-900 text-base leading-relaxed mb-5 px-4 py-3 rounded-xl"
                             style={{ background: "#F8F7F4", border: "0.5px solid #E5E7EB" }}>
                            {current.sentence}
                          </p>
                          <input
                            value={answers[quizIndex] || ""}
                            onChange={e => setAnswers(prev => ({ ...prev, [quizIndex]: e.target.value }))}
                            placeholder="Введи пропущене слово..."
                            className="w-full rounded-xl px-4 py-3 text-gray-900 text-sm outline-none transition-all"
                            style={{
                              background: "#F8F7F4",
                              border: `1.5px solid ${answers[quizIndex] ? "#6B3FA0" : "#E5E7EB"}`,
                            }}
                            onFocus={e => e.target.style.borderColor = "#6B3FA0"}
                            onBlur={e => e.target.style.borderColor = answers[quizIndex] ? "#6B3FA0" : "#E5E7EB"}
                          />
                        </>
                      )}

                      {current.type === "translate" && (
                        <>
                          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
                            Перекладіть норвезькою
                          </p>
                          <div className="px-4 py-3 rounded-xl mb-5"
                               style={{ background: "#FAEEDA", border: "0.5px solid #F0C97A" }}>
                            <p className="text-gray-900 font-medium text-base">{current.ua}</p>
                          </div>
                          <textarea
                            value={answers[quizIndex] || ""}
                            onChange={e => setAnswers(prev => ({ ...prev, [quizIndex]: e.target.value }))}
                            placeholder="Напиши норвезькою..."
                            className="w-full rounded-xl px-4 py-3 text-gray-900 text-sm outline-none resize-none min-h-[90px] transition-all"
                            style={{
                              background: "#F8F7F4",
                              border: `1.5px solid ${answers[quizIndex] ? "#854F0B" : "#E5E7EB"}`,
                            }}
                            onFocus={e => e.target.style.borderColor = "#854F0B"}
                            onBlur={e => e.target.style.borderColor = answers[quizIndex] ? "#854F0B" : "#E5E7EB"}
                          />
                        </>
                      )}
                    </div>

                    <div className="px-5 py-4 border-t border-gray-100 flex justify-between items-center">
                      {quizIndex > 0 ? (
                        <button
                          onClick={() => setQuizIndex(i => i - 1)}
                          className="text-sm text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1"
                        >
                          ← Назад
                        </button>
                      ) : <div />}

                      {!isLast ? (
                        <button
                          onClick={() => setQuizIndex(i => i + 1)}
                          className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium text-white transition-colors"
                          style={{ background: "#185FA5" }}
                          onMouseEnter={e => e.target.style.background = "#1251891"}
                          onMouseLeave={e => e.target.style.background = "#185FA5"}
                        >
                          Наступна →
                        </button>
                      ) : (
                        <button
                          onClick={() => setShowResults(true)}
                          className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium text-white transition-colors"
                          style={{ background: "#0F6E56" }}
                          onMouseEnter={e => e.target.style.background = "#0D5E48"}
                          onMouseLeave={e => e.target.style.background = "#0F6E56"}
                        >
                          Переглянути результати →
                        </button>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-gray-400 mb-4 text-sm">Вправи для цієї підтеми ще не додані</p>
                    <button
                      onClick={nextSubtopic}
                      className="px-5 py-2 rounded-xl text-sm font-medium text-white"
                      style={{ background: "#0F6E56" }}
                    >
                      Наступна підтема →
                    </button>
                  </div>
                )}
              </div>
            )
          })()}

        </div>
      </div>
    </main>
  )
}
