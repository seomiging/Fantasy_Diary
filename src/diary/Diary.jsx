import React, { useState } from 'react'
import './diary.css'

// 날짜 포맷 헬퍼 (offset: 1=내일, 0=오늘, -1=어제 ...)
const getDateInfo = (offset = 0) => {
  const d = new Date()
  d.setDate(d.getDate() + offset)
  const yyyy = d.getFullYear()
  const mm   = String(d.getMonth() + 1).padStart(2, '0')
  const dd   = String(d.getDate()).padStart(2, '0')
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  return { date: `${yyyy}. ${mm}. ${dd}`, day: days[d.getDay()] }
}

const WEATHER = ['☀️ 맑음', '🌤 구름조금', '☁️ 흐림', '🌧 비', '❄️ 눈', '🍃 바람', '🌫️ 안개']
const MOODS   = ['😊 좋음', '😐 보통', '😢 슬픔', '😠 화남', '😴 피곤']

// 전역 저장소 — 언마운트 후에도 내용 유지
const savedDiary = {
  weather: WEATHER[0],
  mood:    MOODS[0],
  title:   '',
  text:    '',
}

// 페이지 1: 일기 작성
const DiaryPage1 = () => {
  const { date, day } = getDateInfo(1)
  const [weather, setWeather] = useState(savedDiary.weather)
  const [mood,    setMood]    = useState(savedDiary.mood)
  const [title,   setTitle]   = useState(savedDiary.title)
  const [text,    setText]    = useState(savedDiary.text)

  const handleWeather = v => { savedDiary.weather = v; setWeather(v) }
  const handleMood    = v => { savedDiary.mood    = v; setMood(v) }
  const handleTitle   = v => { savedDiary.title   = v; setTitle(v) }
  const handleText    = v => { savedDiary.text    = v; setText(v) }

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
          <select className="diary-select" value={weather} onChange={e => handleWeather(e.target.value)}>
            {WEATHER.map(w => <option key={w}>{w}</option>)}
          </select>
        </div>
        <div className="diary-meta-item">
          <span className="diary-meta-label">기분</span>
          <select className="diary-select" value={mood} onChange={e => handleMood(e.target.value)}>
            {MOODS.map(m => <option key={m}>{m}</option>)}
          </select>
        </div>
      </div>

      <input
        className="diary-title-input"
        placeholder="오늘의 일기 제목"
        maxLength={40}
        value={title}
        onChange={e => handleTitle(e.target.value)}
      />
      <div className="diary-title-line" />

      <textarea
        className="diary-textarea"
        placeholder={`오늘 하루를 기록해보세요.\n\n나의 비밀 일기장 입니다.`}
        value={text}
        onChange={e => handleText(e.target.value)}
      />
      <div className="diary-char-count">{text.length} 자</div>
    </div>
  )
}


// 샘플 일기
const SampleDiaryPage = ({ offset, weather, mood, title, text }) => {
  const { date, day } = getDateInfo(offset)
  return (
    <div className="diary-page diary-page--sample">
      <div className="diary-date-row">
        <span className="diary-date">{date}</span>
        <span className="diary-day">{day}</span>
      </div>
      <div className="diary-header-line" />

      <div className="diary-meta-row">
        <div className="diary-meta-item">
          <span className="diary-meta-label">날씨</span>
          <span className="diary-meta-value">{weather}</span>
        </div>
        <div className="diary-meta-item">
          <span className="diary-meta-label">기분</span>
          <span className="diary-meta-value">{mood}</span>
        </div>
      </div>

      <div className="diary-sample-title">{title}</div>
      <div className="diary-title-line" />

      <div className="diary-sample-text">
        {text.split('\n').map((line, i) =>
          line ? <p key={i}>{line}</p> : <br key={i} />
        )}
      </div>
    </div>
  )
}


// 샘플 일기 데이터 (1일 전, 2일 전, 3일 전)
const SAMPLE_DIARIES = [
  {
    offset:  -1,
    weather: '🌤 구름조금',
    mood:    '😢 슬픔',
    title:   '그냥 그런 하루',
    text:
`점심 시간에 편의점에서 그와 잠깐 눈이 마주쳤다.
별일 아닌데 발걸음이 이상하게 느려졌다.
지수가 뭐라고 말을 걸었는데 제대로 못 들었다.
그냥 그런 날이었다.`
  },
  {
    offset:  -2,
    weather: '☀️ 맑음',
    mood:    '😐 보통',
    title:   '도서관',
    text:
`퇴근하고 도서관 갔더니 그가 창가에 앉아 있었다.
모르는 척 멀리 앉아, 같은 줄을 몇 번이나 읽었는지 모르겠다.
그는 조용히 책만 읽다가 먼저 나갔다. 별일 없었다.`
  },
  {
    offset:  -3,
    weather: '🌧 비',
    mood:    '😊 좋음',
    title:   '우산',
    text:
`갑자기 비가 엄청 쏟아졌는데 우산을 못 챙겼다.
현관 앞에 서 있었더니 그가 우산을 같이 쓰자고 했다.
아무 말도 못하고 같이 걸어갔지만 기분이 좋았다.
그는 헤어질 때 "다음엔 꼭 챙겨와요" 라며 웃으며 인사했다.
그의 어깨가 조금 젖어 있었다.`
  },
]


// 메인 컴포넌트 — pageNum: 1=작성, 2~4=샘플
const Diary = ({ pageNum = 1 }) => {
  if (pageNum === 1) return <DiaryPage1 />
  const sample = SAMPLE_DIARIES[pageNum - 2]
  if (!sample) return null
  return <SampleDiaryPage {...sample} />
}

export default Diary
