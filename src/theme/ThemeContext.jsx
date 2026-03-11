import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { useLocation } from 'react-router-dom'

/* ════════════════════════════════════════
   THEMES ← 테마 추가는 여기에만!
════════════════════════════════════════ */
export const THEMES = [
  {
    id: 'theme1',
    label: '붉은 다이어리',
    colors: {
      gradientA:   '#8B1A1A',
      gradientB:   '#C9A84C',
      crimson:     '#8B1A1A',
      crimsonDark: '#5C0F0F',
      gold:        '#C9A84C',
      goldLight:   '#E8C97A',
      parchment:   '#F5E6C8',
      ink:         '#1C1008',
      bgDark:      '#2a1a0e',
    },
    assets: {
      webBg:           './assets/theme1/web_intro_bg.png',
      contentBg:       './assets/theme1/web_content_bg.png',
      webClosedCover:  './assets/theme1/web_cover1.png',
      webCover:        './assets/theme1/cover1.png',
      mobileCover:     './assets/theme1/mobile_cover1.png',
      mobileIntroBg:   './assets/theme1/mobile_intro_bg1.png',
      mobileHeader:    './assets/theme1/mobile_header.png',
      nameLogo:        './assets/theme1/name_logo.png',
      innerLeft:       './assets/theme1/innerpage_left.png',
      innerRight:      './assets/theme1/innerpage_right.png',
      coverMobile:     './assets/theme1/cover_mobile1.png',
      innerMobile:     './assets/theme1/innerpage_mobile.png',
      cursor:          './assets/cursor/pointer1.png',
    },
    ui: {
      bgDark:           '#2a1a0e',
      mobBgShell:       '#2f1e13',
      mobBgIntro:       '#4a0f0f',
      mobBgBookWrap:    '#312016',
      mobBgGoto:        '#3d1210',
      mobBgGotoHover:   'rgba(139,26,26,0.98)',
      btnBg:            'rgba(92,15,15,0.92)',
      btnBgHover:       'rgba(139,26,26,0.98)',
      btnBorder:        '#C9A84C',
      btnShadow:        'rgba(201,168,76,0.7)',
      btnShadow2:       'rgba(201,168,76,0.35)',
      tabBg:            'rgba(245,230,200,0.97)',
      tabBgHover:       'rgba(255,244,218,1)',
      tabBgActive:      'rgba(255,248,228,1)',
      tabBorder:        'rgba(180,140,80,0.45)',
      tabBorderActive:  'rgba(180,140,80,0.6)',
      mobNavBg:         'rgba(30,10,5,0.95)',
      mobNavBorder:     'rgba(201,168,76,0.4)',
      mobNavColor:      'rgba(232,201,122,0.75)',
      mobNavDivider:    'rgba(201,168,76,0.2)',
      mobNavActiveBg:   'rgba(92,15,15,0.5)',
      hintColor:        '#e8c97a',
      hintBorder:       'rgba(232,201,122,0.6)',
      hintShadow:       'rgba(201,168,76,0.3)',
      hintTextShadow:   'rgba(232,201,122,0.9)',
    },
  },
  {
    id: 'theme2',
    label: '공주 다이어리',
    colors: {
      gradientA:   '#D97090',   // 로즈 핑크
      gradientB:   '#8FB87A',   // 세이지 그린
      crimson:     '#C85575',   // 딥 로즈
      crimsonDark: '#9E3558',   // 다크 로즈
      gold:        '#A8B870',   // 연두골드
      goldLight:   '#C8D890',   // 라이트 연두
      parchment:   '#FBF0E8',   // 크림 베이지
      ink:         '#3C2840',   // 다크 모브
      bgDark:      '#2A3828',   // 딥 세이지
    },
    assets: {
      webBg:           './assets/theme2/web_intro_bg.png',
      contentBg:       './assets/theme2/web_content_bg.png',
      webClosedCover:  './assets/theme2/web_cover1.png',
      webCover:        './assets/theme2/cover1.png',
      mobileCover:     './assets/theme2/mobile_cover1.png',
      mobileIntroBg:   './assets/theme2/mobile_intro_bg1.png',
      mobileHeader:    './assets/theme2/mobile_header.png',
      nameLogo:        './assets/theme2/name_logo.png',
      innerLeft:       './assets/theme2/innerpage_left.png',
      innerRight:      './assets/theme2/innerpage_right.png',
      coverMobile:     './assets/theme2/cover_mobile1.png',
      innerMobile:     './assets/theme2/innerpage_mobile.png',
      cursor:          './assets/cursor/pointer2.png',
    },
    ui: {
      bgDark:           '#2A3828',   // 딥 세이지 배경
      mobBgShell:       '#2E3430',   // 세이지 다크 쉘
      mobBgIntro:       '#3A3040',   // 모브 다크 인트로
      mobBgBookWrap:    '#303830',   // 세이지 북랩
      mobBgGoto:        '#4A3058',   // 딥 모브 버튼
      mobBgGotoHover:   'rgba(158,53,88,0.98)',
      btnBg:            'rgba(200,85,117,0.88)',  // 로즈 버튼
      btnBgHover:       'rgba(158,53,88,0.98)',
      btnBorder:        '#C8D890',               // 연두골드 테두리
      btnShadow:        'rgba(168,184,112,0.7)',
      btnShadow2:       'rgba(200,216,144,0.35)',
      tabBg:            'rgba(251,240,232,0.97)', // 크림 탭
      tabBgHover:       'rgba(255,246,240,1)',
      tabBgActive:      'rgba(255,250,246,1)',
      tabBorder:        'rgba(180,160,170,0.5)',
      tabBorderActive:  'rgba(200,130,150,0.65)',
      mobNavBg:         'rgba(38,28,40,0.95)',    // 다크 모브 네비
      mobNavBorder:     'rgba(168,184,112,0.4)',
      mobNavColor:      'rgba(200,216,144,0.85)',
      mobNavDivider:    'rgba(168,184,112,0.22)',
      mobNavActiveBg:   'rgba(200,85,117,0.45)',
      hintColor:        '#C8D890',
      hintBorder:       'rgba(200,216,144,0.65)',
      hintShadow:       'rgba(168,184,112,0.35)',
      hintTextShadow:   'rgba(200,216,144,0.9)',
    },
  },
  // ── 테마 추가 예시 ──────────────────────
  // {
  //   id: 'theme2',
  //   label: '바다 일기',
  //   colors: { gradientA: '#1a4a7a', gradientB: '#4ac9c9', ... },
  //   assets: {
  //     webBg:     '/assets/theme2/web_intro_bg.png',
  //     ...
  //     cursor:    '/assets/cursor/pointer2.png',
  //   },
  // },
]

