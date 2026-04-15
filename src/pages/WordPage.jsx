import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import verbsData from "../data/verbs.json"

function WordPage() {
  const { word } = useParams()
  const navigate = useNavigate()
  const [wordData, setWordData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setWordData(null)
    setLoading(true)

    async function fetchWord() {
      try {
        // КРОК 1: отримуємо ID статті
        const res1 = await fetch(
          `https://ord.uib.no/api/articles?w=${word}&dict=bm&scope=e`
        )
        const data1 = await res1.json()
        const articleId = data1.articles.bm[0]
        if (!articleId) throw new Error("Не знайдено")

        // КРОК 2: отримуємо повну статтю
        const res2 = await fetch(
          `https://ord.uib.no/bm/article/${articleId}.json`
        )
        const data2 = await res2.json()

        // КРОК 3: отримуємо переклад
        const verbMatch = verbsData.verbs.find(v => v.no === word)
        const translation = verbMatch?.ua || ""

        // ПАРСИНГ ДАНИХ З СТАТТІ
        // lemmas[0] — перший варіант слова
        const lemma = data2.lemmas?.[0]
        
        // paradigm_info[0].tags містить ["NOUN", "Neuter"] або ["VERB"] тощо
        const paradigmTags = lemma?.paradigm_info?.[0]?.tags || []
        
        // частина мови — перший тег
        const partOfSpeech = paradigmTags[0] || ""
        
        // рід — другий тег якщо є
        const gender = paradigmTags[1] || ""

        function getArticle(pos, gen) {
        if (pos === "VERB") return "å"
        if (pos === "NOUN") {
        if (gen === "Neuter") return "et"
        if (gen === "Masc" || gen === "Fem") return "en"
        }
        return ""
        }
        const article = getArticle(partOfSpeech, gender)

        // відмінювання — масив форм слова
        // кожен елемент має tags (Sing/Plur, Ind/Def) і word_form
        const inflections = lemma?.paradigm_info?.[0]?.inflection || []

        // визначення норвезькою — беремо перше пояснення
       // рекурсивна функція — шукає елементи на будь-якій глибині
    function extractElements(elements, results = { explanations: [], examples: [] }) {
      if (!elements) return results
      for (const el of elements) {
         if (el.type_ === "explanation" && el.content) {
        results.explanations.push(el.content.replace(/\$/g, word))
         } else if (el.type_ === "example" && el.quote?.content) {
       results.examples.push(el.quote.content.replace(/\$/g, word))
          } else if (el.elements) {
      // якщо є вкладені елементи — йдемо глибше
       extractElements(el.elements, results)
     }
  }
  
  return results
}

const parsed = extractElements(data2.body?.definitions)
const explanations = parsed.explanations
const examples = parsed.examples
        setWordData({
            word,
            translation,
            partOfSpeech,
            gender,
            article,
            inflections,
            explanations: [...new Set(explanations)].slice(0, 3),
            explanations: [...new Set(explanations)]
            .filter(exp => {
            // прибираємо визначення де слово повторюється більше одного разу
             const wordCount = exp.split(word).length - 1
            return wordCount <= 1
            })
  .slice(0, 3),
            examples: [...new Set(examples)].slice(0, 3),
        })

      } catch(err) {
        console.error(err)
        setWordData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchWord()
  }, [word])

  // функція озвучення
  function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = "nb-NO"
    utterance.rate = 0.9
    speechSynthesis.speak(utterance)
  }

  // перекладаємо теги на зрозумілу мову
  function translateTag(tag) {
    const tags = {
      "NOUN": "іменник",
      "VERB": "дієслово",
      "ADJ": "прикметник",
      "ADV": "прислівник",
      "Neuter": "середній рід",
      "Masc": "чоловічий рід",
      "Fem": "жіночий рід",
      "Sing": "однина",
      "Plur": "множина",
      "Ind": "неозначена форма",
      "Def": "означена форма",
    }
    return tags[tag] || tag
  }

  if (loading) return (
    <main className="flex-1 bg-gray-950 flex items-center justify-center">
      <p className="text-gray-400">Завантаження...</p>
    </main>
  )

  if (!wordData) return (
    <main className="flex-1 bg-gray-950 flex items-center justify-center">
      <p className="text-gray-400">Слово не знайдено</p>
    </main>
  )

  return (
    <main className="flex-1 bg-gray-950 p-6">
      <div className="max-w-3xl mx-auto">

        {/* КНОПКА НАЗАД */}
        <button
          onClick={() => navigate("/dictionary")}
          className="text-gray-400 hover:text-white text-sm mb-6 flex items-center gap-2 transition-colors"
        >
          ← Назад до словника
        </button>

        {/* ГОЛОВНА КАРТКА */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-4">

          {/* ЗАГОЛОВОК */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-medium text-white mb-2">
                {wordData.word}
                    </h1>
                    {wordData.article && (
                     <p className="text-lg text-gray-400 mb-1">
                     {wordData.article} {wordData.word}
                    </p>
            )}
              <p className="text-2xl text-blue-300 mb-3">
                {wordData.translation}
              </p>
              <div className="flex gap-2 flex-wrap">
                {wordData.partOfSpeech && (
                  <span className="text-xs bg-gray-800 text-gray-300 px-3 py-1 rounded-full">
                    {translateTag(wordData.partOfSpeech)}
                  </span>
                )}
                {wordData.gender && (
                  <span className="text-xs bg-gray-800 text-gray-300 px-3 py-1 rounded-full">
                    {translateTag(wordData.gender)}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => speak(wordData.word)}
              className="bg-blue-900 text-blue-300 rounded-full w-12 h-12 flex items-center justify-center hover:bg-blue-800 transition-colors shrink-0"
            >
              ▶
            </button>
          </div>

          {/* ВИЗНАЧЕННЯ НОРВЕЗЬКОЮ */}
          {wordData.explanations.length > 0 && (
            <div className="border-t border-gray-800 pt-4 mb-4">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                Визначення (норвезькою)
              </p>
              {wordData.explanations.map((exp, i) => (
                <p key={i} className="text-gray-300 text-sm mb-1">
                  {i + 1}. {exp}
                </p>
              ))}
            </div>
          )}

          {/* ПРИКЛАДИ */}
          {wordData.examples.length > 0 && (
            <div className="border-t border-gray-800 pt-4">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                Приклади
              </p>
              {wordData.examples.slice(0, 3).map((ex, i) => (
                <div key={i} className="flex items-center gap-2 mb-2">
                  <p className="text-gray-300 text-sm italic flex-1">{ex}</p>
                  <button
                    onClick={() => speak(ex)}
                    className="text-gray-500 hover:text-blue-300 text-xs transition-colors shrink-0"
                  >
                    ▶
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ТАБЛИЦЯ ВІДМІНЮВАННЯ */}
        {wordData.inflections.length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-4">
              Відмінювання
            </p>
            <div className="grid grid-cols-2 gap-2">
              {wordData.inflections.map((inf, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between bg-gray-800 rounded-lg px-3 py-2"
                >
                  <span className="text-xs text-gray-400">
                    {inf.tags.map(translateTag).join(", ")}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-white font-medium">
                      {inf.word_form}
                    </span>
                    <button
                      onClick={() => speak(inf.word_form)}
                      className="text-gray-500 hover:text-blue-300 text-xs transition-colors"
                    >
                      ▶
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  )
}

export default WordPage