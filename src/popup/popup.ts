import './popup.css';
import * as Util from '../shared/utils';
import { configStorage } from '../shared/storage';
import { Controls } from '../shared/const';


(async () => {
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    const hostname: string = Util.getHostName(tab.url as string);
    loadConfigs(hostname);
    Util.getDomElement('siteInfo').innerText = 'www.' + hostname;
    [Controls.darkModeActive,
    Controls.removeMode,
    Controls.enableAdblocker,
    Controls.hideImageMode,
    Controls.backgroundColor,
    Controls.fontColor,
    Controls.fontFamily,
    Controls.fontSelector,
    Controls.fontSize,
    Controls.fontWeight
    ].forEach(Element => {
        Util.getInput(Element).addEventListener('change', () => saveConfig(hostname));
    });
    [Controls.backgroundColor,
    Controls.fontColor,
    ].forEach(Element => {
        Util.getInput(Element).addEventListener('input', () => saveConfig(hostname));
    })
    document.getElementById('save-button')?.addEventListener('click', () => {
        saveConfig(hostname, true);
    });
    document.getElementById('clear-button')?.addEventListener('click', () => {
        clearConfig(hostname);
    });
    Util.getInput(Controls.disableAll).addEventListener('change', () => clearConfigAll(hostname));        

    document.getElementById('configButton')?.addEventListener('click', () => changeTab('configuration'));
    document.getElementById('customOptionButton')?.addEventListener('click', () => changeTab('customOption'));
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
            Util.getInput(Controls.disableAll).checked = !pageConfig.clearAll;

            Util.getInput(Controls.backgroundColor).value = pageConfig.customBackground ? pageConfig.customBackground : '#FFFFFF';
            Util.getInput(Controls.fontColor).value = pageConfig.customFontColor ? pageConfig.customFontColor : '#FFFFFF';
            Util.getInput(Controls.fontFamily).value = pageConfig.customFontFamily ? pageConfig.customFontFamily : '';
            Util.getInput(Controls.fontSelector).value = pageConfig.customFontSelector ? pageConfig.customFontSelector : '';
            Util.getInput(Controls.fontSize).value = pageConfig.customFontSize ? pageConfig.customFontSize : '';
            Util.getInput(Controls.fontWeight).value = pageConfig.customeFontWeight ? pageConfig.customeFontWeight : '';
            (document.getElementById('clear-button')as HTMLButtonElement)!.disabled  = !pageConfig.saveCustomOption;

        }
    });
}

function saveConfig(hostname: string, saveConfigButton: boolean = false): void {
    configStorage.get((configs) => {
            let findPageStyleIndex = configs.pageStyle.findIndex(config => config.url === hostname);
            if (findPageStyleIndex === -1) {
                configs.pageStyle.push({
                    url: hostname,
                    removeMode: false,
                    darkMode: false,
                    adblocker: false,
                    hideImages: false,
                    saveCustomOption: false,
                    customBackground: '#FFFFFF',
                    customFontFamily: '#FFFFFF',
                    customFontSize: '',
                    customeFontWeight: '',
                    customFontColor: '',
                    customFontSelector: '',
                    clear: false,
                    clearAll: false
                });
                findPageStyleIndex = configs.pageStyle.length - 1;
            }
            if (saveConfigButton) {
                configs.pageStyle[findPageStyleIndex].saveCustomOption = true;
                window.close();
            }
            configs.pageStyle[findPageStyleIndex].removeMode = Util.getInput(Controls.removeMode).checked;
            configs.pageStyle[findPageStyleIndex].darkMode = Util.getInput(Controls.darkModeActive).checked;
            configs.pageStyle[findPageStyleIndex].adblocker = Util.getInput(Controls.enableAdblocker).checked;
            configs.pageStyle[findPageStyleIndex].hideImages = Util.getInput(Controls.hideImageMode).checked;

            configs.pageStyle[findPageStyleIndex].customBackground = Util.getInput(Controls.backgroundColor).value;
            configs.pageStyle[findPageStyleIndex].customFontColor = Util.getInput(Controls.fontColor).value;
            configs.pageStyle[findPageStyleIndex].customFontFamily = Util.getInput(Controls.fontFamily).value;
            configs.pageStyle[findPageStyleIndex].customFontSelector = Util.getInput(Controls.fontSelector).value;
            configs.pageStyle[findPageStyleIndex].customeFontWeight = Util.getInput(Controls.fontWeight).value;
            configs.pageStyle[findPageStyleIndex].customFontSize = Util.getInput(Controls.fontSize).value;
            configStorage.set(configs);
    })
}

function changeTab(id: string): void {
    let showTab: string = '';
    let showButton: string = '';
    let removeTab: string = '';
    let removeButton: string = '';
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

function clearConfig(hostname: string): void {
    configStorage.get((configs) => {
        let findPageStyleIndex = configs.pageStyle.findIndex(config => config.url === hostname);
        if (findPageStyleIndex!=-1) {
            configs.pageStyle[findPageStyleIndex].saveCustomOption = false;
            configs.pageStyle[findPageStyleIndex].customBackground = '#FFFFFF';
            configs.pageStyle[findPageStyleIndex].customFontFamily ='';
            configs.pageStyle[findPageStyleIndex].customFontSize = '';
            configs.pageStyle[findPageStyleIndex].customeFontWeight = '';
            configs.pageStyle[findPageStyleIndex].customFontColor = '#FFFFFF';
            configs.pageStyle[findPageStyleIndex].customFontSelector = '';
            configs.pageStyle[findPageStyleIndex].clear = true;
            configStorage.set(configs);
            window.close();
        }
    })
}

function clearConfigAll(hostname: string): void {
    if (!Util.getInput(Controls.disableAll).checked) {
        configStorage.get((configs) => {
            let findPageStyleIndex = configs.pageStyle.findIndex(config => config.url === hostname);
            if (findPageStyleIndex!=-1) {
                configs.pageStyle[findPageStyleIndex].clearAll = true;
                configStorage.set(configs);
            }
        })
    } else {
        configStorage.get((configs) => {
            let findPageStyleIndex = configs.pageStyle.findIndex(config => config.url === hostname);
            if (findPageStyleIndex!=-1) {
                configs.pageStyle[findPageStyleIndex].clearAll = false;
                configStorage.set(configs);
            }
        })
    }  
}