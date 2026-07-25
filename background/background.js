/**
 * @fileoverview Background Service Worker — Handles LLM API calls with caching.
 *
 * This script runs as a service worker (Manifest V3) in a privileged context.
 * It handles:
 * - LLM API requests from content scripts (simplify, checklist)
 * - Configuration storage and retrieval
 * - In-memory response caching with TTL
 *
 * Communication flow:
 *   content-script.js  ──(chrome.runtime.sendMessage)──►  background.js  ──►  LLM API
 */

import { callLLM } from '../lib/llm.js';
import { PROMPTS } from '../lib/prompts.js';
import { StorageManager } from '../lib/storage.js';

// ── Constants ─────────────────────────────────────────────────
/** @const {number} Cache TTL in milliseconds (30 minutes) */
const CACHE_TTL = 30 * 60 * 1000;

/** @const {number} Maximum cache entries before LRU cleanup */
const MAX_CACHE_SIZE = 100;

// ── In-Memory Cache ───────────────────────────────────────────
/**
 * LLM response cache. Entries expire after CACHE_TTL.
 * @type {Map<string, {value: string, timestamp: number}>}
 */
const responseCache = new Map();

// ── Message Handler ───────────────────────────────────────────
/**
 * Central message dispatcher for the extension.
 * Routes messages to the appropriate handler based on type.
 *
 * @param {Object} msg - Incoming message
 * @param {string} msg.type - Message type
 * @param {Function} sender - Sender info
 * @param {Function} sendResponse - Response callback
 * @returns {boolean} True if response will be sent asynchronously
 */
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  switch (msg.type) {
    case 'LLM_REQUEST':
      handleLLMRequest(msg, sendResponse);
      return true; // Async — keep channel open

    case 'GET_CONFIG':
      handleGetConfig(sendResponse);
      return true;

    case 'SAVE_CONFIG':
      handleSaveConfig(msg.config, sendResponse);
      return true;

    default:
      sendResponse({ error: `Unknown message type: ${msg.type}` });
      return false;
  }
});

// ── LLM Request Handler ───────────────────────────────────────

/**
 * Process an LLM request from the content script.
 * Validates input, checks cache, selects prompt, calls LLM, caches result.
 *
 * @param {Object} msg - Request message
 * @param {string} msg.mode - 'simplify' | 'checklist'
 * @param {string} msg.text - Text content to process
 * @param {string} [msg.url] - Page URL (for cache key)
 * @param {Function} sendResponse - Response callback
 */
async function handleLLMRequest(msg, sendResponse) {
  const { mode, text, url } = msg;

  try {
    // ── Validate input ────────────────────────────────────
    if (!text || text.trim().length < 10) {
      sendResponse({ error: 'Not enough text to process. Try a page with more content.' });
      return;
    }

    // ── Load configuration ─────────────────────────────────
    const config = await StorageManager.getConfig();
    if (!config.apiKey) {
      sendResponse({
        error: 'API key not configured. Click the extension icon, then the ⚙️ gear to set up your API key.',
      });
      return;
    }

    // ── Check cache ────────────────────────────────────────
    const cacheKey = `${mode}:${hashString(text.slice(0, 200))}`;
    const cached = getCached(cacheKey);
    if (cached) {
      sendResponse({ text: cached, mode, source: url, cached: true });
      return;
    }

    // ── Select prompt template ─────────────────────────────
    let prompt;
    switch (mode) {
      case 'simplify':
        prompt = PROMPTS.simplify(text);
        break;
      case 'checklist':
        prompt = PROMPTS.checklist(text);
        break;
      default:
        sendResponse({ error: `Unknown LLM mode: ${mode}` });
        return;
    }

    // ── Call LLM ───────────────────────────────────────────
    const result = await callLLM({
      prompt,
      mode,
      provider: config.provider,
      model: config.model,
      apiKey: config.apiKey,
      baseUrl: config.baseUrl,
    });

    // ── Cache and respond ──────────────────────────────────
    setCached(cacheKey, result);
    sendResponse({ text: result, mode, source: url, cached: false });

  } catch (err) {
    console.error('🔍 ClarityAI LLM error:', err.message);
    sendResponse({
      error: err.message || 'AI service error. Please try again.',
    });
  }
}

// ── Config Handlers ───────────────────────────────────────────

/**
 * Retrieve the current extension configuration.
 * @param {Function} sendResponse - Response callback
 */
async function handleGetConfig(sendResponse) {
  try {
    const config = await StorageManager.getConfig();
    // Never expose full API key in response
    const safeConfig = {
      ...config,
      apiKey: config.apiKey ? `${config.apiKey.slice(0, 8)}...` : '',
    };
    sendResponse({ config: safeConfig, hasKey: !!config.apiKey });
  } catch (err) {
    sendResponse({ error: err.message });
  }
}

/**
 * Save extension configuration.
 * @param {Object} newConfig - Configuration to save
 * @param {Function} sendResponse - Response callback
 */
async function handleSaveConfig(newConfig, sendResponse) {
  try {
    if (!newConfig.apiKey || !newConfig.apiKey.trim()) {
      sendResponse({ error: 'API key is required' });
      return;
    }
    await StorageManager.saveConfig(newConfig);
    sendResponse({ success: true });
  } catch (err) {
    sendResponse({ error: err.message });
  }
}

// ── Cache Helpers ─────────────────────────────────────────────

/**
 * Simple string hash for cache keys.
 * @param {string} str - String to hash
 * @returns {string} Hash string
 */
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return 'h' + Math.abs(hash).toString(36);
}

/**
 * Store a value in the response cache with TTL.
 * Automatically cleans old entries when size exceeds limit.
 * @param {string} key - Cache key
 * @param {string} value - Response to cache
 */
function setCached(key, value) {
  // Clean if over limit
  if (responseCache.size >= MAX_CACHE_SIZE) {
    const now = Date.now();
    let deleted = 0;
    for (const [k, v] of responseCache) {
      if (now - v.timestamp > CACHE_TTL) {
        responseCache.delete(k);
        deleted++;
      }
    }
    // If still over limit, delete oldest entries
    if (responseCache.size >= MAX_CACHE_SIZE) {
      const entries = Array.from(responseCache.entries());
      const toDelete = entries.slice(0, Math.ceil(MAX_CACHE_SIZE * 0.3));
      toDelete.forEach(([k]) => responseCache.delete(k));
    }
  }

  responseCache.set(key, { value, timestamp: Date.now() });
}

/**
 * Retrieve a cached value if it hasn't expired.
 * @param {string} key - Cache key
 * @returns {string|null} Cached value or null
 */
function getCached(key) {
  const entry = responseCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    responseCache.delete(key);
    return null;
  }
  return entry.value;
}

// ── Lifecycle Hooks ───────────────────────────────────────────

/** Log on installation */
chrome.runtime.onInstalled.addListener((details) => {
  console.log(`🔍 ClarityAI ${details.reason === 'install' ? 'installed' : 'updated'} successfully`);
});

console.log('🔍 ClarityAI background service worker ready');
