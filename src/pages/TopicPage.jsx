import { useState, useRef, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { topics } from "../data/topics"
import WordPopover from "../components/WordPopover"

const STAGES = { READ: "read", GRAMMAR: "grammar", QUIZ: "quiz" }

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
  const [grammarAnswers, setGrammarAnswers] = useState({})
  const [grammarChecked, setGrammarChecked] = useState(false)
  const progressKey = `linguai_progress_${topicId}_${subtopicId}`
  const saved = JSON.parse(localStorage.getItem(progressKey) || "{}")
  const [stage, setStage] = useState(saved.stage || STAGES.READ)
  const [showResults, setShowResults] = useState(false)
  const [flipping, setFlipping] = useState(false)
  const [quizIndex, setQuizIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [speaking, setSpeaking] = useState(false)
  const [aiFeedback, setAiFeedback] = useState({})
  const [aiFeedbackLoading, setAiFeedbackLoading] = useState({})

  useEffect(() => {
  localStorage.setItem(progressKey, JSON.stringify({ stage, quizIndex, grammarAnswers }))
  }, [stage, quizIndex, grammarAnswers])  

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

  function goTo(nextStage) {
    setFlipping(true)
    setTimeout(() => { setStage(nextStage); setFlipping(false) }, 300)
  }

  function nextSubtopic() {
    localStorage.removeItem(progressKey)
    const idx = topic.subtopics.findIndex(s => s.id === subtopicId)
    if (idx < topic.subtopics.length - 1) {
      const next = topic.subtopics[idx + 1]
      localStorage.setItem("topicProgress", JSON.stringify({ topicId: Number(topicId), subtopicId: next.id }))
      setStage(STAGES.READ); setQuizIndex(0); setAnswers({})
      setShowResults(false); setAiFeedback({}); setAiFeedbackLoading({})
      setGrammarAnswers({}); setGrammarChecked(false) 
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
              { key: STAGES.GRAMMAR, icon: "📐", label: "Граматика" },
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
                  onClick={() => goTo(subtopic.grammar ? STAGES.GRAMMAR : STAGES.QUIZ)}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium text-white transition-colors"
                  style={{ background: "#0F6E56" }}
                  onMouseEnter={e => e.target.style.background = "#0D5E48"}
                  onMouseLeave={e => e.target.style.background = "#0F6E56"}
                >
                  {subtopic.grammar ? "📐 До граматики →" : "✏️ До вправ →"}
                </button>
              </div>
            </div>
          )}

          {/* ══ STAGE: GRAMMAR ══════════════════════════════════ */}
          {stage === STAGES.GRAMMAR && subtopic.grammar && (() => {
            const g = subtopic.grammar

            // нормалізація відповіді для порівняння
            const norm = s => (s || "").trim().toLowerCase().replace(/[.,!?]/g, "").replace(/\s+/g, " ")

            // індексація вправ
            const exItems = g.exercises.map((ex, i) => ({ ...ex, idx: i }))

            const checkAnswer = (ex) => {
              const user = grammarAnswers[ex.idx]
              return norm(user) === norm(ex.answer)
            }
            const correctN = exItems.filter(checkAnswer).length

            return (
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

                {/* Header */}
                <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2">
                  <span className="text-base">📐</span>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Граматика</span>
                  <span className="ml-auto text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: "#E6F1FB", color: "#185FA5" }}>
                    {g.topic}
                  </span>
                </div>

                <div className="p-5 flex flex-col gap-4">

                  {/* Rule blocks */}
                  {g.blocks.map((b, i) => (
                    <div key={i} className="rounded-xl p-4" style={{ background: "#F8F7F4", border: "0.5px solid #E5E7EB" }}>
                      <p className="text-sm font-semibold text-gray-900 mb-1.5">{b.heading}</p>
                      <p className="text-sm text-gray-600 leading-relaxed">{b.text}</p>
                    </div>
                  ))}

                  {/* Examples */}
                  <div className="rounded-xl p-4" style={{ background: "#E1F5EE", border: "0.5px solid #9FE1CB" }}>
                    <p className="text-xs font-medium uppercase tracking-wider mb-3" style={{ color: "#0F6E56" }}>Приклади</p>
                    <div className="flex flex-col gap-2.5">
                      {g.examples.map((ex, i) => {
                        // підсвічуємо слово hi всередині норвезького прикладу
                        const parts = ex.hi ? ex.no.split(ex.hi) : [ex.no]
                        return (
                          <div key={i} className="flex flex-col gap-0.5">
                            <p className="text-sm text-gray-900">
                              {ex.hi && parts.length > 1 ? (
                                <>
                                  {parts[0]}
                                  <span className="font-bold" style={{ color: "#0F6E56", background: "#C9EEDF", borderRadius: "4px", padding: "0 3px" }}>{ex.hi}</span>
                                  {parts.slice(1).join(ex.hi)}
                                </>
                              ) : ex.no}
                            </p>
                            <p className="text-xs text-gray-500">{ex.ua}</p>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Exercises */}
                  <div>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Вправи на правило</p>
                    <div className="flex flex-col gap-3">
                      {exItems.map(ex => {
                        const correct = checkAnswer(ex)
                        const showCheck = grammarChecked
                        return (
                          <div key={ex.idx} className="rounded-xl p-4" style={{
                            border: `0.5px solid ${showCheck ? (correct ? "#BBF7D0" : "#FECACA") : "#E5E7EB"}`,
                            background: showCheck ? (correct ? "#F0FFF4" : "#FFF5F5") : "#fff",
                          }}>
                            <p className="text-xs text-gray-400 mb-2">{ex.task}</p>

                            {/* wordorder — показуємо перемішані слова */}
                            {ex.type === "wordorder" && (
                              <div className="flex flex-wrap gap-1.5 mb-3">
                                {ex.scrambled.map((w, k) => (
                                  <span key={k} className="text-xs px-2 py-1 rounded-lg" style={{ background: "#F0EAFC", color: "#6B3FA0" }}>{w}</span>
                                ))}
                              </div>
                            )}

                            {/* conjugate — показуємо речення з пропуском */}
                            {ex.type === "conjugate" && (
                              <p className="text-sm text-gray-900 mb-3">{ex.sentence}</p>
                            )}

                            <input
                              value={grammarAnswers[ex.idx] || ""}
                              onChange={e => setGrammarAnswers(prev => ({ ...prev, [ex.idx]: e.target.value }))}
                              disabled={showCheck}
                              placeholder={ex.type === "wordorder" ? "Запиши речення повністю..." : "Відповідь..."}
                              className="w-full rounded-lg px-3 py-2 text-sm text-gray-900 outline-none"
                              style={{ background: "#F8F7F4", border: `1.5px solid ${grammarAnswers[ex.idx] ? "#185FA5" : "#E5E7EB"}` }}
                            />

                            {showCheck && !correct && (
                              <p className="text-xs mt-2" style={{ color: "#0F6E56" }}>
                                Правильно: <strong>{ex.answer}</strong>
                              </p>
                            )}
                          </div>
                        )
                      })}
                    </div>

                    {/* Check button / result */}
                    {!grammarChecked ? (
                      <button
                        onClick={() => setGrammarChecked(true)}
                        className="mt-3 w-full py-2.5 rounded-xl text-sm font-medium text-white"
                        style={{ background: "#185FA5" }}
                      >
                        Перевірити вправи
                      </button>
                    ) : (
                      <div className="mt-3 text-center text-sm text-gray-500">
                        {correctN} з {exItems.length} правильно
                        <button
                          onClick={() => { setGrammarChecked(false); setGrammarAnswers({}) }}
                          className="ml-2 text-xs underline"
                          style={{ color: "#185FA5" }}
                        >
                          ще раз
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Extra block: pronunciation / lexicon */}
                  {g.extra && (
                    <div className="rounded-xl p-4" style={{
                      background: g.extra.type === "pronunciation" ? "#FAEEDA" : "#E6F1FB",
                      border: `0.5px solid ${g.extra.type === "pronunciation" ? "#F0C97A" : "#B8D6F5"}`,
                    }}>
                      <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: g.extra.type === "pronunciation" ? "#854F0B" : "#185FA5" }}>
                        {g.extra.type === "pronunciation" ? "🗣 " : "📚 "}{g.extra.title}
                      </p>
                      {g.extra.intro && <p className="text-xs text-gray-600 mb-3 leading-relaxed">{g.extra.intro}</p>}
                      <div className="flex flex-col gap-2">
                        {g.extra.items.map((it, i) => (
                          <div key={i} className="flex items-baseline gap-2 text-sm">
                            <span className="font-semibold text-gray-900 shrink-0">{it.word}</span>
                            {it.read && <span className="text-gray-500 shrink-0">[{it.read}]</span>}
                            <span className="text-xs text-gray-500">{it.note}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>

                {/* Footer */}
                <div className="px-5 py-4 border-t border-gray-100 flex justify-between items-center">
                  <button onClick={() => goTo(STAGES.READ)} className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
                    ← До тексту
                  </button>
                  <button
                    onClick={() => goTo(STAGES.QUIZ)}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium text-white transition-colors"
                    style={{ background: "#0F6E56" }}
                    onMouseEnter={e => e.target.style.background = "#0D5E48"}
                    onMouseLeave={e => e.target.style.background = "#0F6E56"}
                  >
                    ✏️ До вправ →
                  </button>
                </div>
              </div>
            )
          })()}

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
