// DOM이 로드된 후 실행
document.addEventListener('DOMContentLoaded', function() {
    // 페이지 초기 설정
    setupInitialPageState();
    
    // 인터섹션 옵저버 설정
    setupIntersectionObserver();
    
    // 스무스 스크롤 설정
    setupSmoothScroll();
    
    // 버튼 이벤트 리스너 설정
    setupButtonListeners();
    
    // 네비게이션 스크롤 효과
    setupNavigationScroll();
    
    // 햄버거 메뉴 설정
    setupHamburgerMenu();
    
    // 로고 클릭 이벤트 설정
    setupLogoClickEvents();
    
    // 폼 유효성 검사 (상담 신청 폼이 있다면)
    setupFormValidation();
    
    // 모달 이벤트 리스너 설정
    setupModalEventListeners();
    
    // 페이지 로드 애니메이션
    setupPageLoadAnimation();
    
    // 타이핑 애니메이션 설정
    setupTypingAnimation();
});

// 페이지 초기 상태 설정
function setupInitialPageState() {
    // hero section은 표시하되, service section부터 메뉴가 나타나도록 설정
    const heroSection = document.querySelector('#hero');
    if (heroSection) {
        heroSection.style.display = 'flex';
    }
    
    // service section의 원래 스타일 복원
    const serviceSection = document.querySelector('#service');
    if (serviceSection) {
        serviceSection.style.marginTop = '';
        serviceSection.style.paddingTop = '';
    }
}

// 인터섹션 옵저버 설정
function setupIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // 애니메이션을 적용할 요소들
    const animatedElements = document.querySelectorAll(`
        .service-card,
        .feature-card,
        .pricing-card,
        .process-card,
        .testimonial-card,
        .section-title,
        .hero-title,
        .hero-subtitle,
        .hero-buttons
    `);

    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// 스무스 스크롤 설정
function setupSmoothScroll() {
    // 데스크톱과 모바일 모든 네비게이션 링크 선택
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                let offsetTop;
                
                // service section의 경우 hero section을 건너뛰고 바로 service section으로 이동
                if (targetId === '#service') {
                    const heroSection = document.querySelector('#hero');
                    const heroHeight = heroSection ? heroSection.offsetHeight : 0;
                    offsetTop = heroHeight - 80; // 네비게이션 높이만큼 조정
                } else {
                    offsetTop = targetSection.offsetTop - 80; // 네비게이션 높이만큼 조정
                }
                
                // 모바일 메뉴가 열려있다면 닫기
                const mobileMenu = document.getElementById('mobileMenu');
                if (mobileMenu && mobileMenu.classList.contains('active')) {
                    closeMobileMenu();
                }
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// 버튼 이벤트 리스너 설정
function setupButtonListeners() {
    // 모든 CTA 버튼에 클릭 이벤트 추가
    const ctaButtons = document.querySelectorAll(`
        .cta-button-primary,
        .cta-button-secondary,
        .cta-button-small,
        .cta-button-large
    `);
    
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 버튼 클릭 효과
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // 상담 신청 모달 또는 페이지로 이동
            handleConsultationRequest();
        });
    });
}

// 상담 신청 처리
function handleConsultationRequest() {
    // 모달 열기
    openConsultationModal();
}

// 모달 열기
function openConsultationModal() {
    const modal = document.getElementById('consultationModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // 스크롤 방지
    
    // 첫 번째 입력 필드에 포커스
    setTimeout(() => {
        const firstInput = modal.querySelector('input[type="text"]');
        if (firstInput) firstInput.focus();
    }, 300);
}

// 모달 닫기
function closeConsultationModal() {
    const modal = document.getElementById('consultationModal');
    modal.classList.remove('active');
    document.body.style.overflow = ''; // 스크롤 복원
    
    // 폼 초기화
    const form = document.getElementById('consultationForm');
    form.reset();
    
    // 에러 메시지 제거
    clearAllFieldErrors();
}

// 모든 필드 에러 제거
function clearAllFieldErrors() {
    const errorElements = document.querySelectorAll('.field-error');
    errorElements.forEach(error => error.remove());
    
    const errorInputs = document.querySelectorAll('.form-input.error, .form-textarea.error, .form-select.error');
    errorInputs.forEach(input => {
        input.classList.remove('error');
        input.style.borderColor = '';
    });
}

// 알림 표시 함수
function showNotification(message, type = 'info') {
    // 기존 알림 제거
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // 새 알림 생성
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // 스타일 적용
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : '#2196F3'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    // 애니메이션으로 표시
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // 닫기 버튼 이벤트
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // 자동으로 5초 후 제거
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 5000);
}

