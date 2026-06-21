const SYSTEM_PROMPT = `Ти постійний AI-асистент у застосунку для вивчення норвезької мови (Bokmål).
Відповідай українською, коротко і практично.
Якщо користувач питає про норвезьке слово, фразу або граматику, давай 1-3 приклади норвезькою з українським перекладом.
Не вигадуй факти про акаунт користувача або його прогрес.

ВАЖЛИВО — обмеження по лінгвістиці:
- Якщо не впевнений у діалектній або регіональній особливості норвезької — скажи "я не впевнений, але..." або "краще перевір це в орфографічному словнику".
- НЕ видавай гіпотези за факти, особливо щодо діалектів, саамської мови та регіональних варіантів.
- Для питань про діалекти (нордланн, трумс, фіннмарк тощо) — завжди зазнач що це діалект і рекомендуй перевірити.`

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const { messages, systemPrompt } = req.body

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "Invalid messages" })
  }

  const systemBlock = systemPrompt
    ? [{ type: "text", text: systemPrompt }]
    : [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }]

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "anthropic-beta": "prompt-caching-2024-07-31",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1024,
        system: systemBlock,
        messages,
      }),
    })

    const data = await response.json()
    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || "API error" })
    }
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({ error: "Internal server error" })
  }
}