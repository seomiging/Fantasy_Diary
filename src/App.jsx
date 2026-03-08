import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Routes, Route, NavLink, useLocation, useNavigate } from 'react-router-dom'
import './app.css'
import Home from './home/Home'
import About from './about/About'
import Intro from './intro/Intro'
import Profile from './profile/Profile'
import Skills from './skills/Skills'
import Project from './project/Project'
import Contact from './contact/Contact'
import AppMobile from './AppMobile'

const NAV_ITEMS = [
  { path: '/about',   label: 'About'   },
  { path: '/profile', label: 'Profile' },
  { path: '/skills',  label: 'Skills'  },
  { path: '/project', label: 'Quest'   },
  { path: '/contact', label: 'Contact' },
]

const PAGES = ['/', '/about', '/intro', '/profile', '/skills', '/project', '/project/2', '/project/3', '/contact']

const App = () => (
  <Routes>
    <Route path="/"          element={<DiaryShell><Home /></DiaryShell>} />
    <Route path="/about"     element={<DiaryShell><About /></DiaryShell>} />
    <Route path="/intro"     element={<DiaryShell><Intro /></DiaryShell>} />
    <Route path="/profile"   element={<DiaryShell><Profile /></DiaryShell>} />
    <Route path="/skills"    element={<DiaryShell><Skills /></DiaryShell>} />
    <Route path="/project"   element={<DiaryShell><Project projectNum={1} /></DiaryShell>} />
    <Route path="/project/2" element={<DiaryShell><Project projectNum={2} /></DiaryShell>} />
    <Route path="/project/3" element={<DiaryShell><Project projectNum={3} /></DiaryShell>} />
    <Route path="/contact"   element={<DiaryShell><Contact /></DiaryShell>} />
  </Routes>
)

