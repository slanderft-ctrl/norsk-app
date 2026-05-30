import { useNavigate } from "react-router-dom"
import { topics } from "../data/topics"

const STAGES = { READ: "read", GRAMMAR: "grammar", QUIZ: "quiz" }

function TopicCard() {
  const navigate = useNavigate()

  // Яка тема/підтема активна
  const savedProgress = JSON.parse(localStorage.getItem("topicProgress") || "null")
  const topic = savedProgress
    ? (topics.find(t => t.id === savedProgress.topicId) || topics.find(t => t.status === "active") || topics[0])
    : (topics.find(t => t.status === "active") || topics[0])

  const firstSubtopic = topic?.subtopics?.[0]
  const targetSubtopicId = savedProgress?.subtopicId || firstSubtopic?.id
  const hasProgress = !!savedProgress

  // Читаємо поточний етап підтеми
  const progressKey = `linguai_progress_${topic?.id}_${targetSubtopicId}`
  const subtopicProgress = JSON.parse(localStorage.getItem(progressKey) || "{}")
  const currentStage = subtopicProgress.stage || STAGES.READ

  const currentSubtopicIdx = hasProgress
    ? (topic?.subtopics.findIndex(s => s.id === targetSubtopicId) || 0)
    : 0
  const progressPercent = topic
    ? Math.round((currentSubtopicIdx / topic.subtopics.length) * 100)
    : 0

  // Динамічні кроки на основі поточного етапу
  const subtopic = topic?.subtopics?.[currentSubtopicIdx]
  const hasGrammar = !!subtopic?.grammar

  const steps = [
    {
      id: 1,
      icon: "📖",
      name: "Читання",
      done: currentStage === STAGES.GRAMMAR || currentStage === STAGES.QUIZ,
      active: currentStage === STAGES.READ,
    },
    // Граматика — тільки якщо є поле grammar у підтемі
    ...(hasGrammar ? [{
      id: 2,
      icon: "📐",
      name: "Граматика",
      done: currentStage === STAGES.QUIZ,
      active: currentStage === STAGES.GRAMMAR,
    }] : []),
    {
      id: 3,
      icon: "✏️",
      name: "Вправи",
      done: false,
      active: currentStage === STAGES.QUIZ,
    },
  ]

  function handleStart() {
    if (topic && targetSubtopicId) {
      navigate(`/topic/${topic.id}/${targetSubtopicId}`)
    }
  }

  // Лейбл кнопки залежно від етапу
  const buttonLabel = {
    [STAGES.READ]: hasProgress ? "▶ Продовжити читання" : "▶ Почати тему",
    [STAGES.GRAMMAR]: "▶ Продовжити граматику",
    [STAGES.QUIZ]: "▶ Продовжити вправи",
  }[currentStage] || "▶ Почати тему"

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">

      {/* Top-bar прогрес */}
      <div className="h-1.5 bg-gray-100">
        <div
          className="h-1.5 bg-teal-500 rounded-r-full transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="p-5">

        {/* Заголовок */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-50 border border-teal-100 rounded-xl flex items-center justify-center text-xl">
              📚
            </div>
            <div>
              <h2 className="text-gray-900 font-semibold text-base">{topic?.title}</h2>
              <p className="text-xs text-gray-400">{topic?.titleUa}</p>
            </div>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full font-medium
            ${topic?.level === "A1" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}
          `}>
            {topic?.level}
          </span>
        </div>

        {/* Прогрес-бар */}
        <div className="flex items-center gap-2 mb-5">
          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-2 bg-teal-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-xs text-gray-400 shrink-0 w-8 text-right">{progressPercent}%</span>
        </div>

        {/* Підтема */}
        <div className="bg-gray-50 rounded-xl px-4 py-3 mb-4 flex items-center gap-3">
          <span className="text-gray-400 text-xs">Підтема</span>
          <span className="text-gray-900 text-sm font-medium">
            {currentSubtopicIdx + 1} / {topic?.subtopics.length}
          </span>
          <span className="text-gray-500 text-sm truncate">
            — {subtopic?.title}
          </span>
        </div>

        {/* Кроки */}
        <div className="flex items-center gap-2 mb-5">
          {steps.map((step, i) => (
            <div key={step.id} className="flex items-center gap-2 flex-1">
              <div className={`flex items-center gap-2 flex-1 px-3 py-2 rounded-xl border text-xs font-medium transition-colors
                ${step.done
                  ? "bg-teal-50 border-teal-200 text-teal-700"
                  : step.active
                  ? "bg-white border-teal-400 text-teal-800 shadow-sm"
                  : "bg-gray-50 border-gray-200 text-gray-400"
                }
              `}>
                <span>{step.icon}</span>
                <span className="truncate">{step.name}</span>
                {step.done && <span className="ml-auto text-teal-500">✓</span>}
              </div>
              {i < steps.length - 1 && (
                <div className={`w-4 h-0.5 shrink-0 ${step.done ? "bg-teal-300" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Кнопка */}
        <button
          onClick={handleStart}
          className="w-full bg-teal-700 hover:bg-teal-600 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
        >
          {buttonLabel}
        </button>

      </div>
    </div>
  )
}

export default TopicCard