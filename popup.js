// Get the active tab URL and use it to fetch the saved texts
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const url = tabs[0].url;

  chrome.runtime.sendMessage(
    { action: "getBinocularSearchedTexts", url },
    (response) => {
      const container = document.getElementById("selectedTextsContainer");

      if (response.texts.length === 0) {
        container.innerText = "No text selected.";
      } else {
        response.texts.forEach((text) => {
          const textElement = document.createElement("div");
          textElement.className = "selected-text";
          textElement.innerText = text;
          container.appendChild(textElement);
        });
      }
    }
  );
});
