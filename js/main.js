/* =============================================
   프롬프트 엔지니어링 가이드북 - 메인 JavaScript
   ============================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* -----------------------------------------------
     1. 독서 진행도 바 (상단 Progress Bar)
  ----------------------------------------------- */
  const progressBar = document.createElement('div');
  progressBar.className = 'progress-bar';
  progressBar.style.width = '0%';
  document.body.prepend(progressBar);

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = progress + '%';
  });


  /* -----------------------------------------------
     2. 모바일 햄버거 메뉴
  ----------------------------------------------- */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
      const icon = hamburger.querySelector('i');
      if (mobileNav.classList.contains('open')) {
        icon.className = 'fas fa-times';
      } else {
        icon.className = 'fas fa-bars';
      }
    });

    // 모바일 메뉴 링크 클릭 시 닫기
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        hamburger.querySelector('i').className = 'fas fa-bars';
      });
    });
  }


  /* -----------------------------------------------
     3. 5가지 기술 탭 기능
  ----------------------------------------------- */
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-tab');

      // 모든 탭 비활성화
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      // 클릭한 탭 활성화
      btn.classList.add('active');
      const targetContent = document.getElementById(target);
      if (targetContent) {
        targetContent.classList.add('active');
      }
    });
  });


  /* -----------------------------------------------
     4. 체크리스트 & 진행도 피드백
  ----------------------------------------------- */
  const checkItems = document.querySelectorAll('.check-input');
  const checkResult = document.getElementById('checkResult');

  const messages = [
    { min: 0, max: 0, emoji: '💤', text: '아직 아무것도 체크하지 않았어요. 시작해볼까요?', color: '#94a3b8' },
    { min: 1, max: 2, emoji: '🌱', text: '좋은 시작이에요! 계속 확인해 보세요.', color: '#f59e0b' },
    { min: 3, max: 4, emoji: '🔥', text: '반 이상 왔어요! 거의 완성된 프롬프트예요!', color: '#f97316' },
    { min: 5, max: 5, emoji: '⭐', text: '아주 잘 하고 있어요! 딱 하나만 더!', color: '#8b5cf6' },
    { min: 6, max: 6, emoji: '🎉', text: '완벽해요! 이 프롬프트는 AI에게 최고의 지시문이 될 거예요!', color: '#10b981' },
  ];

  function updateCheckResult() {
    const checked = Array.from(checkItems).filter(item => item.checked).length;
    const total = checkItems.length;
    const percent = Math.round((checked / total) * 100);

    const msg = messages.find(m => checked >= m.min && checked <= m.max) || messages[messages.length - 1];

    if (checkResult) {
      checkResult.innerHTML = `
        <div style="color: ${msg.color}; font-size: 1.1rem; margin-bottom: 8px;">${msg.emoji} ${msg.text}</div>
        <div style="display:flex; align-items:center; gap:10px; justify-content:center;">
          <div style="background:#e2e8f0; border-radius:20px; height:10px; width:200px; overflow:hidden;">
            <div style="background:${msg.color}; height:100%; width:${percent}%; border-radius:20px; transition:width 0.4s;"></div>
          </div>
          <span style="font-size:0.85rem; color:#64748b; font-weight:700;">${checked}/${total} 완료</span>
        </div>
      `;
    }
  }

  checkItems.forEach(item => {
    item.addEventListener('change', updateCheckResult);
  });

  // 초기 상태 표시
  updateCheckResult();


  /* -----------------------------------------------
     5. 스크롤 페이드 업 애니메이션
  ----------------------------------------------- */
  const fadeElements = document.querySelectorAll(
    '.element-card, .rule-card, .practice-card, .compare-card, .caution-item, .role-card'
  );

  fadeElements.forEach((el, index) => {
    el.classList.add('fade-up');
    el.style.transitionDelay = `${(index % 4) * 0.1}s`;
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  fadeElements.forEach(el => observer.observe(el));


  /* -----------------------------------------------
     6. 스무스 스크롤 네비게이션 활성화 표시
  ----------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav a, .mobile-nav a');

  function updateActiveNav() {
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.style.color = '';
          link.style.background = '';
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.style.color = 'var(--primary)';
            link.style.background = 'var(--primary-light)';
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav);
  updateActiveNav();


  /* -----------------------------------------------
     7. 채팅 버블 순차 애니메이션
  ----------------------------------------------- */
  const chatBubbles = document.querySelectorAll('.chat-bubble');
  chatBubbles.forEach((bubble, index) => {
    bubble.style.opacity = '0';
    bubble.style.transform = 'translateY(15px)';
    bubble.style.transition = `opacity 0.5s ease ${index * 0.4}s, transform 0.5s ease ${index * 0.4}s`;

    setTimeout(() => {
      bubble.style.opacity = '1';
      bubble.style.transform = 'translateY(0)';
    }, 400 + index * 400);
  });


  /* -----------------------------------------------
     8. 4요소 통합 예시 - 호버 하이라이트
  ----------------------------------------------- */
  const intPieces = document.querySelectorAll('.int-piece');
  intPieces.forEach(piece => {
    piece.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';
    piece.addEventListener('mouseenter', () => {
      piece.style.transform = 'scale(1.03)';
      piece.style.boxShadow = '0 4px 15px rgba(108, 99, 255, 0.2)';
    });
    piece.addEventListener('mouseleave', () => {
      piece.style.transform = 'scale(1)';
      piece.style.boxShadow = 'none';
    });
  });


  /* -----------------------------------------------
     9. 실습 카드 - 클릭 시 하이라이트 효과
  ----------------------------------------------- */
  const practiceCards = document.querySelectorAll('.practice-card');
  practiceCards.forEach(card => {
    card.addEventListener('click', function (e) {
      // details 태그 내 클릭은 무시
      if (e.target.closest('details')) return;

      practiceCards.forEach(c => {
        c.style.borderColor = '';
        c.style.boxShadow = '';
      });
      this.style.borderColor = 'var(--primary)';
      this.style.boxShadow = '0 8px 30px rgba(108, 99, 255, 0.2)';
    });
  });


  /* -----------------------------------------------
     10. 툴팁: 빈칸(blank) hover 시 설명 표시
  ----------------------------------------------- */
  const blanks = document.querySelectorAll('.blank');
  const blankHints = {
    '역할': '예: 친절한 코치, 수학 선생님, 요리사',
    '학년/나이': '예: 중학교 2학년, 15세',
    '목표': '예: 달리기 기록 향상, 체력 검사 통과',
    '형식': '예: 표, 목록, 단계별 설명',
    '구성원': '예: 부모님과 중학생 자녀 1명',
    '여행지': '예: 제주도, 부산, 강릉',
    '기간': '예: 2박 3일, 당일치기',
    '관심사': '예: 맛집, 자연, 체험 활동',
    '재료 목록': '예: 계란, 양파, 당면, 간장',
    '잘함/못함': '잘 못함 → 쉬운 레시피로',
    '시간': '예: 20분 이내',
    '학년': '예: 중학교 2학년',
    '과목들': '예: 수학, 영어, 과학',
  };

  blanks.forEach(blank => {
    const hint = blankHints[blank.textContent.trim()];
    if (!hint) return;

    blank.title = hint;
    blank.style.cursor = 'help';

    const tooltip = document.createElement('span');
    tooltip.style.cssText = `
      position: absolute;
      bottom: calc(100% + 8px);
      left: 50%;
      transform: translateX(-50%);
      background: #1e1b4b;
      color: white;
      font-size: 0.78rem;
      padding: 6px 12px;
      border-radius: 6px;
      white-space: nowrap;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.2s;
      z-index: 10;
    `;
    tooltip.textContent = hint;

    blank.style.position = 'relative';
    blank.appendChild(tooltip);

    blank.addEventListener('mouseenter', () => { tooltip.style.opacity = '1'; });
    blank.addEventListener('mouseleave', () => { tooltip.style.opacity = '0'; });
  });


  /* -----------------------------------------------
     11. 히어로 배지 펄스 애니메이션
  ----------------------------------------------- */
  const heroBadge = document.querySelector('.hero-badge');
  if (heroBadge) {
    setInterval(() => {
      heroBadge.style.transform = 'scale(1.03)';
      heroBadge.style.transition = 'transform 0.3s';
      setTimeout(() => {
        heroBadge.style.transform = 'scale(1)';
      }, 300);
    }, 2500);
  }


  /* -----------------------------------------------
     12. 상단 이동 버튼
  ----------------------------------------------- */
  const scrollTopBtn = document.createElement('button');
  scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
  scrollTopBtn.style.cssText = `
    position: fixed;
    bottom: 28px;
    right: 28px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--primary, #6c63ff), #8b5cf6);
    color: white;
    border: none;
    cursor: pointer;
    font-size: 1.1rem;
    box-shadow: 0 4px 15px rgba(108, 99, 255, 0.4);
    opacity: 0;
    transform: translateY(10px);
    transition: opacity 0.3s, transform 0.3s;
    z-index: 99;
  `;

  document.body.appendChild(scrollTopBtn);

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      scrollTopBtn.style.opacity = '1';
      scrollTopBtn.style.transform = 'translateY(0)';
    } else {
      scrollTopBtn.style.opacity = '0';
      scrollTopBtn.style.transform = 'translateY(10px)';
    }
  });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* -----------------------------------------------
     13. 통계 카운터 애니메이션 (히어로 섹션)
  ----------------------------------------------- */
  function animateCounter(element, target, duration = 1200) {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        element.textContent = target;
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(start);
      }
    }, 16);
  }

  const statNums = document.querySelectorAll('.stat-num');
  let statsAnimated = false;

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !statsAnimated) {
        statsAnimated = true;
        statNums.forEach(el => {
          const target = parseInt(el.textContent);
          animateCounter(el, target);
        });
      }
    });
  }, { threshold: 0.5 });

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) statsObserver.observe(heroStats);


  console.log('🤖 프롬프트 엔지니어링 가이드북 - JavaScript 로드 완료!');
  console.log('💡 팁: 오늘 배운 프롬프트 기술로 AI와 대화해보세요!');
});
