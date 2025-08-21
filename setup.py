#!/usr/bin/env python3
"""
OpenCV MCP Server 설정 스크립트
"""

from setuptools import setup, find_packages

setup(
    name="opencv-mcp-server",
    version="1.0.0",
    description="OpenCV 기능을 제공하는 Model Context Protocol 서버",
    author="Your Name",
    author_email="your.email@example.com",
    packages=find_packages(),
    install_requires=[
        "opencv-python>=4.8.0",
        "numpy>=1.24.0",
        "Pillow>=10.0.0",
        "mcp>=0.4.0",
        "pydantic>=2.0.0",
    ],
    python_requires=">=3.8",
    entry_points={
        "console_scripts": [
            "opencv-mcp-server=opencv_mcp_server:main",
        ],
    },
    classifiers=[
        "Development Status :: 3 - Alpha",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
    ],
)