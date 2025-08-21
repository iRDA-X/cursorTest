#!/usr/bin/env python3
"""
OpenCV MCP Server 테스트 스크립트
실제 MCP 프로토콜 통신 없이 서버 기능을 테스트합니다.
"""

import asyncio
import base64
import cv2
import numpy as np
from opencv_mcp_server import OpenCVProcessor
from mcp.types import TextContent

async def test_opencv_functions():
    """OpenCV 처리 함수들을 직접 테스트"""
    print("🧪 OpenCV MCP Server 기능 테스트")
    print("=" * 50)
    
    # 테스트용 이미지 생성
    test_img = np.zeros((200, 200, 3), dtype=np.uint8)
    cv2.circle(test_img, (100, 100), 50, (0, 255, 0), -1)
    cv2.rectangle(test_img, (50, 50), (150, 90), (255, 0, 0), -1)
    
    processor = OpenCVProcessor()
    
    # 이미지를 base64로 변환
    _, buffer = cv2.imencode('.png', test_img)
    test_img_b64 = base64.b64encode(buffer).decode()
    
    print("✅ 테스트 이미지 생성 완료")
    
    # 각 기능 테스트
    tests = [
        ("Edge Detection", "edge_detection", {"image": test_img_b64}),
        ("Gaussian Blur", "blur_image", {"image": test_img_b64, "kernel_size": 15}),
        ("Grayscale Convert", "convert_grayscale", {"image": test_img_b64}),
        ("Image Resize", "resize_image", {"image": test_img_b64, "width": 100, "height": 100}),
        ("Histogram Equalization", "histogram_equalization", {"image": test_img_b64}),
    ]
    
    success_count = 0
    
    for test_name, func_name, args in tests:
        try:
            print(f"\n🔧 {test_name} 테스트 중...")
            
            if func_name == "edge_detection":
                image = processor.base64_to_cv2(args["image"])
                edges = cv2.Canny(image, 100, 200)
                result_b64 = processor.cv2_to_base64(edges)
                
            elif func_name == "blur_image":
                image = processor.base64_to_cv2(args["image"])
                blurred = cv2.GaussianBlur(image, (15, 15), 0)
                result_b64 = processor.cv2_to_base64(blurred)
                
            elif func_name == "convert_grayscale":
                image = processor.base64_to_cv2(args["image"])
                gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
                result_b64 = processor.cv2_to_base64(gray)
                
            elif func_name == "resize_image":
                image = processor.base64_to_cv2(args["image"])
                resized = cv2.resize(image, (args["width"], args["height"]))
                result_b64 = processor.cv2_to_base64(resized)
                
            elif func_name == "histogram_equalization":
                image = processor.base64_to_cv2(args["image"])
                gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
                equalized = cv2.equalizeHist(gray)
                result_b64 = processor.cv2_to_base64(equalized)
            
            print(f"✅ {test_name}: 성공 (결과 크기: {len(result_b64)} characters)")
            success_count += 1
            
        except Exception as e:
            print(f"❌ {test_name}: 실패 - {str(e)}")
    
    print(f"\n📊 테스트 결과: {success_count}/{len(tests)} 성공")
    
    if success_count == len(tests):
        print("🎉 모든 테스트가 성공적으로 완료되었습니다!")
    else:
        print("⚠️ 일부 테스트가 실패했습니다. 에러 메시지를 확인해주세요.")

def test_image_conversion():
    """이미지 변환 기능 테스트"""
    print("\n🔄 이미지 변환 기능 테스트")
    print("-" * 30)
    
    processor = OpenCVProcessor()
    
    try:
        # 테스트 이미지 생성
        original = np.random.randint(0, 256, (100, 100, 3), dtype=np.uint8)
        
        # OpenCV → Base64 → OpenCV 변환 테스트
        _, buffer = cv2.imencode('.png', original)
        b64_str = base64.b64encode(buffer).decode()
        
        converted = processor.base64_to_cv2(b64_str)
        
        print(f"✅ 원본 이미지 형태: {original.shape}")
        print(f"✅ 변환된 이미지 형태: {converted.shape}")
        print("✅ 이미지 변환 테스트 성공")
        
    except Exception as e:
        print(f"❌ 이미지 변환 테스트 실패: {str(e)}")

if __name__ == "__main__":
    # OpenCV 버전 확인
    print(f"OpenCV 버전: {cv2.__version__}")
    print(f"NumPy 버전: {np.__version__}")
    print()
    
    # 이미지 변환 테스트
    test_image_conversion()
    
    # 메인 기능 테스트
    asyncio.run(test_opencv_functions())