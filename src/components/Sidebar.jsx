const topics = [
  { id: 1, name: "Presentasjon", status: "done" },
  { id: 2, name: "Familie og hjem", status: "active" },
  { id: 3, name: "Mat og drikke", status: "locked" },
  { id: 4, name: "Jobb og skole", status: "locked" },
  { id: 5, name: "By og transport", status: "locked" },
  { id: 6, name: "Natur og vær", status: "locked" },
  { id: 7, name: "Fritid og hobby", status: "locked" },
]

function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-10"
          onClick={onClose}
        />
      )}

      <div className={`fixed top-0 left-0 h-full w-64 bg-gray-900 border-r border-gray-800 z-20 transition-transform duration-200 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-4 border-b border-gray-800">
          <span className="text-xs text-gray-400 uppercase tracking-wider">Всі теми</span>
        </div>

        <div className="flex flex-col py-2">
          {topics.map(topic => (
            <div
              key={topic.id}
              className={`flex items-center gap-3 px-4 py-3 ${topic.status === "locked" ? "opacity-40" : "hover:bg-gray-800 cursor-pointer"}`}
            >
              <span className={`text-sm ${topic.status === "done" ? "text-green-400" : topic.status === "active" ? "text-blue-400" : "text-gray-500"}`}>
                {topic.status === "done" ? "✓" : topic.status === "active" ? "▶" : "○"}
              </span>
              <span className={`text-sm ${topic.status === "active" ? "text-white font-medium" : "text-gray-300"}`}>
                {topic.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default Sidebar