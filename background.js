var newWordOrPhraseItemAdded = false;
var newQuoteItemAdded = false;

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
	var action = message.action;
	if (action == createNewWordOrPhraseContextMenuItemRequest) {
		if (newWordOrPhraseItemAdded) return;
		newWordOrPhraseItemAdded = true;
		createContextItem(chrome.i18n.getMessage("newWordOrPhrase"), newWordOrPhraseClickHandler);
	} else if (action == createNewQuoteContextMenuItemRequest) {
		if (newQuoteItemAdded) return;
		newQuoteItemAdded = true;
		createContextItem(chrome.i18n.getMessage("newQuote"), newQuoteClickHandler);
	} else {
		alert("Action not supported: " + action);
	}
});

function createContextItem(title, handler) {
	var contextItemProperties = {
		"title": title,
		"contexts": ["page", "selection", "image", "link"],
		"onclick" : handler
	};
	chrome.contextMenus.create(contextItemProperties);
}

// App business logic ====================================================================

function newWordOrPhraseClickHandler(info, tab) {
	if (tab) {
		chrome.tabs.sendMessage(
			tab.id,
			{ "actionType": newWordOrPhraseAction },
			function (response) { alert(response.selectedText); }
		);
	}
}
function newQuoteClickHandler(info, tab) {
	if (tab) {
		chrome.tabs.sendMessage(
			tab.id,
			{ "actionType": newQuoteAction },
			function (response) { alert(response.selectedText); }
		);
	}
}


//TODO move to constants.js
String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

// Browser event triggers ================================================================
chrome.webNavigation.onCommitted.addListener(function(e) {
	var isPdf = e.url.toLowerCase().endsWith('.pdf');
	if (isPdf) {
		console.info('Should open link as PDF.');
	}
});