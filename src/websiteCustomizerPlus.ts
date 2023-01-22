chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse) {
      document.body.style.background = "blue";
      const messageHeader: HTMLHeadElement = document.createElement("H1");
      messageHeader.innerText = message.greeting;
      document.body.appendChild(messageHeader)

      sendResponse({farewell: "Hola popup"});
    }
  );