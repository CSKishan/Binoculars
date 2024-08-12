chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.action === "loadBinocularSearchPopup") {
    console.info(request);
    const selectedTextDiv = document.getElementById("searchedBinocularText");
    console.info(selectedTextDiv);
    selectedTextDiv.innerHTML = request.text;
  }
});