/* ════════════════════════════════════════
   테마 적용 - <style> 태그로 CSS 덮어쓰기
   원본 CSS/JSX 파일은 건드리지 않음!
════════════════════════════════════════ */
const applyTheme = (theme) => {
  const c = theme.colors
  const a = theme.assets
  const u = theme.ui

  // ── CSS 기본 팔레트 변수 ──
  const root = document.documentElement
  root.style.setProperty('--crimson',      c.crimson)
  root.style.setProperty('--crimson-dark', c.crimsonDark)
  root.style.setProperty('--gold',         c.gold)
  root.style.setProperty('--gold-light',   c.goldLight)
  root.style.setProperty('--parchment',    c.parchment)
  root.style.setProperty('--ink',          c.ink)

  // ── CSS UI 컴포넌트 변수 ──
  root.style.setProperty('--bg-dark',           u.bgDark)
  root.style.setProperty('--mob-bg-shell',      u.mobBgShell)
  root.style.setProperty('--mob-bg-intro',      u.mobBgIntro)
  root.style.setProperty('--mob-bg-book-wrap',  u.mobBgBookWrap)
  root.style.setProperty('--mob-bg-goto',       u.mobBgGoto)
  root.style.setProperty('--mob-bg-goto-hover', u.mobBgGotoHover)
  root.style.setProperty('--btn-bg',            u.btnBg)
  root.style.setProperty('--btn-bg-hover',      u.btnBgHover)
  root.style.setProperty('--btn-border',        u.btnBorder)
  root.style.setProperty('--btn-shadow',        u.btnShadow)
  root.style.setProperty('--btn-shadow2',       u.btnShadow2)
  root.style.setProperty('--tab-bg',            u.tabBg)
  root.style.setProperty('--tab-bg-hover',      u.tabBgHover)
  root.style.setProperty('--tab-bg-active',     u.tabBgActive)
  root.style.setProperty('--tab-border',        u.tabBorder)
  root.style.setProperty('--tab-border-active', u.tabBorderActive)
  root.style.setProperty('--mob-nav-bg',        u.mobNavBg)
  root.style.setProperty('--mob-nav-border',    u.mobNavBorder)
  root.style.setProperty('--mob-nav-color',     u.mobNavColor)
  root.style.setProperty('--mob-nav-divider',   u.mobNavDivider)
  root.style.setProperty('--mob-nav-active-bg', u.mobNavActiveBg)
  root.style.setProperty('--hint-color',        u.hintColor)
  root.style.setProperty('--hint-border',       u.hintBorder)
  root.style.setProperty('--hint-shadow',       u.hintShadow)
  root.style.setProperty('--hint-text-shadow',  u.hintTextShadow)

  // ── 이미지 + 커서 !important 덮어쓰기 ──
  let style = document.getElementById('__theme-override__')
  if (!style) {
    style = document.createElement('style')
    style.id = '__theme-override__'
    document.head.appendChild(style)
  }
  style.textContent = `
    * { cursor: url('${a.cursor}') 0 100, auto !important; }
    .diary-bg.bg-home      { background-image: url('${a.webBg}')      !important; }
    .diary-bg.bg-content   { background-image: url('${a.contentBg}')  !important; }
    .book-open::before     { background-image: url('${a.webCover}')    !important; }
    .book-portrait::before { background-image: url('${a.coverMobile}') !important; }
    .page-inner-left       { background-image: url('${a.innerLeft}')   !important; }
    .page-inner-right      { background-image: url('${a.innerRight}')  !important; }
    .port-inner            { background-image: url('${a.innerMobile}') !important; }
    .mob-header            { background-image: url('${a.mobileHeader}') !important; }
  `
}

const ThemeContext = createContext(null)
export const useTheme = () => useContext(ThemeContext)

export const ThemeProvider = ({ children }) => {
  const location = useLocation()
  const isHome   = location.pathname === '/'

  const [currentTheme, setCurrentTheme] = useState(THEMES[0])
  const [isOpen,       setIsOpen]       = useState(true)
  const prevIsHome = useRef(isHome)

  useEffect(() => { applyTheme(THEMES[0]) }, [])

  useEffect(() => {
    if (prevIsHome.current && !isHome) setIsOpen(false)
    prevIsHome.current = isHome
  }, [isHome])

  useEffect(() => {
    if (isHome) setIsOpen(true)
  }, [isHome])

  const selectTheme = useCallback((theme) => {
    setCurrentTheme(theme)
    applyTheme(theme)
    setIsOpen(false)
  }, [])

  const toggleOpen = useCallback(() => setIsOpen(v => !v), [])

  return (
    <ThemeContext.Provider value={{ currentTheme, isOpen, toggleOpen, selectTheme, isHome }}>
      {children}
    </ThemeContext.Provider>
  )
}
