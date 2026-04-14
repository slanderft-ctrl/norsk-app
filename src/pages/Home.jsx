import TopicCard from "../components/TopicCard"
import { useNavigate } from "react-router-dom"

function Home() {
  const navigate = useNavigate()
  return (
    <main className="flex-1 p-6">
      <div className="max-w-5xl mx-auto grid grid-cols-3 gap-5">

        <div className="col-span-2">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Сьогоднішня тема</p>
          <TopicCard />
        </div>

        <div className="col-span-1 flex flex-col gap-4 self-start">
  <p className="text-xs text-gray-500 uppercase tracking-wider">Швидкий доступ</p>
  <div
    onClick={() => navigate("/dictionary")}
    className="bg-gray-900 border border-gray-800 rounded-xl p-4 cursor-pointer hover:border-gray-600 transition-colors"
  >
    <p className="text-white font-medium mb-1">Словник</p>
    <p className="text-xs text-gray-400">1 240 слів · 18 тем</p>
  </div>
  <div
    onClick={() => navigate("/listening")}
    className="bg-gray-900 border border-gray-800 rounded-xl p-4 cursor-pointer hover:border-gray-600 transition-colors"
  >
    <p className="text-white font-medium mb-1">Аудіювання</p>
    <p className="text-xs text-gray-400">Всі теми</p>
  </div>
</div>

      </div>
    </main>
  )
}

export default Home