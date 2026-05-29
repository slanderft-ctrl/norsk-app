import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"
import { useAuth } from "../context/AuthContext"

function Header({ onMenuClick }) {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [myWordsResults, setMyWordsResults] = useState([])
  const [showResults, setShowResults] = useState(false)
  const [profile, setProfile] = useState(null)
  const [showMenu, setShowMenu] = useState(false)
  const debounceTimer = useRef(null)
  useEffect(() => {
    if (!user) { setProfile(null); return }
      supabase
      .from("profiles")
      .select("name, streak")
      .eq("id", user.id)
      .single()
      .then(({ data }) => setProfile(data))
  }, [user])
  
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([])
      setMyWordsResults([])
      return
    }
    if (user) {
      supabase
        .from("my_words")
        .select("word_no, word_ua")
        .eq("user_id", user.id)
        .or(`word_no.ilike.%${query}%,word_ua.ilike.%${query}%`)
        .limit(5)
        .then(({ data }) => setMyWordsResults(data ?? []))
    } else {
      setMyWordsResults([])
    }
    clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(`https://ord.uib.no/api/suggest?q=${query}&dict=bm&n=6`)
        const data = await res.json()
        const words = data?.a?.exact?.map(item => item[0]) || []
        setSuggestions(words)
      } catch {
        setSuggestions([])
      }
    }, 300)
  }, [query])

  function selectWord(word) {
    setQuery("")
    setShowResults(false)
    navigate(`/dictionary/${word}`)
  }

  return (
    <header className="bg-white border-b border-gray-200 px-5 py-0 flex items-center gap-4 relative h-14">

      {/* Логотип */}
      <button
        onClick={onMenuClick}
        className="flex items-center gap-2 shrink-0 hover:opacity-80 transition-opacity"
      >
        <div className="w-7 h-7 bg-teal-700 rounded-lg flex items-center justify-center">
          <span className="text-white text-sm font-bold leading-none">✦</span>
        </div>
        <span className="text-gray-900 font-semibold text-sm tracking-tight">LinguAI</span>
      </button>

      {/* Пошук */}
      <div className="flex-1 max-w-lg mx-auto relative">
        <div className="flex items-center gap-2 bg-gray-100 border border-gray-200 rounded-full px-4 py-2 focus-within:border-teal-400 focus-within:bg-white transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 shrink-0">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setShowResults(true)}
            onBlur={() => setTimeout(() => setShowResults(false), 200)}
            placeholder="Шукати слово норвезькою..."
            className="flex-1 bg-transparent text-gray-900 text-sm outline-none placeholder-gray-400"
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-gray-400 hover:text-gray-600 text-xs">✕</button>
          )}
        </div>

        {/* Dropdown */}
        {showResults && query.trim() && (suggestions.length > 0 || myWordsResults.length > 0) && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl overflow-hidden z-50 shadow-lg max-h-80 overflow-y-auto">

            {myWordsResults.length > 0 && (
              <div>
                <div className="px-4 py-2 text-xs text-gray-400 uppercase tracking-wider bg-gray-50 border-b border-gray-100 flex items-center gap-2">
                  <span>📘</span> Мій словник
                </div>
                {myWordsResults.map(w => (
                  <div
                    key={w.id}
                    onMouseDown={() => selectWord(w.word_no)}
                    className="px-4 py-2.5 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0 flex items-center justify-between"
                  >
                    <span className="text-gray-900 text-sm font-medium">{w.word_no}</span>
                      <span className="text-gray-400 text-xs">{w.word_ua}</span>
                  </div>
                ))}
              </div>
            )}

            {suggestions.length > 0 && (
              <div>
                <div className="px-4 py-2 text-xs text-gray-400 uppercase tracking-wider bg-gray-50 border-b border-gray-100 flex items-center gap-2">
                  <span>🇳🇴</span> Bokmål
                </div>
                {suggestions.map((word, i) => (
                  <div
                    key={i}
                    onMouseDown={() => selectWord(word)}
                    className="px-4 py-2.5 text-gray-700 text-sm hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
                  >
                    {word}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Права частина */}
      <div className="flex items-center gap-3 shrink-0">

        {/* Streak — показуємо тільки якщо залогінений */}
        {user && (
          <div className="flex items-center gap-1.5 bg-teal-50 border border-teal-200 rounded-full px-3 py-1">
            <span className="text-teal-700 text-xs">🔥</span>
            <span className="text-teal-700 text-xs font-medium">
              {profile?.streak ?? 0} днів
            </span>
          </div>
        )}

        {/* Аватар або кнопка входу */}
        {user ? (
          <div className="relative">
            <button
              onClick={() => setShowMenu(v => !v)}
              className="w-8 h-8 rounded-full bg-teal-700 flex items-center justify-center text-white text-xs font-semibold hover:bg-teal-800 transition-colors"
            >
              {profile?.name?.[0]?.toUpperCase() ?? "?"}
            </button>

            {showMenu && (
              <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 min-w-[160px] overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{profile?.name ?? "..."}</p>
                  <p className="text-xs text-gray-400 truncate">{user.email}</p>
                </div>
                <button
                  onClick={() => { setShowMenu(false); navigate("/account") }}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Профіль
                </button>
                <button
                  onClick={() => { setShowMenu(false); logout() }}
                  className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50"
                >
                  Вийти
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => navigate("/auth")}
            className="px-4 py-1.5 bg-teal-700 text-white text-xs font-semibold rounded-full hover:bg-teal-800 transition-colors"
          >
            Увійти
          </button>
        )}
      </div>

    </header>
  )
}

export default Header
