import React, { useState, useEffect, useRef, useCallback } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import ThemeSelector from './theme/ThemeSelector'
import { useTheme } from './theme/ThemeContext'
import Profile from './profile/Profile'
import Diary from './diary/Diary'

const NAV_ITEMS = [
  { path: '/profile', label: 'Profile' },
  { path: '/diary',   label: 'Diary'   },
]

// 페이지 4장: profile p1 → profile p2 → diary p1 → diary p2
const MOBILE_PAGES = [
  { path: '/profile', pageNum: 1, page: 1 },
  { path: '/profile', pageNum: 2, page: 2 },
  { path: '/diary',   pageNum: 1, page: 3 },
  { path: '/diary',   pageNum: 2, page: 4 },
  { path: '/diary2',  pageNum: 3, page: 5 },
  { path: '/diary2',  pageNum: 4, page: 6 },
]

const AppMobile = ({ isMobilePhone }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { currentTheme } = useTheme()

  const [phase,        setPhase]        = useState(null)
  const [isOpen,       setIsOpen]       = useState(false)
  const [closing,      setClosing]      = useState(false)
  const [coverLeaving, setCoverLeaving] = useState(false)
  const [step,         setStep]         = useState(0)

  const busy       = useRef(false)
  const stepRef    = useRef(0)
  const lastScroll = useRef(0)

  useEffect(() => { stepRef.current = step }, [step])

  const isHome = location.pathname === '/'

  useEffect(() => {
    if (!isHome) setIsOpen(true)
    else { setIsOpen(false); setCoverLeaving(false) }
  }, [isHome])

  // 표지로 돌아가기
  const goHome = useCallback(() => {
    if (closing) return
    setClosing(true)
    setTimeout(() => {
      setIsOpen(false)
      navigate('/')
      setTimeout(() => setClosing(false), 100)
    }, 400)
  }, [closing, navigate])

  // 표지 탭 → 콘텐츠 진입
  const tapStart = useCallback(() => {
    setCoverLeaving(true)
    setTimeout(() => { navigate('/profile'); setStep(0) }, 500)
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

  // 일기 첫 페이지로 이동
  const goDiary = useCallback(() => {
    if (closing || busy.current) return
    const diaryIdx = MOBILE_PAGES.findIndex(p => p.path === '/diary')
    if (diaryIdx >= 0) goStep(diaryIdx, diaryIdx > stepRef.current ? 'next' : 'prev')
  }, [closing, goStep])

  // 휠 이벤트
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

  const currentPage = MOBILE_PAGES[step]?.page ?? 1
  const currentSide = step % 2 === 0 ? 'l' : 'r'
  const isLastPage  = step === MOBILE_PAGES.length - 1
  const isFirstPage = step === 0

  const portCls = phase === 'exit-next'  ? ' port-exit-down'
                : phase === 'exit-prev'  ? ' port-exit-up'
                : phase === 'enter-next' ? ' port-enter-up'
                : phase === 'enter-prev' ? ' port-enter-down'
                : ''

  const bookCls = closing ? ' book-closing' : isOpen ? ' book-opened' : ''

  // 현재 step에 맞는 컴포넌트 직접 렌더 — children 없음
  const renderContent = () => {
    const p = MOBILE_PAGES[step]
    if (!p) return null
    if (p.path === '/profile') return <Profile pageNum={p.pageNum} />
    if (p.path === '/diary')   return <Diary   pageNum={p.pageNum} />
    if (p.path === '/diary2')  return <Diary   pageNum={p.pageNum} />
    return null
  }

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
        <div className={`port-page port-page-${currentSide}`}>
          <div className={`port-inner${portCls}`} />
          <div className="page-content">{renderContent()}</div>
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
        {isLastPage   && <button className="home-return-btn" onClick={goDiary}>처음으로</button>}
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
      <header className="mob-header">
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
          <div className="mob-page-content">{renderContent()}</div>
          <span className="mob-page-number">{currentPage}</span>
        </div>

        {isLastPage ? (
          <button className="mob-goto-btn" onClick={goDiary}>첫 페이지로 돌아가기</button>
        ) : (
          <button className="mob-arrow mob-arrow-next" onClick={clickNext}>﹀</button>
        )}
      </div>
    </div>
  )
}

export default AppMobile
