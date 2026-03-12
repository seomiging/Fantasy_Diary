import React, { useState } from 'react'
import './diary.css'

// 내일 날짜 포맷 (항상 내일 = 오늘 일기 쓸 수 있게)
const tomorrow = () => {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  const yyyy = d.getFullYear()
  const mm   = String(d.getMonth() + 1).padStart(2, '0')
  const dd   = String(d.getDate()).padStart(2, '0')
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  return { date: `${yyyy}. ${mm}. ${dd}`, day: days[d.getDay()] }
}

const WEATHER = ['☀️ 맑음', '🌤 구름조금', '☁️ 흐림', '🌧 비', '❄️ 눈','🍃 바람', '🌫️ 안개']
const MOODS   = ['😊 좋음', '😐 보통', '😢 슬픔', '😠 화남', '😴 피곤']

// 페이지 1: 일기 작성 (내일 날짜)
const DiaryPage1 = () => {
  const { date, day } = tomorrow()
  const [weather, setWeather] = useState(WEATHER[0])
  const [mood,    setMood]    = useState(MOODS[0])
  const [text,    setText]    = useState('')

  return (
    <div className="diary-page">
      <div className="diary-date-row">
        <span className="diary-date">{date}</span>
        <span className="diary-day">{day}</span>
      </div>
      <div className="diary-header-line" />

      <div className="diary-meta-row">
        <div className="diary-meta-item">
          <span className="diary-meta-label">날씨</span>
          <select className="diary-select" value={weather} onChange={e => setWeather(e.target.value)}>
            {WEATHER.map(w => <option key={w}>{w}</option>)}
          </select>
        </div>
        <div className="diary-meta-item">
          <span className="diary-meta-label">기분</span>
          <select className="diary-select" value={mood} onChange={e => setMood(e.target.value)}>
            {MOODS.map(m => <option key={m}>{m}</option>)}
          </select>
        </div>
      </div>

      <input
        className="diary-title-input"
        placeholder="오늘의 제목을 적어주세요..."
        maxLength={40}
      />
      <div className="diary-title-line" />

      <textarea
        className="diary-textarea"
        placeholder={`오늘 하루를 기록해보세요.\n\n작은 것들도 괜찮아요. ✦`}
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <div className="diary-char-count">{text.length} 자</div>
    </div>
  )
}

// 페이지 2: 샘플 일기 (미리 써둔 버전)
const DiaryPage2 = () => {
  const { date: sampleDate, day: sampleDay } = tomorrow()
  const sampleText = `오늘은 오랜만에 카페에 나가 일했다.

창가 자리에 앉아 따뜻한 라테 한 잔을 시켜놓고, 밀린 작업들을 하나씩 정리했다. 바깥에는 얇은 봄비가 내리고 있었고, 빗소리가 꽤 좋았다. 이런 날이 생산적이기도 하고 감성적이기도 해서 참 좋다.

점심은 근처 일식집에서 먹었는데, 오늘따라 유난히 맛있었다. 소소하게 배부르고 행복한 하루.

앞으로도 이런 날들이 자주 있었으면 좋겠다. ✦`

  return (
    <div className="diary-page diary-page--sample">
      <div className="diary-date-row">
        <span className="diary-date">{sampleDate}</span>
        <span className="diary-day">{sampleDay}</span>
      </div>
      <div className="diary-header-line" />

      <div className="diary-meta-row">
        <div className="diary-meta-item">
          <span className="diary-meta-label">날씨</span>
          <span className="diary-meta-value">🌧 비</span>
        </div>
        <div className="diary-meta-item">
          <span className="diary-meta-label">기분</span>
          <span className="diary-meta-value">😊 좋음</span>
        </div>
      </div>

      <div className="diary-sample-title">봄 비 내리는 카페에서</div>
      <div className="diary-title-line" />

      <div className="diary-sample-text">
        {sampleText.split('\n').map((line, i) =>
          line ? <p key={i}>{line}</p> : <br key={i} />
        )}
      </div>
    </div>
  )
}

const Diary = ({ pageNum = 1 }) => {
  return pageNum === 1 ? <DiaryPage1 /> : <DiaryPage2 />
}

export default Diary
