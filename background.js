'use strict';

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

// Browser event triggers ================================================================
chrome.webRequest.onBeforeRequest.addListener(
	function (details) {
		var navigationUrl = details.url;
		var isPdf = navigationUrl.toLowerCase().endsWith('.pdf');
		if (!isPdf) {
			// log('Is NOT a pdf'); // TODO add log function
			return;
		} else {
			var displayURL = chrome.extension.getURL('smartReadingPdfViewer.html') + '?file=' + encodeURIComponent(navigationUrl);
			// alert('IS PDF -> redirect to ' + displayURL + '\n\nFrom: ' + navigationUrl);
			return {redirectUrl: displayURL};
		}
	},
	{urls: [ '*://*/*.pdf', 'file:///*' ]},
	['blocking']
);