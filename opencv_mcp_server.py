#!/usr/bin/env python3
"""
OpenCV MCP Server
OpenCV 기능을 제공하는 Model Context Protocol 서버
"""

import asyncio
import cv2
import numpy as np
import base64
from io import BytesIO
from PIL import Image
import json
from typing import Dict, List, Optional, Any
from mcp import McpServer, ResourceTemplate, ToolTemplate
from mcp.shared.exceptions import McpError
from mcp.types import Resource, Tool, TextContent

# MCP 서버 초기화
server = McpServer("opencv-server")

class OpenCVProcessor:
    """OpenCV 이미지 처리 기능을 제공하는 클래스"""
    
    @staticmethod
    def base64_to_cv2(base64_str: str) -> np.ndarray:
        """Base64 문자열을 OpenCV 이미지로 변환"""
        try:
            # Base64 디코딩
            img_data = base64.b64decode(base64_str)
            # PIL Image로 변환
            pil_image = Image.open(BytesIO(img_data))
            # numpy 배열로 변환
            np_array = np.array(pil_image)
            # BGR로 변환 (OpenCV 기본 포맷)
            if len(np_array.shape) == 3:
                cv2_image = cv2.cvtColor(np_array, cv2.COLOR_RGB2BGR)
            else:
                cv2_image = np_array
            return cv2_image
        except Exception as e:
            raise McpError(f"이미지 변환 실패: {str(e)}")
    
    @staticmethod
    def cv2_to_base64(cv2_image: np.ndarray) -> str:
        """OpenCV 이미지를 Base64 문자열로 변환"""
        try:
            # BGR을 RGB로 변환
            if len(cv2_image.shape) == 3:
                rgb_image = cv2.cvtColor(cv2_image, cv2.COLOR_BGR2RGB)
            else:
                rgb_image = cv2_image
            
            # PIL Image로 변환
            pil_image = Image.fromarray(rgb_image)
            
            # BytesIO를 사용하여 base64로 인코딩
            buffer = BytesIO()
            pil_image.save(buffer, format='PNG')
            img_str = base64.b64encode(buffer.getvalue()).decode()
            return img_str
        except Exception as e:
            raise McpError(f"이미지 인코딩 실패: {str(e)}")

# 도구 등록
@server.list_tools()
async def handle_list_tools() -> List[Tool]:
    """사용 가능한 OpenCV 도구들을 반환"""
    return [
        Tool(
            name="edge_detection",
            description="Canny edge detection을 사용하여 이미지에서 가장자리를 감지합니다.",
            inputSchema={
                "type": "object",
                "properties": {
                    "image": {
                        "type": "string",
                        "description": "Base64로 인코딩된 이미지"
                    },
                    "threshold1": {
                        "type": "number",
                        "description": "첫 번째 임계값 (기본값: 100)",
                        "default": 100
                    },
                    "threshold2": {
                        "type": "number",
                        "description": "두 번째 임계값 (기본값: 200)",
                        "default": 200
                    }
                },
                "required": ["image"]
            }
        ),
        Tool(
            name="blur_image",
            description="가우시안 블러를 적용하여 이미지를 흐리게 만듭니다.",
            inputSchema={
                "type": "object",
                "properties": {
                    "image": {
                        "type": "string",
                        "description": "Base64로 인코딩된 이미지"
                    },
                    "kernel_size": {
                        "type": "number",
                        "description": "블러 커널 크기 (홀수여야 함, 기본값: 15)",
                        "default": 15
                    }
                },
                "required": ["image"]
            }
        ),
        Tool(
            name="convert_grayscale",
            description="컬러 이미지를 그레이스케일로 변환합니다.",
            inputSchema={
                "type": "object",
                "properties": {
                    "image": {
                        "type": "string",
                        "description": "Base64로 인코딩된 이미지"
                    }
                },
                "required": ["image"]
            }
        ),
        Tool(
            name="face_detection",
            description="Haar Cascade를 사용하여 이미지에서 얼굴을 감지합니다.",
            inputSchema={
                "type": "object",
                "properties": {
                    "image": {
                        "type": "string",
                        "description": "Base64로 인코딩된 이미지"
                    },
                    "scale_factor": {
                        "type": "number",
                        "description": "스케일 팩터 (기본값: 1.1)",
                        "default": 1.1
                    },
                    "min_neighbors": {
                        "type": "number",
                        "description": "최소 이웃 개수 (기본값: 5)",
                        "default": 5
                    }
                },
                "required": ["image"]
            }
        ),
        Tool(
            name="resize_image",
            description="이미지 크기를 변경합니다.",
            inputSchema={
                "type": "object",
                "properties": {
                    "image": {
                        "type": "string",
                        "description": "Base64로 인코딩된 이미지"
                    },
                    "width": {
                        "type": "number",
                        "description": "새로운 폭"
                    },
                    "height": {
                        "type": "number",
                        "description": "새로운 높이"
                    }
                },
                "required": ["image", "width", "height"]
            }
        ),
        Tool(
            name="histogram_equalization",
            description="히스토그램 균등화를 적용하여 이미지의 대비를 개선합니다.",
            inputSchema={
                "type": "object",
                "properties": {
                    "image": {
                        "type": "string",
                        "description": "Base64로 인코딩된 이미지"
                    }
                },
                "required": ["image"]
            }
        )
    ]

