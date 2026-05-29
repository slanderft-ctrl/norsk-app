import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"

export default function AuthPage() {
  const navigate = useNavigate()
  const [mode, setMode] = useState("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const isLogin = mode === "login"

  async function handleSubmit() {
    setError("")
    if (!email.trim() || !password.trim()) return setError("Заповни email і пароль")
    if (!isLogin && !name.trim()) return setError("Введи ім'я")
    if (password.length < 6) return setError("Пароль — мінімум 6 символів")

    setLoading(true)
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name } }  // тригер підхопить name
        })
        if (error) throw error
      }
      navigate("/")
    } catch (err) {
      const msgs = {
        "Invalid login credentials": "Невірний email або пароль",
        "User already registered": "Цей email вже зареєстрований",
        "Password should be at least 6 characters": "Пароль — мінімум 6 символів",
      }
      setError(msgs[err.message] || err.message)
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
              <button key={m} onClick={() => { setMode(m); setError("") }} style={{
                flex: 1, padding: "9px", borderRadius: "9px", border: "none", cursor: "pointer",
                fontSize: "14px", fontWeight: 600, fontFamily: "inherit", transition: "all .15s",
                background: mode === m ? "#fff" : "transparent",
                color: mode === m ? "#0F6E56" : "#9CA3AF",
                boxShadow: mode === m ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
              }}>{label}</button>
            ))}
          </div>

          {!isLogin && (
            <Field label="Ім'я" value={name} onChange={setName} placeholder="Як до тебе звертатися?" />
          )}
          <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="din@epost.no" />
          <Field label="Пароль" type="password" value={password} onChange={setPassword}
            placeholder="••••••••" onKeyDown={e => e.key === "Enter" && handleSubmit()} />

          {error && (
            <div style={{ marginTop: "12px", padding: "9px 12px", background: "#FFF5F5", border: "0.5px solid #FECACA", borderRadius: "10px", fontSize: "13px", color: "#DC2626" }}>
              {error}
            </div>
          )}

          <button onClick={handleSubmit} disabled={loading} style={{
            width: "100%", marginTop: "20px", padding: "13px", borderRadius: "12px", border: "none",
            background: loading ? "#9FE1CB" : "#0F6E56", color: "#fff", fontSize: "15px", fontWeight: 600,
            cursor: loading ? "default" : "pointer", fontFamily: "inherit",
          }}>
            {loading ? "Зачекай..." : isLogin ? "Увійти" : "Створити акаунт"}
          </button>

          <p style={{ textAlign: "center", fontSize: "13px", color: "#9CA3AF", marginTop: "16px" }}>
            {isLogin ? "Немає акаунту? " : "Вже є акаунт? "}
            <button onClick={() => { setMode(isLogin ? "signup" : "login"); setError("") }}
              style={{ background: "none", border: "none", color: "#0F6E56", fontWeight: 600, cursor: "pointer", fontSize: "13px", fontFamily: "inherit" }}>
              {isLogin ? "Зареєструватися" : "Увійти"}
            </button>
          </p>
        </div>

        <p style={{ textAlign: "center", marginTop: "16px" }}>
          <button onClick={() => navigate("/")} style={{ background: "none", border: "none", color: "#9CA3AF", fontSize: "13px", cursor: "pointer" }}>
            Пропустити →
          </button>
        </p>
      </div>
    </main>
  )
}

function Field({ label, type = "text", value, onChange, placeholder, onKeyDown }) {
  return (
    <div style={{ marginBottom: "14px" }}>
      <label style={{ display: "block", fontSize: "12px", fontWeight: 500, color: "#6B7280", marginBottom: "6px" }}>{label}</label>
      <input
        type={type} value={value} placeholder={placeholder} onKeyDown={onKeyDown}
        onChange={e => onChange(e.target.value)}
        style={{ width: "100%", background: "#F8F7F4", border: "1.5px solid #E5E7EB", borderRadius: "10px", padding: "11px 14px", fontSize: "14px", color: "#1F2937", outline: "none", fontFamily: "inherit", boxSizing: "border-box", transition: "border-color .12s" }}
        onFocus={e => e.target.style.borderColor = "#0F6E56"}
        onBlur={e => e.target.style.borderColor = "#E5E7EB"}
      />
    </div>
  )
}
