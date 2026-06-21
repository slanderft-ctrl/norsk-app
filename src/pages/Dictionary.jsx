import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"
import { useAuth } from "../context/AuthContext"

const TOPICS = [
  { id: 1, name: "Familie og hjem",  count: 42 },
  { id: 2, name: "Mat og drikke",    count: 38 },
  { id: 3, name: "Jobb og skole",    count: 31 },
  { id: 4, name: "By og transport",  count: 27 },
  { id: 5, name: "Natur og vær",     count: 24 },
  { id: 6, name: "Fritid og hobby",  count: 19 },
  { id: 7, name: "Helse",            count: 22 },
  { id: 8, name: "Tall og tid",      count: 15 },
]

function speak(text) {
  speechSynthesis.cancel()
  const utt = new SpeechSynthesisUtterance(text)
  utt.lang = "nb-NO"; utt.rate = 0.9
  const nora = speechSynthesis.getVoices().find(v => v.lang === "nb-NO")
  if (nora) utt.voice = nora
  speechSynthesis.speak(utt)
}

function WordCard({ word, isExpanded, onToggle, onOpen, onSaveNote, onDelete }) {
  const [noteValue, setNoteValue] = useState(word.note || "")
  const [saved, setSaved] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => { setNoteValue(word.note || "") }, [word.note])

  function handleSave() {
    onSaveNote(noteValue); setSaved(true)
    setTimeout(() => { setSaved(false); onToggle() }, 1400)
  }

  function handleDelete() {
    if (!confirmDelete) { setConfirmDelete(true); setTimeout(() => setConfirmDelete(false), 3000); return }
    onDelete()
  }

  return (
    <div
      onClick={e => { e.stopPropagation(); onToggle() }}
      style={{
        background: "#fff",
        border: `0.5px solid ${isExpanded ? "#0F6E56" : "#E5E7EB"}`,
        borderRadius: "14px", padding: "14px 16px", cursor: "pointer",
        transition: "all .15s", display: "flex", flexDirection: "column", gap: "10px",
        boxShadow: isExpanded ? "0 0 0 2px rgba(15,110,86,0.10)" : "none",
      }}
      onMouseEnter={e => { if (!isExpanded) e.currentTarget.style.borderColor = "#9FE1CB" }}
      onMouseLeave={e => { if (!isExpanded) e.currentTarget.style.borderColor = "#E5E7EB" }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "10px" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "3px" }}>
            <span style={{ fontSize: "17px", fontWeight: 600, color: "#111827" }}>{word.word_no}</span>
          </div>
          {word.word_ua && (
            <p style={{ fontSize: "13px", color: "#0F6E56", fontWeight: 500, margin: 0 }}>{word.word_ua}</p>
          )}
          {word.note && !isExpanded && (
            <p style={{ fontSize: "12px", color: "#9CA3AF", fontStyle: "italic", marginTop: "5px", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
              {word.note}
            </p>
          )}
        </div>
        <button
          onClick={e => { e.stopPropagation(); speak(word.word_no) }}
          style={{
            width: "32px", height: "32px", borderRadius: "50%",
            background: "#E1F5EE", border: "0.5px solid #9FE1CB",
            color: "#0F6E56", fontSize: "11px",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", flexShrink: 0, transition: "all .12s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "#0F6E56"; e.currentTarget.style.color = "#fff" }}
          onMouseLeave={e => { e.currentTarget.style.background = "#E1F5EE"; e.currentTarget.style.color = "#0F6E56" }}
        >▶</button>
      </div>

      {isExpanded && (
        <div onClick={e => e.stopPropagation()} style={{ borderTop: "0.5px solid #F3F4F6", paddingTop: "10px", display: "flex", flexDirection: "column", gap: "8px" }}>
          {!saved ? (
            <textarea
              value={noteValue}
              onChange={e => setNoteValue(e.target.value)}
              placeholder="Додай нотатку..."
              style={{
                width: "100%", background: "#F8F7F4", border: "0.5px solid #E5E7EB",
                borderRadius: "10px", padding: "8px 12px", fontSize: "13px", color: "#1F2937",
                outline: "none", resize: "vertical", minHeight: "60px",
                fontFamily: "inherit", boxSizing: "border-box",
              }}
              onFocus={e => e.target.style.borderColor = "#0F6E56"}
              onBlur={e => e.target.style.borderColor = "#E5E7EB"}
            />
          ) : (
            <div style={{ background: "#E1F5EE", border: "0.5px solid #9FE1CB", borderRadius: "10px", padding: "8px 12px", fontSize: "13px", color: "#0F6E56", textAlign: "center" }}>
              Збережено ✓
            </div>
          )}
          <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
            <button onClick={handleDelete} style={{
              fontSize: "12px", padding: "6px 12px", borderRadius: "8px",
              cursor: "pointer", fontFamily: "inherit",
              background: confirmDelete ? "#DC2626" : "transparent",
              border: `0.5px solid ${confirmDelete ? "#DC2626" : "#FECACA"}`,
              color: confirmDelete ? "#fff" : "#EF4444",
            }}>{confirmDelete ? "Підтвердити" : "Видалити"}</button>
            <button onClick={onOpen} style={{ fontSize: "12px", padding: "6px 12px", borderRadius: "8px", cursor: "pointer", fontFamily: "inherit", background: "#F8F7F4", border: "0.5px solid #E5E7EB", color: "#374151" }}>
              Відкрити →
            </button>
            {!saved && (
              <button onClick={handleSave} style={{ fontSize: "12px", padding: "6px 12px", borderRadius: "8px", cursor: "pointer", fontFamily: "inherit", background: "#0F6E56", border: "none", color: "#fff" }}>
                Зберегти
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function Dictionary() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [myWords, setMyWords] = useState([])
  const [expandedId, setExpandedId] = useState(null)
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user === null) { navigate("/auth"); return }
    if (!user) { setLoading(false); return }
    supabase
      .from("my_words")
      .select("*")
      .eq("user_id", user.id)
      .order("added_at", { ascending: false })
      .then(({ data }) => {
        setMyWords(data ?? [])
        setLoading(false)
      })
  }, [user])

  async function saveNote(id, note) {
    setMyWords(prev => prev.map(w => w.id === id ? { ...w, note } : w))
    await supabase.from("my_words").update({ note }).eq("id", id)
  }

  async function deleteWord(id) {
    setMyWords(prev => prev.filter(w => w.id !== id))
    setExpandedId(null)
    await supabase.from("my_words").delete().eq("id", id)
  }

  const filtered = myWords.filter(w =>
    !search.trim() ||
    w.word_no.toLowerCase().includes(search.toLowerCase()) ||
    (w.word_ua || "").toLowerCase().includes(search.toLowerCase())
  )

  const notesCount = myWords.filter(w => w.note).length

  return (
    <main onClick={() => setExpandedId(null)} style={{ flex: 1, background: "#F8F7F4", padding: "24px 32px", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ fontSize: "22px", fontWeight: 600, color: "#111827", marginBottom: "4px" }}>Мій словник</h1>
          <p style={{ fontSize: "13px", color: "#9CA3AF", margin: 0 }}>
            {myWords.length} слів · {notesCount} з нотатками
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 260px", gap: "20px", alignItems: "start" }}>

          <div>
            <div style={{ marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px", background: "#fff", border: "0.5px solid #E5E7EB", borderRadius: "12px", padding: "9px 14px" }}>
              <span style={{ fontSize: "14px", color: "#9CA3AF" }}>🔍</span>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Пошук у своєму словнику..."
                style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: "14px", color: "#1F2937", fontFamily: "inherit" }}
              />
              {search && (
                <button onClick={() => setSearch("")} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#9CA3AF", fontSize: "14px" }}>✕</button>
              )}
            </div>

            {loading ? (
              <div style={{ textAlign: "center", padding: "48px", color: "#9CA3AF", fontSize: "14px" }}>Завантаження...</div>
            ) : !user ? (
              <div style={{ background: "#fff", border: "0.5px solid #E5E7EB", borderRadius: "16px", padding: "48px 24px", textAlign: "center" }}>
                <p style={{ fontSize: "32px", marginBottom: "12px" }}>🔐</p>
                <p style={{ fontSize: "15px", color: "#374151", fontWeight: 500, marginBottom: "6px" }}>Увійди щоб бачити словник</p>
                <button onClick={() => navigate("/auth")} style={{ marginTop: "12px", padding: "10px 24px", background: "#0F6E56", color: "#fff", border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>
                  Увійти
                </button>
              </div>
            ) : myWords.length === 0 ? (
              <div style={{ background: "#fff", border: "0.5px solid #E5E7EB", borderRadius: "16px", padding: "48px 24px", textAlign: "center" }}>
                <p style={{ fontSize: "32px", marginBottom: "12px" }}>📘</p>
                <p style={{ fontSize: "15px", color: "#374151", fontWeight: 500, marginBottom: "6px" }}>Словник поки порожній</p>
                <p style={{ fontSize: "13px", color: "#9CA3AF" }}>Шукай слова через пошук і додавай через «+ Словник»</p>
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ background: "#fff", border: "0.5px solid #E5E7EB", borderRadius: "16px", padding: "32px 24px", textAlign: "center" }}>
                <p style={{ fontSize: "14px", color: "#9CA3AF" }}>Нічого не знайдено за запитом «{search}»</p>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                {filtered.map(word => (
                  <WordCard
                    key={word.id}
                    word={word}
                    isExpanded={expandedId === word.id}
                    onToggle={() => setExpandedId(expandedId === word.id ? null : word.id)}
                    onOpen={() => navigate(`/dictionary/${word.word_no}`)}
                    onSaveNote={note => saveNote(word.id, note)}
                    onDelete={() => deleteWord(word.id)}
                  />
                ))}
              </div>
            )}
          </div>

          <div style={{ background: "#fff", border: "0.5px solid #E5E7EB", borderRadius: "16px", overflow: "hidden", position: "sticky", top: "24px" }}>
            <div style={{ padding: "12px 16px", borderBottom: "0.5px solid #F3F4F6", display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "15px" }}>📚</span>
              <span style={{ fontSize: "12px", fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: ".06em" }}>Теми курсу</span>
            </div>
            <div style={{ padding: "8px" }}>
              {TOPICS.map(topic => (
                <div key={topic.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 10px", borderRadius: "9px", cursor: "pointer", transition: "background .12s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#F8F7F4"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <span style={{ fontSize: "13px", color: "#374151" }}>{topic.name}</span>
                  <span style={{ fontSize: "11px", fontWeight: 500, color: "#9CA3AF", background: "#F3F4F6", padding: "2px 7px", borderRadius: "20px" }}>{topic.count}</span>
                </div>
              ))}
            </div>
            {myWords.length > 0 && (
              <div style={{ borderTop: "0.5px solid #F3F4F6", padding: "12px 16px" }}>
                <p style={{ fontSize: "11px", color: "#9CA3AF", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: "8px", fontWeight: 500 }}>Прогрес</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {[
                    { label: "Всього слів", value: myWords.length, color: "#0F6E56" },
                    { label: "З нотатками", value: notesCount, color: "#185FA5" },
                  ].map(s => (
                    <div key={s.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: "12px", color: "#6B7280" }}>{s.label}</span>
                      <span style={{ fontSize: "14px", fontWeight: 600, color: s.color }}>{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </main>
  )
}