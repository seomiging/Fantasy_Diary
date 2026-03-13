import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Routes, Route, NavLink, useLocation, useNavigate } from 'react-router-dom'
import './app.css'
import Profile from './profile/Profile'
import Diary from './diary/Diary'
import AppMobile from './AppMobile'
import ThemeSelector from './theme/ThemeSelector'
import { useTheme } from './theme/ThemeContext'

const NAV_ITEMS = [
  { path: '/profile', label: 'Profile' },
  { path: '/diary',   label: 'Diary'   },
]

const SPREAD_PATHS = ['/', '/profile', '/diary', '/diary2']

const App = () => (
  <Routes>
    <Route path="/"        element={<DiaryShell spreadIdx={0} />} />
    <Route path="/profile" element={<DiaryShell spreadIdx={1} />} />
    <Route path="/diary"   element={<DiaryShell spreadIdx={2} />} />
    <Route path="/diary2"  element={<DiaryShell spreadIdx={3} />} />
  </Routes>
)

const DiaryShell = ({ spreadIdx }) => {
  const location        = useLocation()
  const navigate        = useNavigate()
  const [opening,       setOpening]       = useState(false)
  const [closing,       setClosing]       = useState(false)
  const [isOpen,        setIsOpen]        = useState(false)
  const [isPortrait,    setIsPortrait]    = useState(false)
  const [isMobilePhone, setIsMobilePhone] = useState(false)
  const [scale,         setScale]         = useState(1)
  // 웹 페이지 넘김 애니메이션 상태
  const [flipDir,       setFlipDir]       = useState(null) 
  const [flipPhase,     setFlipPhase]     = useState(null) 
  const { currentTheme } = useTheme()
  const busy = useRef(false)

  const isHome = location.pathname === '/'

  // 흰색 커서 동그라미
  useEffect(() => {
    const dot = document.createElement('div')
    dot.id = 'cursor-dot'
    Object.assign(dot.style, {
      position: 'fixed', width: '10px', height: '10px',
      borderRadius: '50%', background: '#ffffff',
      boxShadow: '0 0 6px 2px rgba(255,255,255,0.8), 0 0 14px 4px rgba(255,255,255,0.35)',
      pointerEvents: 'none', zIndex: '99999',
      transform: 'translate(-50%, -50%)', transition: 'opacity 0.2s', opacity: '0',
    })
    document.body.appendChild(dot)
    const move = (e) => { dot.style.left = e.clientX + 'px'; dot.style.top = e.clientY + 'px'; dot.style.opacity = '1' }
    const hide = () => { dot.style.opacity = '0' }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseleave', hide)
    return () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseleave', hide); dot.remove() }
  }, [])

  // 반응형 scale
  const BASE_W = 1436; const BASE_H = 946
  const PORT_W = 456;  const PORT_H = 720

  useEffect(() => {
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
    const getVH = () => isSafari && window.visualViewport ? window.visualViewport.height : document.documentElement.clientHeight || window.innerHeight
    const check = () => {
      const portrait = window.matchMedia('(max-width:1024px) and (orientation:portrait)').matches
      const phone    = window.matchMedia('(max-width:480px) and (orientation:portrait)').matches
      setIsPortrait(portrait); setIsMobilePhone(phone)
      const vw = window.innerWidth; const vh = getVH()
      if (!portrait) setScale(Math.min(vw / BASE_W, vh / BASE_H, 1))
      else if (phone) setScale(1)
      else setScale(Math.min((vw - 60) / PORT_W, (vh - 100) / PORT_H))
    }
    check()
    window.addEventListener('resize', check)
    window.addEventListener('orientationchange', check)
    if (isSafari && window.visualViewport) window.visualViewport.addEventListener('resize', check)
    return () => {
      window.removeEventListener('resize', check)
      window.removeEventListener('orientationchange', check)
    }
  }, [])

  // 웹 페이지 넘김: exit → navigate → enter
  const goTo = useCallback((idx) => {
    if (busy.current || idx < 0 || idx >= SPREAD_PATHS.length) return
    busy.current = true
    const dir = idx > spreadIdx ? 'next' : 'prev'
    setFlipDir(dir)
    setFlipPhase('exit')
    setTimeout(() => {
      navigate(SPREAD_PATHS[idx])
      setFlipPhase('enter')
      setTimeout(() => {
        setFlipPhase(null)
        setFlipDir(null)
        busy.current = false
      }, 360)
    }, 320)
  }, [navigate, spreadIdx])

  const openBook = () => {
    if (opening) return
    setOpening(true)
    setTimeout(() => { setIsOpen(true); navigate('/profile') }, 700)
    setTimeout(() => setOpening(false), 1200)
  }

  const goHome = useCallback(() => {
    if (closing) return
    setClosing(true)
    setTimeout(() => {
      setIsOpen(false); navigate('/')
      setTimeout(() => setClosing(false), 100)
    }, 420)
  }, [closing, navigate])

  useEffect(() => {
    if (!isHome) setIsOpen(true)
    else setIsOpen(false)
  }, [isHome])

  const spreads = [
    { left: null,                    right: null                    },
    { left: <Profile pageNum={1} />, right: <Profile pageNum={2} /> },
    { left: <Diary   pageNum={1} />, right: <Diary   pageNum={2} /> },
    { left: <Diary   pageNum={3} />, right: <Diary   pageNum={4} /> },
  ]
  const spread       = spreads[spreadIdx]
  const pageNumLeft  = spreadIdx > 0 ? spreadIdx * 2 - 1 : ''
  const pageNumRight = spreadIdx > 0 ? spreadIdx * 2     : ''


  // 웹 책 넘김
  const leftFlipCls = flipPhase === 'exit'
    ? (flipDir === 'prev' ? ' flip-exit-left'   : '')
    : flipPhase === 'enter'
    ? (flipDir === 'next' ? ' flip-enter-left'  : '')
    : ''
  const rightFlipCls = flipPhase === 'exit'
    ? (flipDir === 'next' ? ' flip-exit-right'  : '')
    : flipPhase === 'enter'
    ? (flipDir === 'prev' ? ' flip-enter-right' : '')
    : ''

  return (
    <div className={`diary-bg${isHome && !isMobilePhone ? ' bg-home' : ''}${!isHome ? ' bg-content' : ''}${isPortrait ? ' bg-portrait' : ''}${isMobilePhone ? ' bg-phone' : ''}`}>
      <div
        className={`book-container${isPortrait ? ' book-container-portrait' : ''}${isMobilePhone ? ' book-container-phone' : ''}`}
        style={isMobilePhone ? undefined : {
          position: 'absolute', top: '50%', left: '50%',
          transform: `translate(-50%, -50%) scale(${scale})`,
        }}
      >
        {!isMobilePhone && <ThemeSelector isMobilePhone={false} />}

        {isMobilePhone ? (
          <AppMobile isMobilePhone={true} spreadIdx={spreadIdx} />

        ) : isHome ? (
          <div className={`book-closed${opening ? ' book-opening' : ''}`} onClick={openBook}>
            <picture>
              <source media="(max-width:1024px) and (orientation:portrait)" srcSet={currentTheme.assets.mobileCover} />
              <img className="cover-img" src={currentTheme.assets.webClosedCover} alt="cover" />
            </picture>
            <span className="click-hint">click to start &nbsp;»</span>
          </div>

        ) : isPortrait ? (
          <AppMobile isMobilePhone={false} spreadIdx={spreadIdx} />

        ) : (
          /* 웹 펼침 뷰 */
          <div className={`book-open${closing ? ' book-closing' : isOpen ? ' book-opened' : ''}`}>

            {/* 왼쪽 페이지 */}
            <div className="page-left">
              <div className={`page-inner-left${leftFlipCls}`} />
              {spread.left && (
                <div className="page-content page-content-left">
                  {spread.left}
                </div>
              )}
              <span className="page-number">{pageNumLeft}</span>
            </div>

            {/* 오른쪽 페이지 */}
            <div className="page-right">
              <div className={`page-inner-right${rightFlipCls}`} />
              <nav className="diary-nav" onClick={e => e.stopPropagation()}>
                {NAV_ITEMS.map(item => (
                  <NavLink key={item.path} to={item.path}
                    className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
                    {item.label}
                  </NavLink>
                ))}
              </nav>
              <div className="page-content">
                {spread.right}
              </div>
              <span className="page-number">{pageNumRight}</span>
            </div>

            <button className="close-btn" onClick={goHome} title="홈으로">✕</button>

            {spreadIdx > 0 && (
              <button className="nav-btn prev" onClick={() => goTo(spreadIdx - 1)}>❮</button>
            )}
            {spreadIdx < SPREAD_PATHS.length - 1 && (
              <button className="nav-btn next" onClick={() => goTo(spreadIdx + 1)}>❯</button>
            )}
            {spreadIdx === SPREAD_PATHS.length - 1 && (
              <button className="home-return-btn" onClick={() => goTo(2)}>처음으로</button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default App
