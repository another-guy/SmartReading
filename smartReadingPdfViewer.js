'use strict';

function log(text) { console.log('SmartReading: ' + text); }

function initializeSemanticUi() {
	console.log('initializeSemanticUi()');
	
	$('.ui.dropdown').dropdown();
}

function initializeMenu() {
	$('#wordOrPhraseButton').click(function (event) { });
	$('#grammarExampleButton').click(function (event) { });
	$('#quoteButton').click(function (event) { });
	$('#notaBeneButton').click(function (event) { });
	$('#commentButton').click(function (event) { });
	$('#helpButton').click(function (event) { });
	$('#aboutButton').click(function (event) { });
	$('#closeButton').click(function (event) { });
}

function getPdfUrl() {
	log('getPdfUrl()');
	
	var pdfUrl = decodeURIComponent(location.href.split('/smartReadingPdfViewer.html?file=')[1]);
	log('Detected PDF url "' + pdfUrl + '"');
	return pdfUrl;
}
function setTitleFromUrl(url) {
	log('setTitleFromUrl()');
	
	var parts = url.split('/');
	var newTitle = "SmartReading " + parts[parts.length - 1];
	log('Set title "' + newTitle + '"');
	document.title = newTitle;
}

function loadAndRenderPdf(pdfUrl) {
	log('loadAndRenderPdf()');

	var canvas = document.getElementById('pdfViewerCanvas');
	var context = canvas.getContext('2d');
	PDFJS.disableWorker = false;
	PDFJS.workerSrc = 'lib/pdf.worker.js';
	PDFJS.getDocument(pdfUrl).then(function(pdf) {
	  // Using promise to fetch the page
	  pdf.getPage(1).then(function(page) {
		var scale = page.getViewport(1.0).width / canvas.width;
		var viewport = page.getViewport(scale);

		canvas.height = viewport.height;
		canvas.width = viewport.width;

		var renderContext = {
		  canvasContext: context,
		  viewport: viewport
		};
		page.render(renderContext);
	  });
	});
}

$(function() {
	log('Page loaded...');
	
	initializeSemanticUi();
	initializeMenu();
	
	var pdfUrl = getPdfUrl();
	setTitleFromUrl(pdfUrl);

	loadAndRenderPdf(pdfUrl);
	
	//$("#pdfViewerContainer").css("border", "1px solid black");
});