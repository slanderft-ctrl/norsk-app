const steps = [
  { id: 1, name: "Читання тексту", status: "done" },
  { id: 2, name: "Питання до тексту", status: "done" },
  { id: 3, name: "Аудіювання", status: "active" },
  { id: 4, name: "Лексичні вправи", status: "locked" },
]

function TopicCard() {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">

      <div className="flex items-center justify-between mb-3">
        <h2 className="text-white font-medium text-lg">Familie og hjem</h2>
        <span className="text-xs bg-green-900 text-green-400 px-2 py-1 rounded-full">
          60% виконано
        </span>
      </div>

      <div className="h-1.5 bg-gray-800 rounded-full mb-5">
        <div className="h-1.5 bg-green-500 rounded-full w-[60%]" />
      </div>

      <div className="flex flex-col gap-2 mb-5">
        {steps.map(step => (
          <div
            key={step.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
              step.status === "done" ? "bg-green-950 text-green-400" :
              step.status === "active" ? "bg-blue-950 border-2 border-blue-500 text-blue-300" :
              "bg-gray-800 text-gray-500"
            }`}
          >
            <span className="text-sm">
              {step.status === "done" ? "✓" : step.status === "active" ? "▶" : "○"}
            </span>
            <span className="text-sm font-medium">{step.name}</span>
          </div>
        ))}
      </div>

      <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 rounded-lg transition-colors">
        Продовжити тему
      </button>

    </div>
  )
}

export default TopicCard