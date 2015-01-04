/*
This file contains different constants. Their purpose is to hide the value(s) used in communication between content script and background.
*/

const extensionInfo = {
  "officialName": "SmartReading",
  "progName": "smartReading"
};

const createNewWordOrPhraseContextMenuItemRequest = "createNewWordOrPhraseContextMenuItemRequest";
const createNewQuoteContextMenuItemRequest = "createNewQuoteContextMenuItemRequest";

const newWordOrPhraseAction = "newWordOrPhraseAction";
const newQuoteAction = "newQuoteAction";


String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};