import { useNavigate } from "react-router-dom"
import { topics } from "../data/topics"

function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate()

  function handleTopic(topic) {
    if (topic.status === "locked") return
    const first = topic.subtopics?.[0]
    if (first) {
      navigate(`/topic/${topic.id}/${first.id}`)
      onClose()
    }
  }

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/20 z-10" onClick={onClose} />
      )}

      <div className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-20 transition-transform duration-200 flex flex-col ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>

        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-teal-700 rounded-md flex items-center justify-center">
              <span className="text-white text-xs leading-none">✦</span>
            </div>
            <span className="text-gray-900 font-semibold text-sm">LinguAI</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg leading-none">✕</button>
        </div>

        {/* Nav links */}
        <div className="px-3 py-3 border-b border-gray-100">
          <button
            onClick={() => { navigate("/dictionary"); onClose() }}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <span className="text-base">📘</span> Словник
          </button>
          <button
            onClick={() => { navigate("/my-words"); onClose() }}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <span className="text-base">⭐</span> Мій словник
          </button>
        </div>

        {/* Topics list */}
        <div className="flex-1 overflow-y-auto px-3 py-3">
          <p className="text-xs text-gray-400 uppercase tracking-wider px-2 mb-3">Теми</p>
          <div className="flex flex-col gap-1">
            {topics.map((topic, idx) => {
              const done = topic.status === "done"
              const active = topic.status === "active"
              const locked = topic.status === "locked"
              return (
                <button
                  key={topic.id}
                  onClick={() => handleTopic(topic)}
                  disabled={locked}
                  className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-left transition-colors
                    ${active ? "bg-teal-50 border border-teal-200" : ""}
                    ${done ? "hover:bg-gray-100" : ""}
                    ${locked ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
                  `}
                >
                  {/* Status icon */}
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0
                    ${done ? "bg-teal-100 text-teal-700" : ""}
                    ${active ? "bg-teal-700 text-white" : ""}
                    ${locked ? "bg-gray-100 text-gray-400" : ""}
                  `}>
                    {done ? "✓" : active ? "▶" : idx + 1}
                  </div>

                  {/* Topic name */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm truncate ${active ? "text-teal-800 font-medium" : done ? "text-gray-700" : "text-gray-500"}`}>
                      {topic.title}
                    </p>
                    <p className="text-xs text-gray-400 truncate">{topic.titleUa}</p>
                  </div>

                  {/* Level badge */}
                  <span className={`text-xs px-1.5 py-0.5 rounded shrink-0
                    ${topic.level === "A1" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}
                  `}>
                    {topic.level}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>✦</span>
            <span>LinguAI · A1–B1 Norsk</span>
          </div>
        </div>

      </div>
    </>
  )
}

export default Sidebar
