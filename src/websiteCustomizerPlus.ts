import { Configs, configStorage, PageStyle } from './shared/storage';
import * as Util from './shared/utils';
import './websiteCustomizerPlus.css';

let pageStyle: PageStyle;
let intervalID:  NodeJS.Timeout;
let removeDomState = false;

const updateDom = (): void => {
  configStorage.get((configs) => {
    if (configs) {
      const updatedPageStyle: PageStyle = configs.pageStyle.find(
        (config) => config.url === Util.getHostName(document.URL))!;
      const pageStyleIndex = configs.pageStyle.findIndex((config) => config.url === Util.getHostName(document.URL))!;
      if (updatedPageStyle) {
        if (updatedPageStyle.clear) {
          configs.pageStyle[pageStyleIndex].clear = false;
          configStorage.set(configs);
          document.location.reload();
          return;
        }
        if (updatedPageStyle.clearAll) {
          document.location.reload();
          return;
        }
        EnableDarkMode(updatedPageStyle.darkMode);
        if (updatedPageStyle.adblocker) {
          intervalID = setInterval(enableAdblocker, 500);
        } else {
          clearInterval(intervalID);
        }
        HideAllImages(updatedPageStyle.hideImages);
        if (updatedPageStyle.removeMode != removeDomState) {
          hideElementsFromDom(updatedPageStyle.removeMode);
          removeDomState = updatedPageStyle.removeMode;
        }
        applyCustomPropertiesToDom(updatedPageStyle);
      }
    }
  });
};

const refresh = (): void => {
  configStorage.get((configs) => {
    if (configs) {
      pageStyle = configs.pageStyle.find((config) => config.url === Util.getHostName(document.URL))!;
      const pageStyleIndex = configs.pageStyle.findIndex((config) => config.url === Util.getHostName(document.URL))!;
      if (pageStyle) {
        if (pageStyle.clearAll) {
          return;
        }
        // set the hide dom option to false
        configs.pageStyle[pageStyleIndex].removeMode = false;
        if (!pageStyle.saveCustomOption) {
          pageStyle.customBackground = '#FFFFFF';
          pageStyle.customFontColor = '#FFFFFF';
          pageStyle.customFontFamily = '';
          pageStyle.customFontSelector = '';
          pageStyle.customFontSize = '';
          pageStyle.customeFontWeight = '';
        }

        configStorage.set(configs);
        EnableDarkMode(pageStyle.darkMode);
        if (pageStyle.adblocker) {
          intervalID = setInterval(enableAdblocker, 500);
        } else {
          clearInterval(intervalID);
        }
        HideAllImages(pageStyle.hideImages);
        if (pageStyle.saveCustomOption) {
          applyCustomPropertiesToDom(pageStyle);
        }
      }
    }
  });
};
refresh();
configStorage.listen(updateDom);

const EnableDarkMode = (flag: boolean): void => {
  const id = 'dark-theme-snippet';
  const snippet: HTMLElement | null = document.getElementById(id);
  if (null != snippet) {
    snippet.parentNode!.removeChild(snippet);
  }
  if (flag) {
    const css = `
      :root{
        background-color: #fefefe;
        filter: invert(100%)
      }
      * {
        background-color: inherit
      }
      img:not([src*=".svg"]), video{
        filter: invert(100%)
      }
    `;
    const style: HTMLStyleElement = document.createElement('style');
    style.id = id;
    style.appendChild(document.createTextNode(css));
    document.querySelector('head')!.appendChild(style);
  }
};

const HideAllImages = (flag: boolean): void => {
  if (flag) {
    const images = document.getElementsByTagName('img');
    const images_length = images.length;
    for (let i = 0; i < images_length; i++) {
      images[i].style.setProperty('display', 'none', 'important');
    }

    /** now also hide images which are implemented in css */
    const all_elements: any = document.querySelectorAll('*');
    for (let i = 0; i < all_elements.length; i++) {
      all_elements[i].style.setProperty('background-image', 'unset', 'important');
    }
  } else {
    const images = document.getElementsByTagName('img');
    const images_length = images.length;
    for (let i = 0; i < images_length; i++) {
      images[i].style.setProperty('display', 'inherit', 'important');
    }
  }
};

const enableAdblocker = (): void => {
  const adCls = [
    'adsbygoogle',
    'mod_ad_container',
    'brn-ads-box',
    'gpt-ad',
    'ad-box',
    'top-ads-container',
    'adthrive-ad',
  ];
  const adSelector = [
    '[aria-label="advertisement"]',
    '[class*="-ad "], [class*="-ad-"], [class$="-ad"], [class^="ad-"]',
    'div[id^="google_ads_iframe_"',
  ];
  for (const cls of adCls) {
    const elementList = document.getElementsByClassName(cls);
    Array.from(elementList).forEach((v) => {
      if (!shouldIgnore(v)) {
        v.remove();
      }
    });
  }
  for (const selector of adSelector) {
    const elementList = document.querySelectorAll(selector);
    Array.from(elementList).forEach((v) => {
      if (!shouldIgnore(v)) {
        v.remove();
      }
    });
  }
  const adElements = document.getElementsByClassName('*');
  for (const elem of adElements) {
    let flag = 0;
    for (const clsname of elem.classList) {
      if (clsname.startsWith('ad') || /[-_\s]ad(?:vertisement)?$/.test(clsname)) {
        flag = 1;
      }
    }
    if (!shouldIgnore(elem)) {
      elem.remove();
    }
  }
  const adElement = document.getElementsByClassName('[class*="ad"]');
  for (const elem of adElement) {
    let flag = 0;
    for (const clsname of elem.classList) {
      if (clsname.startsWith('ad') || /[-_\s]ad(?:vertisement)?$/.test(clsname)) {
        flag = 1;
      }
    }
    if (!shouldIgnore(elem)) {
      elem.remove();
    }
  }

  const exceptOrigins = ['https://disqus.com', document.defaultView!.location.origin];

  for (const e of document.getElementsByTagName('iframe')) {
    try {
      const orgn = new URL(e.src || 'http://unknown-src').origin;
      if (!exceptOrigins.includes(orgn)) {
        e.parentElement!.removeChild(e);
        console.log('REMOVE IFRAME', orgn);
      }
    } catch (err) {
      console.log('REMOVE ERROR', err);
    }
  }
};

