import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import verbsData from "../data/verbs.json"
import AiWidget from "../components/AiWidget"
import { supabase } from "../lib/supabase"
import { useAuth } from "../context/AuthContext"

const TAG_MAP = {
  "NOUN":"іменник","VERB":"дієслово","ADJ":"прикметник","ADV":"прислівник",
  "Neuter":"середній рід","Masc":"чоловічий рід","Fem":"жіночий рід",
  "Masc/Fem":"чол./жін. рід","Sing":"однина","Plur":"множина",
  "Ind":"неозначена","Def":"означена","Inf":"інфінітив",
  "Pres":"теперішній час","Past":"минулий час","Imp":"наказовий спосіб",
  "Pass":"пасив","PerfPart":"перфект дієприкметник",
  "<PerfPart>":"перфект","PresPart":"дієприслівник","<PresPart>":"дієприслівник",
}
const tt = tag => TAG_MAP[tag] || tag

const POS_ICON = { NOUN:"📦", VERB:"⚡", ADJ:"🎨", ADV:"🔀" }
const GENDER_COLOR = {
  Masc:   { bg:"#EFF6FF", color:"#1D4ED8", label:"чоловічий рід" },
  Fem:    { bg:"#FDF2F8", color:"#9D174D", label:"жіночий рід"   },
  Neuter: { bg:"#F0FDF4", color:"#166534", label:"середній рід"  },
}

function SpeakBtn({ text }) {
  const [playing, setPlaying] = useState(false)
  function speak() {
    speechSynthesis.cancel()
    const utt = new SpeechSynthesisUtterance(text)
    utt.lang = "nb-NO"; utt.rate = 0.9
    const nora = speechSynthesis.getVoices().find(v => v.lang === "nb-NO")
    if (nora) utt.voice = nora
    utt.onstart = () => setPlaying(true)
    utt.onend = () => setPlaying(false)
    speechSynthesis.speak(utt)
  }
  return (
    <button onClick={speak} title="Відтворити" style={{
      background: playing ? "#E1F5EE" : "#F8F7F4",
      border: `0.5px solid ${playing ? "#9FE1CB" : "#E5E7EB"}`,
      borderRadius: "8px", width: "30px", height: "30px",
      cursor: "pointer", color: playing ? "#0F6E56" : "#9CA3AF",
      fontSize: "11px", display: "flex", alignItems: "center", justifyContent: "center",
      transition: "all .15s", flexShrink: 0,
    }}>
      {playing ? "⏹" : "▶"}
    </button>
  )
}

function Section({ icon, title, children }) {
  return (
    <div style={{ background:"#fff", border:"0.5px solid #E5E7EB", borderRadius:"16px", overflow:"hidden" }}>
      <div style={{ padding:"12px 18px", borderBottom:"0.5px solid #F3F4F6", display:"flex", alignItems:"center", gap:"8px" }}>
        <span style={{ fontSize:"16px" }}>{icon}</span>
        <span style={{ fontSize:"12px", fontWeight:600, color:"#6B7280", textTransform:"uppercase", letterSpacing:".06em" }}>{title}</span>
      </div>
      <div style={{ padding:"16px 18px" }}>{children}</div>
    </div>
  )
}

