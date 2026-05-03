import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { topics } from "../data/topics"

// ── СТАН КАРТКИ ─────────────────────
const STAGES = { READ: "read", LISTEN: "listen", QUIZ: "quiz" }

export default function TopicPage() {
  const { topicId, subtopicId } = useParams()
  const navigate = useNavigate()

  const topic = topics.find(t => t.id === Number(topicId))
  const subtopic = topic?.subtopics.find(s => s.id === subtopicId)

  const [stage, setStage] = useState(STAGES.READ)
  const [flipping, setFlipping] = useState(false)
  const [quizIndex, setQuizIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [revealed, setRevealed] = useState({})
  const [speaking, setSpeaking] = useState(false)
  const [wordIndex, setWordIndex] = useState(-1)
  const wordsRef = useRef([])

  if (!topic || !subtopic) return (
    <div className="flex-1 bg-gray-950 flex items-center justify-center text-gray-500">
      Тему не знайдено
    </div>
  )

  const words = subtopic.text?.split(" ") || []

  // ── TTS ────────────────────────────
  function speak() {
    if (speaking) { speechSynthesis.cancel(); setSpeaking(false); setWordIndex(-1); return }
    const utt = new SpeechSynthesisUtterance(subtopic.text)
    utt.lang = "nb-NO"
    utt.rate = 0.85
    const voices = speechSynthesis.getVoices()
    const nora = voices.find(v => v.lang === "nb-NO")
    if (nora) utt.voice = nora

    let i = 0
    utt.onboundary = e => {
      if (e.name === "word") {
        const spoken = subtopic.text.slice(0, e.charIndex + e.charLength)
        const count = spoken.trim().split(/\s+/).length - 1
        setWordIndex(count)
      }
    }
    utt.onend = () => { setSpeaking(false); setWordIndex(-1) }
    utt.onstart = () => setSpeaking(true)
    speechSynthesis.speak(utt)
  }

  // ── ПЕРЕГОРТАННЯ ───────────────────
  function goStage(next) {
    setFlipping(true)
    setTimeout(() => { setStage(next); setFlipping(false) }, 400)
  }

  // ── ПЕРЕХІД ДО НАСТУПНОЇ ПІДТЕМИ ──
  function nextSubtopic() {
    const idx = topic.subtopics.findIndex(s => s.id === subtopicId)
    if (idx < topic.subtopics.length - 1) {
      const next = topic.subtopics[idx + 1]
      localStorage.setItem("topicProgress", JSON.stringify({ topicId: Number(topicId), subtopicId: next.id }))
      setStage(STAGES.READ); setQuizIndex(0); setAnswers({}); setRevealed({})
      navigate(`/topic/${topicId}/${next.id}`)
    } else {
      localStorage.removeItem("topicProgress")
      navigate("/")
    }
  }

  const subtopicIdx = topic.subtopics.findIndex(s => s.id === subtopicId)
  const progress = ((subtopicIdx) / topic.subtopics.length) * 100

  return (
    <main className="flex-1 bg-gray-950 min-h-screen p-4 md:p-8">
      <div className="max-w-3xl mx-auto">

        {/* ── ХЕДЕР ── */}
        <div className="mb-6">
          <button onClick={() => navigate("/")} className="text-xs text-gray-500 hover:text-gray-300 transition-colors mb-3 flex items-center gap-1">
            ← Назад до тем
          </button>
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-white font-medium">{topic.title}</h1>
            <span className="text-xs text-gray-500">{subtopicIdx + 1} / {topic.subtopics.length}</span>
          </div>
          {/* Прогрес-бар */}
          <div className="w-full bg-gray-800 rounded-full h-1">
            <div className="bg-blue-500 h-1 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* ── КАРТКА ── */}
        <div className={`transition-all duration-400 ${flipping ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}>

          {/* Назва підтеми */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-blue-900 border border-blue-700 flex items-center justify-center text-blue-300 text-sm font-medium flex-shrink-0">
              {subtopicIdx + 1}
            </div>
            <div>
              <p className="text-white font-medium">{subtopic.title}</p>
              <p className="text-xs text-gray-500">{subtopic.titleUa}</p>
            </div>
            {/* Іконка стадії */}
            <div className="ml-auto text-xs text-gray-600 flex items-center gap-2">
              {[STAGES.READ, STAGES.LISTEN, STAGES.QUIZ].map((s, i) => (
                <div key={s} className={`w-2 h-2 rounded-full transition-colors ${stage === s ? "bg-blue-400" : stage > s || (stage === STAGES.QUIZ && i < 2) ? "bg-green-600" : "bg-gray-700"}`} />
              ))}
            </div>
          </div>

          {/* ── СТАДІЯ 1: ЧИТАННЯ ── */}
          {stage === STAGES.READ && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
                <span className="text-xs text-gray-500 uppercase tracking-wider">Читання</span>
                <span className="text-xs bg-blue-950 text-blue-400 border border-blue-800 px-2 py-0.5 rounded-full">{topic.level}</span>
              </div>
              <div className="p-6">
                <p className="text-gray-200 leading-relaxed text-base">
                  {subtopic.text}
                </p>
              </div>
              <div className="px-6 py-4 border-t border-gray-800 flex justify-end">
                <button
                  onClick={() => goStage(STAGES.LISTEN)}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg text-sm transition-colors flex items-center gap-2"
                >
                  Далі: аудіювання →
                </button>
              </div>
            </div>
          )}

          {/* ── СТАДІЯ 2: АУДІЮВАННЯ ── */}
          {stage === STAGES.LISTEN && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
                <span className="text-xs text-gray-500 uppercase tracking-wider">Аудіювання</span>
                <button
                  onClick={speak}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
                    speaking
                      ? "bg-red-950 border border-red-800 text-red-400"
                      : "bg-blue-900 border border-blue-700 text-blue-300 hover:bg-blue-800"
                  }`}
                >
                  {speaking ? "⏹ Зупинити" : "▶ Відтворити"}
                </button>
              </div>
              <div className="p-6">
                <p className="text-gray-200 leading-relaxed text-base">
                  {words.map((word, i) => (
                    <span
                      key={i}
                      className={`transition-colors duration-100 ${
                        i === wordIndex ? "bg-blue-500 text-white rounded px-0.5" : ""
                      }`}
                    >
                      {word}{" "}
                    </span>
                  ))}
                </p>
              </div>
              <div className="px-6 py-4 border-t border-gray-800 flex justify-between items-center">
                <button
                  onClick={() => goStage(STAGES.READ)}
                  className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
                >
                  ← Назад до тексту
                </button>
                <button
                  onClick={() => { speechSynthesis.cancel(); setSpeaking(false); setWordIndex(-1); goStage(STAGES.QUIZ) }}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg text-sm transition-colors"
                >
                  Далі: вправи →
                </button>
              </div>
            </div>
          )}

          {/* ── СТАДІЯ 3: ВПРАВИ ── */}
          {stage === STAGES.QUIZ && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
                <span className="text-xs text-gray-500 uppercase tracking-wider">Вправи</span>
                <span className="text-xs text-gray-600">{quizIndex + 1} / {subtopic.questions?.length || 0}</span>
              </div>

              {subtopic.questions?.length > 0 ? (
                <>
                  <div className="p-6">
                    <p className="text-white font-medium mb-6 text-base">
                      {subtopic.questions[quizIndex]?.q}
                    </p>

                    {/* Поле відповіді */}
                    <textarea
                      value={answers[quizIndex] || ""}
                      onChange={e => setAnswers(prev => ({ ...prev, [quizIndex]: e.target.value }))}
                      placeholder="Введи відповідь норвезькою..."
                      disabled={revealed[quizIndex]}
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-blue-500 resize-none min-h-[80px] disabled:opacity-60 transition-colors"
                    />

                    {/* Правильна відповідь */}
                    {revealed[quizIndex] && (
                      <div className="mt-4 bg-green-950 border border-green-800 rounded-xl px-4 py-3">
                        <p className="text-xs text-green-500 uppercase tracking-wider mb-1">Правильна відповідь</p>
                        <p className="text-green-300 text-sm">{subtopic.questions[quizIndex]?.a}</p>
                      </div>
                    )}
                  </div>

                  <div className="px-6 py-4 border-t border-gray-800 flex justify-between items-center">
                    {!revealed[quizIndex] ? (
                      <button
                        onClick={() => setRevealed(prev => ({ ...prev, [quizIndex]: true }))}
                        className="text-sm text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 px-4 py-2 rounded-lg transition-colors"
                      >
                        Показати відповідь
                      </button>
                    ) : (
                      <div />
                    )}

                    {quizIndex < subtopic.questions.length - 1 ? (
                      <button
                        onClick={() => { setQuizIndex(i => i + 1) }}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg text-sm transition-colors"
                      >
                        Наступне питання →
                      </button>
                    ) : (
                      <button
                        onClick={nextSubtopic}
                        className="bg-green-700 hover:bg-green-600 text-white px-5 py-2 rounded-lg text-sm transition-colors flex items-center gap-2"
                      >
                        ✓ Завершити підтему
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <div className="p-6 text-center">
                  <p className="text-gray-400 mb-4">Вправи для цієї підтеми ще не додані</p>
                  <button onClick={nextSubtopic} className="bg-green-700 hover:bg-green-600 text-white px-5 py-2 rounded-lg text-sm transition-colors">
                    Наступна підтема →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── СЛОВНИК ПІДТЕМИ ── */}
          {subtopic.vocabulary?.length > 0 && (
            <div className="mt-4 bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Словник теми</p>
              <div className="flex flex-wrap gap-2">
                {subtopic.vocabulary.map((word, i) => (
                  <button
                    key={i}
                    onClick={() => navigate(`/dictionary/${word}`)}
                    className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-700 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    {word}
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </main>
  )
}