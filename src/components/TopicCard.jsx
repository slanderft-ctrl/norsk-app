import { useNavigate } from "react-router-dom"
import { topics } from "../data/topics"

function TopicCard() {
  const navigate = useNavigate()

  const savedProgress = JSON.parse(localStorage.getItem("topicProgress") || "null")
  const topic = savedProgress
    ? (topics.find(t => t.id === savedProgress.topicId) || topics.find(t => t.status === "active") || topics[0])
    : (topics.find(t => t.status === "active") || topics[0])
  const firstSubtopic = topic?.subtopics?.[0]
  const targetSubtopicId = savedProgress?.subtopicId || firstSubtopic?.id
  const hasProgress = !!savedProgress

  const currentSubtopicIdx = hasProgress
    ? topic?.subtopics.findIndex(s => s.id === targetSubtopicId)
    : 0
  const progressPercent = topic
    ? Math.round((currentSubtopicIdx / topic.subtopics.length) * 100)
    : 0

  const steps = [
    { id: 1, name: "Читання тексту",    status: "active" },
    { id: 2, name: "Аудіювання",        status: "locked" },
    { id: 3, name: "Питання до тексту", status: "locked" },
    { id: 4, name: "Лексичні вправи",   status: "locked" },
  ]

  function handleStart() {
    if (topic && targetSubtopicId) {
      navigate(`/topic/${topic.id}/${targetSubtopicId}`)
    }
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-white font-medium text-lg">{topic?.title}</h2>
          <p className="text-xs text-gray-500">{topic?.titleUa}</p>
        </div>
        <span className="text-xs bg-blue-950 text-blue-400 border border-blue-800 px-2 py-1 rounded-full">
          {topic?.level}
        </span>
      </div>

      <div className="h-1.5 bg-gray-800 rounded-full mb-5">
        <div className="h-1.5 bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
      </div>

      <div className="flex flex-col gap-2 mb-5">
        {steps.map(step => (
          <div
            key={step.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
              step.status === "done"   ? "bg-green-950 text-green-400" :
              step.status === "active" ? "bg-blue-950 border border-blue-700 text-blue-300" :
              "bg-gray-800 text-gray-600"
            }`}
          >
            <span className="text-sm">
              {step.status === "done" ? "✓" : step.status === "active" ? "▶" : "○"}
            </span>
            <span className="text-sm font-medium">{step.name}</span>
          </div>
        ))}
      </div>

      <button
        onClick={handleStart}
        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 rounded-lg transition-colors"
      >
        {hasProgress ? "Продовжити тему →" : "Почати тему →"}
      </button>
    </div>
  )
}

export default TopicCard