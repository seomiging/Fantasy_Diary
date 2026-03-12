import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { useLocation } from 'react-router-dom'

/* THEMES  여기서 객체 추가만 하면됨 */
export const THEMES = [
  {
    id: 'theme1',
    label: 'Vintage',
    colors: {
      gradientA:   '#8B1A1A',
      gradientB:   '#e09d0bff',
      crimson:     '#8B1A1A',
      crimsonDark: '#5C0F0F',
      gold:        '#C9A84C',
      goldLight:   '#E8C97A',
      parchment:   '#693f1dff',
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
      btnColor:         '#E8C97A',
      btnColorHover:    '#ffffff',
      btnBorder:        '#C9A84C',
      btnShadow:        'rgba(201,168,76,0.7)',
      btnShadow2:       'rgba(201,168,76,0.35)',
      tabBg:            'rgba(245,230,200,0.97)',
      tabBgHover:       'rgba(255,244,218,1)',
      tabBgActive:      'rgba(255,248,228,1)',
      tabBorder:        'rgba(180,140,80,0.45)',
      tabBorderActive:  'rgba(180,140,80,0.6)',
      tabColor:         '#5C3A10', 
      tabColorActive:   '#8B1A1A',   
      mobNavBg:         'rgba(30,10,5,0.95)',
      mobNavBorder:     'rgba(201,168,76,0.4)',
      mobNavColor:      'rgba(232,201,122,0.75)',
      mobNavDivider:    'rgba(201,168,76,0.2)',
      mobNavActiveBg:   'rgba(92,15,15,0.5)',
      hintColor:        '#e8c97a',
      hintBorder:       'rgba(232,201,122,0.6)',
      hintShadow:       'rgba(201,168,76,0.3)',
      hintTextShadow:   'rgba(232,201,122,0.9)',
      logoShadow:       'rgba(0,0,0,0.45)',
    },
  },
  {
    id: 'theme2',
    label: 'Princess',
    colors: {
      gradientA:   '#EFAFC0',
      gradientB:   '#C0D4B0',
      crimson:     '#D4788A',
      crimsonDark: '#B85A70',
      gold:        '#D4B87A',
      goldLight:   '#EDD49A',
      parchment:   '#F4EED8',
      ink:         '#e4cc98ff',
      bgDark:      '#7A9878',
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
      bgDark:           '#7A9878',
      mobBgShell:       '#ECD8DC', 
      mobBgIntro:       '#F2E0E6', 
      mobBgBookWrap:    '#D4E0CC',
      mobBgGoto:        '#D4788A',
      mobBgGotoHover:   'rgba(184,90,112,0.98)',
      btnBg:            'rgba(164, 190, 151, 0.9)',
      btnBgHover:       'rgba(130, 175, 124, 0.98)',
      btnColor:         '#FFF0F4',
      btnColorHover:    '#ffffff',
      btnBorder:        '#C0D4B0',
      btnShadow:        'rgba(160,200,144,0.7)',
      btnShadow2:       'rgba(160,200,144,0.35)',
      tabBg:            'rgba(244,238,216,0.97)',
      tabBgHover:       'rgba(250,244,224,1)',
      tabBgActive:      'rgba(255,250,232,1)',
      tabBorder:        'rgba(212,184,122,0.45)', 
      tabBorderActive:  'rgba(192,212,176,0.75)',
      tabColor:         '#7A5A60',  
      tabColorActive:   '#B85A70',  
      mobNavBg:         'rgba(184,100,120,0.95)',
      mobNavBorder:     'rgba(192,212,176,0.5)',
      mobNavColor:      '#FFF4EC',
      mobNavDivider:    'rgba(255,255,255,0.22)',
      mobNavActiveBg:   'rgba(255,255,255,0.28)',
      hintColor:        '#E86080',
      hintBorder:       'rgba(232, 96, 128, 0.65)',
      hintShadow:       'rgba(232, 96, 128, 0.35)',
      hintTextShadow:   'rgba(255, 130, 160, 0.9)',
      logoShadow:       'rgba(219, 193, 200, 0.35)',
    }
  },
  {
    id: 'theme3',
    label: 'AsianStyle',
    colors: {
      gradientA:   '#d4bc7aff',
      gradientB:   '#ce0610ff',
      crimson:     '#C8A030',
      crimsonDark: '#A07820',
      gold:        '#C89828',
      goldLight:   '#E0BC60',
      parchment:   '#F5EDD8',
      ink:         '#1C1008',
      bgDark:      '#3C2C10',
    },
    assets: {
      webBg:           './assets/theme3/web_intro_bg.png',
      contentBg:       './assets/theme3/web_content_bg.png',
      webClosedCover:  './assets/theme3/web_cover1.png',
      webCover:        './assets/theme3/cover1.png',
      mobileCover:     './assets/theme3/mobile_cover1.png',
      mobileIntroBg:   './assets/theme3/mobile_intro_bg1.png',
      mobileHeader:    './assets/theme3/mobile_header.png',
      nameLogo:        './assets/theme3/name_logo.png',
      innerLeft:       './assets/theme3/innerpage_left.png',
      innerRight:      './assets/theme3/innerpage_right.png',
      coverMobile:     './assets/theme3/cover_mobile1.png',
      innerMobile:     './assets/theme3/innerpage_mobile.png',
      cursor:          './assets/cursor/pointer3.png',
    },
    ui: {
      bgDark:           '#3C2C10',
      mobBgShell:       '#E8DDB8',
      mobBgIntro:       '#F0E8C8',
      mobBgBookWrap:    '#D8C880',
      mobBgGoto:        '#8C6830',
      mobBgGotoHover:   'rgba(108,80,28,0.98)',
      btnBg:            'rgba(255, 249, 242, 0.92)',
      btnBgHover:       'rgba(236, 231, 221, 0.98)',
      btnColor:         '#3d3c3aff',
      btnColorHover:    '#1d1b1bff',
      btnBorder:        '#C8241C',
      btnShadow:        'rgba(200,36,28,0.5)',
      btnShadow2:       'rgba(200,36,28,0.25)',
      tabBg:            'rgba(245,237,216,0.97)',
      tabBgHover:       'rgba(250,244,224,1)',
      tabBgActive:      'rgba(255,250,232,1)',
      tabBorder:        'rgba(200,152,40,0.45)',
      tabBorderActive:  'rgba(200,36,28,0.50)',
      tabColor:         '#6B4A1A',
      tabColorActive:   '#C8241C',
      mobNavBg:         'rgba(200,160,48,0.97)',
      mobNavBorder:     'rgba(200,36,28,0.35)',
      mobNavColor:      '#2C1A04',
      mobNavDivider:    'rgba(28,16,8,0.18)',
      mobNavActiveBg:   'rgba(200,36,28,0.25)',
      hintColor:        '#C8A030',
      hintBorder:       'rgba(200,160,48,0.65)',
      hintShadow:       'rgba(200,160,48,0.35)',
      hintTextShadow:   'rgba(224,188,96,0.9)',
      logoShadow:       'rgba(28,16,8,0.45)',
    }
  },
]

