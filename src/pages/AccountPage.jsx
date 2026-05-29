import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
// import { supabase } from "../lib/supabase"

const LEVELS = ["A1", "A2", "B1"]

export default function AccountPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState({ words: 0, notes: 0, streak: 0, level: "—" })
  const [targetLevel, setTargetLevel] = useState("A2")

  useEffect(() => {
    // ─── SUPABASE (наступний крок) ───
    // const { data: { user } } = await supabase.auth.getUser()
    // const { data: profile } = await supabase.from("profiles").select().eq("id", user.id).single()
    // setUser(profile)

    // ─── ТИМЧАСОВО ───
    const saved = JSON.parse(localStorage.getItem("linguaiUser") || "null")
    if (!saved) { navigate("/auth"); return }
    setUser(saved)

    const myWords = JSON.parse(localStorage.getItem("myWords") || "[]")
    const testResult = JSON.parse(localStorage.getItem("lastTestResult") || "null")
    setStats({
      words: myWords.length,
      notes: myWords.filter(w => w.note).length,
      streak: saved.streak || 0,
      level: testResult?.level || "—",
    })
    if (saved.targetLevel) setTargetLevel(saved.targetLevel)
  }, [])

  function logout() {
    // await supabase.auth.signOut()
    localStorage.removeItem("linguaiUser")
    navigate("/auth")
  }

  function saveTargetLevel(lvl) {
    setTargetLevel(lvl)
    const updated = { ...user, targetLevel: lvl }
    localStorage.setItem("linguaiUser", JSON.stringify(updated))
    setUser(updated)
    // await supabase.from("profiles").update({ target_level: lvl }).eq("id", user.id)
  }

  if (!user) return null

  const initials = (user.name || user.email || "?").slice(0, 2).toUpperCase()

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
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ fontSize: "20px", fontWeight: 700, color: "#111827", marginBottom: "2px" }}>{user.name}</h1>
            <p style={{ fontSize: "13px", color: "#9CA3AF" }}>{user.email}</p>
          </div>
        </div>

        {/* Stats grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px", marginBottom: "16px" }}>
          {[
            { label: "Серія днів", value: stats.streak, icon: "🔥" },
            { label: "Слів у словнику", value: stats.words, icon: "📚" },
            { label: "З нотатками", value: stats.notes, icon: "📝" },
            { label: "Рівень CEFR", value: stats.level, icon: "🎯" },
          ].map(s => (
            <div key={s.label} style={{ background: "#fff", border: "0.5px solid #E5E7EB", borderRadius: "14px", padding: "16px 12px", textAlign: "center" }}>
              <div style={{ fontSize: "18px", marginBottom: "4px" }}>{s.icon}</div>
              <div style={{ fontSize: "22px", fontWeight: 700, color: "#0F6E56", marginBottom: "2px" }}>{s.value}</div>
              <div style={{ fontSize: "11px", color: "#9CA3AF" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Target level */}
        <div style={{ background: "#fff", border: "0.5px solid #E5E7EB", borderRadius: "16px", padding: "20px 24px", marginBottom: "16px" }}>
          <p style={{ fontSize: "12px", fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: "12px" }}>Ціль навчання</p>
          <div style={{ display: "flex", gap: "8px" }}>
            {LEVELS.map(lvl => (
              <button
                key={lvl}
                onClick={() => saveTargetLevel(lvl)}
                style={{
                  flex: 1, padding: "12px", borderRadius: "12px", cursor: "pointer", fontFamily: "inherit",
                  fontSize: "15px", fontWeight: 600, transition: "all .12s",
                  border: `1.5px solid ${targetLevel === lvl ? "#0F6E56" : "#E5E7EB"}`,
                  background: targetLevel === lvl ? "#E1F5EE" : "#F8F7F4",
                  color: targetLevel === lvl ? "#0F6E56" : "#6B7280",
                }}
              >{lvl}</button>
            ))}
          </div>
          <p style={{ fontSize: "12px", color: "#9CA3AF", marginTop: "10px" }}>
            Рівень для підготовки до norskprøve
          </p>
        </div>

        {/* Actions */}
        <div style={{ background: "#fff", border: "0.5px solid #E5E7EB", borderRadius: "16px", overflow: "hidden", marginBottom: "16px" }}>
          {[
            { label: "Пройти тест рівня", icon: "📊", action: () => navigate("/level-test") },
            { label: "Мій словник", icon: "📖", action: () => navigate("/dictionary") },
          ].map((item, i) => (
            <button
              key={item.label}
              onClick={item.action}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: "12px", padding: "16px 20px",
                background: "transparent", border: "none", borderBottom: i === 0 ? "0.5px solid #F3F4F6" : "none",
                cursor: "pointer", fontFamily: "inherit", fontSize: "14px", color: "#374151", textAlign: "left",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "#F8F7F4"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <span style={{ fontSize: "16px" }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              <span style={{ color: "#D1D5DB" }}>→</span>
            </button>
          ))}
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          style={{
            width: "100%", padding: "13px", borderRadius: "12px", cursor: "pointer", fontFamily: "inherit",
            background: "#fff", border: "0.5px solid #FECACA", color: "#DC2626", fontSize: "14px", fontWeight: 500,
          }}
        >
          Вийти з акаунту
        </button>
      </div>
    </main>
  )
}
