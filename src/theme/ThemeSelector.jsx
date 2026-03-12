import React from 'react'
import { THEMES, useTheme } from './ThemeContext'
import './theme-selector.css'

const ThemeSelector = ({ isMobilePhone }) =>
  isMobilePhone ? <ThemeSelectorMobile /> : <ThemeSelectorWeb />

export default ThemeSelector

/* 웹 / 태블릿: 가로 */
const ThemeSelectorWeb = () => {
  const { currentTheme, isOpen, toggleOpen, selectTheme } = useTheme()
  return (
    <div className={`ts-web${isOpen ? ' ts-open' : ''}`}>
      <button className="ts-toggle-web" onClick={toggleOpen} aria-label="테마 선택">
        <span className={`ts-chevron${isOpen ? ' ts-chevron-open' : ''}`}>▶</span>
      </button>
      <div className="ts-panel-web">
        <span className="ts-label">THEME</span>
        {THEMES.map(theme => (
          <button
            key={theme.id}
            className={`ts-dot${currentTheme.id === theme.id ? ' ts-dot-active' : ''}`}
            onClick={() => selectTheme(theme)}
            title={theme.label}
            style={{
              background: `conic-gradient(
                ${theme.colors.gradientA} 0% 25%,
                ${theme.colors.gradientB} 25% 50%,
                ${theme.colors.parchment} 50% 75%,
                ${theme.colors.ink}       75% 100%
              )`,
            }}
          />
        ))}
      </div>
    </div>
  )
}

/* 모바일: 오른쪽 세로 */
const ThemeSelectorMobile = () => {
  const { currentTheme, isOpen, toggleOpen, selectTheme } = useTheme()
  return (
    <div className={`ts-mobile${isOpen ? ' ts-open' : ''}`}>
      <div className="ts-panel-mobile">
        {THEMES.map(theme => (
          <button
            key={theme.id}
            className={`ts-dot${currentTheme.id === theme.id ? ' ts-dot-active' : ''}`}
            onClick={(e) => { e.stopPropagation(); selectTheme(theme) }}
            title={theme.label}
            style={{
              background: `conic-gradient(
                ${theme.colors.gradientA} 0% 25%,
                ${theme.colors.gradientB} 25% 50%,
                ${theme.colors.parchment} 50% 75%,
                ${theme.colors.ink}       75% 100%
              )`,
            }}
          />
        ))}
      </div>
      <button className="ts-toggle-mobile" onClick={(e) => { e.stopPropagation(); toggleOpen() }} aria-label="테마 선택">
        <span className={`ts-chevron${isOpen ? ' ts-chevron-open' : ''}`}>▲</span>
      </button>
    </div>
  )
}
