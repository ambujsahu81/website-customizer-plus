import { Configs, configStorage, PageStyle } from './shared/storage';
import * as Util from './shared/utils';
import './websiteCustomizerPlus.css';



const objectToBeRemoved: string[] = [];
let pageStyle: PageStyle;
let intervalID : any;

const updateDom = (updatedConfigs?: Configs): void => {
  configStorage.get((configs) => {
    if (configs) {
      const updatedPageStyle: PageStyle = configs.pageStyle.find(config => config.url === Util.getHostName(document.URL))!;
      if (updatedPageStyle) {
        EnableDarkMode(updatedPageStyle.darkMode);
        if (updatedPageStyle.adblocker) {
          intervalID = setInterval(enableAdblocker, 3000);
        } else {
          clearInterval(intervalID);
        }
      }
    }
  });
}

const refresh = (): void => {
  configStorage.get((configs) => {
    if (configs) {
      pageStyle = configs.pageStyle.find(config => config.url === Util.getHostName(document.URL))!;
      if (pageStyle) {
        EnableDarkMode(pageStyle.darkMode);
        if (pageStyle.adblocker) {
          intervalID = setInterval(enableAdblocker, 3000);
        } else {
          clearInterval(intervalID);
        }
      }
    }
  });
}

refresh();
configStorage.listen(updateDom);

const EnableDarkMode = (flag: boolean): void => {
  if (flag) {

  }
  const id: string = "dark-theme-snippet";
  const snippet: HTMLElement | null = document.getElementById(id);
  if (null != snippet) {
    snippet.parentNode!.removeChild(snippet);
  }
  if (flag) {
    const css: string = `
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
    `
    const style: HTMLStyleElement = document.createElement('style');
    style.id = id;
    style.appendChild(document.createTextNode(css))
    document.querySelector('head')!.appendChild(style)
  }
}

const enableAdblocker = (): void => {
    const adCls = ['adsbygoogle', 'mod_ad_container', 'brn-ads-box', 'gpt-ad', 'ad-box', 'top-ads-container', 'adthrive-ad'];
    const adSelector = ['[aria-label="advertisement"]', '[class*="-ad "], [class*="-ad-"], [class$="-ad"], [class^="ad-"]', 'div[id^="google_ads_iframe_"'];
    for (const cls of adCls) {
      const elementList = document.getElementsByClassName(cls);
      Array.from(elementList).forEach(v => {
        if (!shouldIgnore(v)) {
          v.remove();
        }
      })
    }
    for (const selector of adSelector) {
      const elementList = document.querySelectorAll(selector);
      Array.from(elementList).forEach(v => {
        if (!shouldIgnore(v)) {
          v.remove();
        }
      })
    }
    const adElements = document.getElementsByClassName("*");
    for (let elem of adElements) {
      let flag = 0;
      for (const clsname of elem.classList) {
        if (clsname.startsWith("ad") || /[-_\s]ad(?:vertisement)?$/.test(clsname)) {
          flag = 1;
        }
      }
      if (!shouldIgnore(elem)) {
        elem.remove()
      }
    }
    const adElement = document.getElementsByClassName('[class*="ad"]');
    for (let elem of adElement) {
      let flag = 0;
      for (const clsname of elem.classList) {
        if (clsname.startsWith("ad") || /[-_\s]ad(?:vertisement)?$/.test(clsname)) {
          flag = 1;
        }
      }
      if (!shouldIgnore(elem)) {
        elem.remove()
      }
    }

    const exceptOrigins = [
      'https://disqus.com',
      document.defaultView!.location.origin
    ];

    for(var e of document.getElementsByTagName('iframe')){
      try{
        var orgn = new URL(e.src || 'http://unknown-src').origin;
        if( ! exceptOrigins.includes(orgn)){
          e.parentElement!.removeChild(e);
          console.log('REMOVE IFRAME',orgn);
        }
      } catch(err) {
        console.log('REMOVE ERROR',err);
      }
    }  
}

const shouldIgnore = (elem: any) => {
  let articles = document.getElementsByTagName('article');
  const ignore = ["body", ".ad-layout"];
  for (let a of articles) {
    if (elem.contains(a)) {
      return true;  // ignore if an article descends from it
    }
  }
  for (const element of ignore) {
    if (elem.matches(element)) {
      return true;
    }
  }

}

