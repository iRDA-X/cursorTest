#!/bin/bash

# OpenCV MCP Server 설치 스크립트

echo "🚀 OpenCV MCP Server 설치를 시작합니다..."

# Python 버전 확인
python_version=$(python3 --version 2>&1 | grep -o '[0-9]\+\.[0-9]\+')
if [[ $(echo "$python_version >= 3.8" | bc -l) -eq 0 ]]; then
    echo "❌ Python 3.8 이상이 필요합니다. 현재 버전: $python_version"
    exit 1
fi

echo "✅ Python 버전 확인: $python_version"

# 가상환경 생성 (선택사항)
read -p "가상환경을 생성하시겠습니까? (y/N): " create_venv
if [[ $create_venv =~ ^[Yy]$ ]]; then
    echo "📦 가상환경 생성 중..."
    python3 -m venv opencv_mcp_env
    source opencv_mcp_env/bin/activate
    echo "✅ 가상환경 활성화 완료"
fi

# 의존성 설치
echo "📥 의존성 패키지 설치 중..."
pip install --upgrade pip
pip install -r requirements.txt

if [ $? -eq 0 ]; then
    echo "✅ 의존성 설치 완료"
else
    echo "❌ 의존성 설치 실패"
    exit 1
fi

# OpenCV 테스트
echo "🧪 OpenCV 설치 확인 중..."
python3 -c "import cv2; print(f'OpenCV 버전: {cv2.__version__}')" 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ OpenCV 설치 확인 완료"
else
    echo "❌ OpenCV 설치 확인 실패"
    exit 1
fi

# 실행 권한 부여
chmod +x opencv_mcp_server.py
chmod +x example_client.py

echo ""
echo "🎉 OpenCV MCP Server 설치 완료!"
echo ""
echo "다음 단계:"
echo "1. Claude Desktop 설정 파일에 config.json 내용을 추가하세요"
echo "2. 'python3 example_client.py'로 테스트하세요"
echo "3. 'python3 opencv_mcp_server.py'로 서버를 실행하세요"
echo ""

if [[ $create_venv =~ ^[Yy]$ ]]; then
    echo "💡 가상환경을 사용하는 경우:"
    echo "   source opencv_mcp_env/bin/activate"
    echo ""
fi