/* 테마 적용 */
const applyTheme = (theme) => {
  const c = theme.colors
  const a = theme.assets
  const u = theme.ui

  //CSS 컬러
  const root = document.documentElement
  root.style.setProperty('--crimson',      c.crimson)
  root.style.setProperty('--crimson-dark', c.crimsonDark)
  root.style.setProperty('--gold',         c.gold)
  root.style.setProperty('--gold-light',   c.goldLight)
  root.style.setProperty('--parchment',    c.parchment)
  root.style.setProperty('--ink',          c.ink)

  //
  root.style.setProperty('--bg-dark',           u.bgDark)
  root.style.setProperty('--mob-bg-shell',      u.mobBgShell)
  root.style.setProperty('--mob-bg-intro',      u.mobBgIntro)
  root.style.setProperty('--mob-bg-book-wrap',  u.mobBgBookWrap)
  root.style.setProperty('--mob-bg-goto',       u.mobBgGoto)
  root.style.setProperty('--mob-bg-goto-hover', u.mobBgGotoHover)
  root.style.setProperty('--btn-bg',            u.btnBg)
  root.style.setProperty('--btn-bg-hover',      u.btnBgHover)
  root.style.setProperty('--btn-color',         u.btnColor)
  root.style.setProperty('--btn-color-hover',   u.btnColorHover)
  root.style.setProperty('--btn-border',        u.btnBorder)
  root.style.setProperty('--btn-shadow',        u.btnShadow)
  root.style.setProperty('--btn-shadow2',       u.btnShadow2)
  root.style.setProperty('--tab-bg',            u.tabBg)
  root.style.setProperty('--tab-bg-hover',      u.tabBgHover)
  root.style.setProperty('--tab-bg-active',     u.tabBgActive)
  root.style.setProperty('--tab-border',        u.tabBorder)
  root.style.setProperty('--tab-border-active', u.tabBorderActive)
  root.style.setProperty('--tab-color',         u.tabColor)
  root.style.setProperty('--tab-color-active',  u.tabColorActive)
  root.style.setProperty('--mob-nav-bg',        u.mobNavBg)
  root.style.setProperty('--mob-nav-border',    u.mobNavBorder)
  root.style.setProperty('--mob-nav-color',     u.mobNavColor)
  root.style.setProperty('--mob-nav-divider',   u.mobNavDivider)
  root.style.setProperty('--mob-nav-active-bg', u.mobNavActiveBg)
  root.style.setProperty('--hint-color',        u.hintColor)
  root.style.setProperty('--hint-border',       u.hintBorder)
  root.style.setProperty('--hint-shadow',       u.hintShadow)
  root.style.setProperty('--hint-text-shadow',  u.hintTextShadow)
  root.style.setProperty('--logo-shadow',       u.logoShadow)

  // 이미지 + 커서
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
    .mob-logo              { filter: drop-shadow(0 1px 4px ${u.logoShadow}) !important; }
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