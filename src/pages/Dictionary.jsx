import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

const topics = [
  { id: 1, name: "Familie og hjem", count: 42 },
  { id: 2, name: "Mat og drikke", count: 38 },
  { id: 3, name: "Jobb og skole", count: 31 },
  { id: 4, name: "By og transport", count: 27 },
  { id: 5, name: "Natur og vær", count: 24 },
  { id: 6, name: "Fritid og hobby", count: 19 },
  { id: 7, name: "Helse", count: 22 },
  { id: 8, name: "Tall og tid", count: 15 },
]

function Dictionary() {
  const navigate = useNavigate()
  const [myWords, setMyWords] = useState(() => {
    return JSON.parse(localStorage.getItem("myWords") || "[]")
  })
  const [expandedId, setExpandedId] = useState(null)

  // ФУНКЦІЯ ЗБЕРЕЖЕННЯ НОТАТКИ
  function saveNote(id, note) {
    const updated = myWords.map(w =>
      w.id === id ? { ...w, note } : w
    )
    setMyWords(updated)
    localStorage.setItem("myWords", JSON.stringify(updated))
  }

  // ФУНКЦІЯ ВИДАЛЕННЯ СЛОВА
  function deleteWord(id) {
    const updated = myWords.filter(w => w.id !== id)
    setMyWords(updated)
    localStorage.setItem("myWords", JSON.stringify(updated))
    setExpandedId(null)
  }

  // ОЗВУЧЕННЯ
  function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = "nb-NO"
  utterance.rate = 0.9
  
  // явно обираємо норвезький голос
  const voices = speechSynthesis.getVoices()
  const norwegianVoice = voices.find(v => v.lang === "nb-NO")
  if (norwegianVoice) utterance.voice = norwegianVoice
  
  speechSynthesis.speak(utterance)
}

  const notesCount = myWords.filter(w => w.note).length

  return (
    <main className="flex-1 bg-gray-950 p-6" onClick={() => setExpandedId(null)}>
      <div className="max-w-6xl mx-auto">

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-medium text-white mb-1">Мій словник</h1>
            <p className="text-xs text-gray-500">
              {myWords.length} слів · {notesCount} з нотатками
            </p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">

          {/* ЛІВА ЧАСТИНА — мої слова */}
          <div className="col-span-3">
            {myWords.length === 0 ? (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
                <p className="text-gray-400 mb-2">Твій словник поки порожній</p>
                <p className="text-xs text-gray-500">
                  Шукай слова через пошук зверху і додавай до словника
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {myWords.map(word => (
                  <WordCard
                    key={word.id}
                    word={word}
                    isExpanded={expandedId === word.id}
                    onToggle={() => setExpandedId(expandedId === word.id ? null : word.id)}
                    onSpeak={() => speak(word.no)}
                    onOpen={() => navigate(`/dictionary/${word.no}`)}
                    onSaveNote={(note) => saveNote(word.id, note)}
                    onDelete={() => deleteWord(word.id)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* ПРАВА КОЛОНКА — тематичні слова */}
          <div className="col-span-1 bg-gray-900 border border-gray-800 rounded-xl p-4 self-start">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">
              Теми платформи
            </p>
            <div className="flex flex-col gap-1">
              {topics.map(topic => (
  <div
    key={topic.id}
    className="flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer text-sm text-gray-300 hover:bg-gray-800 transition-colors"
  >
    <span>{topic.name}</span>
    <span className="text-xs text-gray-500">{topic.count}</span>
  </div>
))}
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}

// ОКРЕМИЙ КОМПОНЕНТ ДЛЯ КАРТКИ СЛОВА
function WordCard({ word, isExpanded, onToggle, onSpeak, onOpen, onSaveNote, onDelete }) {
  const [noteValue, setNoteValue] = useState(word.note || "")
  const [saved, setSaved] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    setNoteValue(word.note || "")
  }, [word.note])

  function handleSave() {
    onSaveNote(noteValue)
    setSaved(true)
    setTimeout(() => {
      setSaved(false)
      onToggle() // згортаємо картку
    }, 1500)
  }

  function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true)
      setTimeout(() => setConfirmDelete(false), 3000)
      return
    }
    onDelete()
  }

  return (
    <div
      onClick={(e) => { e.stopPropagation(); onToggle() }}
      className={`bg-gray-900 border rounded-xl p-4 cursor-pointer transition-all flex flex-col gap-2 ${
        isExpanded
          ? "col-span-2 border-blue-700"
          : "border-gray-800 hover:border-gray-600"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-lg font-medium text-white">{word.no}</span>
            {word.partOfSpeech && (
              <span className="text-xs text-gray-500">· {word.partOfSpeech}</span>
            )}
          </div>
          {word.ua && <p className="text-sm text-gray-300 mt-1">{word.ua}</p>}
          {word.note && !isExpanded && (
            <p className="text-xs text-gray-500 italic mt-2 line-clamp-2">
              {word.note}
            </p>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onSpeak()
          }}
          className="bg-blue-900 text-blue-300 rounded-full w-8 h-8 flex items-center justify-center text-xs hover:bg-blue-800 transition-colors flex-shrink-0"
        >
          ▶
        </button>
      </div>

      {isExpanded && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex flex-col gap-2 mt-2 pt-3 border-t border-gray-800"
        >
          {!saved && (
            <textarea
              value={noteValue}
              onChange={e => setNoteValue(e.target.value)}
              placeholder="Додай нотатку..."
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-blue-500 resize-y min-h-[60px] transition-all"
            />
          )}

          {saved && (
            <div className="bg-green-950 border border-green-800 rounded-lg px-3 py-2 text-sm text-green-400 text-center">
              Збережено ✓
            </div>
          )}

          <div className="flex gap-2 justify-end">
            <button
              onClick={handleDelete}
              className={`text-xs px-3 py-1.5 rounded-lg transition-all ${
                confirmDelete
                  ? "bg-red-600 text-white border border-red-500"
                  : "text-red-400 border border-red-900 hover:bg-red-950"
              }`}
            >
              {confirmDelete ? "Підтвердити видалення" : "Видалити"}
            </button>
            <button
              onClick={onOpen}
              className="text-xs text-gray-300 border border-gray-700 hover:bg-gray-800 px-3 py-1.5 rounded-lg transition-colors"
            >
              Відкрити картку
            </button>
            {!saved && (
              <button
                onClick={handleSave}
                className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg transition-colors"
              >
                Зберегти
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Dictionary