'use strict';

var pdf = null;
var canvas = null;
var context = null;
var currentPageNumber = 1;

function log(text) {
  console.log('SmartReading: ' + text);
}

function initializeSemanticUi() {
  console.log('initializeSemanticUi()');
  $('.ui.dropdown').dropdown();
}

function wordOrPhraseHandler() {
  log('wordOrPhraseHandler()');
}
function grammarExampleHandler() {
  log('grammarExampleHandler()');
}
function previousPageHandler() {
  log('previousPageHandler()');
  if (currentPageNumber > 1) {
    currentPageNumber--;
    renderPage(currentPageNumber);
  }
}
function nextPageHandler() {
  log('nextPageHandler()');
  if (currentPageNumber < pdf.pdfInfo.numPages) {
    currentPageNumber++;
    renderPage(currentPageNumber);
  }
}

function registerButton(buttonSelector, handler, hotkey, hotkeyTextOverride) {
  if (handler != null) {
    $(buttonSelector).click(handler);
  }

  if (hotkey !== '') {
    if (handler != null) {
      $(document).bind('keydown', hotkey, handler);
    }

    var hotkeyToShow = hotkey;
    if (typeof hotkeyTextOverride != 'undefined') {
      hotkeyToShow = hotkeyTextOverride;
    }
    hotkeyToShow = hotkeyToShow == '' ? '' : ' (' + hotkeyToShow + ')';
    $(buttonSelector).append(hotkeyToShow);
  }
}

function initializeMenu() {
  registerButton('#wordOrPhraseButton', wordOrPhraseHandler, 'Ctrl+A');
  registerButton('#grammarExampleButton', grammarExampleHandler, 'Ctrl+G');

  registerButton('#quoteButton', null, 'Ctrl+Q');
  registerButton('#notaBeneButton', null, 'Ctrl+N');
  registerButton('#commentButton', null, 'Ctrl+M');

  registerButton('#fitWidthButton', null, '');
  registerButton('#zoomInButton', null, '');
  registerButton('#zoomOutButton', null, '');

  registerButton('#previousButton', previousPageHandler, ',', '');
  registerButton('#nextButton', nextPageHandler, '.', '');

  registerButton('#facebookButton', null, '');
  registerButton('#googlePlusButton', null, '');
  registerButton('#twitterButton', null, '');
  registerButton('#vkontakteButton', null, '');

  registerButton('#helpButton', null, '');
  registerButton('#feedbackButton', null, '');
  registerButton('#aboutButton', null, 'F2');
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
  PDFJS.workerSrc = 'lib/pdf.js/pdf.worker.js';
  PDFJS.getDocument(pdfUrl).then(function (loadedPdf) {
    pdf = loadedPdf;
    renderPage(currentPageNumber);
  });
}

// EXAMPLE FROM http://mozilla.github.io/pdf.js/examples/learning/prevnext.html

var initialCanvasWidth = 0;
function renderPage(pageNumber) {
  pdf.getPage(pageNumber).then(function (page) {
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
      viewport     : viewport
    };
    var renderTask = page.render(renderContext);


    var pdfContainerDiv = $('#pdfViewerContainer');
    // Remove old textLayerDiv and append a brand new one.
    pdfContainerDiv.children("div").remove();
    var textLayerDiv = $('<div id="textLayerDiv"></div>');
    pdfContainerDiv.append(textLayerDiv);

    textLayerDiv.addClass('textLayer');
    textLayerDiv.width(canvas.width);
    textLayerDiv.height(canvas.height);

    var textLayerPromise = page.getTextContent().then(function (textContent) {
      var textLayerBuilder = new TextLayerBuilder({
        textLayerDiv: textLayerDiv.get(0),
        viewport: viewport,
        pageIndex: pageNumber - 1
      });
      textLayerBuilder.setTextContent(textContent);
    });

    // We might be interested when rendering complete and text layer is built.
    return Promise.all([renderTask.promise, textLayerPromise]);
  });
}

$(function () {
  log('Page loaded...');

  initializeSemanticUi();
  initializeMenu();

  var pdfUrl = getPdfUrl();
  setTitleFromUrl(pdfUrl);

  loadAndRenderPdf(pdfUrl);

  //$("#pdfViewerContainer").css("border", "1px solid black");
});