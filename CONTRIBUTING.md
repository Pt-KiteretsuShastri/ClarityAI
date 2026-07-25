# Contributing to ClarityAI

We love contributions! Here's how to get started.

## 🚀 Quick Start

```bash
# Clone the repo
git clone https://github.com/Pt-KiteretsuShastri/ClarityAI.git
cd ClarityAI/accessibility-ext

# Load as unpacked extension in Chrome:
# chrome://extensions → Developer mode → Load unpacked
```

## 🧠 Development Workflow

### 1. Pick a mode to work on

Each mode is self-contained:

| Mode | JS file | CSS file |
|---|---|---|
| 🎯 Focus | `content/modes/focus.js` | `content/css/focus.css` |
| 📖 Dyslexia | `content/modes/dyslexia.js` | `content/css/dyslexia.css` |
| ✂️ Simplify | `content/modes/simplify.js` | `content/css/simplify.css` |

### 2. Make your changes

- **JS**: Each mode exports `enable()` and `disable()` methods
- **CSS**: Each mode uses a unique class prefix (`.clarity-{mode}-mode`)
- **DOM**: All changes must be revertible (store originals, restore on disable)

### 3. Test

```bash
# 1. Go to chrome://extensions
# 2. Click the refresh icon on ClarityAI
# 3. Open a test page
# 4. Click the extension and try your mode
# 5. Check console for errors (F12 → Console)
```

### 4. Commit

```bash
git add .
git commit -m "feat: add [your feature]"
git push
```

## 📋 Coding Guidelines

### General

- **Vanilla JS only** — no frameworks, no transpilers
- **IIFE pattern** for content scripts to avoid polluting global scope
- Use `window.*` to export shared utilities between content script files
- All DOM changes must be fully revertible

### Mode Structure

Every mode module must follow this pattern:

```javascript
window.MyMode = {
  enabled: false,

  /** Apply transformations to the page */
  enable() {
    if (this.enabled) return { success: true, alreadyActive: true };
    this.enabled = true;
    // ... apply CSS classes, modify DOM, store originals ...
    return { success: true, mode: 'mymode', state: 'enabled' };
  },

  /** Revert all transformations */
  disable() {
    if (!this.enabled) return { success: true, alreadyInactive: true };
    this.enabled = false;
    // ... remove CSS classes, restore DOM originals ...
    return { success: true, mode: 'mymode', state: 'disabled' };
  }
};
```

### CSS Naming

- Prefix all classes with `clarity-`
- Use custom properties for theme values
- Use `!important` only for mode overrides (they need to beat page styles)
- Never modify the original page's stylesheet

### Messaging

- Popup → Content: `chrome.tabs.sendMessage(tabId, { mode, action })`
- Content → Background: `chrome.runtime.sendMessage({ type, ... })`
- Background → Content: `chrome.runtime.sendMessage({ ... })`
- Always return `true` from message listeners for async responses

### Commit Messages

Follow conventional commits:

```
feat: add new feature
fix: bug fix
refactor: code restructuring
docs: documentation only
style: formatting only
perf: performance improvement
```

## 🐛 Reporting Bugs

Open an issue with:

1. Browser version
2. Steps to reproduce
3. Expected vs actual behavior
4. Console errors (if any)

## 💡 Feature Requests

Open an issue describing:

1. What you want to add
2. Why it's useful for accessibility
3. How the demo would look (this is a hackathon project!)

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.
