import { useState, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { topics } from "../data/topics"
import WordPopover from "../components/WordPopover"

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

  function speak() {
    if (speaking) { speechSynthesis.cancel(); setSpeaking(false); setWordIndex(-1); return }
    const utt = new SpeechSynthesisUtterance(subtopic.text)
    utt.lang = "nb-NO"
    utt.rate = 0.85
    const voices = speechSynthesis.getVoices()
    const nora = voices.find(v => v.lang === "nb-NO")
    if (nora) utt.voice = nora

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

  function goStage(next) {
    setFlipping(true)
    setTimeout(() => { setStage(next); setFlipping(false) }, 400)
  }

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
  const progress = (subtopicIdx / topic.subtopics.length) * 100

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
            <div className="ml-auto text-xs text-gray-600 flex items-center gap-2">
              {[STAGES.READ, STAGES.LISTEN, STAGES.QUIZ].map((s, i) => (
                <div key={s} className={`w-2 h-2 rounded-full transition-colors ${stage === s ? "bg-blue-400" : stage > s || (stage === STAGES.QUIZ && i < 2) ? "bg-green-600" : "bg-gray-700"}`} />
              ))}
            </div>
          </div>

          {/* ── СТАДІЯ 1: ЧИТАННЯ ── */}
          {stage === STAGES.READ && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl">
              <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
                <span className="text-xs text-gray-500 uppercase tracking-wider">Читання</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={speak}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all ${
                      speaking
                        ? "bg-red-950 border border-red-800 text-red-400"
                        : "bg-gray-800 border border-gray-700 text-gray-300 hover:border-gray-500"
                    }`}
                  >
                    {speaking ? "⏹ Стоп" : "▶ Слухати"}
                  </button>
                  <span className="text-xs bg-blue-950 text-blue-400 border border-blue-800 px-2 py-0.5 rounded-full">
                    {topic.level}
                  </span>
                </div>
              </div>
              <div className="p-6 flex gap-6" style={{ overflow: "visible" }}>
                {subtopic.vocabulary?.length > 0 && (
                  <div className="shrink-0 w-36">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Словник</p>
                    <div className="flex flex-col gap-1">
                      {subtopic.vocabulary.map((item, i) => {
                        const w = typeof item === "string" ? item : item.word
                        return (
                          <button
                            key={i}
                            onClick={() => navigate(`/dictionary/${w}`)}
                            className="text-left text-sm text-gray-400 px-2 py-1.5 rounded-lg transition-all duration-150 group hover:bg-gray-800"
                          >
                            <span className="group-hover:text-blue-300 transition-colors">{w}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
                <div className="flex-1 min-w-0" style={{ overflow: "visible" }}>
                  <WordPopover text={subtopic.text} />
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-800 flex justify-end">
                <button
                  onClick={() => goStage(STAGES.QUIZ)}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg text-sm transition-colors flex items-center gap-2"
                >
                  Далі: вправи →
                </button>
              </div>
            </div>
          )}

          {/* ── СТАДІЯ 2: ВПРАВИ ── */}
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

                    <textarea
                      value={answers[quizIndex] || ""}
                      onChange={e => setAnswers(prev => ({ ...prev, [quizIndex]: e.target.value }))}
                      placeholder="Введи відповідь норвезькою..."
                      disabled={revealed[quizIndex]}
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-blue-500 resize-none min-h-[80px] disabled:opacity-60 transition-colors"
                    />

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
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Fokuser på</p>
              <div className="flex flex-wrap gap-2">
                {subtopic.vocabulary?.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => navigate(`/dictionary/${typeof item === "string" ? item : item.word}`)}
                    className="text-xs text-gray-400 bg-gray-800 hover:bg-gray-700 border border-gray-700 px-3 py-1 rounded-full transition-colors"
                  >
                    {typeof item === "string" ? item : item.word}
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
