import React, { useState, useEffect, useRef } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'

const NAV_ITEMS = [
  { path: '/about',   label: 'About'   },
  { path: '/profile', label: 'Profile' },
  { path: '/skills',  label: 'Skills'  },
  { path: '/project', label: 'Quest'   },
  { path: '/contact', label: 'Contact' },
]

const WEB_SPREADS = [
  '/about', '/intro', '/profile', '/skills',
  '/project', '/project/2', '/project/3', '/contact'
]

const MOBILE_PAGES = WEB_SPREADS.flatMap((path, i) => [
  { path, side: 'L', page: i * 2 + 1 },
  { path, side: 'R', page: i * 2 + 2 },
])

// 기준 크기는 App.jsx에서 통합 관리
// book-portrait: 360x480 (CSS 기준)

const AppMobile = ({ children }) => {
  const location = useLocation()
  const navigate = useNavigate()

  const [phase,   setPhase]   = useState(null)
  const [isOpen,  setIsOpen]  = useState(false)
  const [closing, setClosing] = useState(false)
  const [step,    setStep]    = useState(0)
  const busy = useRef(false)
  const lastScroll = useRef(0)

  const isHome = location.pathname === '/'

  useEffect(() => {
    if (!isHome) setIsOpen(true)
    else setIsOpen(false)
  }, [isHome])

  const goHome = () => {
    if (closing) return
    setClosing(true)
    setTimeout(() => {
      setIsOpen(false)
      navigate('/')
      setTimeout(() => setClosing(false), 100)
    }, 400)
  }

  const goStep = (nextStep, dir) => {
    if (busy.current) return
    busy.current = true
    setPhase(dir === 'next' ? 'exit-next' : 'exit-prev')
    setTimeout(() => {
      const target = MOBILE_PAGES[nextStep]
      if (target.path !== location.pathname) navigate(target.path)
      setStep(nextStep)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setPhase(dir === 'next' ? 'enter-next' : 'enter-prev')
          setTimeout(() => { setPhase(null); busy.current = false }, 400)
        })
      })
    }, 320)
  }

  const clickNext = () => { if (step < MOBILE_PAGES.length - 1) goStep(step + 1, 'next') }
  const clickPrev = () => { if (step > 0) goStep(step - 1, 'prev') }

  // 휠 이벤트
  useEffect(() => {
    const handleWheel = (e) => {
      if (busy.current) return
      const now = Date.now()
      if (now - lastScroll.current < 600) return
      lastScroll.current = now
      if (e.deltaY > 0) clickNext()
      else clickPrev()
    }
    window.addEventListener('wheel', handleWheel, { passive: true })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [step])

  const currentSide = MOBILE_PAGES[step]?.side ?? 'L'

  const portCls = phase === 'exit-next'  ? ' port-exit-down'
                : phase === 'exit-prev'  ? ' port-exit-up'
                : phase === 'enter-next' ? ' port-enter-up'
                : phase === 'enter-prev' ? ' port-enter-down'
                : ''

  const currentPage = MOBILE_PAGES[step]?.page ?? 1

  if (isHome) {
    return (
      <div className="book-closed"
        onClick={() => { navigate('/about'); setStep(0) }}>
        <picture>
          <img className="cover-img" src="./assets/mobile_cover1.png" alt="cover" />
        </picture>
        <span className="click-hint">click to start &nbsp;»</span>
      </div>
    )
  }

  return (
    <div className={`book-open book-portrait${closing ? ' book-closing' : isOpen ? ' book-opened' : ''}`}>

      <div className={`port-page port-page-${currentSide.toLowerCase()}`}>
        <div className={`port-inner${portCls}`} />
        {/* 콘텐츠 영역 - 스크롤 가능 */}
        <div className="page-content">
          {children}
        </div>
        {/* 페이지 넘기기 클릭 영역 - 하단 20% */}
        <div className="port-click-zone" onClick={clickNext} />
        <span className="page-number">{currentPage}</span>
      </div>

      <nav className="diary-nav">
        {NAV_ITEMS.map(item => (
          <NavLink key={item.path} to={item.path}
            onClick={(e) => {
              e.stopPropagation()
              const idx = MOBILE_PAGES.findIndex(p => p.path === item.path)
              if (idx >= 0) goStep(idx, idx > step ? 'next' : 'prev')
            }}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <button className="close-btn" onClick={goHome} title="홈으로">✕</button>

      {step > 0 && (
        <button className="nav-btn prev" onClick={clickPrev}>︿</button>
      )}
      {step < MOBILE_PAGES.length - 1 && (
        <button className="nav-btn next" onClick={clickNext}>﹀</button>
      )}
      {step === MOBILE_PAGES.length - 1 && (
        <button className="home-return-btn" onClick={goHome}>↩ 처음으로</button>
      )}
    </div>
  )
}

export default AppMobile