// 네비게이션 스크롤 효과
function setupNavigationScroll() {
    const nav = document.querySelector('nav'); // 실제 네비게이션 요소
    let navShown = false; // 네비게이션이 한 번 나타났는지 추적
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const serviceSection = document.querySelector('#service');
        const serviceTop = serviceSection ? serviceSection.offsetTop : 0;
        
        // service section에 도달했을 때 네비게이션 표시
        if (scrollTop > serviceTop - 100) {
            if (!navShown) {
                // 처음 나타날 때만 부드러운 애니메이션 적용
                navShown = true;
                
                // 네비게이션 표시
                if (nav) {
                    nav.classList.add('show');
                }
            }
            // 이미 나타난 상태에서는 계속 유지
        } else {
            // service section 이전으로 돌아갔을 때만 숨김
            if (navShown) {
                navShown = false;
                
                // 네비게이션 숨김
                if (nav) {
                    nav.classList.remove('show');
                }
            }
        }
        
        // 스크롤 위치에 따라 배경 투명도 조정
        if (scrollTop > 50) {
            if (nav) {
                nav.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                nav.style.backdropFilter = 'blur(10px)';
            }
        } else {
            if (nav) {
                nav.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                nav.style.backdropFilter = 'blur(5px)';
            }
        }
    });
}

// 폼 유효성 검사 설정
function setupFormValidation() {
    const consultationForm = document.getElementById('consultationForm');
    
    if (consultationForm) {
        consultationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateConsultationForm(this)) {
                // 폼 제출 처리
                handleConsultationFormSubmission(this);
            }
        });
    }
}

// 상담 신청 폼 유효성 검사
function validateConsultationForm(form) {
    let isValid = true;
    clearAllFieldErrors();
    
    // 필수 필드 검사
    const requiredFields = ['name', 'email', 'phone', 'subject', 'message'];
    requiredFields.forEach(fieldName => {
        const field = form.querySelector(`[name="${fieldName}"]`);
        if (!field.value.trim()) {
            showFieldError(field, '이 필드는 필수입니다.');
            isValid = false;
        }
    });
    
    // 이메일 유효성 검사
    const emailField = form.querySelector('[name="email"]');
    if (emailField.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailField.value.trim())) {
            showFieldError(emailField, '유효한 이메일 주소를 입력해주세요.');
            isValid = false;
        }
    }
    
    // 전화번호 유효성 검사
    const phoneField = form.querySelector('[name="phone"]');
    if (phoneField.value.trim()) {
        const phoneRegex = /^[0-9-+\s()]+$/;
        if (!phoneRegex.test(phoneField.value.trim())) {
            showFieldError(phoneField, '유효한 전화번호를 입력해주세요.');
            isValid = false;
        }
    }
    
    // 개인정보처리방침 동의 확인
    const privacyCheckbox = form.querySelector('[name="privacy"]');
    if (!privacyCheckbox.checked) {
        showFieldError(privacyCheckbox, '개인정보처리방침에 동의해주세요.');
        isValid = false;
    }
    
    return isValid;
}

