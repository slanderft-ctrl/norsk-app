import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"

const LEVELS = ["A1", "A2", "B1"]

export default function AccountPage() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [stats, setStats] = useState({ words: 0, notes: 0, topics: 0 })
  const [lastTest, setLastTest] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { navigate("/auth"); return }

    // Паралельно вантажимо все
    const [profileRes, wordsRes, progressRes, testRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).single(),
      supabase.from("my_words").select("id, note").eq("user_id", user.id),
      supabase.from("topic_progress").select("id").eq("user_id", user.id).eq("completed", true),
      supabase.from("test_results").select("cefr_level, theta, correct, total, taken_at")
        .eq("user_id", user.id).order("taken_at", { ascending: false }).limit(1),
    ])

    setProfile(profileRes.data)
    setStats({
      words: wordsRes.data?.length ?? 0,
      notes: wordsRes.data?.filter(w => w.note).length ?? 0,
      topics: progressRes.data?.length ?? 0,
    })
    setLastTest(testRes.data?.[0] ?? null)
    setLoading(false)
  }

  async function updateTargetLevel(lvl) {
    setProfile(p => ({ ...p, target_level: lvl }))
    await supabase.from("profiles").update({ target_level: lvl }).eq("id", profile.id)
  }

  async function logout() {
    await supabase.auth.signOut()
    navigate("/auth")
  }

  if (loading) return (
    <main style={{ flex: 1, background: "#F8F7F4", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: "32px", height: "32px", border: "3px solid #E5E7EB", borderTopColor: "#0F6E56", borderRadius: "50%", animation: "spin .7s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </main>
  )

  if (!profile) return null

  const initials = (profile.name || "?").slice(0, 2).toUpperCase()
  const pct = lastTest ? Math.round((lastTest.correct / lastTest.total) * 100) : null

  return (
    <main style={{ flex: 1, minHeight: "100vh", background: "#F8F7F4", padding: "24px 32px" }}>
      <div style={{ maxWidth: "640px", margin: "0 auto" }}>

        <button onClick={() => navigate("/")} style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", fontSize: "13px", marginBottom: "20px", padding: 0 }}>
          ← На головну
        </button>

        {/* Profile header */}
        <div style={{ background: "#fff", border: "0.5px solid #E5E7EB", borderRadius: "20px", padding: "28px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "18px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "20px", background: "#0F6E56", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", fontWeight: 700, flexShrink: 0 }}>
            {initials}
          </div>
          <div>
            <h1 style={{ fontSize: "20px", fontWeight: 700, color: "#111827", marginBottom: "2px" }}>{profile.name}</h1>
            <p style={{ fontSize: "13px", color: "#9CA3AF" }}>
              З нами з {new Date(profile.created_at).toLocaleDateString("uk-UA", { month: "long", year: "numeric" })}
            </p>
          </div>
        </div>

        {/* Stats grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px", marginBottom: "16px" }}>
          {[
            { label: "Серія днів",   value: profile.streak ?? 0, icon: "🔥" },
            { label: "Слів",         value: stats.words,          icon: "📚" },
            { label: "Тем пройдено", value: stats.topics,         icon: "✅" },
            { label: "Рівень CEFR",  value: lastTest?.cefr_level ?? "—", icon: "🎯" },
          ].map(s => (
            <div key={s.label} style={{ background: "#fff", border: "0.5px solid #E5E7EB", borderRadius: "14px", padding: "16px 12px", textAlign: "center" }}>
              <div style={{ fontSize: "18px", marginBottom: "4px" }}>{s.icon}</div>
              <div style={{ fontSize: "22px", fontWeight: 700, color: "#0F6E56", marginBottom: "2px" }}>{s.value}</div>
              <div style={{ fontSize: "11px", color: "#9CA3AF" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Last test result */}
        {lastTest && (
          <div style={{ background: "#fff", border: "0.5px solid #E5E7EB", borderRadius: "16px", padding: "20px 24px", marginBottom: "16px" }}>
            <p style={{ fontSize: "12px", fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: "12px" }}>
              Останній тест рівня
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{ fontSize: "32px", fontWeight: 800, color: "#0F6E56" }}>{lastTest.cefr_level}</div>
              <div>
                <p style={{ fontSize: "14px", color: "#374151", fontWeight: 500 }}>
                  {lastTest.correct} з {lastTest.total} правильно · {pct}%
                </p>
                <p style={{ fontSize: "12px", color: "#9CA3AF" }}>
                  {new Date(lastTest.taken_at).toLocaleDateString("uk-UA")}
                </p>
              </div>
              <button onClick={() => navigate("/level-test")}
                style={{ marginLeft: "auto", background: "#F8F7F4", border: "0.5px solid #E5E7EB", borderRadius: "10px", padding: "8px 14px", fontSize: "12px", color: "#374151", cursor: "pointer", fontFamily: "inherit" }}>
                Пройти знову
              </button>
            </div>
          </div>
        )}

        {/* Target level */}
        <div style={{ background: "#fff", border: "0.5px solid #E5E7EB", borderRadius: "16px", padding: "20px 24px", marginBottom: "16px" }}>
          <p style={{ fontSize: "12px", fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: "12px" }}>
            Ціль навчання
          </p>
          <div style={{ display: "flex", gap: "8px" }}>
            {LEVELS.map(lvl => (
              <button key={lvl} onClick={() => updateTargetLevel(lvl)} style={{
                flex: 1, padding: "12px", borderRadius: "12px", cursor: "pointer", fontFamily: "inherit",
                fontSize: "15px", fontWeight: 600, transition: "all .12s",
                border: `1.5px solid ${profile.target_level === lvl ? "#0F6E56" : "#E5E7EB"}`,
                background: profile.target_level === lvl ? "#E1F5EE" : "#F8F7F4",
                color: profile.target_level === lvl ? "#0F6E56" : "#6B7280",
              }}>{lvl}</button>
            ))}
          </div>
          <p style={{ fontSize: "12px", color: "#9CA3AF", marginTop: "10px" }}>Цільовий рівень для norskprøve</p>
        </div>

        {/* Quick actions */}
        <div style={{ background: "#fff", border: "0.5px solid #E5E7EB", borderRadius: "16px", overflow: "hidden", marginBottom: "16px" }}>
          {[
            { label: "Мій словник", icon: "📖", sub: `${stats.words} слів`, action: () => navigate("/dictionary") },
            { label: "Тест рівня", icon: "📊", sub: lastTest ? `Останній: ${lastTest.cefr_level}` : "Ще не проходив", action: () => navigate("/level-test") },
          ].map((item, i) => (
            <button key={item.label} onClick={item.action} style={{
              width: "100%", display: "flex", alignItems: "center", gap: "12px", padding: "15px 20px",
              background: "transparent", border: "none", borderBottom: i === 0 ? "0.5px solid #F3F4F6" : "none",
              cursor: "pointer", fontFamily: "inherit", textAlign: "left",
            }}
              onMouseEnter={e => e.currentTarget.style.background = "#F8F7F4"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <span style={{ fontSize: "16px" }}>{item.icon}</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "14px", color: "#374151", fontWeight: 500, margin: 0 }}>{item.label}</p>
                <p style={{ fontSize: "12px", color: "#9CA3AF", margin: 0 }}>{item.sub}</p>
              </div>
              <span style={{ color: "#D1D5DB" }}>→</span>
            </button>
          ))}
        </div>

        {/* Logout */}
        <button onClick={logout} style={{
          width: "100%", padding: "13px", borderRadius: "12px", cursor: "pointer", fontFamily: "inherit",
          background: "#fff", border: "0.5px solid #FECACA", color: "#DC2626", fontSize: "14px", fontWeight: 500,
        }}>
          Вийти з акаунту
        </button>

      </div>
    </main>
  )
}
