import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"


// ТЕМИ ПЛАТФОРМИ — поки хардкодені, пізніше підключимо базу даних
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

// МОЇ СЛОВА — поки хардкодені, пізніше прийдуть з бази даних
const myWords = [
  { id: 1, no: "hjem", ua: "дім" },
  { id: 2, no: "familie", ua: "сім'я" },
  { id: 3, no: "kjøkken", ua: "кухня" },
  { id: 4, no: "vindu", ua: "вікно" },
  { id: 5, no: "dør", ua: "двері" },
]

function Dictionary() {
  

  // STATE — пам'ять компонента
  // query — те що користувач зараз друкує в пошуку
  const [query, setQuery] = useState("")
  
  // suggestions — список підказок що випадає під пошуком
  const [suggestions, setSuggestions] = useState([])
  
  // lastWord — остання знайдена картка слова
  const [lastWord, setLastWord] = useState(null)
  
  // loading — чи йде зараз запит до API
  const [loading, setLoading] = useState(false)
  
  // activeTopic — яка тема зараз виділена зліва
  const [activeTopic, setActiveTopic] = useState(1)
  const navigate = useNavigate()

  // useRef — це як useState але НЕ перемальовує компонент при зміні
  // використовуємо щоб зберігати таймер між рендерами
  const debounceTimer = useRef(null)

  // useEffect — це хук який запускає код у відповідь на зміну змінної
  // тут: кожного разу коли змінюється query — запускаємо пошук підказок
  useEffect(() => {
    // якщо поле пошуку порожнє — очищаємо підказки і виходимо
    if (!query.trim()) {
      setSuggestions([])
      return
    }

    // DEBOUNCE — затримка перед запитом
    // Без debounce: кожна буква відправляє запит → "h", "hj", "hje", "hjem" = 4 запити
    // З debounce: чекаємо 300мс після останньої букви → тільки 1 запит
    // Це економить ресурси і не перевантажує API
    clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(async () => {
      try {
        // fetch — вбудована функція браузера для HTTP запитів
        // ми вже знайомі з цим принципом
        const res = await fetch(
          `https://ord.uib.no/api/suggest?q=${query}&dict=bm&n=8`
        )
        const data = await res.json()
        
        // data.a.exact — масив точних збігів з API
        // кожен елемент виглядає так: ["hjem", ["bm"]]
        // нам потрібне тільки перше значення — саме слово
        const words = data?.a?.exact?.map(item => item[0]) || []
        setSuggestions(words)
      } catch (err) {
        // якщо щось пішло не так — просто очищаємо підказки
        setSuggestions([])
      }
    }, 300)
  }, [query]) // <-- масив залежностей: запускати useEffect тільки коли змінився query

  // ФУНКЦІЯ ПОШУКУ СЛОВА
  // async — означає що функція асинхронна, тобто може "чекати" на відповідь API
  async function searchWord(word) {
    const searchTerm = word || query
    if (!searchTerm.trim()) return

    // закриваємо підказки і показуємо стан завантаження
    setSuggestions([])
    setQuery(searchTerm)
    setLoading(true)

    try {
      // КРОК 1: отримуємо ID статті з ordbøkene
      const articlesRes = await fetch(
        `https://ord.uib.no/api/articles?w=${searchTerm}&dict=bm&scope=e`
      )
      const articlesData = await articlesRes.json()
      
      // беремо перший ID зі списку
      // articlesData.articles.bm виглядає так: [23742, 23743]
      const articleId = articlesData?.articles?.bm?.[0]
      if (!articleId) throw new Error("Слово не знайдено")

      // КРОК 2: отримуємо повну статтю по ID
      const articleRes = await fetch(
        `https://ord.uib.no/bm/article/${articleId}.json`
      )
      const articleData = await articleRes.json()

      // КРОК 3: отримуємо переклад українською через MyMemory
      const translateRes = await fetch(
        `https://api.mymemory.translated.net/get?q=${searchTerm}&langpair=no|uk`
      )
      const translateData = await translateRes.json()
      const translation = translateData?.responseData?.translatedText || ""

      // КРОК 4: збираємо все в один об'єкт і зберігаємо в state
      setLastWord({
        word: searchTerm,
        translation: translation,
        // articleData може мати різну структуру — беремо перше визначення
        definition: articleData?.body?.[0]?.content?.[0]?.textContent || "",
        articleId: articleId,
      })

    } catch (err) {
      setLastWord({ word: searchTerm, translation: "Не знайдено", definition: "", articleId: null })
    } finally {
      // finally виконується завжди — і при успіху і при помилці
      setLoading(false)
    }
  }

  // ФУНКЦІЯ ОЗВУЧЕННЯ — Web Speech API
  // це вбудований в браузер синтез мовлення, нічого не коштує
  function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = "nb-NO" // норвезька Bokmål
    utterance.rate = 0.9     // трохи повільніше для кращого розуміння
    speechSynthesis.speak(utterance)
  }

  return (
    <main className="flex-1 bg-gray-950 p-4">
      <div className="max-w-6xl mx-auto">

        {/* ПОШУК З АВТОДОПОВНЕННЯМ */}
        {/* relative — щоб випадаючий список позиціонувався відносно цього блоку */}
        <div className="relative mb-4">
          <div className="flex items-center gap-3 bg-gray-900 border border-gray-800 rounded-xl px-4 py-3">
            <span className="text-gray-400">🔍</span>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === "Enter" && searchWord()}
              placeholder="Шукати норвезьке слово..."
              className="flex-1 bg-transparent text-white text-sm outline-none placeholder-gray-500"
            />
            {loading && (
              <span className="text-gray-400 text-xs">Шукаю...</span>
            )}
          </div>

          {/* ВИПАДАЮЧИЙ СПИСОК ПІДКАЗОК */}
          {/* показуємо тільки якщо є підказки */}
          {suggestions.length > 0 && (
            // absolute — позиціонується відносно батьківського relative блоку
            // z-10 — відображається поверх інших елементів
            <div className="absolute top-full left-0 right-0 mt-1 bg-gray-900 border border-gray-700 rounded-xl overflow-hidden z-10">
              {suggestions.map((word, index) => (
                <div
                  key={index}
                  onClick={() => navigate(`/dictionary/${word}`)}
                  className="px-4 py-3 text-sm text-gray-200 hover:bg-gray-800 cursor-pointer border-b border-gray-800 last:border-0"
                >
                  {word}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ОСНОВНА СІТКА — три колонки */}
        <div className="grid grid-cols-4 gap-4">

          {/* ЛІВА КОЛОНКА — теми платформи */}
          <div className="col-span-1 bg-gray-900 border border-gray-800 rounded-xl p-4 self-start">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">
              Теми платформи
            </p>
            <div className="flex flex-col gap-1">
              {topics.map(topic => (
                <div
                  key={topic.id}
                  onClick={() => setActiveTopic(topic.id)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer text-sm transition-colors ${
                    activeTopic === topic.id
                      ? "bg-blue-950 border border-blue-700 text-blue-300"
                      : "text-gray-300 hover:bg-gray-800"
                  }`}
                >
                  <span>{topic.name}</span>
                  <span className="text-xs text-gray-500">{topic.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ЦЕНТРАЛЬНА КОЛОНКА — картка слова */}
          <div className="col-span-2">
            {lastWord ? (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                
                {/* ЗАГОЛОВОК КАРТКИ */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-3xl font-medium text-white mb-1">
                      {lastWord.word}
                    </h2>
                    <p className="text-xl text-blue-300 mb-2">
                      {lastWord.translation}
                    </p>
                    {lastWord.definition && (
                      <p className="text-sm text-gray-400">
                        {lastWord.definition}
                      </p>
                    )}
                  </div>

                  {/* КНОПКА ОЗВУЧЕННЯ */}
                  <button
                    onClick={() => speak(lastWord.word)}
                    className="bg-blue-900 text-blue-300 rounded-full w-10 h-10 flex items-center justify-center text-sm hover:bg-blue-800 transition-colors shrink-0"
                  >
                    ▶
                  </button>
                </div>

                {/* КНОПКА ДОДАТИ ДО СЛОВНИКА */}
                <button className="text-xs bg-green-950 text-green-400 border border-green-800 px-3 py-1.5 rounded-lg hover:bg-green-900 transition-colors">
                  + До мого словника
                </button>
              </div>
            ) : (
              // ПОРОЖНІЙ СТАН — коли ще нічого не шукали
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex items-center justify-center h-48">
                <p className="text-gray-500 text-sm">
                  Введи слово у пошук щоб побачити результат
                </p>
              </div>
            )}
          </div>

          {/* ПРАВА КОЛОНКА — мої слова */}
          <div className="col-span-1 bg-gray-900 border border-gray-800 rounded-xl p-4 self-start">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">
              Мої слова
            </p>
            <div className="flex flex-col gap-2">
              {myWords.map(word => (
                <div
                  key={word.id}
                  onClick={() => searchWord(word.no)}
                  className="flex items-center justify-between px-3 py-2 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-white">{word.no}</p>
                    <p className="text-xs text-gray-400">{word.ua}</p>
                  </div>
                  <span className="text-xs text-gray-500">▶</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 text-center mt-3 cursor-pointer hover:text-gray-300">
              + ще 24 слова →
            </p>
          </div>

        </div>
      </div>
    </main>
  )
}

export default Dictionary