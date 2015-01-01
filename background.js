var newWordOrPhraseItemAdded = false;
var newQuoteItemAdded = false;

function onRequest(request, sender, callback) {
	var action = request.action;
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
}

function createContextItem(title, handler) {
	var contextItemProperties = {
		"title": title,
		"contexts": ["page", "selection", "image", "link"],
		"onclick" : handler
	};
	chrome.contextMenus.create(contextItemProperties);
}

// Subscribe on request from summarize-it.js:
chrome.extension.onRequest.addListener(onRequest);


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