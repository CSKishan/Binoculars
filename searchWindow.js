chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.action === "loadBinocularSearchPopup") {
    const selectedTextDiv = document.getElementById("searchedBinocularText");
    selectedTextDiv.innerHTML = request.text;
  }
});
