import { useState, useEffect } from "react";
import {
  Eye,
  BookOpen,
  Scissors,
  CheckSquare,
  Settings,
  X,
  Key,
  ChevronRight,
  Sparkles,
  Globe,
} from "lucide-react";

interface Modes {
  focusMode: boolean;
  dyslexiaMode: boolean;
  simplifyMode: boolean;
  checklistMode: boolean;
}

interface ModeButtonProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  active: boolean;
  color: string;
  onClick: () => void;
  loading?: boolean;
}

function ModeButton({
  icon,
  label,
  description,
  active,
  color,
  onClick,
  loading,
}: ModeButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl border transition-all duration-200 text-left group ${
        active
          ? `bg-gradient-to-r ${color} border-transparent shadow-md`
          : "bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm"
      } ${loading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <div
        className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
          active ? "bg-white/20" : "bg-gray-50 group-hover:bg-gray-100"
        }`}
      >
        <span className={active ? "text-white" : "text-gray-500"}>{icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-semibold leading-none mb-0.5 ${
            active ? "text-white" : "text-gray-800"
          }`}
        >
          {label}
        </p>
        <p
          className={`text-xs leading-tight ${
            active ? "text-white/75" : "text-gray-400"
          }`}
        >
          {loading ? "Applying..." : description}
        </p>
      </div>
      <div
        className={`flex-shrink-0 w-10 h-5 rounded-full transition-all relative ${
          active ? "bg-white/30" : "bg-gray-200"
        }`}
      >
        <div
          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-200 ${
            active ? "left-5" : "left-0.5"
          }`}
        />
      </div>
    </button>
  );
}

export default function Popup() {
  const [modes, setModes] = useState<Modes>({
    focusMode: false,
    dyslexiaMode: false,
    simplifyMode: false,
    checklistMode: false,
  });
  const [currentTab, setCurrentTab] = useState<chrome.tabs.Tab | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [savedApiKey, setSavedApiKey] = useState("");
  const [loading, setLoading] = useState<Partial<Record<keyof Modes, boolean>>>(
    {}
  );
  const [statusMsg, setStatusMsg] = useState("");

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        setCurrentTab(tabs[0]);
        const tabId = tabs[0].id;
        if (tabId) {
          chrome.storage.local.get(
            [`modes_${tabId}`, "openai_api_key"],
            (result) => {
              if (result[`modes_${tabId}`]) {
                setModes(result[`modes_${tabId}`]);
              }
              if (result["openai_api_key"]) {
                setSavedApiKey(result["openai_api_key"]);
                setApiKey(result["openai_api_key"]);
              }
            }
          );
        }
      }
    });
  }, []);

  const showStatus = (msg: string) => {
    setStatusMsg(msg);
    setTimeout(() => setStatusMsg(""), 2500);
  };

  const toggleMode = async (mode: keyof Modes) => {
    const tabId = currentTab?.id;
    if (!tabId) return;

    if (mode === "simplifyMode" && !modes.simplifyMode && !savedApiKey) {
      setShowSettings(true);
      showStatus("Add your OpenAI API key first");
      return;
    }

    setLoading((prev) => ({ ...prev, [mode]: true }));

    const newActive = !modes[mode];
    const newModes = { ...modes, [mode]: newActive };

    try {
      await chrome.tabs.sendMessage(tabId, {
        type: "TOGGLE_MODE",
        mode,
        active: newActive,
      });
      setModes(newModes);
      chrome.storage.local.set({ [`modes_${tabId}`]: newModes });
      showStatus(
        newActive
          ? `${getModeLabel(mode)} activated`
          : `${getModeLabel(mode)} deactivated`
      );
    } catch {
      // Content script might not be ready; inject it first
      try {
        await chrome.scripting.executeScript({
          target: { tabId },
          files: ["src/content/index.ts"],
        });
        await chrome.tabs.sendMessage(tabId, {
          type: "TOGGLE_MODE",
          mode,
          active: newActive,
        });
        setModes(newModes);
        chrome.storage.local.set({ [`modes_${tabId}`]: newModes });
      } catch (e) {
        showStatus("Cannot run on this page");
      }
    }

    setLoading((prev) => ({ ...prev, [mode]: false }));
  };

  const getModeLabel = (mode: keyof Modes) => {
    const labels: Record<keyof Modes, string> = {
      focusMode: "Focus Mode",
      dyslexiaMode: "Dyslexia Mode",
      simplifyMode: "Simplify",
      checklistMode: "Reading Checklist",
    };
    return labels[mode];
  };

  const saveApiKey = () => {
    chrome.storage.local.set({ openai_api_key: apiKey });
    setSavedApiKey(apiKey);
    setShowSettings(false);
    showStatus("API key saved!");
  };

  const resetAll = async () => {
    const tabId = currentTab?.id;
    if (!tabId) return;
    try {
      await chrome.tabs.sendMessage(tabId, { type: "RESET_ALL" });
    } catch {}
    const cleared: Modes = {
      focusMode: false,
      dyslexiaMode: false,
      simplifyMode: false,
      checklistMode: false,
    };
    setModes(cleared);
    chrome.storage.local.set({ [`modes_${tabId}`]: cleared });
    showStatus("All modes reset");
  };

  const activeCount = Object.values(modes).filter(Boolean).length;
  const hostname = currentTab?.url
    ? (() => {
        try {
          return new URL(currentTab.url).hostname.replace("www.", "");
        } catch {
          return currentTab.url;
        }
      })()
    : "Loading...";

  if (showSettings) {
    return (
      <div className="w-[340px] min-h-[400px] bg-white flex flex-col">
        {/* Settings Header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSettings(false)}
              className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <X size={14} className="text-gray-600" />
            </button>
            <span className="text-sm font-semibold text-gray-800">
              Settings
            </span>
          </div>
        </div>

        <div className="flex-1 p-4 space-y-5">
          {/* API Key Section */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Key size={14} className="text-indigo-500" />
              <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                OpenAI API Key
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-3 leading-relaxed">
              Required for the{" "}
              <span className="font-medium text-gray-700">Simplify</span> mode.
              Your key is stored locally and never sent to our servers.
            </p>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm font-mono placeholder-gray-300 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
            />
            <button
              onClick={saveApiKey}
              disabled={!apiKey.startsWith("sk-")}
              className="mt-3 w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-md transition-all"
            >
              Save API Key
            </button>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100" />

          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={14} className="text-indigo-500" />
              <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                About ClarityAI
              </span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Built during Sketch'N'Ship Hackathon 2026. Open source and free
              to use.
            </p>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="mt-2 flex items-center gap-1.5 text-xs text-indigo-500 hover:text-indigo-700 font-medium transition-colors"
            >
              View on GitHub <ChevronRight size={12} />
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[340px] min-h-[480px] bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-3.5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-200">
              <Sparkles size={14} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 leading-none">
                ClarityAI
              </p>
              <p className="text-[10px] text-gray-400 leading-none mt-0.5">
                AI Reading Assistant
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowSettings(true)}
            className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <Settings size={15} className="text-gray-400" />
          </button>
        </div>

        {/* Current site */}
        <div className="flex items-center gap-2 px-2.5 py-1.5 bg-gray-50 rounded-lg border border-gray-100">
          <Globe size={11} className="text-gray-400 flex-shrink-0" />
          <span className="text-xs text-gray-500 truncate flex-1">
            {hostname}
          </span>
          {activeCount > 0 && (
            <span className="flex-shrink-0 text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-full">
              {activeCount} active
            </span>
          )}
        </div>
      </div>

      {/* Status message */}
      {statusMsg && (
        <div className="mx-3 mt-3 px-3 py-2 bg-indigo-50 border border-indigo-100 rounded-lg">
          <p className="text-xs text-indigo-700 font-medium text-center">
            {statusMsg}
          </p>
        </div>
      )}

      {/* Mode Toggles */}
      <div className="flex-1 p-3 space-y-2">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-1 mb-3">
          Reading Modes
        </p>

        <ModeButton
          icon={<Eye size={16} />}
          label="Focus Mode"
          description="Remove ads, sidebars & clutter"
          active={modes.focusMode}
          color="from-indigo-500 to-indigo-600"
          onClick={() => toggleMode("focusMode")}
          loading={loading.focusMode}
        />

        <ModeButton
          icon={<BookOpen size={16} />}
          label="Dyslexia Mode"
          description="Accessible font, spacing & tint"
          active={modes.dyslexiaMode}
          color="from-violet-500 to-violet-600"
          onClick={() => toggleMode("dyslexiaMode")}
          loading={loading.dyslexiaMode}
        />

        <ModeButton
          icon={<Scissors size={16} />}
          label="Simplify"
          description={
            savedApiKey
              ? "AI rewrites in plain language"
              : "Requires OpenAI API key"
          }
          active={modes.simplifyMode}
          color="from-purple-500 to-purple-600"
          onClick={() => toggleMode("simplifyMode")}
          loading={loading.simplifyMode}
        />

        <ModeButton
          icon={<CheckSquare size={16} />}
          label="Reading Checklist"
          description="Extract key headings & takeaways"
          active={modes.checklistMode}
          color="from-blue-500 to-blue-600"
          onClick={() => toggleMode("checklistMode")}
          loading={loading.checklistMode}
        />
      </div>

      {/* Footer */}
      <div className="px-3 pb-3">
        {activeCount > 0 && (
          <button
            onClick={resetAll}
            className="w-full py-2 rounded-xl border border-gray-200 text-xs text-gray-500 font-medium hover:bg-white hover:border-gray-300 transition-all"
          >
            Reset all modes
          </button>
        )}
        <p className="text-center text-[10px] text-gray-300 mt-2">
          ClarityAI · Hackathon 2026
        </p>
      </div>
    </div>
  );
}
