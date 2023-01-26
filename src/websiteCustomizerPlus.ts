import { Configs, configStorage, PageStyle } from './shared/storage';
import * as Util from './shared/utils';
import './websiteCustomizerPlus.css'

const objectToBeRemoved: string[] = [];
let pageStyle: PageStyle;


const updateDom = (updatedConfigs?: Configs): void => {
  configStorage.get((configs) => {
    const updatedPageStyle: PageStyle = configs.pageStyle.find(config => config.url === Util.getHostName(document.URL))!;
    EnableDarkMode(updatedPageStyle.darkMode) 

  });
}

const refresh = (): void => {
  configStorage.get((configs) => {
    pageStyle = configs.pageStyle.find(config => config.url === Util.getHostName(document.URL))!;
    EnableDarkMode(pageStyle.darkMode);
  });
}

refresh();
configStorage.listen(updateDom);

const EnableDarkMode = (flag: boolean): void => {
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
