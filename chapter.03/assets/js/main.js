/**
 * 모바일 청첩장 인터랙션 스크립트
 * 10년차 전문 퍼블리셔 기준의 클린 코드 구조화
 */

document.addEventListener('DOMContentLoaded', () => {
    initScrollReveal();
    initCountdownTimer();
    initAccordion();
    initClipboardCopy();
    initContactModal();
    initGalleryModal();
    initGuestbook();
    initShareLink();
});

/* ==========================================================================
   1. 스크롤 페이드 인 인터랙션 (Intersection Observer)
   ========================================================================== */
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal-on-scroll');
    if (!('IntersectionObserver' in window)) {
        reveals.forEach(el => el.classList.add('revealed'));
        return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                obs.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach(el => observer.observe(el));
}

/* ==========================================================================
   2. 실시간 카운트다운 타이머 & 플립 애니메이션
   ========================================================================== */
function initCountdownTimer() {
    // 2099년 12월 26일 오후 12시 (한국 표준시 KST 기준)
    const targetDate = new Date('2099-12-26T12:00:00+09:00').getTime();

    const daysEl = document.getElementById('days-val');
    const hoursEl = document.getElementById('hours-val');
    const minutesEl = document.getElementById('minutes-val');
    const secondsEl = document.getElementById('seconds-val');
    const ddayNoticeEl = document.getElementById('dday-notice-text');

    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

    let prevValues = {
        days: '',
        hours: '',
        minutes: '',
        seconds: ''
    };

    function updateCard(element, cardId, newVal) {
        if (element.textContent !== newVal) {
            element.textContent = newVal;
            const card = document.getElementById(cardId);
            if (card) {
                card.classList.remove('animate-flip');
                // DOM Reflow 강제 트리거 후 애니메이션 재적용
                void card.offsetWidth;
                card.classList.add('animate-flip');
            }
        }
    }

    function calculateTime() {
        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference <= 0) {
            daysEl.textContent = '000';
            hoursEl.textContent = '00';
            minutesEl.textContent = '00';
            secondsEl.textContent = '00';
            if (ddayNoticeEl) {
                ddayNoticeEl.innerHTML = '결혼식이 진행 중이거나 이미 시작되었습니다.';
            }
            return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        const strDays = String(days).padStart(3, '0');
        const strHours = String(hours).padStart(2, '0');
        const strMinutes = String(minutes).padStart(2, '0');
        const strSeconds = String(seconds).padStart(2, '0');

        updateCard(daysEl, 'days-card', strDays);
        updateCard(hoursEl, 'hours-card', strHours);
        updateCard(minutesEl, 'minutes-card', strMinutes);
        updateCard(secondsEl, 'seconds-card', strSeconds);

        if (ddayNoticeEl) {
            ddayNoticeEl.innerHTML = `드미트리와 로렐라이의 특별한 순간까지 <strong>${days}일</strong> 남았습니다.`;
        }
    }

    calculateTime();
    setInterval(calculateTime, 1000);
}

/* ==========================================================================
   3. 아코디언 메뉴 (마음 전하시는 곳)
   ========================================================================== */
function initAccordion() {
    const accordionCards = document.querySelectorAll('.accordion-card');

    accordionCards.forEach(card => {
        const btn = card.querySelector('.accordion-btn');
        const panel = card.querySelector('.accordion-panel');

        btn.addEventListener('click', () => {
            const isActive = card.classList.contains('active');

            // 클릭된 아코디언 토글
            if (isActive) {
                card.classList.remove('active');
                panel.style.maxHeight = null;
            } else {
                card.classList.add('active');
                panel.style.maxHeight = panel.scrollHeight + 'px';
            }
        });
    });
}

/* ==========================================================================
   4. 클립보드 복사 및 토스트 팝업 알림
   ========================================================================== */
function showToast(message) {
    let toast = document.querySelector('.toast-notice');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast-notice';
        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.add('show');

    if (window.toastTimeout) {
        clearTimeout(window.toastTimeout);
    }

    window.toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 2400);
}

function initClipboardCopy() {
    const copyButtons = document.querySelectorAll('.btn-copy-action, .btn-copy-address');

    copyButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const textToCopy = btn.getAttribute('data-copy-target') || btn.innerText;

            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(textToCopy).then(() => {
                    showToast('클립보드에 복사되었습니다.');
                }).catch(() => {
                    fallbackCopy(textToCopy);
                });
            } else {
                fallbackCopy(textToCopy);
            }
        });
    });
}

function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.top = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
        document.execCommand('copy');
        showToast('클립보드에 복사되었습니다.');
    } catch (err) {
        showToast('복사 기능을 지원하지 않는 환경입니다.');
    }
    document.body.removeChild(textarea);
}

