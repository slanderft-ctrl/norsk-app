import { useState } from "react"
import { useNavigate } from "react-router-dom"
// import { supabase } from "../lib/supabase"  // ← підключиш наступним кроком

export default function AuthPage() {
  const navigate = useNavigate()
  const [mode, setMode] = useState("login") // login | signup
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const isLogin = mode === "login"

  async function handleSubmit() {
    setError("")
    if (!email.trim() || !password.trim()) {
      setError("Заповни email і пароль")
      return
    }
    if (!isLogin && !name.trim()) {
      setError("Введи ім'я")
      return
    }
    if (password.length < 6) {
      setError("Пароль має містити щонайменше 6 символів")
      return
    }

    setLoading(true)
    try {
      // ─── SUPABASE: розкоментуєш наступним кроком ───
      //
      // if (isLogin) {
      //   const { error } = await supabase.auth.signInWithPassword({ email, password })
      //   if (error) throw error
      // } else {
      //   const { data, error } = await supabase.auth.signUp({ email, password })
      //   if (error) throw error
      //   // створити запис у profiles
      //   await supabase.from("profiles").insert({
      //     id: data.user.id,
      //     name,
      //     target_level: "A2",
      //     streak: 0,
      //     created_at: new Date().toISOString(),
      //   })
      // }
      // navigate("/")

      // ─── ТИМЧАСОВО (поки немає Supabase): зберігаємо в localStorage ───
      const fakeUser = { email, name: name || email.split("@")[0], id: Date.now() }
      localStorage.setItem("linguaiUser", JSON.stringify(fakeUser))
      await new Promise(r => setTimeout(r, 600))
      navigate("/")

    } catch (err) {
      setError(err.message || "Сталася помилка. Спробуй ще раз.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ minHeight: "100vh", background: "#F8F7F4", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ width: "100%", maxWidth: "420px" }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
            <span style={{ fontSize: "22px" }}>✦</span>
            <span style={{ fontSize: "22px", fontWeight: 700, color: "#111827" }}>
              Lingu<span style={{ color: "#0F6E56" }}>AI</span>
            </span>
          </div>
          <p style={{ fontSize: "13px", color: "#9CA3AF" }}>Вивчай норвезьку з AI</p>
        </div>

        {/* Card */}
        <div style={{ background: "#fff", border: "0.5px solid #E5E7EB", borderRadius: "20px", padding: "28px", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>

          {/* Tabs */}
          <div style={{ display: "flex", gap: "4px", background: "#F3F4F6", borderRadius: "12px", padding: "4px", marginBottom: "24px" }}>
            {[["login","Вхід"],["signup","Реєстрація"]].map(([m, label]) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError("") }}
                style={{
                  flex: 1, padding: "9px", borderRadius: "9px", border: "none", cursor: "pointer",
                  fontSize: "14px", fontWeight: 600, fontFamily: "inherit", transition: "all .15s",
                  background: mode === m ? "#fff" : "transparent",
                  color: mode === m ? "#0F6E56" : "#9CA3AF",
                  boxShadow: mode === m ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                }}
              >{label}</button>
            ))}
          </div>

          {/* Name (signup only) */}
          {!isLogin && (
            <div style={{ marginBottom: "14px" }}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 500, color: "#6B7280", marginBottom: "6px" }}>Ім'я</label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Як до тебе звертатися?"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = "#0F6E56"}
                onBlur={e => e.target.style.borderColor = "#E5E7EB"}
              />
            </div>
          )}

          {/* Email */}
          <div style={{ marginBottom: "14px" }}>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 500, color: "#6B7280", marginBottom: "6px" }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="din@epost.no"
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = "#0F6E56"}
              onBlur={e => e.target.style.borderColor = "#E5E7EB"}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: "8px" }}>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 500, color: "#6B7280", marginBottom: "6px" }}>Пароль</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") handleSubmit() }}
              placeholder="••••••••"
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = "#0F6E56"}
              onBlur={e => e.target.style.borderColor = "#E5E7EB"}
            />
          </div>

          {/* Error */}
          {error && (
            <div style={{ marginTop: "12px", padding: "9px 12px", background: "#FFF5F5", border: "0.5px solid #FECACA", borderRadius: "10px", fontSize: "13px", color: "#DC2626" }}>
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: "100%", marginTop: "20px", padding: "13px", borderRadius: "12px", border: "none",
              background: loading ? "#9FE1CB" : "#0F6E56", color: "#fff", fontSize: "15px", fontWeight: 600,
              cursor: loading ? "default" : "pointer", fontFamily: "inherit", transition: "background .15s",
            }}
          >
            {loading ? "Зачекай..." : isLogin ? "Увійти" : "Створити акаунт"}
          </button>

          {/* Switch hint */}
          <p style={{ textAlign: "center", fontSize: "13px", color: "#9CA3AF", marginTop: "16px" }}>
            {isLogin ? "Ще немає акаунту? " : "Вже маєш акаунт? "}
            <button
              onClick={() => { setMode(isLogin ? "signup" : "login"); setError("") }}
              style={{ background: "none", border: "none", color: "#0F6E56", fontWeight: 600, cursor: "pointer", fontSize: "13px", fontFamily: "inherit" }}
            >
              {isLogin ? "Зареєструватися" : "Увійти"}
            </button>
          </p>
        </div>

        {/* Skip for now */}
        <p style={{ textAlign: "center", marginTop: "16px" }}>
          <button
            onClick={() => navigate("/")}
            style={{ background: "none", border: "none", color: "#9CA3AF", fontSize: "13px", cursor: "pointer", fontFamily: "inherit" }}
          >
            Пропустити поки що →
          </button>
        </p>
      </div>
    </main>
  )
}

const inputStyle = {
  width: "100%",
  background: "#F8F7F4",
  border: "1.5px solid #E5E7EB",
  borderRadius: "10px",
  padding: "11px 14px",
  fontSize: "14px",
  color: "#1F2937",
  outline: "none",
  fontFamily: "inherit",
  boxSizing: "border-box",
  transition: "border-color .12s",
}
