(() => {
  // Listen for messages from the background script
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "showBinocularSearchPopup") {
      showPopupNearSelectedText(request.text);
    }
  });

  // Function to show a popup near the selected text
  function showPopupNearSelectedText(selectedText) {
    const selection = window.getSelection();
    console.info(selection);

    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    console.info(range);
    const rect = range.getBoundingClientRect();
    console.info(rect);

    const iframe = document.createElement("iframe");
    iframe.src = chrome.runtime.getURL("searchWindow.html");
    iframe.style.position = "absolute";
    iframe.style.zIndex = "10000";
    iframe.style.border = "none";
    iframe.style.width = "500px";

    const popupHeight = 100; // estimated height of the popup
    const verticalOffset = 5;

    if (
      rect.top + window.scrollY + rect.height + popupHeight + verticalOffset <
      window.innerHeight
    ) {
      iframe.style.top = `${rect.bottom + window.scrollY + verticalOffset}px`;
    } else {
      iframe.style.top = `${
        rect.top + window.scrollY - popupHeight - verticalOffset
      }px`;
    }

    iframe.style.left = `${rect.left + window.scrollX}px`;

    document.body.appendChild(iframe);

    // Send the selected text to the iframe
    iframe.onload = function () {
      chrome.runtime.sendMessage({
        action: "loadBinocularSearchPopup",
        text: selectedText,
      });
    };

    // Remove the iframe after 3 seconds
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 3000);
  }
})();