const shouldIgnore = (elem: any) => {
  const articles = document.getElementsByTagName('article');
  const ignore = ['body', '.ad-layout'];
  for (const a of articles) {
    if (elem.contains(a)) {
      return true; // ignore if an article descends from it
    }
  }
  for (const element of ignore) {
    if (elem.matches(element)) {
      return true;
    }
  }
};

const hideElementsFromDom = (flag: boolean): void => {
  if (flag) {
    if (document.getElementById('overlayWCP')) {
      return;
    }
    const overlay = document.createElement('div');
    overlay.id = 'overlayWCP';
    overlay.style.cssText = `position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgb(255 255 255 / 59%);
    z-index: 99999;
    pointer-events: none;
    align-items: center;
    flex-direction: column;
    justify-content: flex-start;`;

    const headerone = document.createElement('h1');
    headerone.id = 'headerOne';
    headerone.style.cssText = `color: white; 
    background: black;
    margin: 0rem; 
    text-align: center; 
    `;
    headerone.innerText = 'select elements to focus';
    const headertwo = document.createElement('h1');
    headertwo.id = 'headerTwo';
    headertwo.style.cssText = `color: white; 
    background: black;
    margin: 0rem;
    text-align: center;
    `;
    headertwo.innerText = 'After selection click the remove button to remove the rest from page';
    overlay.appendChild(headerone);
    overlay.appendChild(headertwo);
    document.body.appendChild(overlay);
    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove rest of the content';
    removeButton.id = 'removeBttn';
    removeButton.style.border = '1px solid red';
    removeButton.style.color = 'red';
    removeButton.style.background = 'black';
    removeButton.style.position = 'fixed';
    removeButton.style.zIndex = '999999';
    removeButton.style.top = '15%';
    removeButton.style.left = '50%';
    removeButton.style.padding = '0.7rem';
    removeButton.addEventListener('click', removeOverlay);
    document.body.appendChild(removeButton);
    document.body.querySelectorAll('a').forEach((Element) => (Element.style.pointerEvents = 'none'));
    document.addEventListener('click', setFocusObject);
  } else {
    document.location.reload();
    document.getElementById('overlayWCP')?.remove();
    document.querySelectorAll('.WCPElement').forEach((element) => {
      (element as HTMLElement).style.zIndex = 'intial';
      (element as HTMLElement).style.position = 'inherit';
    });
    document.body.querySelectorAll('a').forEach((Element) => (Element.style.pointerEvents = 'auto'));
  }
};

const setFocusObject = (e: any): void => {
  (e.target as HTMLElement).style.border = '1px solid red';
  (e.target as HTMLElement).classList.add('WCPElement');
};

const removeOverlay = (): void => {
  document.removeEventListener('click', setFocusObject);
  document.getElementById('overlayWCP')!.style.background = 'rgb(255 255 255 / 100%)';
  document.getElementById('headerOne')!.innerText = ' FocusMode is On';
  document.getElementById('headerTwo')?.remove();
  document.getElementById('removeBttn')?.remove();
  document.querySelectorAll('*').forEach((element) => {
    (element as HTMLElement).style.zIndex = 'unset';
    // removeZIndexFromParent(element);
  });
  document.getElementById('overlayWCP')!.style.zIndex = '9999';
  document.querySelectorAll('.WCPElement').forEach((element) => {
    (element as HTMLElement).style.border = 'none';
    (element as HTMLElement).style.zIndex = '999999';
    (element as HTMLElement).style.position = 'relative';
    // removeZIndexFromParent(element);
  });
};

const applyCustomPropertiesToDom = (pageStyle: PageStyle): void => {
  if (pageStyle.customBackground != '#FFFFFF') {
    document.body.style.background = pageStyle.customBackground!;
  }
  let font_selector = '*';
  if (pageStyle.customFontSelector != '') {
    font_selector = pageStyle.customFontSelector!;
  }
  document.body.querySelectorAll(font_selector).forEach((Element) => {
    if (pageStyle.customFontFamily != '') {
      (Element as HTMLElement).style.fontFamily = pageStyle.customFontFamily!;
    }
    if (pageStyle.customeFontWeight != '') {
      (Element as HTMLElement).style.fontWeight = pageStyle.customeFontWeight!;
    }
    if (pageStyle.customFontColor != '#FFFFFF' && pageStyle.customFontColor != '#ffffff') {
      (Element as HTMLElement).style.color = pageStyle.customFontColor!;
    }
    if (pageStyle.customFontSize != '') {
      (Element as HTMLElement).style.fontSize = pageStyle.customFontSize! + 'rem';
    }
  });
};
