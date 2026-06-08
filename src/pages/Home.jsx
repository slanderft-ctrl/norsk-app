import TopicCard from "../components/TopicCard"
import { useNavigate } from "react-router-dom"
import { topics } from "../data/topics"
import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase"
import { useAuth } from "../context/AuthContext"
import { syncUserStreak } from "../lib/streak"

function StatCard({ icon, label, value, color }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-lg font-semibold text-gray-900">{value}</p>
        <p className="text-xs text-gray-400">{label}</p>
      </div>
    </div>
  )
}

function QuickCard({ icon, title, subtitle, onClick, color }) {
  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-xl p-4 cursor-pointer hover:border-teal-300 hover:shadow-sm transition-all group"
    >
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg mb-3 ${color}`}>
        {icon}
      </div>
      <p className="text-sm font-medium text-gray-900 group-hover:text-teal-700 transition-colors">{title}</p>
      <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
    </div>
  )
}

function Home() {
  const navigate = useNavigate()

  const { user } = useAuth()
const [myWords, setMyWords] = useState([])
const [profile, setProfile] = useState(null)

useEffect(() => {
  if (!user) return

  // Слова
  supabase.from("my_words").select("id").eq("user_id", user.id)
    .then(({ data }) => setMyWords(data ?? []))

  syncUserStreak(user.id).then(data => setProfile(data))
}, [user])
 
  const doneTopic = topics.filter(t => t.status === "done").length
  const totalTopics = topics.length

  return (
    <main className="flex-1 p-6 bg-[#F8F7F4]">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">

        {/* Привітання */}
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Доброго дня! 👋</h1>
          <p className="text-sm text-gray-500 mt-1">Продовжуй вчити норвезьку — ти на правильному шляху.</p>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard icon="🔥" label="Днів поспіль" value={profile?.streak ?? 0} color="bg-orange-50" />
          <StatCard icon="📘" label="Слів у словнику" value={myWords.length} color="bg-blue-50" />
          <StatCard icon="✅" label="Тем завершено" value={`${doneTopic}/${totalTopics}`} color="bg-teal-50" />
        </div>

        {/* Основний контент */}
        <div className="grid grid-cols-3 gap-5">

          {/* Поточна тема */}
          <div className="col-span-2">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-3 font-medium">Поточна тема</p>
            <TopicCard />
          </div>

          {/* Швидкий доступ */}
          <div className="col-span-1 flex flex-col gap-3">
            <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">Швидкий доступ</p>
            <QuickCard
              icon="📖"
              title="Словник"
              subtitle="Пошук норвезьких слів"
              onClick={() => navigate("/dictionary")}
              color="bg-blue-50"
            />
            <QuickCard
              icon="⭐"
              title="Мій словник"
              subtitle={`${myWords.length} збережених слів`}
              onClick={() => navigate("/my-words")}
              color="bg-amber-50"
            />
            <QuickCard
              icon="✦"
              title="AI-асистент"
              subtitle="Запитай про граматику"
              onClick={() => navigate("/topic/1/1.1")}
              color="bg-purple-50"
            />
          </div>
        </div>

        {/* Всі теми */}
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-3 font-medium">Всі теми</p>
          <div className="grid grid-cols-3 gap-3">
            {topics.map((topic, idx) => {
              const done = topic.status === "done"
              const active = topic.status === "active"
              const locked = topic.status === "locked"
              return (
                <button
                  key={topic.id}
                  onClick={() => {
                    if (locked) return
                    navigate(`/topic/${topic.id}/${topic.subtopics[0].id}`)
                  }}
                  disabled={locked}
                  className={`bg-white border rounded-xl p-4 text-left transition-all
                    ${active ? "border-teal-300 ring-1 ring-teal-200" : "border-gray-200"}
                    ${locked ? "opacity-50 cursor-not-allowed" : "hover:border-teal-300 hover:shadow-sm cursor-pointer"}
                  `}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium
                      ${done ? "bg-teal-100 text-teal-700" : active ? "bg-teal-700 text-white" : "bg-gray-100 text-gray-400"}
                    `}>
                      {done ? "✓" : active ? "▶" : idx + 1}
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                      ${topic.level === "A1" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}
                    `}>
                      {topic.level}
                    </span>
                  </div>
                  <p className={`text-sm font-medium truncate ${active ? "text-teal-800" : "text-gray-700"}`}>
                    {topic.title}
                  </p>
                  <p className="text-xs text-gray-400 truncate mt-0.5">{topic.titleUa}</p>
                </button>
              )
            })}
          </div>
        </div>

      </div>
    </main>
  )
}

export default Home
