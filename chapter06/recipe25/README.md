# 📊 PDF & DOCX 문서 수량 분석기

업로드한 **PDF** 또는 Word(**.docx**) 파일 내에 포함된 글자 수, 단어 수, 공백 개수 및 이미지 개수를 자동으로 분석해 주는 클라이언트 사이드 웹 애플리케이션입니다.

---

## ✨ 주요 기능
- **드래그 앤 드롭 업로드**: 파일을 드래그하여 손쉽게 등록 가능
- **글자 수 분석**: 공백 포함 및 공백 제외 글자 수 계산
- **단어 & 공백 분석**: 총 단어 수 및 공백(띄어쓰기, 줄바꿈 등) 개수 산출
- **이미지 개수 분석**:
  - **PDF**: PDF Operator 탐색을 통한 객체 형태 이미지 수 탐지
  - **DOCX**: 미디어 파일 구조 분석(`word/media/`)을 통한 정확한 이미지 수 카운트
- **보안성**: 모든 문서 처리 과정이 브라우저 내부(클라이언트 측)에서 실행되어 데이터 유출 우려가 없음

---

## 🛠️ 사용 라이브러리
- **[PDF.js](https://mozilla.github.io/pdf.js/)**: PDF 문서 텍스트 및 이미지 오퍼레이터 추출
- **[Mammoth.js](https://github.com/mwilliamson/mammoth.js)**: DOCX 순수 텍스트 추출
- **[JSZip](https://stuk.github.io/jszip/)**: DOCX 파일 내부 미디어(이미지) 구조 분석

---

## 🚀 Visual Studio 실행 방법

1. Visual Studio에서 프로젝트 폴더를 작성하고 `index.html`과 `README.md`를 추가합니다.
2. `index.html`을 우클릭한 후 **[브라우저에서 보기]** (또는 VS Code의 **Live Server**)로 실행합니다.
3. PDF 또는 DOCX 파일을 드래그하여 결과를 확인합니다.