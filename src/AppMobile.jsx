import React, { useState, useEffect, useRef, useCallback } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import ThemeSelector from './theme/ThemeSelector'
import { useTheme } from './theme/ThemeContext'

const NAV_ITEMS = [
  { path: '/profile', label: 'Profile' },
  { path: '/diary',   label: 'Diary'   },
]

const WEB_SPREADS = ['/profile', '/diary', '/diary/2', '/diary/3']

const MOBILE_PAGES = WEB_SPREADS.flatMap((path, i) => [
  { path, side: 'L', page: i * 2 + 1 },
  { path, side: 'R', page: i * 2 + 2 },
])

const AppMobile = ({ children, isMobilePhone }) => {
  const location = useLocation()
  const navigate = useNavigate()

  const [phase,        setPhase]        = useState(null)
  const [isOpen,       setIsOpen]       = useState(false)
  const [closing,      setClosing]      = useState(false)
  const [coverLeaving, setCoverLeaving] = useState(false)
  const [step,         setStep]         = useState(0)

  const { currentTheme } = useTheme()
  const busy       = useRef(false)
  const stepRef    = useRef(0)
  const lastScroll = useRef(0)

  // stepRef를 step과 동기화
  useEffect(() => { stepRef.current = step }, [step])

  const isHome = location.pathname === '/'

  useEffect(() => {
    if (!isHome) setIsOpen(true)
    else { setIsOpen(false); setCoverLeaving(false) }
  }, [isHome])

  // 표지로 완전히 돌아가기
  const goHome = useCallback(() => {
    if (closing) return
    setClosing(true)
    setTimeout(() => {
      setIsOpen(false)
      navigate('/')
      setTimeout(() => setClosing(false), 100)
    }, 400)
  }, [closing, navigate])

  // 첫 페이지로 돌아가기 - closing 애니 후 step 0으로 이동
  const goFirstPage = useCallback(() => {
    if (closing || busy.current) return
    setClosing(true)
    setTimeout(() => {
      setClosing(false)
      setIsOpen(false)
      setTimeout(() => {
        setStep(2)
        navigate('/diary')
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setIsOpen(true)
          })
        })
      }, 50)
    }, 400)
  }, [closing, navigate])

  // 표지 탭 → 애니 후 콘텐츠 진입
  const tapStart = useCallback(() => {
    setCoverLeaving(true)
    setTimeout(() => {
      navigate('/profile')
      setStep(0)
    }, 500)
  }, [navigate])

  const goStep = useCallback((nextStep, dir) => {
    if (busy.current) return
    busy.current = true
    setPhase(dir === 'next' ? 'exit-next' : 'exit-prev')
    setTimeout(() => {
      const target = MOBILE_PAGES[nextStep]
      navigate(target.path)
      setStep(nextStep)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setPhase(dir === 'next' ? 'enter-next' : 'enter-prev')
          setTimeout(() => { setPhase(null); busy.current = false }, 400)
        })
      })
    }, 320)
  }, [navigate])

  const clickNext = useCallback(() => {
    if (stepRef.current < MOBILE_PAGES.length - 1) goStep(stepRef.current + 1, 'next')
  }, [goStep])

  const clickPrev = useCallback(() => {
    if (stepRef.current > 0) goStep(stepRef.current - 1, 'prev')
  }, [goStep])

  // 휠 이벤트 - stepRef로 stale closure 방지
  useEffect(() => {
    const handleWheel = (e) => {
      if (busy.current) return
      const now = Date.now()
      if (now - lastScroll.current < 600) return
      lastScroll.current = now
      if (e.deltaY > 0) clickNext()
      else              clickPrev()
    }
    window.addEventListener('wheel', handleWheel, { passive: true })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [clickNext, clickPrev])

  const currentSide = MOBILE_PAGES[step]?.side ?? 'L'
  const currentPage = MOBILE_PAGES[step]?.page ?? 1
  const isLastPage  = step === MOBILE_PAGES.length - 1
  const isFirstPage = step === 0

  const portCls = phase === 'exit-next'  ? ' port-exit-down'
                : phase === 'exit-prev'  ? ' port-exit-up'
                : phase === 'enter-next' ? ' port-enter-up'
                : phase === 'enter-prev' ? ' port-enter-down'
                : ''

  const bookCls = closing ? ' book-closing' : isOpen ? ' book-opened' : ''

  // 태블릿 portrait
  if (!isMobilePhone) {
    if (isHome) {
      return (
        <div className="book-closed" onClick={() => { navigate('/profile'); setStep(0) }}>
          <picture>
            <img className="cover-img" src={currentTheme.assets.mobileCover} alt="cover" />
          </picture>
          <span className="click-hint">click to start &nbsp;»</span>
        </div>
      )
    }
    return (
      <div className={`book-open book-portrait${bookCls}`}>
        <div className={`port-page port-page-${currentSide.toLowerCase()}`}>
          <div className={`port-inner${portCls}`} />
          <div className="page-content">{children}</div>
          <div className="port-click-zone-top" onClick={clickPrev} />
          <div className="port-click-zone" onClick={clickNext} />
          <span className="page-number">{currentPage}</span>
        </div>
        <nav className="diary-nav">
          {NAV_ITEMS.map(item => (
            <NavLink key={item.path} to={item.path}
              onClick={(e) => {
                e.stopPropagation()
                const idx = MOBILE_PAGES.findIndex(p => p.path === item.path)
                if (idx >= 0) goStep(idx, idx > stepRef.current ? 'next' : 'prev')
              }}
              className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button className="close-btn" onClick={goHome} title="홈으로">✕</button>
        {!isFirstPage && <button className="nav-btn prev" onClick={clickPrev}>︿</button>}
        {!isLastPage  && <button className="nav-btn next" onClick={clickNext}>﹀</button>}
        {isLastPage   && <button className="home-return-btn" onClick={goHome}>↩ 처음으로</button>}
      </div>
    )
  }

  // 스마트폰: 표지
  if (isHome) {
    return (
      <div className={`mob-intro${coverLeaving ? ' mob-intro-leave' : ''}`} onClick={tapStart}>
        <img src={currentTheme.assets.mobileIntroBg} alt="cover" className="mob-intro-bg" />
        <ThemeSelector isMobilePhone={true} />
        <button className="mob-tap-btn" onClick={e => { e.stopPropagation(); tapStart() }}>
          tap to start &nbsp;»
        </button>
      </div>
    )
  }

  // 스마트폰: 콘텐츠
  return (
    <div className="mob-shell">

      <header className="mob-header"
        style={{ backgroundImage: `url('${currentTheme.assets.mobileHeader}')` }}
      >
        <img src={currentTheme.assets.nameLogo} alt="logo" className="mob-logo" onClick={goHome} />
      </header>

      <nav className="mob-nav">
        {NAV_ITEMS.map(item => (
          <NavLink key={item.path} to={item.path}
            onClick={(e) => {
              e.preventDefault()
              const idx = MOBILE_PAGES.findIndex(p => p.path === item.path)
              if (idx >= 0) goStep(idx, idx > stepRef.current ? 'next' : 'prev')
            }}
            className={({ isActive }) => `mob-nav-item${isActive ? ' active' : ''}`}>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="mob-book-wrap">

        {isFirstPage ? (
          <button className="mob-goto-btn" onClick={goHome}>표지로 돌아가기</button>
        ) : (
          <button className="mob-arrow mob-arrow-prev" onClick={clickPrev}>︿</button>
        )}

        <div className={`mob-page${bookCls}`}>
          <div className={`port-inner${portCls}`} />
          <div className="mob-page-content">{children}</div>
          <div className="port-click-zone-top" onClick={clickPrev} />
          <div className="port-click-zone" onClick={clickNext} />
          <span className="mob-page-number">{currentPage}</span>
        </div>

        {isLastPage ? (
          <button className="mob-goto-btn" onClick={goFirstPage}>첫 페이지로 돌아가기</button>
        ) : (
          <button className="mob-arrow mob-arrow-next" onClick={clickNext}>﹀</button>
        )}

      </div>
    </div>
  )
}

export default AppMobile
