'use strict';

function localizeUI() {
	$('#newWordOrPhrase').text(chrome.i18n.getMessage("newWordOrPhrase"));
	$('#newQuote').text(chrome.i18n.getMessage("newQuote"));
}

function getPdfUrl() {
	var pdfUrl = decodeURIComponent(location.href.split('/smartReadingPdfViewer.html?file=')[1]);
	console.log('Detected PDF url: ' + pdfUrl);
	return pdfUrl;
}
function setTitleFromUrl(url) {
	var parts = url.split('/');
	var newTitle = "Reading " + parts[parts.length - 1];
	console.log('Set title: ' + newTitle);
	document.title = newTitle;
}

function loadAndRenderPdf(pdfUrl) {
	'use strict';

	// TODO Fetch the document to render from pdfUrl
	var canvas = document.getElementById('pdfViewerCanvas');
	var context = canvas.getContext('2d');

	alert(pdfUrl);
	PDFJS.getDocument(pdfUrl).then(function(pdf) {
	//PDFJS.getDocument('helloworld.pdf').then(function(pdf) {
	  // Using promise to fetch the page
	  pdf.getPage(1).then(function(page) {
		var scale = 1.5;
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
	console.log('Page loaded...');
	
	localizeUI();
	
	var pdfUrl = getPdfUrl();
	setTitleFromUrl(pdfUrl);

	loadAndRenderPdf(pdfUrl);
	
	$("#pdfViewerContainer").css("border", "1px solid black");
});