// 폼 유효성 검사 함수
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            showFieldError(input, '이 필드는 필수입니다.');
            isValid = false;
        } else {
            clearFieldError(input);
        }
        
        // 이메일 유효성 검사
        if (input.type === 'email' && input.value.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value.trim())) {
                showFieldError(input, '유효한 이메일 주소를 입력해주세요.');
                isValid = false;
            }
        }
        
        // 전화번호 유효성 검사
        if (input.type === 'tel' && input.value.trim()) {
            const phoneRegex = /^[0-9-+\s()]+$/;
            if (!phoneRegex.test(input.value.trim())) {
                showFieldError(input, '유효한 전화번호를 입력해주세요.');
                isValid = false;
            }
        }
    });
    
    return isValid;
}

// 필드 에러 표시
function showFieldError(input, message) {
    clearFieldError(input);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #f44336;
        font-size: 0.8rem;
        margin-top: 0.25rem;
        display: block;
    `;
    
    input.parentNode.appendChild(errorDiv);
    input.style.borderColor = '#f44336';
}

// 필드 에러 제거
function clearFieldError(input) {
    const existingError = input.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    input.style.borderColor = '';
}

// 상담 신청 폼 제출 처리
function handleConsultationFormSubmission(form) {
    // 제출 버튼 비활성화
    const submitButton = form.querySelector('.submit-button');
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = '처리 중...';
    
    // 폼 데이터 수집
    const formData = new FormData(form);
    const consultationData = {
        name: formData.get('name'),
        company: formData.get('company'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        subject: formData.get('subject'),
        message: formData.get('message'),
        budget: formData.get('budget'),
        services: formData.getAll('services'),
        privacy: formData.get('privacy'),
        timestamp: new Date().toISOString()
    };
    
    // Formspree로 제출 (FormData 사용)
    const formDataToSend = new FormData();
    formDataToSend.append('name', consultationData.name);
    formDataToSend.append('company', consultationData.company);
    formDataToSend.append('email', consultationData.email);
    formDataToSend.append('phone', consultationData.phone);
    formDataToSend.append('subject', consultationData.subject);
    formDataToSend.append('message', consultationData.message);
    formDataToSend.append('budget', consultationData.budget);
    formDataToSend.append('services', consultationData.services.join(', '));
    formDataToSend.append('_replyto', 'jongsu@irda-x.com');
    formDataToSend.append('_subject', `[iRDA-X 상담 신청] ${consultationData.subject}`);
    formDataToSend.append('_cc', 'jongsu@irda-x.com');
    
    fetch(form.action, {
        method: 'POST',
        body: formDataToSend
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('상담 신청 전송에 실패했습니다.');
        }
        return response.text();
    })
    .then(() => {
        // 성공 응답
        showNotification('상담 신청이 성공적으로 접수되었습니다! 24시간 내에 연락드리겠습니다.', 'success');
        
        // 모달 닫기
        closeConsultationModal();
        
        // 버튼 복원
        submitButton.disabled = false;
        submitButton.textContent = originalText;
        
        // 폼 초기화
        form.reset();
    })
    .catch((error) => {
        console.error('상담 신청 전송 실패:', error);
        showNotification('상담 신청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.', 'error');
        
        // 버튼 복원
        submitButton.disabled = false;
        submitButton.textContent = originalText;
    });
}

// 상담 신청 이메일 HTML 생성
function generateConsultationEmailHTML(data) {
    const servicesText = data.services.length > 0 ? data.services.join(', ') : '선택하지 않음';
    
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #1D64F2; color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; background: #f9f9f9; }
                .field { margin-bottom: 15px; }
                .label { font-weight: bold; color: #1243A6; }
                .value { margin-top: 5px; }
                .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>iRDA-X 서비스 상담 신청</h1>
                    <p>새로운 상담 신청이 접수되었습니다.</p>
                </div>
                <div class="content">
                    <div class="field">
                        <div class="label">신청자명:</div>
                        <div class="value">${data.name}</div>
                    </div>
                    <div class="field">
                        <div class="label">회사명:</div>
                        <div class="value">${data.company || '입력하지 않음'}</div>
                    </div>
                    <div class="field">
                        <div class="label">이메일:</div>
                        <div class="value">${data.email}</div>
                    </div>
                    <div class="field">
                        <div class="label">연락처:</div>
                        <div class="value">${data.phone}</div>
                    </div>
                    <div class="field">
                        <div class="label">제목:</div>
                        <div class="value">${data.subject}</div>
                    </div>
                    <div class="field">
                        <div class="label">문의 내용:</div>
                        <div class="value">${data.message.replace(/\n/g, '<br>')}</div>
                    </div>
                    <div class="field">
                        <div class="label">예산 범위:</div>
                        <div class="value">${data.budget || '선택하지 않음'}</div>
                    </div>
                    <div class="field">
                        <div class="label">관심 서비스:</div>
                        <div class="value">${servicesText}</div>
                    </div>
                    <div class="field">
                        <div class="label">신청 시간:</div>
                        <div class="value">${new Date(data.timestamp).toLocaleString('ko-KR')}</div>
                    </div>
                </div>
                <div class="footer">
                    <p>이 이메일은 iRDA-X 서비스 웹사이트를 통해 자동으로 발송되었습니다.</p>
                </div>
            </div>
        </body>
        </html>
    `;
}

