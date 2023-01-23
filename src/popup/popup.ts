import './popup.css';
import * as Util from '../shared/utils';
import { Configs, configStorage } from '../shared/storage';
import { Controls } from '../shared/const';


(async () => {
    const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
    const hostname: string = Util.getHostName(tab.url as string);
    loadConfigs(hostname);
    [Controls.darkModeActive , Controls.focusModeActive].forEach(Element => {
        Util.getInput(Element).addEventListener('change', () =>saveConfig(hostname));
    })
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