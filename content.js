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

    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect(); // The selected text bounding region
    console.info(rect);

    const iframe = document.createElement("iframe");
    iframe.src = chrome.runtime.getURL("searchWindow.html");
    iframe.style.position = "absolute";
    iframe.style.zIndex = "10000";
    iframe.style.border = "none";
    iframe.style.maxWidth = "500px";

    const viewportWidth = Math.max(
      document.documentElement.clientWidth || 0,
      window.innerWidth || 0
    );
    const viewportHeight = Math.max(
      document.documentElement.clientHeight || 0,
      window.innerHeight || 0
    );

    const popupHeight = 200; // estimated height of the popup
    const verticalOffset = 10;

    if (viewportHeight - popupHeight > rect.bottom) {
      // place below
      iframe.style.top = `${rect.bottom + window.scrollY + verticalOffset}px`;
    } else {
      iframe.style.bottom = `${
        viewportHeight - window.scrollY - rect.top + verticalOffset
      }px`;
      // place above
    }

    console.info(iframe);

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
    }, 300000);
  }
})();
