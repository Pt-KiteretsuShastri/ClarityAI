# ClarityAI — Browser Extension

> The web should adapt to people — not the other way around.

ClarityAI is an AI-powered Chrome/Firefox extension that transforms any webpage into a personalized, distraction-free reading experience.

## Features

| Mode | Description |
|------|-------------|
| 🎯 **Focus Mode** | Removes ads, sidebars, cookie banners, popups, and visual clutter |
| 📖 **Dyslexia Mode** | Applies OpenDyslexic font, warm background tint, and accessibility-optimized spacing |
| ✂️ **Simplify** | Uses GPT-4o-mini to rewrite complex content in plain, easy-to-understand language |
| ✅ **Reading Checklist** | Extracts all headings into an interactive side panel you can check off as you read |

## Building the Extension

### Prerequisites
- Node.js 18+
- pnpm

### Install dependencies
```bash
cd artifacts/clarity-ai-extension
pnpm install
```

### Build
```bash
pnpm run build
```

This will:
1. Generate the extension icons (`public/icons/`)
2. Build and bundle all source files into `dist/`

The built extension will be in the `dist/` folder.

## Loading in Chrome

1. Open Chrome and navigate to `chrome://extensions`
2. Enable **Developer mode** (toggle in the top-right corner)
3. Click **"Load unpacked"**
4. Select the `dist/` folder inside `artifacts/clarity-ai-extension/`
5. The ClarityAI icon will appear in your Chrome toolbar

## Loading in Firefox

1. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`
2. Click **"Load Temporary Add-on..."**
3. Select the `dist/manifest.json` file
4. The ClarityAI icon will appear in your Firefox toolbar

## Using the Simplify Feature

The Simplify mode requires an OpenAI API key:

1. Click the ClarityAI extension icon
2. Click the ⚙️ settings gear in the top-right
3. Enter your OpenAI API key (starts with `sk-`)
4. Click **Save API Key**

Your API key is stored **only in local browser storage** — it never leaves your device except for direct calls to OpenAI's API.

## Architecture

```
src/
├── popup/          # React-based popup UI (shown when you click the icon)
│   ├── index.html
│   ├── main.tsx
│   └── Popup.tsx
├── content/        # Content script (runs on every webpage)
│   └── index.ts
└── background/     # Service worker (handles AI API calls)
    └── index.ts
```

- **Manifest V3** compliant
- **Permissions**: `activeTab`, `scripting`, `storage`, `<all_urls>`
- **No data collection** — all processing is local except Simplify (OpenAI API)

## Built During
**Sketch'N'Ship Hackathon 2026** · Open Source · MIT License
