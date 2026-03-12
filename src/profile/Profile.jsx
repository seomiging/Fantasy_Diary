import React from 'react'
import './profile.css'

//페이지 1: 기본 정보
const ProfilePage1 = () => (
  <div className="prof-page">
    <div className="prof-header">
      <span className="prof-title">ADDRESS</span>
      <div className="prof-divider" />
    </div>

    <div className="prof-fields">
      {/* 이름 */}
      <div className="prof-row">
        <span className="prof-label">Name</span>
        <span className="prof-value">서미경</span>
      </div>
      {/* 생년월일 */}
      <div className="prof-row">
        <span className="prof-label">Birth</span>
        <span className="prof-value">2000. 10. 16</span>
      </div>
      {/* 거주지 */}
      <div className="prof-row">
        <span className="prof-label">Location</span>
        <span className="prof-value">Dauge, Korea</span>
      </div>
      {/* 이메일 */}
      <div className="prof-row">
        <span className="prof-label">E-mail</span>
        <span className="prof-value">sz1016sz@naver.com</span>
      </div>
      {/* 연락처 */}
      <div className="prof-row">
        <span className="prof-label">Contact</span>
        <span className="prof-value">010-4132-8153</span>
      </div>
    </div>

    <div className="prof-section-title">Introduction</div>
    <div className="prof-intro-box">
      {/* ↓ 자기소개 문장 수정하세요 */}
      <p>안녕하세요, 저는 서미경입니다.</p>
      <p>현재 웹 퍼블리셔 / 디자인 분야에서 취업 준비 중이며,</p>
      <p>디자인과 기획에 관심이 많습니다.</p>
    </div>

    <div className="prof-page-deco">✦</div>
  </div>
)

// ── 페이지 2: 경력 / 링크
const ProfilePage2 = () => (
  <div className="prof-page">
    <div className="prof-header">
      <span className="prof-title">Career &amp; Links</span>
      <div className="prof-divider" />
    </div>

    <div className="prof-section-title">Skills</div>
    <div className="prof-tag-wrap">
    
      {['React', 'HTML', 'CSS', 'Figma'].map(s => (
        <span key={s} className="prof-tag">{s}</span>
      ))}
    </div>

    <div className="prof-section-title">Projects</div>
    <div className="prof-timeline">
      {/* ↓ 경력 수정하세요 */}
      <div className="prof-tl-row">
        <span className="prof-tl-year">2026</span>
        <span className="prof-tl-desc">MY LITTLE WORLD 제작</span>
      </div>
      <div className="prof-tl-row">
        <span className="prof-tl-year">2026</span>
        <span className="prof-tl-desc">Fantasy Diary 제작</span>
      </div>
      <div className="prof-tl-row">
        <span className="prof-tl-year">2026</span>
        <span className="prof-tl-desc">클론 코딩</span>
      </div>
      <div className="prof-tl-row">
        <span className="prof-tl-year">2026</span>
        <span className="prof-tl-desc">리디자인 협업프로젝트</span>
      </div>
    </div>

    <div className="prof-section-title">Links</div>
    <div className="prof-fields">
      {/* ↓ 링크 수정하세요 */}
      <div className="prof-row">
        <span className="prof-label">GitHub</span>
        <span className="prof-value">github.com/username</span>
      </div>
      <div className="prof-row">
        <span className="prof-label">Blog</span>
        <span className="prof-value">yourblog.com</span>
      </div>
      <div className="prof-row">
        <span className="prof-label">Portfolio</span>
        <span className="prof-value">yourportfolio.com</span>
      </div>
    </div>

    <div className="prof-page-deco">✦</div>
  </div>
)

// ── export: pageNum prop으로 분기 ────────────────────
const Profile = ({ pageNum = 1 }) => {
  return pageNum === 1 ? <ProfilePage1 /> : <ProfilePage2 />
}

export default Profile
