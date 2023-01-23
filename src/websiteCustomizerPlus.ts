import { Configs, configStorage } from './shared/storage';
import * as Util from './shared/utils';

const updateDom = (updatedConfigs?: Configs) : void => {
  if (updatedConfigs) {
    // do something with updated config nothin for now
  }
  refresh();
}

const refresh = () => {
  configStorage.get((configs) => {
    console.log(configs);
    const pageConfig = configs.pageStyle.find(config => config.url === Util.getHostName(document.URL));
    if (pageConfig) {
      document.body.style.background = 'blue';
    }
  });  
}


refresh();
configStorage.listen(updateDom);

