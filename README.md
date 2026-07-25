# 🔍 ClarityAI — Adaptive Reading Assistant

**One click makes any webpage easier to read.**

ClarityAI is a browser extension (Chrome + Firefox) that transforms web pages for accessibility — removing clutter, adapting formatting for dyslexia, and using AI to simplify complex language.

Built for the **Beyond the Browser** track at the Google Developer Community Hackathon.

## ✨ Features

| Mode | What it does |
|---|---|
| 🎯 **Focus Mode** | Removes ads, sidebars, headers, footers. Enlarges text, highlights headings, improves spacing. |
| 📖 **Dyslexia Mode** | Applies OpenDyslexic font, warm cream background, increased letter/word spacing, max-width for easier tracking. |
| ✂️ **Simplify** | AI rewrites dense paragraphs into plain language (grade 5-6 level). Preserves all facts, dates, and names. |
| ✅ **Reading Checklist** | Extracts key takeaways as a floating, interactive checklist. Drag, check off, collapse. |

## 🚀 Quick Start

### 1. Load in Chrome
1. Open `chrome://extensions`
2. Enable **Developer mode** (toggle top-right)
3. Click **Load unpacked**
4. Select the `accessibility-ext/` folder

### 2. Load in Firefox
1. Open `about:debugging#/runtime/this-firefox`
2. Click **Load Temporary Add-on**
3. Select `manifest.json` from the `accessibility-ext/` folder

### 3. Set up API key (for Simplify mode)
1. Click the ClarityAI icon in your toolbar
2. The extension will prompt you to enter your API key
3. Get an API key from [Anthropic](https://console.anthropic.com) or [OpenAI](https://platform.openai.com/api-keys)

## 🎮 How to Use

1. Navigate to any webpage (article, blog, documentation)
2. Click the ClarityAI icon in your browser toolbar
3. Click a mode to activate it:
   - **Focus Mode** — instantly declutters the page
   - **Dyslexia Mode** — applies dyslexia-friendly formatting
   - **Simplify** — rewrites content in plain language (requires API key)
4. Click the mode again to deactivate, or use **Reset Page** to clear all
5. Modes can be stacked (e.g., Focus + Dyslexia at the same time)

## 🏗️ Project Structure

```
accessibility-ext/
├── manifest.json            # Chrome/Firefox manifest
├── icons/                   # Extension icons (SVG)
├── popup/
│   ├── popup.html           # Mode selection UI
│   ├── popup.css            # Popup styling
│   └── popup.js             # Popup logic & messaging
├── content/
│   ├── content-script.js    # Message router & orchestrator
│   ├── modes/
│   │   ├── focus.js         # Focus mode implementation
│   │   ├── dyslexia.js      # Dyslexia mode implementation
│   │   └── simplify.js      # Simplify mode (AI rewrite)
│   ├── css/
│   │   ├── focus.css        # Focus mode styles
│   │   ├── dyslexia.css     # Dyslexia mode styles
│   │   └── simplify.css     # Simplify mode styles
│   └── utils/
│       ├── dom-utils.js     # DOM helpers (find main content, etc.)
│       └── reading-checklist.js  # Floating checklist overlay
├── background/
│   └── background.js        # Service worker (LLM API calls)
├── lib/
│   ├── llm.js               # LLM client (Anthropic + OpenAI)
│   ├── prompts.js           # Prompt templates
│   └── storage.js           # chrome.storage wrappers
├── demo/
│   └── demo-article.html    # Offline demo page for presentations
├── .env.example             # Example environment config
└── README.md
```

## 🧑‍💻 Team

| Area | Owner |
|---|---|
| Popup UI, content scripts, DOM manipulation | Frontend |
| LLM integration, prompts, service worker, caching | Backend |

## 📋 Demo Script (3 minutes)

```
1. Open demo/demo-article.html (a cluttered article page)
2. Click ClarityAI icon
3. Click Focus Mode 🎯 → "Focus Mode removes distractions."
4. Click Dyslexia Mode 📖 → "Dyslexia-friendly formatting."
5. Click Simplify ✂️ → "AI simplifies complex language."
6. Show Reading Checklist → "Key takeaways, automatically."
7. Click Reset → "Everything restored."
```

## 🔧 Tech Stack

- **Manifest**: Chrome MV3 (+ Firefox compatible)
- **Language**: Vanilla JavaScript (no frameworks)
- **Cross-browser**: webextension-polyfill compatible patterns
- **LLM Providers**: Anthropic Claude + OpenAI (configurable)
- **Fonts**: OpenDyslexic (loaded from CDN)

## 📄 License

MIT
