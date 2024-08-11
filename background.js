chrome.runtime.onInstalled.addListener(async () => {
  for (const cs of chrome.runtime.getManifest().content_scripts) {
    for (const tab of await chrome.tabs.query({ url: cs.matches })) {
      if (tab.url.match(/(chrome|chrome-extension):\/\//gi)) {
        continue;
      }
      chrome.scripting.executeScript({
        files: cs.js,
        target: { tabId: tab.id, allFrames: cs.all_frames },
        injectImmediately: cs.run_at === "document_start",
      });
    }
  }

  createContextMenuOptionForBinoculars();
});

function createContextMenuOptionForBinoculars() {
  chrome.contextMenus.create({
    id: "searchWithBinoculars",
    title: "Search with Binoculars",
    contexts: ["selection"],
  });
}

// TODO: Enable keyboard based command
// // Listen for commands
// chrome.commands.onCommand.addListener((command) => {
//   if (command === "trigger-list-popup") {
//   } else {
//     // Trigger the popup to display the selected text
//     chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//       chrome.tabs.sendMessage(tabs[0].id, {
//         action: "showBinocularSearchPopup",
//       });
//     });
//   }
// });

// Create a context menu item when the extension is installed and also install the content scripts

// Listen for context menu item clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  const searchedText = info.selectionText.trim();
  if (info.menuItemId === "searchWithBinoculars" && searchedText) {
    handleSelectedText(searchedText, tab);
  }
});

// Function to handle the selected text
function handleSelectedText(text, tab) {
  const url = new URL(tab.url);
  const domain = url.hostname;

  // Get existing texts for this domain

  chrome.storage.sync.get([domain], (result) => {
    const selectedSearchTexts = result[domain] || [];
    selectedSearchTexts.push(text);

    // Save updated texts back to storage
    chrome.storage.sync.set({ [domain]: selectedSearchTexts });

    // Send a message to content script to show the popup near the selection
    chrome.tabs.sendMessage(tab.id, {
      action: "showBinocularSearchPopup",
      text,
    });
  });
}

// Listen for messages from content script or popup to retrieve selected texts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getBinocularSearchedTexts") {
    const url = new URL(request.url);
    const domain = url.hostname;

    chrome.storage.sync.get([domain], (result) => {
      sendResponse({ texts: result[domain] || [] });
    });

    // This is necessary to make the sendResponse call asynchronous
    return true;
  }
});
