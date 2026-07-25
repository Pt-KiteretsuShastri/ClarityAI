/* LLM Client — Supports Anthropic and OpenAI providers */

const PROVIDERS = {
  ANTHROPIC: 'anthropic',
  OPENAI: 'openai',
};

const DEFAULT_CONFIG = {
  anthropic: {
    model: 'claude-3-haiku-20240307',
    baseUrl: 'https://api.anthropic.com/v1',
  },
  openai: {
    model: 'gpt-4o-mini',
    baseUrl: 'https://api.openai.com/v1',
  },
};

/**
 * Call the configured LLM provider
 * @param {Object} opts
 * @param {string} opts.prompt - The system prompt
 * @param {string} opts.mode - 'simplify' | 'checklist'
 * @param {string} opts.provider - 'anthropic' | 'openai'
 * @param {string} opts.model - Model name override
 * @param {string} opts.apiKey - API key
 * @param {string} [opts.baseUrl] - Custom base URL
 * @returns {Promise<string>} The response text
 */
export async function callLLM({ prompt, mode, provider = PROVIDERS.ANTHROPIC, model, apiKey, baseUrl }) {
  if (!apiKey) {
    throw new Error('API key is required. Configure it in the extension popup.');
  }

  const providerConfig = provider === PROVIDERS.ANTHROPIC
    ? { ...DEFAULT_CONFIG.anthropic, model: model || DEFAULT_CONFIG.anthropic.model, baseUrl: baseUrl || DEFAULT_CONFIG.anthropic.baseUrl }
    : { ...DEFAULT_CONFIG.openai, model: model || DEFAULT_CONFIG.openai.model, baseUrl: baseUrl || DEFAULT_CONFIG.openai.baseUrl };

  if (provider === PROVIDERS.ANTHROPIC) {
    return callAnthropic(prompt, mode, apiKey, providerConfig);
  } else {
    return callOpenAI(prompt, mode, apiKey, providerConfig);
  }
}

/**
 * Call Anthropic Claude API
 */
async function callAnthropic(prompt, mode, apiKey, config) {
  const response = await fetch(`${config.baseUrl}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: config.model,
      max_tokens: mode === 'simplify' ? 2000 : 1000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Anthropic API error (${response.status}): ${error}`);
  }

  const data = await response.json();
  return data.content?.[0]?.text || '';
}

/**
 * Call OpenAI-compatible API
 */
async function callOpenAI(prompt, mode, apiKey, config) {
  const response = await fetch(`${config.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      max_tokens: mode === 'simplify' ? 2000 : 1000,
      messages: [
        {
          role: 'system',
          content: 'You are an accessibility assistant. Respond only with the requested content, no additional commentary.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error (${response.status}): ${error}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}
