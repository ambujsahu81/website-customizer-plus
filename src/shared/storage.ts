export type PageStyle = {
  url: string;
  removeMode: boolean;
  darkMode: boolean;
  adblocker: boolean;
  hideImages: boolean;
  saveCustomOption: boolean;
  customBackground: string | null;
  customFontFamily: string | null;
  customFontSize: string | null;
  customeFontWeight: string | null;
  customFontColor: string | null;
  customFontSelector: string | null;
  clearAll: boolean;
  clear: boolean;
};

export class Configs {
  pageStyle: PageStyle[] = [];
}

export const configStorage = {
  get: (callback: (configs: Configs) => void) => {
    chrome.storage.sync.get({ configs: new Configs() }, (storage) => {
      callback(storage.configs);
    });
  },
  set: (configs: Configs, callback?: () => void) => {
    chrome.storage.sync.set({ configs }, () => {
      callback?.();
    });
  },
  listen: (callback: (configs: Configs) => void) => {
    chrome.storage.onChanged.addListener((changes) => {
      if (changes.configs) {
        callback(changes.configs.newValue);
      }
    });
  },
};
