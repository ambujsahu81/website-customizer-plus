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
        HideAllImages(updatedPageStyle.hideImages);
        hideElementsFromDom(updatedPageStyle.removeMode);
      }
    }
  });
}

const refresh = (): void => {
  configStorage.get((configs) => {
    if (configs) {
      pageStyle = configs.pageStyle.find(config => config.url === Util.getHostName(document.URL))!;
      if (pageStyle) {
        // set the hide dom option to false
        let pageStyleIndex = configs.pageStyle.findIndex(config => config.url === Util.getHostName(document.URL))!;
        configs.pageStyle[pageStyleIndex].removeMode = false;
        configStorage.set(configs);

        EnableDarkMode(pageStyle.darkMode);
        if (pageStyle.adblocker) {
          intervalID = setInterval(enableAdblocker, 3000);
        } else {
          clearInterval(intervalID);
        }
        HideAllImages(pageStyle.hideImages);
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

const HideAllImages = (flag: boolean): void => {
  if ( flag ) {
    let images = document.getElementsByTagName("img");
    let images_length = images.length;
    for (let i = 0; i < images_length; i++) {
      images[i].style.setProperty("display", "none", "important");
    }

    /** now also hide images which are implemented in css */
    let all_elements: any = document.querySelectorAll("*");
    for(let i = 0 ; i < all_elements.length ; i++) {
      all_elements[i].style.setProperty("background-image","unset","important");
    }
  } else {
    let images = document.getElementsByTagName("img");
    let images_length = images.length;
    for (let i = 0; i < images_length; i++) {
      images[i].style.setProperty("display", "inherit", "important");
    }
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

const hideElementsFromDom = (flag: boolean): void => {
  if (flag) {
    const overlay = document.createElement('div');
    overlay.id = 'overlay';
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
    justify-content: flex-start;`

    const headerone = document.createElement('h1');
    headerone.id = "headerOne"
    headerone.style.cssText = `color: white; 
    background: black;
    margin: 0rem; 
    text-align: center; 
    `
    headerone.innerText = 'select elements to focus';
    const headertwo = document.createElement('h1');
    headertwo.id = "headerTwo"
    headertwo.style.cssText = `color: white; 
    background: black;
    margin: 0rem;
    text-align: center;
    `
    headertwo.innerText = 'After selection click the remove button to remove the rest from page';
    overlay.appendChild(headerone);
    overlay.appendChild(headertwo);
    document.body.appendChild(overlay);
    const removeButton = document.createElement('button');
    removeButton.textContent = "Remove rest of the content";
    removeButton.id = "removeBttn";
    removeButton.style.border = '1px solid red';
    removeButton.style.color = 'red';
    removeButton.style.background = 'black';
    removeButton.style.position = 'fixed';
    removeButton.style.zIndex= "999999";
    removeButton.style.top = '15%';
    removeButton.style.left = "50%";
    removeButton.style.padding = "0.7rem";
    removeButton.addEventListener('click',removeOverlay);
    document.body.appendChild(removeButton);
    document.body.querySelectorAll('a').forEach(Element => Element.style.pointerEvents = 'none' );
    document.addEventListener('click', setFocusObject);
  } else {
    document.getElementById('overlay')?.remove();
    document.querySelectorAll('.WCPElement').forEach(element => {
      (element as HTMLElement).style.zIndex = "intial";
      (element as HTMLElement).style.position = "inherit"
    })
    document.body.querySelectorAll('a').forEach(Element => Element.style.pointerEvents = 'auto' );
  }
}

const setFocusObject = (e: any): void => {
  (e.target as HTMLElement).style.border = "1px solid red";
  (e.target as HTMLElement).classList.add("WCPElement");
}

const removeOverlay = (): void => {  
  document.removeEventListener('click', setFocusObject);
  document.getElementById('overlay')!.style.background = "rgb(255 255 255 / 100%)";
  document.getElementById('headerOne')!.innerText =" FocusMode is On";
  document.getElementById('headerTwo')?.remove();
  document.getElementById('removeBttn')?.remove();
  document.querySelectorAll('.WCPElement').forEach(element => {
    (element as HTMLElement).style.border = "none";
    (element as HTMLElement).style.zIndex = "999999";
    (element as HTMLElement).style.position = "sticky"
  })
}

 