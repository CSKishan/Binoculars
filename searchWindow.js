chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "showBinocularSearchPopup") {
    const selectedTextDiv = document.getElementById("searchedBinocularText");
    selectedTextDiv.innerText = request.text;
  }
});
