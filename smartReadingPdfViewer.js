'use strict';

function initializeSemanticUi() {
	console.log('SmartReading: initializeSemanticUi()');
	
	$('.ui.dropdown').dropdown();
}

function getPdfUrl() {
	console.log('SmartReading: getPdfUrl()');
	
	var pdfUrl = decodeURIComponent(location.href.split('/smartReadingPdfViewer.html?file=')[1]);
	console.log('Detected PDF url: ' + pdfUrl);
	return pdfUrl;
}
function setTitleFromUrl(url) {
	console.log('SmartReading: setTitleFromUrl()');
	
	var parts = url.split('/');
	var newTitle = "Reading " + parts[parts.length - 1];
	console.log('Set title: ' + newTitle);
	document.title = newTitle;
}

function loadAndRenderPdf(pdfUrl) {
	console.log('SmartReading: loadAndRenderPdf()');
	
	// TODO Fetch the document to render from pdfUrl
	var canvas = document.getElementById('pdfViewerCanvas');
	var context = canvas.getContext('2d');

	//PDFJS.getDocument(pdfUrl).then(function(pdf) {
	PDFJS.getDocument('helloworld.pdf').then(function(pdf) {
	  // Using promise to fetch the page
	  pdf.getPage(1).then(function(page) {
		var scale = 2.5;
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
	console.log('SmartReading: Page loaded...');
	
	initializeSemanticUi();
	
	var pdfUrl = getPdfUrl();
	setTitleFromUrl(pdfUrl);

	loadAndRenderPdf(pdfUrl);
	
	$("#pdfViewerContainer").css("border", "1px solid black");
});