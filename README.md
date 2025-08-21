# OpenCV MCP Server

OpenCV 기능을 제공하는 Model Context Protocol (MCP) 서버입니다. 이 서버를 통해 Claude나 다른 AI 도구에서 OpenCV의 강력한 컴퓨터 비전 기능을 직접 활용할 수 있습니다.

## 🚀 주요 기능

- **Canny Edge Detection**: 이미지에서 가장자리 감지
- **가우시안 블러**: 이미지 흐림 효과 적용
- **그레이스케일 변환**: 컬러 이미지를 흑백으로 변환
- **얼굴 감지**: Haar Cascade를 사용한 얼굴 인식
- **이미지 리사이징**: 이미지 크기 조정
- **히스토그램 균등화**: 이미지 대비 개선

## 📋 요구사항

- Python 3.8 이상
- OpenCV
- Model Context Protocol 라이브러리

## 🛠 설치 방법

### 1. 저장소 클론 및 의존성 설치

```bash
# 의존성 패키지 설치
pip install -r requirements.txt

# 또는 setup.py를 사용하여 설치
python setup.py install
```

### 2. MCP 서버 구성

Claude Desktop이나 다른 MCP 클라이언트에서 서버를 사용하려면 `config.json` 파일을 MCP 클라이언트 설정에 추가해야 합니다.

**Claude Desktop의 경우:**

1. Claude Desktop 설정 파일을 열어서 다음 내용을 추가합니다:

```json
{
  "mcpServers": {
    "opencv": {
      "command": "python",
      "args": ["/workspace/opencv_mcp_server.py"],
      "env": {
        "PYTHONPATH": "/workspace"
      }
    }
  }
}
```

2. Claude Desktop을 재시작합니다.

## 🎯 사용 방법

### 직접 실행

```bash
python opencv_mcp_server.py
```

### Claude에서 사용

OpenCV MCP 서버를 설정한 후, Claude에서 다음과 같이 사용할 수 있습니다:

1. **이미지 업로드**: 처리하고 싶은 이미지를 Claude에 업로드합니다.
2. **OpenCV 도구 호출**: 원하는 OpenCV 기능을 요청합니다.

예시:
```
"이 이미지에 Canny edge detection을 적용해주세요. threshold1은 50, threshold2는 150으로 설정해주세요."

"이미지를 300x300 크기로 리사이징해주세요."

"이미지에서 얼굴을 감지하고 사각형으로 표시해주세요."
```

## 🧪 테스트

예제 클라이언트를 실행하여 서버 기능을 테스트할 수 있습니다:

```bash
python example_client.py
```

이 스크립트는:
- 테스트용 샘플 이미지들을 생성합니다
- 각 OpenCV 기능의 사용법을 보여줍니다
- 실제 서버 연결 시 결과를 확인할 수 있는 준비를 합니다

## 📚 사용 가능한 도구들

### 1. edge_detection
```json
{
  "name": "edge_detection",
  "parameters": {
    "image": "base64로 인코딩된 이미지",
    "threshold1": 100,  // 첫 번째 임계값
    "threshold2": 200   // 두 번째 임계값
  }
}
```

### 2. blur_image
```json
{
  "name": "blur_image", 
  "parameters": {
    "image": "base64로 인코딩된 이미지",
    "kernel_size": 15  // 블러 커널 크기 (홀수)
  }
}
```

### 3. convert_grayscale
```json
{
  "name": "convert_grayscale",
  "parameters": {
    "image": "base64로 인코딩된 이미지"
  }
}
```

### 4. face_detection
```json
{
  "name": "face_detection",
  "parameters": {
    "image": "base64로 인코딩된 이미지",
    "scale_factor": 1.1,  // 스케일 팩터
    "min_neighbors": 5    // 최소 이웃 개수
  }
}
```

### 5. resize_image
```json
{
  "name": "resize_image",
  "parameters": {
    "image": "base64로 인코딩된 이미지",
    "width": 300,   // 새로운 폭
    "height": 200   // 새로운 높이
  }
}
```

### 6. histogram_equalization
```json
{
  "name": "histogram_equalization",
  "parameters": {
    "image": "base64로 인코딩된 이미지"
  }
}
```

## 🔧 개발 및 확장

새로운 OpenCV 기능을 추가하려면:

1. `opencv_mcp_server.py`에서 `handle_list_tools()` 함수에 새로운 도구를 추가
2. `handle_call_tool()` 함수에 해당 기능의 구현을 추가
3. 필요한 경우 `OpenCVProcessor` 클래스에 헬퍼 메소드 추가

### 예시: 새로운 도구 추가

```python
# handle_list_tools()에 추가
Tool(
    name="my_new_tool",
    description="새로운 OpenCV 기능입니다.",
    inputSchema={
        "type": "object",
        "properties": {
            "image": {"type": "string", "description": "Base64로 인코딩된 이미지"},
            "param1": {"type": "number", "description": "매개변수 1"}
        },
        "required": ["image"]
    }
)

# handle_call_tool()에 구현 추가
elif name == "my_new_tool":
    image = processor.base64_to_cv2(arguments["image"])
    param1 = arguments.get("param1", 0)
    
    # OpenCV 처리 로직
    result = cv2.some_function(image, param1)
    result_base64 = processor.cv2_to_base64(result)
    
    return [TextContent(
        type="text",
        text=f"새로운 도구 처리 완료\\n결과 이미지: data:image/png;base64,{result_base64}"
    )]
```

## 🛡️ 에러 처리

서버는 다음과 같은 에러 상황을 처리합니다:

- 잘못된 Base64 이미지 데이터
- OpenCV 처리 중 발생하는 오류
- 잘못된 매개변수 값
- 지원되지 않는 이미지 형식

## 📝 라이선스

MIT License

## 🤝 기여하기

1. 이 저장소를 포크합니다
2. 새로운 기능 브랜치를 생성합니다 (`git checkout -b feature/AmazingFeature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add some AmazingFeature'`)
4. 브랜치에 푸시합니다 (`git push origin feature/AmazingFeature`)
5. Pull Request를 생성합니다

## 📞 지원

문제가 발생하거나 질문이 있으시면 이슈를 생성해 주세요.

---

**OpenCV MCP Server**로 컴퓨터 비전의 세계를 AI와 함께 탐험해보세요! 🎉