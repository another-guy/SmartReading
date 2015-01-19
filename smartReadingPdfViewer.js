'use strict';

var pdf = null;
var canvas = null;
var context = null;
var currentPageNumber = 1;

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

	$('#fitWidthButton').click(function (event) { });
	$('#zoomInButton').click(function (event) { });
	$('#zoomOutButton').click(function (event) { });

	$('#previousButton').click(function (event) {
		if (currentPageNumber > 1) {
			currentPageNumber--;
			renderPage(currentPageNumber);
		}
	});
	$('#nextButton').click(function (event) {
		if (currentPageNumber < pdf.pdfInfo.numPages) {
			currentPageNumber++;
			renderPage(currentPageNumber);
		}
	});

	$('#facebookButton').click(function (event) { });
	$('#googlePlusButton').click(function (event) { });
	$('#twitterButton').click(function (event) { });
	$('#vkontakteButton').click(function (event) { });

	$('#helpButton').click(function (event) { });
	$('#feedbackButton').click(function (event) { });
	$('#aboutButton').click(function (event) { });
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

	canvas = document.getElementById('pdfViewerCanvas');
	context = canvas.getContext('2d');
	PDFJS.disableWorker = false;
	PDFJS.workerSrc = 'lib/pdf.worker.js';
	PDFJS.getDocument(pdfUrl).then(function(loadedPdf) {
		pdf = loadedPdf;
		renderPage(currentPageNumber);
	});
}

// EXAMPLE FROM http://mozilla.github.io/pdf.js/examples/learning/prevnext.html

var initialCanvasWidth = 0;
function renderPage(pageNumber) {
	pdf.getPage(pageNumber).then(function(page) {
		$('#pageDiv').text('Page ' + pageNumber + ' of ' + pdf.pdfInfo.numPages);

		if (initialCanvasWidth <= 0) {
			initialCanvasWidth = canvas.width;
		}

		var scale = page.getViewport(1.0).width / initialCanvasWidth;
		log('scale = ' + page.getViewport(1.0).width + ' (viewportWidth) / ' + initialCanvasWidth + ' (initialCanvasWidth) = ' + scale);

		var viewport = page.getViewport(scale);

		canvas.height = viewport.height;
		canvas.width = viewport.width;

		var renderContext = {
			canvasContext: context,
			viewport: viewport
		};
		var renderTask = page.render(renderContext);
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