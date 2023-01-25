import { Configs, configStorage, PageStyle } from './shared/storage';
import * as Util from './shared/utils';
import './websiteCustomizerPlus.css'



const updateDom = (updatedConfigs?: Configs) : void => {
  let pageStyle : PageStyle;
  configStorage.get((configs) => {
    console.log(configs);
    pageStyle = configs.pageStyle.find(config => config.url === Util.getHostName(document.URL))!;
    removeFromDom(pageStyle!.removeOption);   
  });

}

configStorage.listen(updateDom);

const removeFromDom = (flag:boolean): void => {
  console.log('alert here')
  const overlay = document.createElement('div');
  overlay.id = 'overlayDiv'
  document.body.appendChild(overlay);
  if (flag) { 
    const headerOne = document.createElement('h1');
    headerOne.style.color = "red";
    headerOne.innerText = "Click on the things which you want to remove within 10 seconds";
    overlay.appendChild(headerOne);
    const headerTwo = document.createElement('h1');
    headerTwo.style.color = "red";
    headerTwo.innerText = "You can see those things again by disabling Remove-things-Mode options in the extension";
    overlay.appendChild(headerTwo);
    overlay.style.cssText = `position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgb(255 255 255 / 79%);
    z-index:99999;
    pointer-events: none;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;`
    document.querySelectorAll('*').forEach(Element => {
      (Element as HTMLElement).addEventListener('click', removeClickAbility)
    })
    document.addEventListener('click', addObjectForDisplay);
    setTimeout(removeOverlay, 7000);
    return;
  }
  document.getElementById('overlayDiv')?.remove();       
  document.querySelectorAll('.FocusedObjectWCP')!.forEach(element => {
    ( element as HTMLElement ).style.display = 'inherit';
  })  
}

const removeClickAbility = (e:MouseEvent) => {
  e.preventDefault();
}
const removeOverlay = () =>{
  document.removeEventListener('click', addObjectForDisplay);
  document.getElementById('overlayDiv')?.remove();
  document.querySelectorAll('*').forEach(Element => {
    (Element as HTMLElement).removeEventListener('click', removeClickAbility)
  })
}

const addObjectForDisplay = (e:MouseEvent) => {
  (e.target as HTMLElement).classList.add('FocusedObjectWCP');
  (e.target as HTMLElement).style.display = 'none';
}

