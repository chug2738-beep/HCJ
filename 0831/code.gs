/**
 * 웹 앱 요청 시 index.html 파일을 반환합니다.
 */
function doGet(e) {
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle('韓国 ソウル 3泊4日モデルコース')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * 필요한 경우 HTML 파일 및 분할 파일(CSS/JS 등)을 불러오는 함수
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}
