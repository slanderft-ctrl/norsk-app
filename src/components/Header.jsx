import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"

function Header({ onMenuClick }) {
  const navigate = useNavigate()
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [myWordsResults, setMyWordsResults] = useState([])
  const [showResults, setShowResults] = useState(false)
  const debounceTimer = useRef(null)

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([])
      setMyWordsResults([])
      return
    }

    // пошук у моєму словнику — миттєвий
    const myWords = JSON.parse(localStorage.getItem("myWords") || "[]")
    const myResults = myWords.filter(w =>
      w.no.toLowerCase().includes(query.toLowerCase()) ||
      w.ua.toLowerCase().includes(query.toLowerCase())
    )
    setMyWordsResults(myResults)

    // пошук у Ordbøkene — з debounce
    clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://ord.uib.no/api/suggest?q=${query}&dict=bm&n=6`
        )
        const data = await res.json()
        const words = data?.a?.exact?.map(item => item[0]) || []
        setSuggestions(words)
      } catch (err) {
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
    <header className="bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center gap-4 relative">
      <button
        onClick={onMenuClick}
        className="flex flex-col gap-1 p-1 hover:opacity-70 shrink-0"
      >
        <span className="block w-5 h-0.5 bg-white"></span>
        <span className="block w-5 h-0.5 bg-white"></span>
        <span className="block w-5 h-0.5 bg-white"></span>
      </button>

      <span className="text-white font-medium shrink-0">Norsk App</span>

      {/* ГЛОБАЛЬНИЙ ПОШУК */}
      <div className="flex-1 max-w-xl mx-auto relative">
        <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2">
          <span className="text-gray-500 text-sm">🔍</span>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setShowResults(true)}
            onBlur={() => setTimeout(() => setShowResults(false), 200)}
            placeholder="Шукати слово..."
            className="flex-1 bg-transparent text-white text-sm outline-none placeholder-gray-500"
          />
        </div>

        {/* ДРОПДАУН РЕЗУЛЬТАТІВ */}
        {showResults && query.trim() && (suggestions.length > 0 || myWordsResults.length > 0) && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gray-700 rounded-lg overflow-hidden z-50 shadow-2xl max-h-96 overflow-y-auto">

            {myWordsResults.length > 0 && (
              <div>
                <div className="px-4 py-2 text-xs text-gray-500 uppercase tracking-wider bg-gray-950 border-b border-gray-800">
                  Мій словник
                </div>
                {myWordsResults.map(w => (
                  <div
                    key={w.id}
                    onMouseDown={() => selectWord(w.no)}
                    className="px-4 py-2.5 hover:bg-gray-800 cursor-pointer border-b border-gray-800 last:border-0"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-white text-sm font-medium">{w.no}</span>
                      <span className="text-gray-400 text-xs">{w.ua}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {suggestions.length > 0 && (
              <div>
                <div className="px-4 py-2 text-xs text-gray-500 uppercase tracking-wider bg-gray-950 border-b border-gray-800">
                  Словник bokmål
                </div>
                {suggestions.map((word, i) => (
                  <div
                    key={i}
                    onMouseDown={() => selectWord(word)}
                    className="px-4 py-2.5 text-gray-200 text-sm hover:bg-gray-800 cursor-pointer border-b border-gray-800 last:border-0"
                  >
                    {word}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-medium shrink-0">
        І
      </div>
    </header>
  )
}

export default Header
