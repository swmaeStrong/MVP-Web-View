'use client'

import { Avatar, AvatarFallback } from '@/shadcn/ui/avatar'
import { Badge } from '@/shadcn/ui/badge'
import { Button } from '@/shadcn/ui/button'
import { Card, CardContent } from '@/shadcn/ui/card'
import { Progress } from '@radix-ui/react-progress'
import { useEffect, useState } from 'react'

// 전체 사용자 데이터 (카테고리별로 분리)
const allUsersData = [
  {
    id: 1,
    name: 'Alex',
    hours: 9.2,
    avatar: 'A',
    isMe: false,
    category: '개발',
    trend: '+0.3',
  },
  {
    id: 2,
    name: 'Sarah',
    hours: 8.7,
    avatar: 'S',
    isMe: false,
    category: '디자인',
    trend: '+0.1',
  },
  {
    id: 3,
    name: '민수',
    hours: 8.5,
    avatar: '민',
    isMe: false,
    category: '개발',
    trend: '+0.5',
  },
  {
    id: 4,
    name: '나',
    hours: 8.2,
    avatar: '나',
    isMe: true,
    category: '개발',
    trend: '+0.2',
  },
  {
    id: 5,
    name: 'Emma',
    hours: 7.8,
    avatar: 'E',
    isMe: false,
    category: '회의',
    trend: '+0.4',
  },
  {
    id: 6,
    name: '지현',
    hours: 7.3,
    avatar: '지',
    isMe: false,
    category: '디자인',
    trend: '+0.1',
  },
  {
    id: 7,
    name: 'Chris',
    hours: 6.9,
    avatar: 'C',
    isMe: false,
    category: '기타',
    trend: '+0.2',
  },
  {
    id: 8,
    name: '수진',
    hours: 6.4,
    avatar: '수',
    isMe: false,
    category: '회의',
    trend: '+0.3',
  },
  {
    id: 9,
    name: 'David',
    hours: 7.9,
    avatar: 'D',
    isMe: false,
    category: '개발',
    trend: '+0.4',
  },
  {
    id: 10,
    name: '혜진',
    hours: 7.1,
    avatar: '혜',
    isMe: false,
    category: '디자인',
    trend: '+0.2',
  },
  {
    id: 11,
    name: 'Michael',
    hours: 6.8,
    avatar: 'M',
    isMe: false,
    category: '회의',
    trend: '+0.1',
  },
  {
    id: 12,
    name: '준호',
    hours: 6.2,
    avatar: '준',
    isMe: false,
    category: '기타',
    trend: '+0.3',
  },
]

const categories = [
  { id: 'all', name: '전체', icon: '🏆', description: '모든 분야 통합 순위' },
  { id: '개발', name: '개발', icon: '💻', description: '코딩의 왕을 가려라!' },
  {
    id: '디자인',
    name: '디자인',
    icon: '🎨',
    description: '창작의 신을 찾아라!',
  },
  { id: '회의', name: '회의', icon: '🤝', description: '소통의 달인은 누구?' },
  { id: '기타', name: '기타', icon: '📋', description: '만능 플레이어 대결!' },
]

const categoryColors = {
  all: 'bg-gradient-to-r from-purple-500 to-blue-500',
  개발: 'bg-gradient-to-r from-purple-500 to-purple-600',
  디자인: 'bg-gradient-to-r from-blue-500 to-blue-600',
  회의: 'bg-gradient-to-r from-green-500 to-green-600',
  기타: 'bg-gradient-to-r from-gray-500 to-gray-600',
}

const categoryBadgeColors = {
  all: 'bg-purple-100 text-purple-700',
  개발: 'bg-purple-100 text-purple-700',
  디자인: 'bg-blue-100 text-blue-700',
  회의: 'bg-green-100 text-green-700',
  기타: 'bg-gray-100 text-gray-700',
}