const DiaryShell = ({ children }) => {
  const location   = useLocation()
  const navigate   = useNavigate()
  const [phase,      setPhase]      = useState(null)
  const [opening,    setOpening]    = useState(false)
  const [closing,    setClosing]    = useState(false)
  const [isOpen,     setIsOpen]     = useState(false)
  const [isPortrait, setIsPortrait] = useState(false)
  const [isMobilePhone, setIsMobilePhone] = useState(false)
  const [scale,      setScale]      = useState(1)
  const busy = useRef(false)

  const isHome    = location.pathname === '/'
  const pageIndex = PAGES.indexOf(location.pathname)

  // ── 흰색 커서 동그라미 (잉크펜 끝 표시) ──
  useEffect(() => {
    const dot = document.createElement('div')
    dot.id = 'cursor-dot'
    Object.assign(dot.style, {
      position:      'fixed',
      width:         '10px',
      height:        '10px',
      borderRadius:  '50%',
      background:    '#ffffff',
      boxShadow:     '0 0 6px 2px rgba(255,255,255,0.8), 0 0 14px 4px rgba(255,255,255,0.35)',
      pointerEvents: 'none',
      zIndex:        '99999',
      transform:     'translate(-50%, -50%)',
      transition:    'opacity 0.2s',
      opacity:       '0',
    })
    document.body.appendChild(dot)
    const move = (e) => {
      dot.style.left    = e.clientX + 'px'
      dot.style.top     = e.clientY + 'px'
      dot.style.opacity = '1'
    }
    const hide = () => { dot.style.opacity = '0' }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseleave', hide)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseleave', hide)
      dot.remove()
    }
  }, [])

  // ── 반응형 감지 + scale 계산 ──
  // 웹/가로 기준: book-open(1300x800) + prev버튼(68) + next버튼(68) + 탭(42) + 하단버튼(64) + 여백
  const BASE_W = 1436
  const BASE_H = 946
  // portrait 기준: book(400x540) + 탭(36) + 여백
  const PORT_W = 456   // 400(책) + 36(탭) + 10(우여백) + 10(좌여백)
  const PORT_H = 720   // 540(책) + 50(위공간) + 54(아래버튼) + 76(상하여백)

  useEffect(() => {
    // 사파리는 window.innerHeight가 주소창 포함이라 visualViewport 사용
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
    const getVH = () => (isSafari && window.visualViewport)
      ? window.visualViewport.height
      : window.innerHeight

    const check = () => {
      const portrait = window.matchMedia('(max-width:1024px) and (orientation:portrait)').matches
      const phone    = window.matchMedia('(max-width:480px) and (orientation:portrait)').matches
      setIsPortrait(portrait)
      setIsMobilePhone(phone)
      const vw = window.innerWidth
      const vh = getVH()
      if (!portrait) {
        const s = Math.min(vw / BASE_W, vh / BASE_H, 1)
        setScale(s)
      } else if (phone) {
        // 스마트폰: scale 없이 풀스크린 CSS로 처리
        setScale(1)
      } else {
        // 태블릿 portrait
        const availH = vh - 100
        const availW = vw - 60
        const s = Math.min(availW / PORT_W, availH / PORT_H)
        setScale(s)
      }
    }
    check()
    window.addEventListener('resize', check)
    window.addEventListener('orientationchange', check)
    if (isSafari && window.visualViewport) {
      window.visualViewport.addEventListener('resize', check)
    }
    return () => {
      window.removeEventListener('resize', check)
      window.removeEventListener('orientationchange', check)
      if (isSafari && window.visualViewport) {
        window.visualViewport.removeEventListener('resize', check)
      }
    }
  }, [])

  const goTo = useCallback((path, dir) => {
    if (busy.current) return
    busy.current = true
    setPhase(dir === 'next' ? 'exit-next' : 'exit-prev')
    setTimeout(() => {
      navigate(path)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setPhase(dir === 'next' ? 'enter-next' : 'enter-prev')
          setTimeout(() => { setPhase(null); busy.current = false }, 400)
        })
      })
    }, 320)
  }, [navigate])

  const scrollAccum = useRef(0)
  const lastScroll  = useRef(0)
  const handleWheel = useCallback((e) => {
    if (isHome || busy.current) return
    const now = Date.now()
    if (now - lastScroll.current < 500) return
    const d = e.deltaY > 0 ? 1 : -1
    scrollAccum.current += d
    if (Math.abs(scrollAccum.current) >= 2) {
      scrollAccum.current = 0
      lastScroll.current  = now
      if (d > 0 && pageIndex < PAGES.length - 1) goTo(PAGES[pageIndex + 1], 'next')
      if (d < 0 && pageIndex > 0)                goTo(PAGES[pageIndex - 1], 'prev')
    }
  }, [isHome, pageIndex, goTo])

  useEffect(() => {
    window.addEventListener('wheel', handleWheel, { passive: true })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [handleWheel])

  const openBook = () => {
    if (opening) return
    setOpening(true)
    setTimeout(() => { setIsOpen(true); navigate('/about') }, 700)
    setTimeout(() => setOpening(false), 1200)
  }

  const goHome = useCallback(() => {
    if (closing) return
    setClosing(true)
    setTimeout(() => {
      setIsOpen(false)
      navigate('/')
      setTimeout(() => setClosing(false), 100)
    }, 420)
  }, [closing, navigate])

  useEffect(() => {
    if (!isHome) setIsOpen(true)
    else setIsOpen(false)
  }, [isHome])

  const rightCls = phase === 'exit-next'  ? ' flip-exit-right'
                 : phase === 'enter-next' ? ' flip-enter-right' : ''
  const leftCls  = phase === 'exit-prev'  ? ' flip-exit-left'
                 : phase === 'enter-prev' ? ' flip-enter-left'  : ''

  const clickRight = () => {
    if (busy.current || pageIndex >= PAGES.length - 1) return
    goTo(PAGES[pageIndex + 1], 'next')
  }
  const clickLeft = () => {
    if (busy.current || pageIndex <= 0) return
    goTo(PAGES[pageIndex - 1], 'prev')
  }

  return (
    <div className={`diary-bg${(isHome && !isMobilePhone) ? ' bg-home' : ''}${(!isHome) ? ' bg-content' : ''}${isPortrait ? ' bg-portrait' : ''}${isMobilePhone ? ' bg-phone' : ''}`}>
      <div
        className={`book-container${isPortrait ? ' book-container-portrait' : ''}${isMobilePhone ? ' book-container-phone' : ''}`}
        style={isMobilePhone ? undefined : { transform: `scale(${scale})`, transformOrigin: 'center center' }}
      >
        {/* 스마트폰은 홈/콘텐츠 모두 AppMobile에서 처리 */}
        {isMobilePhone ? (
          <AppMobile isMobilePhone={true}>{children}</AppMobile>

        ) : isHome ? (
          <div className={`book-closed${opening ? ' book-opening' : ''}`} onClick={openBook}>
            <picture>
              <source media="(max-width:1024px) and (orientation:portrait)" srcSet="./assets/mobile_cover1.png" />
              <img className="cover-img" src="./assets/web_cover1.png" alt="cover" />
            </picture>
            <span className="click-hint">click to start &nbsp;»</span>
          </div>

        ) : isPortrait ? (
          <AppMobile isMobilePhone={false}>{children}</AppMobile>

        ) : (
          <div className={`book-open${closing ? ' book-closing' : isOpen ? ' book-opened' : ''}`}>
            <div className="page-left" onClick={clickLeft}
              style={{ cursor: pageIndex > 0 ? 'pointer' : 'default' }}>
              <div className="page-mat" />
              <div className={`page-inner-left${leftCls}`} />
              <span className="page-number">{pageIndex > 0 ? pageIndex * 2 - 1 : ''}</span>
            </div>

            <div className="page-right" onClick={clickRight}
              style={{ cursor: pageIndex < PAGES.length - 1 ? 'pointer' : 'default' }}>
              <div className="page-mat" />
              <div className={`page-inner-right${rightCls}`} />
              <nav className="diary-nav" onClick={e => e.stopPropagation()}>
                {NAV_ITEMS.map(item => (
                  <NavLink key={item.path} to={item.path}
                    className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
                    {item.label}
                  </NavLink>
                ))}
              </nav>
              <div className="page-content" onClick={pageIndex < PAGES.length - 1 ? clickRight : undefined}>
                {children}
              </div>
              <span className="page-number">{pageIndex * 2}</span>
            </div>

            <button className="close-btn" onClick={goHome} title="홈으로">✕</button>
            {pageIndex > 0 && (
              <button className="nav-btn prev" onClick={clickLeft}>❮</button>
            )}
            {pageIndex < PAGES.length - 1 && (
              <button className="nav-btn next" onClick={clickRight}>❯</button>
            )}
            {pageIndex === PAGES.length - 1 && (
              <button className="home-return-btn" onClick={() => goTo(PAGES[1], 'prev')}>↩ 처음으로</button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default App