/* ==========================================================================
   5. 신랑 / 신부 연락처 액션 시트 모달
   ========================================================================== */
function initContactModal() {
    const overlay = document.getElementById('contact-modal-overlay');
    const modalTitle = document.getElementById('contact-modal-title');
    const callBtn = document.getElementById('btn-modal-call');
    const smsBtn = document.getElementById('btn-modal-sms');
    const closeBtn = document.getElementById('btn-modal-close');

    if (!overlay) return;

    const contactData = {
        groom: {
            title: '신랑 드미트리에게 연락하기',
            tel: '010-1234-5678'
        },
        bride: {
            title: '신부 로렐라이에게 연락하기',
            tel: '010-9876-5432'
        }
    };

    const triggerButtons = document.querySelectorAll('[data-contact-target]');
    triggerButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-contact-target');
            const data = contactData[target];

            if (data) {
                modalTitle.textContent = data.title;
                callBtn.href = `tel:${data.tel}`;
                smsBtn.href = `sms:${data.tel}`;
                overlay.classList.add('active');
            }
        });
    });

    closeBtn.addEventListener('click', () => {
        overlay.classList.remove('active');
    });

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.classList.remove('active');
        }
    });
}

/* ==========================================================================
   6. 갤러리 라이트박스 풀스크린 모달
   ========================================================================== */
function initGalleryModal() {
    const overlay = document.getElementById('gallery-modal-overlay');
    const lightboxImg = document.getElementById('lightbox-image');
    const closeBtn = document.getElementById('lightbox-close');

    if (!overlay || !lightboxImg) return;

    const galleryItems = document.querySelectorAll('.gallery-grid-item');
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            if (img) {
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt || '웨딩 사진 확대';
                overlay.classList.add('active');
            }
        });
    });

    closeBtn.addEventListener('click', () => {
        overlay.classList.remove('active');
    });

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.classList.remove('active');
        }
    });
}

/* ==========================================================================
   7. 축하 메시지 방명록 (Local Storage 연동)
   ========================================================================== */
function initGuestbook() {
    const form = document.getElementById('guestbook-form');
    const nameInput = document.getElementById('guestbook-name');
    const msgInput = document.getElementById('guestbook-message');
    const listContainer = document.getElementById('guestbook-list');

    if (!form || !listContainer) return;

    const STORAGE_KEY = 'wedding_guestbook_entries';

    // 기본 샘플 데이터
    const defaultEntries = [
        {
            name: '파르벤 지인 일동',
            message: '두 사람의 새로운 시작을 진심으로 축복합니다. 늘 행복하세요.',
            time: '2099.12.01'
        },
        {
            name: '페르시카 연구소 동료들',
            message: '언제나 든든한 동반자가 되어 서로를 아껴주기를 기도합니다.',
            time: '2099.12.10'
        }
    ];

    function getEntries() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : defaultEntries;
        } catch (e) {
            return defaultEntries;
        }
    }

    function saveEntries(entries) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
        } catch (e) {
            console.warn('LocalStorage 저장 실패:', e);
        }
    }

    function renderList() {
        const entries = getEntries();
        listContainer.innerHTML = '';

        entries.forEach(entry => {
            const item = document.createElement('div');
            item.className = 'guestbook-item';
            item.innerHTML = `
                <div class="guestbook-meta">
                    <span class="guestbook-author">${escapeHtml(entry.name)}</span>
                    <span class="guestbook-time">${escapeHtml(entry.time)}</span>
                </div>
                <div class="guestbook-msg">${escapeHtml(entry.message)}</div>
            `;
            listContainer.appendChild(item);
        });
    }

    function escapeHtml(str) {
        if (!str) return '';
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = nameInput.value.trim();
        const message = msgInput.value.trim();

        if (!name || !message) {
            showToast('이름과 축하 메시지를 모두 입력해 주세요.');
            return;
        }

        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const timeStr = `${year}.${month}.${day}`;

        const entries = getEntries();
        entries.unshift({
            name: name,
            message: message,
            time: timeStr
        });

        saveEntries(entries);
        renderList();

        nameInput.value = '';
        msgInput.value = '';
        showToast('축하 메시지가 등록되었습니다.');
    });

    renderList();
}

/* ==========================================================================
   8. 청첩장 링크 공유 기능
   ========================================================================== */
function initShareLink() {
    const shareBtn = document.getElementById('btn-share-link');
    if (!shareBtn) return;

    shareBtn.addEventListener('click', () => {
        const url = window.location.href;
        if (navigator.share) {
            navigator.share({
                title: '드미트리 & 로렐라이 결혼식에 초대합니다',
                text: '2099년 12월 26일 토요일 오후 12시, 나나컨벤션센터',
                url: url
            }).catch(() => {});
        } else {
            fallbackCopy(url);
        }
    });
}
