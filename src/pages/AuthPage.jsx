import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"

export default function AuthPage() {
  const navigate = useNavigate()
  const [mode, setMode] = useState(() => new URLSearchParams(window.location.search).get("reset") ? "update" : "login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")

  const isLogin = mode === "login"
  const isSignup = mode === "signup"
  const isReset = mode === "reset"
  const isUpdate = mode === "update"

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setMode("update")
        setError("")
        setMessage("Введи новий пароль для акаунту.")
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function handleSubmit() {
    setError("")
    setMessage("")

    if (isReset) return handlePasswordReset()
    if (isUpdate) return handlePasswordUpdate()

    if (!email.trim() || !password.trim()) return setError("Заповни email і пароль")
    if (isSignup && !name.trim()) return setError("Введи ім'я")
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
          options: { data: { name } }
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

  async function handlePasswordReset() {
    if (!email.trim()) return setError("Введи email")

    setLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?reset=1`,
      })
      if (error) throw error
      setMessage("Якщо акаунт існує, ми надіслали лист для скидання пароля.")
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handlePasswordUpdate() {
    if (!password.trim()) return setError("Введи новий пароль")
    if (password.length < 6) return setError("Пароль — мінімум 6 символів")

    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      setMessage("Пароль оновлено. Тепер можна увійти.")
      setPassword("")
      setMode("login")
      window.history.replaceState({}, "", "/auth")
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ minHeight: "100vh", background: "#F8F7F4", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ width: "100%", maxWidth: "420px" }}>

        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
            <img src="/star-green.png" style={{ width: "28px", height: "28px" }} />
            <span style={{ fontSize: "22px", fontWeight: 700, color: "#111827" }}>
              Lingu<span style={{ color: "#0F6E56" }}>AI</span>
            </span>
          </div>
          <p style={{ fontSize: "13px", color: "#9CA3AF" }}>Вивчай норвезьку з AI</p>
        </div>

        <div style={{ background: "#fff", border: "0.5px solid #E5E7EB", borderRadius: "20px", padding: "28px", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>

          {!isUpdate && (
            <div style={{ display: "flex", gap: "4px", background: "#F3F4F6", borderRadius: "12px", padding: "4px", marginBottom: "24px" }}>
              {[["login","Вхід"],["signup","Реєстрація"]].map(([m, label]) => (
                <button key={m} onClick={() => { setMode(m); setError(""); setMessage("") }} style={{
                  flex: 1, padding: "9px", borderRadius: "9px", border: "none", cursor: "pointer",
                  fontSize: "14px", fontWeight: 600, fontFamily: "inherit", transition: "all .15s",
                  background: mode === m ? "#fff" : "transparent",
                  color: mode === m ? "#0F6E56" : "#9CA3AF",
                  boxShadow: mode === m ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                }}>{label}</button>
              ))}
            </div>
          )}

          {isReset && (
            <div style={{ marginBottom: "18px" }}>
              <p style={{ fontSize: "15px", fontWeight: 700, color: "#111827", margin: "0 0 6px" }}>Скинути пароль</p>
              <p style={{ fontSize: "13px", color: "#6B7280", lineHeight: 1.5, margin: 0 }}>
                Введи email, і ми надішлемо посилання для створення нового пароля.
              </p>
            </div>
          )}

          {isUpdate && (
            <div style={{ marginBottom: "18px" }}>
              <p style={{ fontSize: "15px", fontWeight: 700, color: "#111827", margin: "0 0 6px" }}>Новий пароль</p>
              <p style={{ fontSize: "13px", color: "#6B7280", lineHeight: 1.5, margin: 0 }}>
                Введи новий пароль для свого акаунту.
              </p>
            </div>
          )}

          {isSignup && (
            <Field label="Ім'я" value={name} onChange={setName} placeholder="Як до тебе звертатися?" />
          )}
          {!isUpdate && (
            <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="din@epost.no"
              onKeyDown={e => e.key === "Enter" && handleSubmit()} />
          )}
          {!isReset && (
            <Field label={isUpdate ? "Новий пароль" : "Пароль"} type="password" value={password} onChange={setPassword}
              placeholder="••••••••" onKeyDown={e => e.key === "Enter" && handleSubmit()} />
          )}

          {error && (
            <div style={{ marginTop: "12px", padding: "9px 12px", background: "#FFF5F5", border: "0.5px solid #FECACA", borderRadius: "10px", fontSize: "13px", color: "#DC2626" }}>
              {error}
            </div>
          )}

          {message && (
            <div style={{ marginTop: "12px", padding: "9px 12px", background: "#F0FFF4", border: "0.5px solid #BBF7D0", borderRadius: "10px", fontSize: "13px", color: "#0F6E56" }}>
              {message}
            </div>
          )}

          <button onClick={handleSubmit} disabled={loading} style={{
            width: "100%", marginTop: "20px", padding: "13px", borderRadius: "12px", border: "none",
            background: loading ? "#9FE1CB" : "#0F6E56", color: "#fff", fontSize: "15px", fontWeight: 600,
            cursor: loading ? "default" : "pointer", fontFamily: "inherit",
          }}>
            {loading ? "Зачекай..." : isReset ? "Надіслати посилання" : isUpdate ? "Оновити пароль" : isLogin ? "Увійти" : "Створити акаунт"}
          </button>

          {isLogin && (
            <p style={{ textAlign: "center", margin: "12px 0 0" }}>
              <button onClick={() => { setMode("reset"); setError(""); setMessage(""); setPassword("") }}
                style={{ background: "none", border: "none", color: "#6B7280", fontWeight: 500, cursor: "pointer", fontSize: "13px", fontFamily: "inherit" }}>
                Забув пароль?
              </button>
            </p>
          )}

          {!isUpdate && (
            <p style={{ textAlign: "center", fontSize: "13px", color: "#9CA3AF", marginTop: "16px" }}>
              {isLogin ? "Немає акаунту? " : isReset ? "Згадав пароль? " : "Вже є акаунт? "}
              <button onClick={() => { setMode(isLogin ? "signup" : "login"); setError(""); setMessage("") }}
                style={{ background: "none", border: "none", color: "#0F6E56", fontWeight: 600, cursor: "pointer", fontSize: "13px", fontFamily: "inherit" }}>
                {isLogin ? "Зареєструватися" : "Увійти"}
              </button>
            </p>
          )}
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
