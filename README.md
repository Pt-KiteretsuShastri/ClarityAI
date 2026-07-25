# 🔍 ClarityAI

**Adaptive Reading Assistant — One click makes any webpage easier to read.**

[![Chrome Web Store](https://img.shields.io/badge/Chrome-Install-4F46E5?logo=google-chrome)](https://github.com/Pt-KiteretsuShastri/ClarityAI)
[![Firefox Add-on](https://img.shields.io/badge/Firefox-Install-FF7139?logo=firefox-browser)](https://github.com/Pt-KiteretsuShastri/ClarityAI)
[![License: MIT](https://img.shields.io/badge/License-MIT-22C55E.svg)](LICENSE)

ClarityAI is a **browser extension** (Chrome + Firefox) that transforms web pages for accessibility. Built for the **"Beyond the Browser"** track at the Google Developer Community Hackathon.

---

## ✨ Features

| Mode | One-click magic | How it works |
|---|---|---|
| 🎯 **Focus Mode** | Removes clutter, enlarges text, highlights key info | Hides ads/sidebars/headers, identifies main content, improves readability CSS |
| 📖 **Dyslexia Mode** | Dyslexia-friendly formatting in one click | OpenDyslexic font, warm cream background, increased letter/word spacing, max-width tracking |
| ✂️ **Simplify** | AI rewrites dense paragraphs in plain language | Extracts main text → LLM simplifies (grade 5-6 level) → replaces in-place with citations |
| ✅ **Reading Checklist** | Floating checklist of key takeaways | Extracts action items via AI, draggable panel, check-off tracking |

### How they stack

Modes work **independently or stacked** — enable Focus + Dyslexia together, toggle Simplify on top. Reset clears everything instantly.

---

## 🚀 Quick Start

### 1. Load in Chrome
```bash
# 1. Open chrome://extensions
# 2. Enable "Developer mode" (top-right toggle)
# 3. Click "Load unpacked"
# 4. Select the accessibility-ext/ folder
```

### 2. Load in Firefox
```bash
# 1. Open about:debugging#/runtime/this-firefox
# 2. Click "Load Temporary Add-on"
# 3. Select manifest.json from accessibility-ext/
```

### 3. Set up API key (required for Simplify mode)

Get a key from [Anthropic](https://console.anthropic.com) or [OpenAI](https://platform.openai.com/api-keys), then click the ClarityAI icon → enter your key in the settings.

---

## 🎮 Demo Script (3-minute presentation)

```
1. Open demo/demo-article.html     ← cluttered news article with ads + popups
2. Click ClarityAI icon in toolbar
3. Click Focus Mode 🎯
   → "Focus Mode removes distractions. Ads gone. Text larger. Clean."
4. Click Dyslexia Mode 📖
   → "Dyslexia-friendly formatting — proven font, spacing, colors."
5. Click Simplify ✂️
   → "AI simplifies complex language. All facts preserved."
6. Show Reading Checklist
   → "Key takeaways, extracted automatically."
7. Click Reset Page
   → "Everything restored. No permanent changes."
```

---

## 🏗️ Architecture

```
accessibility-ext/
├── manifest.json              # Chrome MV3 + Firefox compatible
├── icons/                     # SVG icons (16, 48, 128)
│
├── popup/                     # Extension popup UI
│   ├── popup.html             # Mode selection cards
│   ├── popup.css              # Dark-themed popup styling
│   └── popup.js               # Click → sendMessage to content script
│
├── content/                   # Injected into web pages
│   ├── content-script.js      # Message router + state orchestrator
│   ├── modes/
│   │   ├── focus.js           # Clutter removal + readability
│   │   ├── dyslexia.js        # OpenDyslexic + spacing
│   │   └── simplify.js        # Text extraction + LLM injection
│   ├── css/
│   │   ├── focus.css          # Focus mode CSS
│   │   ├── dyslexia.css       # Dyslexia mode CSS
│   │   └── simplify.css       # Simplify mode CSS
│   └── utils/
│       ├── dom-utils.js       # Main content finder, clutter selectors
│       └── reading-checklist.js  # Floating draggable checklist
│
├── background/
│   └── background.js          # Service worker (LLM API + caching)
│
├── lib/
│   ├── llm.js                 # Anthropic + OpenAI clients
│   ├── prompts.js             # Prompt templates (simplify, checklist)
│   └── storage.js             # chrome.storage.sync wrappers
│
├── demo/
│   └── demo-article.html      # Offline demo page
│
├── .env.example               # Example config
├── .gitignore
├── LICENSE
└── README.md
```

---

## 🧑‍💻 Team

| Role | Responsibilities |
|---|---|
| **Frontend** | Popup UI, content scripts, DOM manipulation, CSS modes, demo page |
| **Backend** | LLM integration, prompt engineering, service worker, caching, config |

---

## ⚙️ LLM Provider Support

ClarityAI supports **Anthropic Claude** and **OpenAI** (plus any OpenAI-compatible endpoint):

| Provider | Default Model | Config |
|---|---|---|
| Anthropic | `claude-3-haiku-20240307` | Set `provider: anthropic` + API key |
| OpenAI | `gpt-4o-mini` | Set `provider: openai` + API key |
| Custom | Any | Set `provider: openai` + custom `baseUrl` |

Configuration is stored in `chrome.storage.sync` and set through the extension popup.

---

## 🔧 Tech Stack

| Layer | Technology |
|---|---|
| **Extension** | Chrome Manifest V3 + Firefox compatible |
| **Language** | Vanilla JavaScript (ES modules) |
| **Cross-browser** | Manifest V3 patterns, no framework deps |
| **LLM** | Anthropic Claude + OpenAI (configurable) |
| **Font** | OpenDyslexic (CDN-loaded woff2) |
| **Storage** | chrome.storage.sync |

---

## 📄 License

MIT — see [LICENSE](LICENSE) for details.

Built with ❤️ for the Google Developer Community Hackathon.