const motivationalMessages = {
  all: [
    '🔥 전체 순위에서 승부하라!',
    '⚡ 모든 분야의 강자들이 모였다!',
    '👑 진정한 올라운더는 누구인가?',
  ],
  개발: [
    '💻 코드로 말하는 시간!',
    '🚀 버그보다 빠르게!',
    '⌨️ 키보드가 불타고 있다!',
  ],
  디자인: [
    '🎨 창의력이 폭발한다!',
    '✨ 픽셀 하나하나가 예술!',
    '🖌️ 상상력의 한계를 뛰어넘어라!',
  ],
  회의: [
    '🗣️ 말로써 세상을 바꾼다!',
    '🤝 협력의 마스터들!',
    '💬 소통의 힘을 보여줘!',
  ],
  기타: [
    '🌟 숨겨진 보석들의 전장!',
    '🎯 다재다능함의 진수!',
    '💪 만능 스킬의 향연!',
  ],
}

const rankTitles = {
  1: '👑 절대강자',
  2: '🥈 도전자',
  3: '🥉 상승세',
  4: '🔥 핫한놈',
  5: '⚡ 급상승',
}

export default function Leaderboard() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [motivationIndex, setMotivationIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // 동기부여 메시지 회전
  useEffect(() => {
    const messageTimer = setInterval(() => {
      setMotivationIndex(
        prev =>
          (prev + 1) %
          motivationalMessages[
            selectedCategory as keyof typeof motivationalMessages
          ].length
      )
    }, 3000)

    return () => clearInterval(messageTimer)
  }, [selectedCategory])

  const getFilteredData = () => {
    if (selectedCategory === 'all') {
      return allUsersData.sort((a, b) => b.hours - a.hours)
    }
    return allUsersData
      .filter(user => user.category === selectedCategory)
      .sort((a, b) => b.hours - a.hours)
  }

  const filteredData = getFilteredData()
  const myRank = filteredData.findIndex(user => user.isMe) + 1
  const currentCategory = categories.find(cat => cat.id === selectedCategory)

  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4 sm:p-6 lg:p-8'>
      <div className='mx-auto max-w-4xl space-y-6 sm:space-y-8'>
        {/* 헤더 */}
        <div className='space-y-4 text-center'>
          <h1 className='bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl'>
            🏆 실시간 리더보드
          </h1>
          <p className='text-lg text-gray-600 sm:text-xl'>
            카테고리별 최강자를 가려라! 🔥
          </p>

          {/* 실시간 시간 및 동기부여 메시지 */}
          <div className='flex flex-col items-center gap-3'>
            <Badge className='bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg'>
              🕐 {currentTime.toLocaleTimeString('ko-KR')} 기준
            </Badge>
            <div className='animate-pulse text-lg font-bold text-purple-600'>
              {
                motivationalMessages[
                  selectedCategory as keyof typeof motivationalMessages
                ][motivationIndex]
              }
            </div>
          </div>
        </div>

        {/* 카테고리 선택 */}
        <Card className='relative rounded-2xl border-0 bg-white p-6 shadow-xl transition-all duration-300 hover:shadow-2xl sm:rounded-3xl'>
          <div className='absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-600/5 to-blue-600/5 sm:rounded-3xl'></div>
          <CardContent className='relative space-y-4 p-0'>
            <div className='mb-4 text-center'>
              <h3 className='mb-2 text-lg font-bold text-gray-800 sm:text-xl'>
                {currentCategory?.icon} {currentCategory?.name} 리더보드
              </h3>
              <p className='text-sm text-gray-600'>
                {currentCategory?.description}
              </p>
            </div>

            <div className='flex flex-wrap justify-center gap-2 sm:gap-3'>
              {categories.map(category => (
                <Button
                  key={category.id}
                  variant={
                    selectedCategory === category.id ? 'default' : 'secondary'
                  }
                  className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                    selectedCategory === category.id
                      ? categoryColors[
                          category.id as keyof typeof categoryColors
                        ] + ' text-white shadow-lg hover:shadow-xl'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.icon} {category.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 내 순위 강조 */}
        {myRank > 0 && (
          <Card className='relative rounded-2xl border-0 bg-white p-4 shadow-xl transition-all duration-300 hover:shadow-2xl sm:rounded-3xl sm:p-6'>
            <div className='absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-600/5 to-blue-600/5 sm:rounded-3xl'></div>
            <CardContent className='relative p-0'>
              <div className='space-y-3 text-center'>
                <div className='text-2xl sm:text-3xl'>🎯</div>
                <h3 className='text-lg font-bold text-gray-800 sm:text-xl'>
                  {currentCategory?.name} 분야 내 순위
                </h3>
                <div className='flex items-center justify-center gap-4'>
                  <div className='text-center'>
                    <span className='bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl'>
                      #{myRank}위
                    </span>
                    <div className='text-lg font-semibold text-gray-800'>
                      {filteredData.find(user => user.isMe)?.hours}시간
                    </div>
                  </div>
                  <div className='text-center'>
                    <div className='text-lg font-bold text-purple-600'>
                      {rankTitles[myRank as keyof typeof rankTitles] ||
                        '🌟 상위권'}
                    </div>
                    <div className='text-sm text-green-600'>
                      {filteredData.find(user => user.isMe)?.trend} 증가 중
                    </div>
                  </div>
                </div>

                {myRank === 1 ? (
                  <div className='rounded-xl bg-gradient-to-r from-yellow-100 to-amber-100 p-3'>
                    <p className='text-lg font-bold text-yellow-800'>
                      🔥 당신이 바로 이 분야의 킹! 👑
                    </p>
                  </div>
                ) : myRank <= 3 ? (
                  <div className='rounded-xl bg-gradient-to-r from-orange-100 to-red-100 p-3'>
                    <p className='font-bold text-orange-800'>
                      ⚡ TOP 3! 1위까지{' '}
                      {(
                        filteredData[0].hours -
                        (filteredData.find(user => user.isMe)?.hours || 0)
                      ).toFixed(1)}
                      시간 차이!
                    </p>
                  </div>
                ) : myRank <= 5 ? (
                  <div className='rounded-xl bg-gradient-to-r from-blue-100 to-purple-100 p-3'>
                    <p className='font-bold text-purple-800'>
                      🚀 TOP 5! 한번 더 집중해서 상위권 도전!
                    </p>
                  </div>
                ) : (
                  <div className='rounded-xl bg-gradient-to-r from-gray-100 to-slate-100 p-3'>
                    <p className='font-bold text-gray-800'>
                      💪 꾸준히 기록해서 TOP 5에 도전하세요!
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 리더보드 카드 */}
        <Card className='relative rounded-2xl border-0 bg-white shadow-xl transition-all duration-300 hover:shadow-2xl sm:rounded-3xl'>
          <div className='absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-600/5 to-blue-600/5 sm:rounded-3xl'></div>
          <CardContent className='relative p-0'>
            <div className='border-b border-purple-100 p-4 sm:p-6'>
              <div className='flex items-center justify-between'>
                <h2 className='text-xl font-bold text-gray-800 sm:text-2xl'>
                  {currentCategory?.icon} {currentCategory?.name} 순위표
                </h2>
                <div className='flex items-center gap-2'>
                  <div className='h-2 w-2 animate-pulse rounded-full bg-green-500'></div>
                  <span className='text-sm font-medium text-gray-600'>
                    LIVE
                  </span>
                </div>
              </div>
              <p className='mt-2 text-sm text-gray-600'>
                총 {filteredData.length}명이 경쟁 중 • 실시간 업데이트
              </p>
            </div>

            <div className='divide-y divide-purple-50'>
              {filteredData.slice(0, 10).map((user, index) => (
                <div
                  key={user.id}
                  className={`flex items-center px-4 py-4 transition-all duration-300 hover:bg-purple-50/50 sm:px-6 sm:py-5 ${
                    user.isMe
                      ? 'border-l-4 border-purple-400 bg-gradient-to-r from-purple-50 to-blue-50'
                      : ''
                  } ${
                    index === 0
                      ? 'border-l-4 border-yellow-400 bg-gradient-to-r from-yellow-50 to-amber-50'
                      : ''
                  }`}
                >
                  {/* 순위 */}
                  <div className='w-12 flex-shrink-0 sm:w-14'>
                    <div
                      className={`text-center text-xl font-bold sm:text-2xl ${
                        index === 0
                          ? 'text-yellow-600'
                          : index === 1
                            ? 'text-gray-500'
                            : index === 2
                              ? 'text-amber-600'
                              : 'text-purple-600'
                      }`}
                    >
                      #{index + 1}
                    </div>
                    <div className='text-center text-xs font-bold text-gray-600'>
                      {rankTitles[(index + 1) as keyof typeof rankTitles] || ''}
                    </div>
                  </div>

                  {/* 아바타 */}
                  <div className='ml-3 flex-shrink-0'>
                    <Avatar
                      className={`ring-2 ${
                        index === 0
                          ? 'ring-yellow-400'
                          : index === 1
                            ? 'ring-gray-400'
                            : index === 2
                              ? 'ring-amber-400'
                              : 'ring-purple-300'
                      } ${index < 3 ? 'shadow-lg' : 'shadow-md'} h-12 w-12 sm:h-14 sm:w-14`}
                    >
                      <AvatarFallback
                        className={`text-lg font-bold ${
                          index === 0
                            ? 'bg-yellow-100 text-yellow-800'
                            : index === 1
                              ? 'bg-gray-100 text-gray-800'
                              : index === 2
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {user.avatar}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  {/* 사용자 정보 */}
                  <div className='ml-4 min-w-0 flex-1'>
                    <div className='mb-1 flex items-center gap-2'>
                      <span
                        className={`text-lg font-semibold sm:text-xl ${
                          user.isMe ? 'text-purple-700' : 'text-gray-900'
                        }`}
                      >
                        {user.name}
                      </span>

                      {index === 0 && (
                        <Badge className='animate-bounce bg-gradient-to-r from-yellow-400 to-amber-400 text-xs font-bold text-yellow-900 shadow-md'>
                          👑 KING
                        </Badge>
                      )}

                      {user.isMe && (
                        <Badge className='bg-gradient-to-r from-purple-500 to-blue-500 text-xs font-bold text-white shadow-md'>
                          ME
                        </Badge>
                      )}
                    </div>

                    <div className='flex items-center gap-2'>
                      <Badge
                        className={`px-2 py-1 text-xs ${categoryBadgeColors[selectedCategory as keyof typeof categoryBadgeColors]}`}
                      >
                        {currentCategory?.icon}
                      </Badge>
                      <span className='flex items-center gap-1 text-sm font-medium text-green-600'>
                        {user.trend} <span className='text-xs'>🔥</span>
                      </span>
                    </div>
                  </div>

                  {/* 작업 시간 및 프로그래스 */}
                  <div className='flex flex-col items-end text-right'>
                    <span
                      className={`text-xl font-bold sm:text-2xl ${
                        index === 0
                          ? 'text-yellow-600'
                          : user.isMe
                            ? 'text-purple-600'
                            : 'text-gray-800'
                      }`}
                    >
                      {user.hours}h
                    </span>
                    <Progress
                      value={Math.round(
                        (user.hours / filteredData[0].hours) * 100
                      )}
                      className='mt-2 h-2 w-16 bg-purple-100 sm:w-20'
                    />
                    <span className='mt-1 text-xs text-gray-500'>
                      {Math.round((user.hours / filteredData[0].hours) * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 도전 메시지 */}
        <Card className='relative rounded-2xl border-0 bg-white p-4 shadow-xl transition-all duration-300 hover:shadow-2xl sm:rounded-3xl sm:p-6'>
          <div className='absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-600/5 to-blue-600/5 sm:rounded-3xl'></div>
          <CardContent className='relative p-0'>
            <div className='space-y-3 text-center'>
              <div className='text-3xl sm:text-4xl'>🚀</div>
              <h3 className='text-lg font-bold text-gray-800 sm:text-xl'>
                다음 순위까지 얼마나 남았을까요?
              </h3>
              {myRank > 1 && myRank <= filteredData.length && (
                <div className='rounded-xl bg-gradient-to-r from-orange-100 to-red-100 p-4'>
                  <p className='text-lg font-bold text-orange-800'>
                    🔥 {myRank - 1}위까지 단{' '}
                    {(
                      filteredData[myRank - 2].hours -
                      (filteredData.find(user => user.isMe)?.hours || 0)
                    ).toFixed(1)}
                    시간 차이!
                  </p>
                  <p className='mt-1 text-sm text-orange-700'>
                    조금만 더 집중하면 순위 상승! 💪
                  </p>
                </div>
              )}
              <p className='text-sm text-gray-600 sm:text-base'>
                매분매초가 소중해요. 지금 이 순간도 순위가 바뀌고 있습니다! ⚡
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
