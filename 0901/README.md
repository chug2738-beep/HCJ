# 일본 여행지 선정 설문 (SeishunTravel)

이름/연락처/가고 싶은 일본 여행지를 입력받아 구글 스프레드시트에 저장하는 설문 웹앱입니다.

## 구성
- `code.gs` — GAS 웹앱 진입점 (`doGet`)과 폼 데이터를 시트에 저장하는 `submitData` 함수
- `index.html` — Tailwind CSS 기반 설문 폼 UI
- `0901개인 디자인 수정.xlsx` — 디자인 검토용 엑셀 파일

## 기술 스택
- Google Apps Script (HtmlService, SpreadsheetApp)
- Tailwind CSS(CDN), Material Symbols, Google Fonts

## 실행 방법
Google Apps Script 프로젝트로 배포한 뒤 웹앱 URL로 접속합니다. 제출된 데이터는 연결된 스프레드시트에 자동 저장됩니다.