// 상담 신청 이메일 텍스트 생성
function generateConsultationEmailText(data) {
    const servicesText = data.services.length > 0 ? data.services.join(', ') : '선택하지 않음';
    
    return `
iRDA-X 서비스 상담 신청

신청자명: ${data.name}
회사명: ${data.company || '입력하지 않음'}
이메일: ${data.email}
연락처: ${data.phone}
제목: ${data.subject}
문의 내용: ${data.message}
예산 범위: ${data.budget || '선택하지 않음'}
관심 서비스: ${servicesText}
신청 시간: ${new Date(data.timestamp).toLocaleString('ko-KR')}

이 메시지는 iRDA-X 서비스 웹사이트를 통해 자동으로 발송되었습니다.
    `;
}

// 이메일 전송 함수
function sendConsultationEmail(emailData, consultationData) {
    // Formspree를 사용한 이메일 전송 (가장 간단하고 안정적인 방법)
    return fetch('https://formspree.io/f/xpzgwqzg', { // 실제 Formspree 엔드포인트로 변경 필요
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: consultationData.email,
            name: consultationData.name,
            company: consultationData.company,
            phone: consultationData.phone,
            subject: consultationData.subject,
            message: consultationData.message,
            budget: consultationData.budget,
            services: consultationData.services.join(', '),
            _replyto: 'jongsu@irda-x.com', // 받는 사람 이메일
            _subject: emailData.subject, // 이메일 제목
            _cc: 'jongsu@irda-x.com' // CC로도 받기
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('이메일 전송에 실패했습니다.');
        }
        return response.json();
    });
}

// 모달 이벤트 리스너 설정
function setupModalEventListeners() {
    // 모달 닫기 버튼
    const closeButton = document.getElementById('closeModal');
    if (closeButton) {
        closeButton.addEventListener('click', closeConsultationModal);
    }
    
    // 모달 외부 클릭 시 닫기
    const modal = document.getElementById('consultationModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeConsultationModal();
            }
        });
    }
    
    // ESC 키로 모달 닫기
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const modal = document.getElementById('consultationModal');
            if (modal && modal.classList.contains('active')) {
                closeConsultationModal();
            }
        }
    });
}

// 페이지 로드 애니메이션
function setupPageLoadAnimation() {
    // hero 버튼만 애니메이션 적용 (텍스트는 타이핑 애니메이션으로 처리)
    const heroButtons = document.querySelector('.hero-buttons');
    
    if (heroButtons) {
        heroButtons.style.opacity = '0';
        heroButtons.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            heroButtons.style.transition = 'all 0.8s ease';
            heroButtons.style.opacity = '1';
            heroButtons.style.transform = 'translateY(0)';
        }, 1000); // 타이핑 애니메이션이 시작된 후 버튼 표시
    }
}

// 숫자 카운터 애니메이션 (성과 지표 등에 사용)
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    }
    
    updateCounter();
}

