'use strict';

console.warn(extensionInfo.progName + " successfully loaded.");

function getSelectedText() {
    var text = "";
    if (typeof window.getSelection != "undefined") {
        text = window.getSelection().toString();
    } else if (typeof document.selection != "undefined" && document.selection.type == "Text") {
        text = document.selection.createRange().text;
    }
    return text;
}

// Ask background script to create contextMenu item
chrome.runtime.sendMessage({ "action": createNewWordOrPhraseContextMenuItemRequest });
chrome.runtime.sendMessage({ "action": createNewQuoteContextMenuItemRequest });

console.log('test');

// Listen for contextMenu item's messages
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	var actionType = request.actionType;
	if (actionType == newWordOrPhraseAction) {
		alert("New word/phrase: " + getSelectedText());
		sendResponse({ "selectedText": getSelectedText()});
	} else if (actionType == newQuoteAction) {
		alert("New quote: " + getSelectedText());
		sendResponse({ "selectedText": getSelectedText()});
	} else {
		alert("Action type unknown or not found in " + request);
	}
});

