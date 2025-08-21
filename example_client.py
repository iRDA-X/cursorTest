#!/usr/bin/env python3
"""
OpenCV MCP Server 사용 예제
"""

import asyncio
import base64
import json
from pathlib import Path
from typing import Dict, Any

async def test_opencv_mcp():
    """OpenCV MCP 서버 기능 테스트"""
    
    # 테스트용 샘플 이미지 생성 (간단한 체크보드 패턴)
    import cv2
    import numpy as np
    
    # 체크보드 패턴 생성
    img = np.zeros((200, 200, 3), dtype=np.uint8)
    for i in range(0, 200, 25):
        for j in range(0, 200, 25):
            if (i // 25 + j // 25) % 2 == 0:
                img[i:i+25, j:j+25] = [255, 255, 255]
    
    # 원과 사각형 추가
    cv2.circle(img, (100, 100), 30, (0, 255, 0), -1)
    cv2.rectangle(img, (50, 150), (150, 180), (255, 0, 0), -1)
    
    # 이미지를 Base64로 인코딩
    _, buffer = cv2.imencode('.png', img)
    sample_image_b64 = base64.b64encode(buffer).decode()
    
    print("OpenCV MCP Server 테스트 시작...")
    print("=" * 50)
    
    # 테스트할 도구들
    test_cases = [
        {
            "name": "edge_detection",
            "args": {"image": sample_image_b64, "threshold1": 50, "threshold2": 150},
            "description": "Canny Edge Detection 테스트"
        },
        {
            "name": "blur_image", 
            "args": {"image": sample_image_b64, "kernel_size": 21},
            "description": "가우시안 블러 테스트"
        },
        {
            "name": "convert_grayscale",
            "args": {"image": sample_image_b64},
            "description": "그레이스케일 변환 테스트"
        },
        {
            "name": "resize_image",
            "args": {"image": sample_image_b64, "width": 100, "height": 100},
            "description": "이미지 리사이징 테스트"
        },
        {
            "name": "histogram_equalization",
            "args": {"image": sample_image_b64},
            "description": "히스토그램 균등화 테스트"
        }
    ]
    
    # 각 테스트 케이스 실행
    for test in test_cases:
        print(f"\n📸 {test['description']}")
        print(f"도구: {test['name']}")
        print(f"매개변수: {json.dumps({k: v if k != 'image' else '[이미지 데이터]' for k, v in test['args'].items()}, indent=2)}")
        print("✅ 테스트 준비 완료 (실제 MCP 서버와 연결 시 결과를 확인할 수 있습니다)")

def create_sample_images():
    """다양한 테스트용 샘플 이미지 생성"""
    import cv2
    import numpy as np
    
    # 1. 기본 도형들이 있는 이미지
    img1 = np.zeros((300, 400, 3), dtype=np.uint8)
    cv2.circle(img1, (100, 100), 50, (0, 255, 0), -1)
    cv2.rectangle(img1, (200, 50), (350, 150), (255, 0, 0), -1)
    cv2.ellipse(img1, (250, 200), (80, 40), 45, 0, 360, (0, 0, 255), -1)
    cv2.imwrite('sample_shapes.png', img1)
    
    # 2. 텍스트가 포함된 이미지
    img2 = np.ones((200, 400, 3), dtype=np.uint8) * 255
    cv2.putText(img2, 'OpenCV MCP Test', (50, 100), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 0), 2)
    cv2.imwrite('sample_text.png', img2)
    
    # 3. 노이즈가 있는 이미지
    img3 = np.random.randint(0, 256, (200, 200, 3), dtype=np.uint8)
    cv2.circle(img3, (100, 100), 50, (255, 255, 255), -1)
    cv2.imwrite('sample_noisy.png', img3)
    
    print("📁 샘플 이미지들이 생성되었습니다:")
    print("  - sample_shapes.png: 기본 도형들")
    print("  - sample_text.png: 텍스트 이미지")
    print("  - sample_noisy.png: 노이즈가 있는 이미지")

if __name__ == "__main__":
    print("🚀 OpenCV MCP Server 예제 실행")
    print()
    
    # 샘플 이미지 생성
    create_sample_images()
    print()
    
    # 테스트 실행
    asyncio.run(test_opencv_mcp())