export default function WordPage() {
  const { word } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [wordData, setWordData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    setWordData(null); setLoading(true)
    async function fetchWord() {
      try {
        const r1 = await fetch(`https://ord.uib.no/api/articles?w=${word}&dict=bm&scope=e`)
        const d1 = await r1.json()
        const id = d1.articles.bm[0]
        if (!id) throw new Error("not found")
        const r2 = await fetch(`https://ord.uib.no/bm/article/${id}.json`)
        const d2 = await r2.json()
        const verbMatch = verbsData.verbs.find(v => v.no === word)
        const lemma = d2.lemmas?.[0]
        const tags = lemma?.paradigm_info?.[0]?.tags || []
        const pos = tags[0] || ""
        const gender = tags[1] || ""
        const article = pos === "VERB" ? "å" : pos === "NOUN"
          ? (gender === "Neuter" ? "et" : "en") : ""
        const isVerb = pos === "VERB"
        const inflections = (lemma?.paradigm_info?.[0]?.inflection || []).filter(inf => {
          if (!inf.word_form?.trim()) return false
          const t = inf.tags || []
          if (isVerb) {
            const ok = t.some(x => ["Inf","Pres","Past","Imp"].includes(x))
            const bad = t.some(x => ["Sing","Plur","Def","Ind"].includes(x))
            return ok && !bad
          }
          return true
        })
        function extract(els, acc = {expl:[],ex:[]}) {
          if (!els) return acc
          for (const el of els) {
            if (el.type_ === "explanation" && el.content) acc.expl.push(el.content.replace(/\$/g, word))
            else if (el.type_ === "example" && el.quote?.content) acc.ex.push(el.quote.content.replace(/\$/g, word))
            else if (el.elements) extract(el.elements, acc)
          }
          return acc
        }
        const { expl, ex } = extract(d2.body?.definitions)
        const allInf = (lemma?.paradigm_info || []).flatMap(p => p.inflection || [])
        const perf = allInf.find(inf => inf.tags?.some(t => t==="<PerfPart>") && inf.word_form && inf.tags.length===1)
        setWordData({
          word, translation: verbMatch?.ua || "",
          pos, gender, article, inflections,
          perfPart: perf?.word_form || null,
          explanations: [...new Set(expl)].filter(e => (e.split(word).length-1)<=1).slice(0,3),
          examples: [...new Set(ex)].slice(0,3),
        })
      } catch { setWordData(null) }
      finally { setLoading(false) }
    }
    fetchWord()
  }, [word])

  async function addToDict() {
  if (!user) { navigate("/auth"); return }

  const { data: existing } = await supabase
    .from("my_words")
    .select("id")
    .eq("user_id", user.id)
    .eq("word_no", wordData.word)
    .single()

  if (!existing) {
    await supabase.from("my_words").insert({
      user_id: user.id,
      word_no: wordData.word,
      word_ua: wordData.translation || "",
    })
  }

  setAdded(true)
  setTimeout(() => setAdded(false), 2000)
}

  if (loading) return (
    <main style={{ flex:1, background:"#F8F7F4", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"12px" }}>
        <div style={{ width:"32px", height:"32px", border:"3px solid #E5E7EB", borderTopColor:"#0F6E56", borderRadius:"50%", animation:"wpSpin .7s linear infinite" }} />
        <p style={{ color:"#9CA3AF", fontSize:"14px" }}>Завантаження...</p>
      </div>
      <style>{`@keyframes wpSpin{to{transform:rotate(360deg)}}`}</style>
    </main>
  )

  if (!wordData) return (
    <main style={{ flex:1, background:"#F8F7F4", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ textAlign:"center" }}>
        <p style={{ fontSize:"32px", marginBottom:"8px" }}>🔍</p>
        <p style={{ color:"#6B7280", fontSize:"15px" }}>Слово «{word}» не знайдено</p>
        <button onClick={() => navigate("/dictionary")} style={{ marginTop:"16px", background:"#0F6E56", color:"#fff", border:"none", borderRadius:"10px", padding:"8px 18px", fontSize:"14px", cursor:"pointer" }}>
          ← До словника
        </button>
      </div>
    </main>
  )

  const gc = GENDER_COLOR[wordData.gender]

  return (
    <main style={{ flex:1, background:"#F8F7F4", padding:"24px 32px", minHeight:"100vh" }}>
      <style>{`@keyframes wpSpin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ maxWidth:"1100px", margin:"0 auto" }}>

        <button onClick={() => navigate(-1)} style={{
          background:"transparent", border:"none", cursor:"pointer",
          color:"#9CA3AF", fontSize:"13px", display:"flex", alignItems:"center", gap:"5px",
          marginBottom:"20px", padding:0,
        }}>
          ← Назад
        </button>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 320px", gap:"16px", alignItems:"start" }}>

          <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>

            <div style={{ background:"#fff", border:"0.5px solid #E5E7EB", borderRadius:"20px", padding:"24px 24px 20px", boxShadow:"0 1px 4px rgba(0,0,0,0.04)" }}>
              <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:"16px" }}>

                <div style={{ flex:1 }}>
                  {wordData.article && (
                    <p style={{ fontSize:"14px", color:"#9CA3AF", marginBottom:"4px", fontWeight:500 }}>
                      {wordData.article}
                    </p>
                  )}
                  <h1 style={{ fontSize:"40px", fontWeight:600, color:"#111827", lineHeight:1.1, marginBottom:"8px" }}>
                    {wordData.word}
                  </h1>

                  {wordData.translation && (
                    <p style={{ fontSize:"20px", color:"#0F6E56", fontWeight:500, marginBottom:"14px" }}>
                      {wordData.translation}
                    </p>
                  )}

                  <div style={{ display:"flex", gap:"6px", flexWrap:"wrap" }}>
                    {wordData.pos && (
                      <span style={{ fontSize:"12px", fontWeight:500, padding:"3px 10px", borderRadius:"20px", background:"#F3F4F6", color:"#374151" }}>
                        {POS_ICON[wordData.pos] || ""} {tt(wordData.pos)}
                      </span>
                    )}
                    {gc && (
                      <span style={{ fontSize:"12px", fontWeight:500, padding:"3px 10px", borderRadius:"20px", background:gc.bg, color:gc.color }}>
                        {gc.label}
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"10px" }}>
                  <button
                    onClick={() => {
                      const utt = new SpeechSynthesisUtterance(wordData.word)
                      utt.lang="nb-NO"; utt.rate=0.9
                      const n = speechSynthesis.getVoices().find(v=>v.lang==="nb-NO")
                      if(n) utt.voice=n
                      speechSynthesis.speak(utt)
                    }}
                    style={{
                      width:"52px", height:"52px", borderRadius:"50%",
                      background:"#0F6E56", border:"none", cursor:"pointer",
                      color:"#fff", fontSize:"18px", display:"flex", alignItems:"center", justifyContent:"center",
                      boxShadow:"0 2px 8px rgba(15,110,86,0.25)", transition:"all .15s",
                    }}
                    title="Озвучити слово"
                  >▶</button>

                 <button
                  onClick={addToDict}
                  style={{
                    fontSize:"12px", fontWeight:500, padding:"7px 14px", borderRadius:"10px",
                    cursor:"pointer", transition:"all .15s", whiteSpace:"nowrap",
                    background: added ? "#E1F5EE" : "#F8F7F4",
                    border: `0.5px solid ${added ? "#9FE1CB" : "#E5E7EB"}`,
                    color: added ? "#0F6E56" : "#6B7280",
                  }}
                  >
                  {added ? "✓ Додано" : user ? "+ Словник" : "🔐 Увійти"}
                  </button>
                </div>
              </div>
            </div>

            {wordData.explanations.length > 0 && (
              <Section icon="📖" title="Визначення (норвезькою)">
                <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
                  {wordData.explanations.map((exp, i) => (
                    <div key={i} style={{ display:"flex", gap:"10px", alignItems:"flex-start" }}>
                      <span style={{ fontSize:"11px", fontWeight:700, color:"#0F6E56", background:"#E1F5EE", borderRadius:"6px", padding:"2px 7px", flexShrink:0, marginTop:"2px" }}>
                        {i+1}
                      </span>
                      <p style={{ fontSize:"14px", color:"#374151", lineHeight:1.6, margin:0 }}>{exp}</p>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {wordData.examples.length > 0 && (
              <Section icon="💬" title="Приклади використання">
                <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
                  {wordData.examples.map((ex, i) => (
                    <div key={i} style={{ display:"flex", alignItems:"center", gap:"10px", padding:"10px 14px", background:"#F8F7F4", borderRadius:"10px", border:"0.5px solid #E5E7EB" }}>
                      <p style={{ flex:1, fontSize:"14px", color:"#1F2937", fontStyle:"italic", lineHeight:1.5, margin:0 }}>{ex}</p>
                      <SpeakBtn text={ex} />
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {(wordData.inflections.length > 0 || wordData.perfPart) && (
              <Section icon="📐" title="Відмінювання / Форми">
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px" }}>
                  {wordData.inflections.filter(inf => inf.word_form?.trim()).map((inf, i) => (
                    <div key={i} style={{
                      display:"flex", alignItems:"center", justifyContent:"space-between",
                      padding:"9px 13px", background:"#F8F7F4", borderRadius:"10px",
                      border:"0.5px solid #E5E7EB",
                    }}>
                      <span style={{ fontSize:"11px", color:"#9CA3AF", flex:1 }}>
                        {inf.tags.filter(t => {
                          if (inf.tags.some(x=>x==="PerfPart"||x==="<PerfPart>"||x==="PresPart"||x==="<PresPart>") && t==="Adj") return false
                          return true
                        }).map(tt).join(", ")}
                      </span>
                      <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                        <span style={{ fontSize:"14px", fontWeight:600, color:"#111827" }}>{inf.word_form}</span>
                        <SpeakBtn text={inf.word_form} />
                      </div>
                    </div>
                  ))}

                  {wordData.perfPart && (
                    <div style={{
                      display:"flex", alignItems:"center", justifyContent:"space-between",
                      padding:"9px 13px", background:"#E1F5EE", borderRadius:"10px",
                      border:"0.5px solid #9FE1CB",
                    }}>
                      <span style={{ fontSize:"11px", color:"#0F6E56", fontWeight:500 }}>перфект</span>
                      <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                        <span style={{ fontSize:"14px", fontWeight:600, color:"#0F6E56" }}>har {wordData.perfPart}</span>
                        <SpeakBtn text={`har ${wordData.perfPart}`} />
                      </div>
                    </div>
                  )}
                </div>
              </Section>
            )}

          </div>

          <div style={{ position:"sticky", top:"24px" }}>
            <AiWidget context={{ word: wordData.word, partOfSpeech: wordData.pos }} />
          </div>

        </div>
      </div>
    </main>
  )
}
