/* Background Service Worker — Handles LLM API calls with caching */

import { callLLM } from '../lib/llm.js';
import { PROMPTS } from '../lib/prompts.js';
import { StorageManager } from '../lib/storage.js';

// ── Cache for LLM responses ───────────────────────────────────
const responseCache = new Map();
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

// ── Message handler ───────────────────────────────────────────
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  switch (msg.type) {
    case 'LLM_REQUEST':
      handleLLMRequest(msg, sendResponse);
      return true; // Keep channel open for async

    case 'GET_CONFIG':
      handleGetConfig(sendResponse);
      return true;

    case 'SAVE_CONFIG':
      handleSaveConfig(msg.config, sendResponse);
      return true;

    default:
      sendResponse({ error: `Unknown message type: ${msg.type}` });
  }
});

// ── LLM Request Handler ───────────────────────────────────────
async function handleLLMRequest(msg, sendResponse) {
  const { mode, text, url, title } = msg;

  try {
    // Validate input
    if (!text || text.trim().length < 10) {
      sendResponse({ error: 'Not enough text to process' });
      return;
    }

    // Get configuration
    const config = await StorageManager.getConfig();
    if (!config.apiKey) {
      sendResponse({ error: 'API key not configured. Click the extension icon and set up your API key.' });
      return;
    }

    // Check cache
    const cacheKey = `${mode}:${url}:${text.slice(0, 100)}`;
    const cached = getFromCache(cacheKey);
    if (cached) {
      sendResponse({ text: cached });
      return;
    }

    // Get prompt based on mode
    let prompt;
    if (mode === 'simplify') {
      prompt = PROMPTS.simplify(text);
    } else if (mode === 'checklist') {
      prompt = PROMPTS.checklist(text);
    } else {
      sendResponse({ error: `Unknown mode: ${mode}` });
      return;
    }

    // Call LLM
    const result = await callLLM({
      prompt,
      mode,
      provider: config.provider,
      model: config.model,
      apiKey: config.apiKey,
      baseUrl: config.baseUrl,
    });

    // Cache the result
    addToCache(cacheKey, result);

    // Send response
    sendResponse({
      text: result,
      mode,
      source: url,
    });

  } catch (err) {
    console.error('ClarityAI LLM error:', err);
    sendResponse({
      error: err.message || 'AI service error. Please try again.',
    });
  }
}

// ── Config handlers ───────────────────────────────────────────
async function handleGetConfig(sendResponse) {
  try {
    const config = await StorageManager.getConfig();
    sendResponse({ config });
  } catch (err) {
    sendResponse({ error: err.message });
  }
}

async function handleSaveConfig(newConfig, sendResponse) {
  try {
    await StorageManager.saveConfig(newConfig);
    sendResponse({ success: true });
  } catch (err) {
    sendResponse({ error: err.message });
  }
}

// ── Cache helpers ─────────────────────────────────────────────
function addToCache(key, value) {
  responseCache.set(key, {
    value,
    timestamp: Date.now(),
  });

  // Clean old entries if cache is large
  if (responseCache.size > 100) {
    const now = Date.now();
    for (const [k, v] of responseCache) {
      if (now - v.timestamp > CACHE_TTL) {
        responseCache.delete(k);
      }
    }
  }
}

function getFromCache(key) {
  const entry = responseCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    responseCache.delete(key);
    return null;
  }
  return entry.value;
}

// ── Installation handler ──────────────────────────────────────
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // Open a setup page or just log
    console.log('🔍 ClarityAI installed successfully');
  }
});

// Log that service worker started
console.log('🔍 ClarityAI background service worker started');
