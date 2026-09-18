# 🎵 웹 오디오 스튜디오 & 에디터 (Web Audio Editor)

서버 없이 브라우저 내에서 직접 오디오 파일(MP3, WAV 등)을 편집하고 원하는 포맷으로 변환 및 다운로드할 수 있는 웹 애플리케이션입니다.

---

## ✨ 핵심 기능
1. **일부 구간 자르기 (Trim)**:
   - 시작 시간과 종료 시간을 설정하여 원하는 영역만 추출
2. **볼륨 조절 (Volume Gain)**:
   - 0% ~ 200% 범위 내에서 음량 증폭 및 감소
3. **포맷 변환 (Format Conversion)**:
   - 편집된 오디오 데이터를 **WAV(무손실)** 또는 **MP3(압축)** 형태로 인코딩하여 저장
4. **시각적 파형 렌더링**:
   - HTML5 Canvas 기반 실시간 오디오 파형 출력 및 미리듣기 재생/정지 지원

---

## 🛠️ 사용 기술
- **Web Audio API**: 브라우저 기반 실시간 PCM 데이터 디코딩 및 샘플 연산
- **HTML5 Canvas**: 오디오 Waveform 시각화
- **[lamejs](https://github.com/zhuker/lamejs)**: 클라이언트 사이드 MP3 인코더

---

## 🚀 Visual Studio 실행 방법

1. Visual Studio에서 프로젝트 폴더에 `index.html`과 `README.md`를 준비합니다.
2. `index.html`을 우클릭한 뒤 **[브라우저에서 보기]** (또는 VS Code **Live Server**)로 실행합니다.
3. 오디오 파일을 업로드하여 구간 자르기, 볼륨 조정, 포맷 변환 편집을 진행합니다.