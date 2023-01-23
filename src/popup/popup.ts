import * as Util from '../shared/utils';
import { Configs, configStorage } from '../shared/storage';
import { Controls } from '../shared/const';



loadConfigs();
Util.getInput(Controls.darkModeActive).addEventListener('change', saveConfig)
 



function loadConfigs(): void {
    configStorage.get((configs) => {
    Util.getInput(Controls.focusModeActive).checked = configs.focusMode;
    });    
}

function saveConfig(): void {
    const configs = new Configs();
    configs.focusMode = Util.getInput(Controls.focusModeActive).checked;
    configStorage.set(configs);
}