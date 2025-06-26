'use client';

import TimelineChart from './TimelineChart';

// 샘플 데이터
const sampleSchedules = [
  {
    id: '1',
    title: '개발 미팅',
    startTime: '09:00',
    endTime: '10:30',
    type: 'primary' as const
  },
  {
    id: '2',
    title: '코드 리뷰',
    startTime: '09:00',
    endTime: '09:30',
    type: 'secondary' as const
  },
  {
    id: '3',
    title: '점심 시간',
    startTime: '12:00',
    endTime: '13:00',
    type: 'primary' as const
  },
  {
    id: '4',
    title: '브레인스토밍',
    startTime: '10:00',
    endTime: '11:00',
    type: 'secondary' as const
  },
  {
    id: '5',
    title: '프로젝트 개발',
    startTime: '14:00',
    endTime: '17:00',
    type: 'primary' as const
  },
  {
    id: '6',
    title: '팀 스탠드업',
    startTime: '13:00',
    endTime: '13:30',
    type: 'secondary' as const
  },
  {
    id: '7',
    title: '문서 작성',
    startTime: '17:00',
    endTime: '18:00',
    type: 'primary' as const
  },
  {
    id: '8',
    title: '퀵 미팅',
    startTime: '14:00',
    endTime: '14:30',
    type: 'secondary' as const
  },
  {
    id: '9',
    title: '집중 작업',
    startTime: '15:00',
    endTime: '15:30',
    type: 'secondary' as const
  },
  {
    id: '10',
    title: '1:1 미팅',
    startTime: '17:00',
    endTime: '17:30',
    type: 'secondary' as const
  }
];

export default function TimelineExample() {
  const today = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });

  return (
    <div className="p-4">
      <TimelineChart schedules={sampleSchedules} date={today} />
    </div>
  );
}