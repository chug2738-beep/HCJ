# 서울 3박4일 모델 코스 (일본인 대상)

일본인 여행자를 위한 서울 3박4일 여행 일정을 소개하는 Google Apps Script 웹앱입니다.

## 구성
- `code.gs` — GAS 웹앱 진입점 (`doGet`), `index.html` 렌더링
- `index.html` — DAY1~4 일정, 숙소 추천, 맛집, QR코드 안내가 담긴 단일 페이지
- `3박4일.json` — Apps Script 프로젝트 내보내기(export) 파일 (appsscript 설정 + index.html 원본 소스 포함)

## 기술 스택
- Google Apps Script (HtmlService)
- HTML5/CSS3 (인라인 스타일)

## 실행 방법
Google Apps Script 프로젝트로 배포하거나, `index.html`을 단독으로 브라우저에서 열어 확인할 수 있습니다.
