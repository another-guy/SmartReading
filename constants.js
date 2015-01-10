'use strict';

/*
This file contains different constants. Their purpose is to hide the value(s) used in communication between content script and background.
*/

var extensionInfo = {
  "officialName": "SmartReading",
  "progName": "smartReading"
};

var createNewWordOrPhraseContextMenuItemRequest = "createNewWordOrPhraseContextMenuItemRequest";
var createNewQuoteContextMenuItemRequest = "createNewQuoteContextMenuItemRequest";

var newWordOrPhraseAction = "newWordOrPhraseAction";
var newQuoteAction = "newQuoteAction";


String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};