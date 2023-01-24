import './popup.css';
import * as Util from '../shared/utils';
import { Configs, configStorage } from '../shared/storage';
import { Controls } from '../shared/const';


(async () => {
    const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
    const hostname: string = Util.getHostName(tab.url as string);
    loadConfigs(hostname);
    Util.getDomElement('siteInfo').innerText = 'www.'+hostname;    
    [Controls.darkModeActive , Controls.focusModeActive].forEach(Element => {
        Util.getInput(Element).addEventListener('change', () =>saveConfig(hostname));
    })
    document.getElementById('configButton')?.addEventListener('click', ()=>changeTab('configuration','configButton'));
    document.getElementById('customOptionButton')?.addEventListener('click', ()=>changeTab('customOption','customOptionButton'));
    changeTab('configuration','configButton');
})();



function loadConfigs(hostname: string): void {
    configStorage.get((configs) => {
    const pageConfig = configs.pageStyle.find(config => config.url === hostname);
    if (pageConfig) {
        Util.getInput(Controls.focusModeActive).checked = pageConfig.focusMode;
    }
    });    
}

function saveConfig(hostname: string): void {
    const configs = new Configs();
    let findPageStyleIndex = configs.pageStyle.findIndex(config => config.url === hostname);

    if (findPageStyleIndex === -1) {
        configs.pageStyle.push({ url: hostname, focusMode: false});
        findPageStyleIndex = configs.pageStyle.length - 1;
    }
    configs.pageStyle[findPageStyleIndex].focusMode = Util.getInput(Controls.focusModeActive).checked;
    configStorage.set(configs);
}

function changeTab(id: string, tabId: string): void{
    let i, tabcontent, tablinks;

    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      (tabcontent[i] as HTMLElement).style.display = 'none';
    }

    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    document.getElementById(id)!.style.display = "block";
    document.getElementById(tabId)!.classList.add("active");
  }