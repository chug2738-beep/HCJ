/**
 * 웹앱 접속 시 index.html 화면을 렌더링
 */
function doGet() {
  return HtmlService.createTemplateFromFile('index')
      .evaluate()
      .setTitle('일본 여행지 선정')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * 폼 데이터를 받아 구글 스프레드시트에 저장하는 함수
 * @param {Object} formData 설문 데이터 (이름, 연락처, 여행지)
 */
function submitData(formData) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // 헤더(1행)가 없을 경우 대비하여 자동 생성
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['이름', '연락처', '가고싶은 여행지']);
    }
    
    // 데이터 추가
    sheet.appendRow([
      formData.name,
      formData.phone,
      formData.destination
    ]);
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}
