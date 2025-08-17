# iRDA-X 서비스 - AI SNS 마케팅 랜딩 페이지

## 프로젝트 개요

iRDA-X 서비스의 AI SNS 마케팅 서비스를 홍보하고 상담 신청을 유도하는 단일 페이지 웹사이트입니다.

### 주요 특징

- **AI 기반 SNS 마케팅 서비스** 소개
- **기존 대비 50% 비용 절감** 강조
- **성과 기반 비용 지불** 시스템
- **실시간 성과 모니터링** 기능
- **반응형 디자인** (모바일 최적화)
- **부드러운 스크롤 애니메이션**
- **인터섹션 옵저버** 기반 애니메이션

## 기술 스택

- **HTML5** - 시맨틱 마크업
- **CSS3** - 모던 스타일링 및 애니메이션
- **Vanilla JavaScript** - 인터랙티브 기능
- **Tailwind CSS** - 유틸리티 기반 스타일링
- **Noto Sans KR** - 한글 최적화 폰트

## 디자인 시스템

### 색상 팔레트 (UMAUMA Icons 테마)

```css
--primary-dark: #1243A6;    /* 진한 파랑 - 주요 버튼, 헤더 */
--primary: #1D64F2;         /* 밝은 파랑 - 링크, 하이라이트 */
--dark: #011C40;            /* 네이비 - 텍스트, 배경 */
--light: #F2EED8;           /* 크림 - 배경, 카드 */
--accent: #F24822;          /* 오렌지레드 - CTA, 강조 */
```

### 폰트

- **제목**: Noto Sans KR Bold
- **본문**: Noto Sans KR Regular

## 페이지 구조

1. **Hero Section** - 메인 타이틀, 서브 타이틀, CTA 버튼
2. **Service Introduction** - 3가지 핵심 장점 카드
3. **Features Section** - AI 기능 4가지 소개
4. **Pricing Section** - 기존 업체 vs iRDA-X 서비스 비교
5. **Process Section** - 4단계 프로세스 설명
6. **Testimonials Section** - 고객 후기
7. **CTA Section** - 최종 상담 유도
8. **Footer** - 회사 정보 및 링크

## 파일 구조

```
cursorTest/
├── index.html          # 메인 HTML 파일
├── styles.css          # CSS 스타일시트
├── script.js           # JavaScript 기능
├── README.md           # 프로젝트 설명서
└── 웹사이트기획안.markdown  # 기획 문서
```

## 주요 기능

### 1. 반응형 디자인
- 모바일 퍼스트 접근법
- 모든 디바이스에서 최적화된 경험
- 유연한 그리드 시스템

### 2. 스크롤 애니메이션
- 인터섹션 옵저버 기반 페이드인 효과
- 부드러운 스크롤 네비게이션
- 스크롤 진행률 표시

### 3. 인터랙티브 요소
- 호버 효과 및 마이크로 인터랙션
- 버튼 클릭 피드백
- 알림 시스템

### 4. 성능 최적화
- 디바운스된 스크롤 이벤트
- 최적화된 애니메이션
- 효율적인 DOM 조작

## 설치 및 실행

### 로컬 개발 서버 실행

1. 프로젝트 폴더로 이동:
```bash
cd cursorTest
```

2. 로컬 서버 실행 (Python 사용):
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

3. 브라우저에서 접속:
```
http://localhost:8000
```

### 정적 호스팅 배포

GitHub Pages, Netlify, Vercel 등 정적 호스팅 서비스에 배포 가능합니다.

## 브라우저 지원

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 개발 가이드라인

### CSS 작성 규칙
- CSS 변수 활용
- 모듈화된 스타일 구조
- 반응형 미디어 쿼리 사용

### JavaScript 작성 규칙
- ES6+ 문법 사용
- 함수형 프로그래밍 접근법
- 성능 최적화 고려

### 접근성 고려사항
- 시맨틱 HTML 구조
- 키보드 네비게이션 지원
- 스크린 리더 호환성

## 커스터마이징

### 색상 변경
`styles.css` 파일의 CSS 변수를 수정하여 색상을 변경할 수 있습니다:

```css
:root {
    --primary-dark: #your-color;
    --primary: #your-color;
    --dark: #your-color;
    --light: #your-color;
    --accent: #your-color;
}
```

### 콘텐츠 수정
`index.html` 파일에서 텍스트와 이미지를 수정할 수 있습니다.

### 기능 추가
`script.js` 파일에 새로운 JavaScript 기능을 추가할 수 있습니다.

## 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 연락처

- **회사**: iRDA-X 서비스
- **전화**: 1588-0000
- **이메일**: infobiz@irda-x.com
- **카카오톡**: @iRDA-X 서비스

## 업데이트 로그

### v1.0.0 (2026-01-XX)
- 초기 버전 릴리스
- 기본 랜딩 페이지 기능 구현
- 반응형 디자인 적용
- 스크롤 애니메이션 구현