@server.call_tool()
async def handle_call_tool(name: str, arguments: Dict[str, Any]) -> List[TextContent]:
    """OpenCV 도구 호출 처리"""
    try:
        processor = OpenCVProcessor()
        
        if name == "edge_detection":
            image = processor.base64_to_cv2(arguments["image"])
            threshold1 = arguments.get("threshold1", 100)
            threshold2 = arguments.get("threshold2", 200)
            
            # Canny edge detection
            edges = cv2.Canny(image, threshold1, threshold2)
            result_base64 = processor.cv2_to_base64(edges)
            
            return [TextContent(
                type="text",
                text=f"Canny edge detection 완료. 임계값: {threshold1}, {threshold2}\n결과 이미지: data:image/png;base64,{result_base64}"
            )]
        
        elif name == "blur_image":
            image = processor.base64_to_cv2(arguments["image"])
            kernel_size = arguments.get("kernel_size", 15)
            
            # 커널 크기가 홀수인지 확인
            if kernel_size % 2 == 0:
                kernel_size += 1
            
            # 가우시안 블러 적용
            blurred = cv2.GaussianBlur(image, (kernel_size, kernel_size), 0)
            result_base64 = processor.cv2_to_base64(blurred)
            
            return [TextContent(
                type="text",
                text=f"가우시안 블러 적용 완료. 커널 크기: {kernel_size}x{kernel_size}\n결과 이미지: data:image/png;base64,{result_base64}"
            )]
        
        elif name == "convert_grayscale":
            image = processor.base64_to_cv2(arguments["image"])
            
            # 그레이스케일 변환
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            result_base64 = processor.cv2_to_base64(gray)
            
            return [TextContent(
                type="text",
                text=f"그레이스케일 변환 완료\n결과 이미지: data:image/png;base64,{result_base64}"
            )]
        
        elif name == "face_detection":
            image = processor.base64_to_cv2(arguments["image"])
            scale_factor = arguments.get("scale_factor", 1.1)
            min_neighbors = arguments.get("min_neighbors", 5)
            
            # Haar Cascade 분류기 로드
            face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
            
            # 그레이스케일 변환
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            
            # 얼굴 감지
            faces = face_cascade.detectMultiScale(gray, scale_factor, min_neighbors)
            
            # 감지된 얼굴에 사각형 그리기
            result_image = image.copy()
            for (x, y, w, h) in faces:
                cv2.rectangle(result_image, (x, y), (x+w, y+h), (255, 0, 0), 2)
            
            result_base64 = processor.cv2_to_base64(result_image)
            
            return [TextContent(
                type="text",
                text=f"얼굴 감지 완료. {len(faces)}개의 얼굴을 찾았습니다.\n결과 이미지: data:image/png;base64,{result_base64}"
            )]
        
        elif name == "resize_image":
            image = processor.base64_to_cv2(arguments["image"])
            width = int(arguments["width"])
            height = int(arguments["height"])
            
            # 이미지 크기 변경
            resized = cv2.resize(image, (width, height))
            result_base64 = processor.cv2_to_base64(resized)
            
            return [TextContent(
                type="text",
                text=f"이미지 크기 변경 완료. 새로운 크기: {width}x{height}\n결과 이미지: data:image/png;base64,{result_base64}"
            )]
        
        elif name == "histogram_equalization":
            image = processor.base64_to_cv2(arguments["image"])
            
            # 그레이스케일로 변환
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            
            # 히스토그램 균등화
            equalized = cv2.equalizeHist(gray)
            result_base64 = processor.cv2_to_base64(equalized)
            
            return [TextContent(
                type="text",
                text=f"히스토그램 균등화 완료\n결과 이미지: data:image/png;base64,{result_base64}"
            )]
        
        else:
            raise McpError(f"알 수 없는 도구: {name}")
    
    except Exception as e:
        raise McpError(f"도구 실행 중 오류 발생: {str(e)}")

async def main():
    """MCP 서버 실행"""
    from mcp.server.stdio import stdio_server
    
    async with stdio_server() as (read_stream, write_stream):
        await server.run(
            read_stream,
            write_stream,
            server.create_initialization_options()
        )

if __name__ == "__main__":
    asyncio.run(main())