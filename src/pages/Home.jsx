import TopicCard from "../components/TopicCard"
import { useNavigate } from "react-router-dom"
import { topics } from "../data/topics"
import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase"
import { useAuth } from "../context/AuthContext"
import { syncUserStreak } from "../lib/streak"

function StatCard({ icon, label, value, color, hoverText, onClick }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3 transition-all duration-200
        ${onClick ? "cursor-pointer hover:border-teal-300 hover:shadow-sm" : ""}
        ${hovered && hoverText ? "bg-teal-50 border-teal-200" : ""}
      `}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${color}`}>
        {icon}
      </div>
      <div className="min-w-0">
        {hovered && hoverText ? (
          <p className="text-sm font-medium text-teal-700 leading-tight">{hoverText}</p>
        ) : (
          <>
            <p className="text-lg font-semibold text-gray-900">{value}</p>
            <p className="text-xs text-gray-400">{label}</p>
          </>
        )}
      </div>
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

  supabase.from("my_words").select("id").eq("user_id", user.id)
    .then(({ data }) => setMyWords(data ?? []))

  syncUserStreak(user.id).then(data => setProfile(data))
}, [user])
 
  return (
    <main className="flex-1 p-6 bg-[#F8F7F4]">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">

        <div>
          <h1 className="text-xl font-semibold text-gray-900">Доброго дня! 👋</h1>
          <p className="text-sm text-gray-500 mt-1">Продовжуй вчити норвезьку — ти на правильному шляху.</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <StatCard
            icon="🔥"
            label="Днів поспіль"
            value={profile?.streak ?? 0}
            color="bg-orange-50"
            hoverText="Регулярність — запорука успіху"
          />
          <StatCard
            icon="📘"
            label="Слів у словнику"
            value={myWords.length}
            color="bg-blue-50"
            hoverText="Перейти до словника"
            onClick={() => navigate("/dictionary")}
          />
        </div>

        <div className="grid grid-cols-3 gap-5">

          <div className="col-span-2">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-3 font-medium">Поточна тема</p>
            <TopicCard />
          </div>

          <div className="col-span-1 flex flex-col gap-3">
            <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">Всі теми</p>
            <div className="flex flex-col gap-2">
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
                    className={`bg-white border rounded-xl p-3 text-left transition-all
                      ${active ? "border-teal-300 ring-1 ring-teal-200" : "border-gray-200"}
                      ${locked ? "opacity-50 cursor-not-allowed" : "hover:border-teal-300 hover:shadow-sm cursor-pointer"}
                    `}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0
                        ${done ? "bg-teal-100 text-teal-700" : active ? "bg-teal-700 text-white" : "bg-gray-100 text-gray-400"}
                      `}>
                        {done ? "✓" : active ? "▶" : idx + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={`text-xs font-medium truncate ${active ? "text-teal-800" : "text-gray-700"}`}>
                          {topic.title}
                        </p>
                        <p className="text-xs text-gray-400 truncate">{topic.titleUa}</p>
                      </div>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium flex-shrink-0
                        ${topic.level === "A1" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}
                      `}>
                        {topic.level}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

      </div>
    </main>
  )
}

export default Home
