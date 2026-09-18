# 🤖 TextRank 문서 요약기 (PDF / DOCX)

업로드한 문서(PDF, Word `.docx`)에서 텍스트를 추출한 후 **TextRank 알고리즘**을 통해 문서의 주요 요점을 선택한 분량에 맞춰 자동으로 추출하는 웹 애플리케이션입니다.

---

## ✨ 핵심 특징
- **TextRank 그래프 알고리즘**:
  - 문장 간 자카드 유사도(Jaccard Similarity) 기반 인접 행렬 및 PageRank 반복 계산 수행
  - 가장 인접도와 중요도가 높은 주요 핵심 문장 추출
- **문맥 보존**:
  - 추출된 주요 문장들을 원문의 시간/문맥 순서대로 배치하여 요약문의 자연스러운 가독성 확보
- **슬라이더 분량 조절**:
  - 최소 **1문장** ~ 최대 **5문장** 슬라이더 선택 가능
- **보안 유지**:
  - 클라이언트 브라우저 단에서 전체 알고리즘이 실행되므로 서버로 텍스트 데이터가 전송되지 않음

---

## 🛠️ 사용 기술
- **HTML5 & CSS3**: 반응형 UI 및 모든 장치 지원 카드 레이아웃
- **JavaScript (ES6+)**: TextRank 및 PageRank 수학 알고리즘 직접 구현
- **[PDF.js](https://mozilla.github.io/pdf.js/)**: PDF 텍스트 추출
- **[Mammoth.js](https://github.com/mwilliamson/mammoth.js)**: DOCX 순수 텍스트 추출

---

## 🚀 Visual Studio 실행 방법

1. Visual Studio에서 프로젝트 폴더를 열고 `index.html`과 `README.md`를 구성합니다.
2. `index.html`을 우클릭한 뒤 **[브라우저에서 보기]** (또는 VS Code **Live Server**)로 실행합니다.
3. 문서를 업로드하고 요약 문장 수를 조절한 후 **[TextRank 요약]** 버튼을 클릭합니다.