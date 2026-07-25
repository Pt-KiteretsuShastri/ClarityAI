/* Storage Manager — chrome.storage wrappers for config and caching */

const CONFIG_KEY = 'clarityai_config';
const DEFAULT_CONFIG = {
  provider: 'anthropic',
  model: '',
  apiKey: '',
  baseUrl: '',
  simplifyEnabled: true,
  focusEnabled: true,
  dyslexiaEnabled: true,
};

export const StorageManager = {
  /**
   * Get the full config object
   * @returns {Promise<Object>}
   */
  async getConfig() {
    try {
      const result = await chrome.storage.sync.get(CONFIG_KEY);
      const config = result[CONFIG_KEY] || {};
      return { ...DEFAULT_CONFIG, ...config };
    } catch (err) {
      console.warn('ClarityAI: Error reading config', err);
      return { ...DEFAULT_CONFIG };
    }
  },

  /**
   * Save config object
   * @param {Object} config
   * @returns {Promise<boolean>}
   */
  async saveConfig(config) {
    try {
      const existing = await this.getConfig();
      const merged = { ...existing, ...config };
      await chrome.storage.sync.set({ [CONFIG_KEY]: merged });
      return true;
    } catch (err) {
      console.warn('ClarityAI: Error saving config', err);
      throw err;
    }
  },

  /**
   * Check if API key is configured
   * @returns {Promise<boolean>}
   */
  async hasApiKey() {
    const config = await this.getConfig();
    return !!config.apiKey;
  },

  /**
   * Clear all stored data
   * @returns {Promise<boolean>}
   */
  async clearAll() {
    try {
      await chrome.storage.sync.remove(CONFIG_KEY);
      await chrome.storage.session.clear();
      return true;
    } catch (err) {
      console.warn('ClarityAI: Error clearing storage', err);
      return false;
    }
  },
};
