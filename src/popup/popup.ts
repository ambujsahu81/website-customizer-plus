

const inputElement: HTMLElement = document.getElementById('fname') as HTMLElement;

inputElement.addEventListener('input', function (evt) {
    let msg: string =  (evt as InputEvent).data as string ;
    updateContentScript(msg);

});



const updateContentScript = async ( msg: string ) => {
    const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
    const tabId:number = tab.id?tab.id: 0;
    const response = await chrome.tabs.sendMessage(tabId, {greeting: msg});
    // do something with response here, not outside the function
    console.log(response);
  }