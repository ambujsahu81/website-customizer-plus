import { Configs, configStorage } from './shared/storage';


let configs: Configs = new Configs();


const refresh = (updatedConfigs?: Configs) : void => {
  if (updatedConfigs) {
    configs = updatedConfigs;

    // call all the methods here
    document.body.style.background = 'blue';
    console.log("somthing to get", updatedConfigs)
  }
  console.log("nothing to get", updatedConfigs)
}

const newRefresh = (updatedConfigs?: Configs) : void => {
  if (updatedConfigs) {
    configs = updatedConfigs;
  }
  // call all the methods here
  console.log("listening to get", updatedConfigs)
  document.body.style.background = 'green';
}

configStorage.get(refresh);
configStorage.listen(newRefresh);

