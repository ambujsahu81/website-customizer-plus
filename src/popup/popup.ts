import './popup.css';
import * as Util from '../shared/utils';
import { Configs, configStorage } from '../shared/storage';
import { Controls } from '../shared/const';

(async () => {
    const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
    const hostname: string = Util.getHostName(tab.url as string);
    loadConfigs(hostname);
    Util.getDomElement('siteInfo').innerText = 'www.'+hostname;    
    [Controls.darkModeActive , Controls.removeMode, Controls.enableAdblocker, Controls.hideImageMode].forEach(Element => {
        Util.getInput(Element).addEventListener('change', () =>saveConfig(hostname));
    })
    document.getElementById('configButton')?.addEventListener('click', ()=>changeTab('configuration'));
    document.getElementById('customOptionButton')?.addEventListener('click', ()=>changeTab('customOption'));
    changeTab('configuration');
})();

function loadConfigs(hostname: string): void {
    configStorage.get((configs) => {
    const pageConfig = configs.pageStyle.find(config => config.url === hostname);
    if (pageConfig) {
        Util.getInput(Controls.removeMode).checked = pageConfig.removeMode;
        Util.getInput(Controls.darkModeActive).checked = pageConfig.darkMode;
        Util.getInput(Controls.enableAdblocker).checked = pageConfig.adblocker;
        Util.getInput(Controls.hideImageMode).checked = pageConfig.hideImages;
    }
    });    
}

function saveConfig(hostname: string): void {
    const configs = new Configs();
    let findPageStyleIndex = configs.pageStyle.findIndex(config => config.url === hostname);

    if (findPageStyleIndex === -1) {
        configs.pageStyle.push({url: hostname, removeMode: false, darkMode: false, adblocker: false, hideImages: false});
        findPageStyleIndex = configs.pageStyle.length - 1;
    }
    configs.pageStyle[findPageStyleIndex].removeMode = Util.getInput(Controls.removeMode).checked;
    configs.pageStyle[findPageStyleIndex].darkMode = Util.getInput(Controls.darkModeActive).checked;
    configs.pageStyle[findPageStyleIndex].adblocker = Util.getInput(Controls.enableAdblocker).checked;
    configs.pageStyle[findPageStyleIndex].hideImages = Util.getInput(Controls.hideImageMode).checked;
    configStorage.set(configs);
}

function changeTab(id: string): void{
    let showTab: string ='';
    let showButton: string ='';
    let removeTab: string ='';
    let removeButton: string ='';
    if (id === 'configuration') {
        showTab = 'configuration';
        removeTab = 'customOption';
        showButton = 'configButton';
        removeButton = 'customOptionButton';        
    } else {
        showTab = 'customOption';
        removeTab = 'configuration';
        showButton = 'customOptionButton';
        removeButton = 'configButton';
    }
    document.getElementById(showTab)!.style.display = "block";
    document.getElementById(showButton)!.classList.add("active");
    document.getElementById(removeTab)!.style.display = "none";
    document.getElementById(removeButton)!.classList.remove("active");
}