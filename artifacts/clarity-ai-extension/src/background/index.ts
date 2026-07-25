// ClarityAI Background Service Worker
// Handles AI API calls so content scripts don't need direct API access.

interface SimplifyTextMessage {
  type: "SIMPLIFY_TEXT";
  text: string;
}

interface DeactivateChecklistMessage {
  type: "DEACTIVATE_CHECKLIST";
}

type Message = SimplifyTextMessage | DeactivateChecklistMessage;

chrome.runtime.onMessage.addListener(
  (message: Message, _sender, sendResponse) => {
    if (message.type === "DEACTIVATE_CHECKLIST") {
      // Forward to the active tab's content script to close the panel
      // (This message is actually handled in the content script directly)
      sendResponse({ ok: true });
      return true;
    }

    if (message.type === "SIMPLIFY_TEXT") {
      handleSimplify(message.text)
        .then((result) => sendResponse(result))
        .catch((err) =>
          sendResponse({ error: err.message ?? "Unknown error" })
        );
      return true; // keep message channel open for async response
    }
  }
);

async function handleSimplify(
  text: string
): Promise<{ simplified?: string; error?: string }> {
  const stored = await chrome.storage.local.get("openai_api_key");
  const apiKey: string = stored["openai_api_key"] ?? "";

  if (!apiKey || !apiKey.startsWith("sk-")) {
    return {
      error:
        "No OpenAI API key configured. Please add your API key in ClarityAI settings.",
    };
  }

  const systemPrompt = `You are ClarityAI, an expert at making complex text accessible and easy to understand.
Your task is to rewrite the provided article/content in plain, simple language suitable for a general audience.
Rules:
- Use short sentences (max 20 words each)
- Explain technical jargon in plain terms
- Keep the core meaning and key facts
- Break content into clear paragraphs
- Do not add headers or markdown formatting
- Write at a 6th-grade reading level
- Remove filler phrases and redundancy
- Be concise: aim for 40-60% of the original length`;

  const userPrompt = `Please simplify the following content:\n\n${text}`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        max_tokens: 1200,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      const errMsg =
        (errData as { error?: { message?: string } }).error?.message ??
        `API error ${response.status}`;
      return { error: errMsg };
    }

    const data = (await response.json()) as {
      choices: Array<{ message: { content: string } }>;
    };
    const simplified = data.choices?.[0]?.message?.content ?? "";

    return { simplified };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Network error — check your connection.";
    return { error: message };
  }
}

export {};
