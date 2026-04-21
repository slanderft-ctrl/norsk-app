import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import verbsData from "../data/verbs.json"
import AiWidget from "../components/AiWidget"

function WordPage() {
  const { word } = useParams()
  const navigate = useNavigate()
  const [wordData, setWordData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [addedToDict, setAddedToDict] = useState(false)

  useEffect(() => {
    setWordData(null)
    setLoading(true)

    async function fetchWord() {
      try {
        const res1 = await fetch(
          `https://ord.uib.no/api/articles?w=${word}&dict=bm&scope=e`
        )
        const data1 = await res1.json()
        const articleId = data1.articles.bm[0]
        if (!articleId) throw new Error("Не знайдено")

        const res2 = await fetch(
          `https://ord.uib.no/bm/article/${articleId}.json`
        )
        const data2 = await res2.json()

        const verbMatch = verbsData.verbs.find(v => v.no === word)
        const translation = verbMatch?.ua || ""

        const lemma = data2.lemmas?.[0]
        const paradigmTags = lemma?.paradigm_info?.[0]?.tags || []
        const partOfSpeech = paradigmTags[0] || ""
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

        const isVerb = partOfSpeech === "VERB"

        const inflections = (lemma?.paradigm_info?.[0]?.inflection || [])
          .filter(inf => {
            if (!inf.word_form || inf.word_form.trim() === "") return false
            const tags = inf.tags || []
            if (isVerb) {
              const verbTags = ["Inf", "Pres", "Past", "Imp"]
              const hasVerbTag = tags.some(t => verbTags.includes(t))
              const isAdjectival = tags.includes("Sing") || tags.includes("Plur") || tags.includes("Def") || tags.includes("Ind")
              return hasVerbTag && !isAdjectival
            } else {
              return true
            }
          })

        function extractElements(elements, results = { explanations: [], examples: [] }) {
          if (!elements) return results
          for (const el of elements) {
            if (el.type_ === "explanation" && el.content) {
              results.explanations.push(el.content.replace(/\$/g, word))
            } else if (el.type_ === "example" && el.quote?.content) {
              results.examples.push(el.quote.content.replace(/\$/g, word))
            } else if (el.elements) {
              extractElements(el.elements, results)
            }
          }
          return results
        }

        const parsed = extractElements(data2.body?.definitions)
        const explanations = parsed.explanations
        const examples = parsed.examples

        const allInflections = (lemma?.paradigm_info || []).flatMap(p => p.inflection || [])
        const perfPart = allInflections.find(inf =>
          inf.tags?.some(t => t === "<PerfPart>") &&
          inf.word_form &&
          inf.tags.length === 1
        )

        setWordData({
          word,
          translation,
          partOfSpeech,
          gender,
          article,
          inflections,
          perfPart: perfPart?.word_form || null,
          explanations: [...new Set(explanations)]
            .filter(exp => {
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

  function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = "nb-NO"
    utterance.rate = 0.9
    const voices = speechSynthesis.getVoices()
    const norwegianVoice = voices.find(v => v.lang === "nb-NO")
    if (norwegianVoice) utterance.voice = norwegianVoice
    speechSynthesis.speak(utterance)
  }

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
      "Ind": "неозначена",
      "Def": "означена",
      "Inf": "інфінітив",
      "Pres": "теперішній час",
      "Past": "минулий час",
      "Imp": "наказовий спосіб",
      "Pass": "пасивний стан",
      "PerfPart": "дієприкметник",
      "<PerfPart>": "дієприкметник",
      "PresPart": "дієприслівник",
      "<PresPart>": "дієприслівник",
      "Adj": "прикметник",
      "Masc/Fem": "чол./жін. рід",
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
      <div className="max-w-5xl mx-auto">

        <button
          onClick={() => navigate("/dictionary")}
          className="text-gray-400 hover:text-white text-sm mb-6 flex items-center gap-2 transition-colors"
        >
          ← Назад до словника
        </button>

        <div className="grid grid-cols-3 gap-4">

          {/* ЛІВА ЧАСТИНА — основний контент */}
          <div className="col-span-2 flex flex-col gap-4">

            {/* ГОЛОВНА КАРТКА */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
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
                <div className="flex flex-col items-end gap-3">
                  <button
                    onClick={() => speak(wordData.word)}
                    className="bg-blue-900 text-blue-300 rounded-full w-12 h-12 flex items-center justify-center hover:bg-blue-800 transition-colors shrink-0"
                  >
                    ▶
                  </button>
                  <button
                    onClick={() => {
                      const saved = JSON.parse(localStorage.getItem("myWords") || "[]")
                      const exists = saved.find(w => w.no === wordData.word)
                      if (!exists) {
                        saved.unshift({ id: Date.now(), no: wordData.word, ua: wordData.translation || "" })
                        localStorage.setItem("myWords", JSON.stringify(saved))
                      }
                      setAddedToDict(true)
                      setTimeout(() => setAddedToDict(false), 2000)
                    }}
                    className={`text-xs px-3 py-1.5 rounded-lg transition-all ${
                      addedToDict
                        ? "bg-green-900 text-green-400 border border-green-700"
                        : "bg-green-950 text-green-400 border border-green-800 hover:bg-green-900"
                    }`}
                  >
                    {addedToDict ? "Додано ✓" : "+ До словника"}
                  </button>
                </div>
              </div>

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
            {(wordData.inflections.length > 0 || wordData.perfPart) && (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-4">
                  Відмінювання
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {wordData.inflections
                    .filter(inf => inf.word_form && inf.word_form.trim() !== "")
                    .map((inf, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between bg-gray-800 rounded-lg px-3 py-2"
                      >
                        <span className="text-xs text-gray-400">
                          {inf.tags
                            .filter(tag => {
                              if (inf.tags.some(t => t === "PerfPart" || t === "<PerfPart>") && tag === "Adj") return false
                              if (inf.tags.some(t => t === "PresPart" || t === "<PresPart>") && tag === "Adj") return false
                              return true
                            })
                            .map(translateTag)
                            .join(", ")}
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

                  {wordData.perfPart && (
                    <div className="flex items-center justify-between bg-gray-800 rounded-lg px-3 py-2">
                      <span className="text-xs text-gray-400">перфект</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-white font-medium">
                          har {wordData.perfPart}
                        </span>
                        <button
                          onClick={() => speak(`har ${wordData.perfPart}`)}
                          className="text-gray-500 hover:text-blue-300 text-xs transition-colors"
                        >
                          ▶
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>

          {/* ПРАВА КОЛОНКА — AI віджет */}
          <div className="col-span-1">
            <AiWidget context={{ word: wordData.word, partOfSpeech: wordData.partOfSpeech }} />
          </div>

        </div>
      </div>
    </main>
  )
}

export default WordPage
