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

// Browser event triggers ================================================================
function doInCurrentTab(tabCallback) {
	chrome.tabs.query(
		{ currentWindow: true, active: true },
		function (tabArray) { tabCallback(tabArray[0]); }
	);
}

chrome.webNavigation.onCommitted.addListener(function(e) {
	var navigationUrl = e.url;
	var isPdf = navigationUrl.toLowerCase().endsWith('.pdf');
	if (isPdf) {
		alert('Should open link as PDF.');		
		doInCurrentTab(
			function(tab) {
				alert('tab = ' + tab + ' -> ' + navigationUrl);
				// chrome.tabs.update(tab.id, {url: 'http://www.ya.ru'});
				// TODO show view with URL passed
			}
		);
	}
});