// 스크롤 진행률 표시
function setupScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, var(--primary) 0%, var(--accent) 100%);
        z-index: 1001;
        transition: width 0.1s ease;
    `;
    
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / scrollHeight) * 100;
        
        progressBar.style.width = `${progress}%`;
    });
}

// 뷰포트 크기 변경 감지
window.addEventListener('resize', function() {
    // 반응형 디자인을 위한 추가 처리
    console.log('뷰포트 크기 변경됨:', window.innerWidth, 'x', window.innerHeight);
});

// 페이지 가시성 변경 감지 (탭 전환 등)
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        console.log('페이지가 숨겨짐');
    } else {
        console.log('페이지가 다시 표시됨');
    }
});

// 햄버거 메뉴 설정
function setupHamburgerMenu() {
    const mobileNavHamburgerButton = document.getElementById('mobileNavHamburgerButton');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    const mobileConsultationButton = mobileMenu.querySelector('.cta-button-primary');
    const mobileHamburgerButton = document.getElementById('mobileHamburgerButton');
    const mobileNav = document.getElementById('mobileNav');
    
    // 모바일 네비게이션 햄버거 버튼 클릭
    if (mobileNavHamburgerButton) {
        mobileNavHamburgerButton.addEventListener('click', function() {
            toggleMobileMenu();
        });
    }
    
    // 모바일 햄버거 버튼 클릭
    if (mobileHamburgerButton) {
        mobileHamburgerButton.addEventListener('click', function() {
            toggleMobileNav();
        });
    }
    
    // 모바일 메뉴 닫기 버튼
    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', function() {
            closeMobileMenu();
        });
    }
    
    // 모바일 메뉴 외부 클릭 시 닫기
    if (mobileMenu) {
        mobileMenu.addEventListener('click', function(e) {
            if (e.target === mobileMenu) {
                closeMobileMenu();
            }
        });
    }
    
    // 모바일 네비게이션 링크 클릭 시 메뉴 닫기
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            closeMobileMenu();
        });
    });
    
    // 모바일 메뉴의 상담 신청 버튼 클릭 시
    if (mobileConsultationButton) {
        mobileConsultationButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 버튼 클릭 효과
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // 모바일 메뉴 닫기
            closeMobileMenu();
            
            // 상담 신청 모달 열기
            setTimeout(() => {
                handleConsultationRequest();
            }, 300);
        });
    }
    
    // ESC 키로 모바일 메뉴 닫기
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeMobileMenu();
        }
    });
}

// 모바일 메뉴 토글
function toggleMobileMenu() {
    const mobileNavHamburgerButton = document.getElementById('mobileNavHamburgerButton');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenu.classList.contains('active')) {
        closeMobileMenu();
    } else {
        openMobileMenu();
    }
}

// 모바일 메뉴 열기
function openMobileMenu() {
    const mobileNavHamburgerButton = document.getElementById('mobileNavHamburgerButton');
    const mobileMenu = document.getElementById('mobileMenu');
    
    mobileNavHamburgerButton.classList.add('active');
    mobileMenu.classList.add('active');
    document.body.style.overflow = 'hidden'; // 스크롤 방지
}

// 모바일 네비게이션 토글
function toggleMobileNav() {
    const mobileHamburgerButton = document.getElementById('mobileHamburgerButton');
    const mobileNav = document.getElementById('mobileNav');
    
    if (mobileNav.classList.contains('active')) {
        closeMobileNav();
    } else {
        openMobileNav();
    }
}

// 모바일 네비게이션 열기
function openMobileNav() {
    const mobileHamburgerButton = document.getElementById('mobileHamburgerButton');
    const mobileNav = document.getElementById('mobileNav');
    
    mobileHamburgerButton.classList.add('active');
    mobileNav.classList.add('active');
}

// 모바일 네비게이션 닫기
function closeMobileNav() {
    const mobileHamburgerButton = document.getElementById('mobileHamburgerButton');
    const mobileNav = document.getElementById('mobileNav');
    
    mobileHamburgerButton.classList.remove('active');
    mobileNav.classList.remove('active');
}

// 로고 클릭 이벤트 설정
function setupLogoClickEvents() {
    const desktopLogoLink = document.getElementById('desktopLogoLink');
    const mobileLogoLink = document.getElementById('mobileLogoLink');
    const mobileNavLogoLink = document.getElementById('mobileNavLogoLink');
    
    // 데스크톱 로고 클릭
    if (desktopLogoLink) {
        desktopLogoLink.addEventListener('click', function() {
            scrollToHeroSection();
        });
    }
    
    // 모바일 네비게이션 로고 클릭
    if (mobileNavLogoLink) {
        mobileNavLogoLink.addEventListener('click', function() {
            scrollToHeroSection();
        });
    }
    
    // 모바일 메뉴 로고 클릭
    if (mobileLogoLink) {
        mobileLogoLink.addEventListener('click', function() {
            // 모바일 메뉴가 열려있다면 닫기
            const mobileMenu = document.getElementById('mobileMenu');
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                closeMobileMenu();
            }
            
            // hero section으로 이동
            setTimeout(() => {
                scrollToHeroSection();
            }, 300);
        });
    }
}

// hero section으로 스크롤
function scrollToHeroSection() {
    const heroSection = document.querySelector('#hero');
    if (heroSection) {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// 모바일 메뉴 닫기
function closeMobileMenu() {
    const mobileNavHamburgerButton = document.getElementById('mobileNavHamburgerButton');
    const mobileMenu = document.getElementById('mobileMenu');
    
    mobileNavHamburgerButton.classList.remove('active');
    mobileMenu.classList.remove('active');
    document.body.style.overflow = ''; // 스크롤 복원
}

// 타이핑 애니메이션 설정
function setupTypingAnimation() {
    const texts = [
        { id: 'heroTitle1', text: 'AI가 만드는' },
        { id: 'heroTitle2', text: 'VISION INSPECTION의 새로운 기준' },
        { id: 'heroSubtitle1', text: '기존 대비 50% 비용으로' },
        { id: 'heroSubtitle2', text: '200% 성과를 경험하세요' }
    ];
    
    let currentIndex = 0;
    let isTyping = false;
    
    function typeText(elementId, text, speed = 100) {
        return new Promise((resolve) => {
            const element = document.getElementById(elementId);
            if (!element) {
                resolve();
                return;
            }
            
            element.textContent = '';
            element.classList.remove('completed');
            
            let charIndex = 0;
            
            function typeChar() {
                if (charIndex < text.length) {
                    element.textContent += text[charIndex];
                    charIndex++;
                    setTimeout(typeChar, speed);
                } else {
                    element.classList.add('completed');
                    resolve();
                }
            }
            
            typeChar();
        });
    }
    
    function clearText(elementId) {
        return new Promise((resolve) => {
            const element = document.getElementById(elementId);
            if (!element) {
                resolve();
                return;
            }
            
            element.classList.remove('completed');
            element.textContent = '';
            resolve();
        });
    }
    
    async function animateTexts() {
        if (isTyping) return;
        isTyping = true;
        
        // 모든 텍스트를 순차적으로 타이핑
        for (let i = 0; i < texts.length; i++) {
            await typeText(texts[i].id, texts[i].text, 80);
            await new Promise(resolve => setTimeout(resolve, 500)); // 각 텍스트 사이 간격
        }
        
        // 3초간 정지
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // 모든 텍스트를 순차적으로 지우기
        for (let i = texts.length - 1; i >= 0; i--) {
            await clearText(texts[i].id);
            await new Promise(resolve => setTimeout(resolve, 200)); // 지우기 간격
        }
        
        // 1초간 정지 후 다시 시작
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        isTyping = false;
        animateTexts(); // 반복
    }
    
    // 애니메이션 시작
    animateTexts();
}

// 스크롤 진행률 표시 초기화
setupScrollProgress();

// 성능 최적화를 위한 디바운스 함수
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 스크롤 이벤트 최적화
const optimizedScrollHandler = debounce(() => {
    // 스크롤 관련 작업들
}, 16); // 약 60fps

window.addEventListener('scroll', optimizedScrollHandler);
