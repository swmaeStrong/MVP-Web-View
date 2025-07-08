export interface ProcessedDetail {
  category: string;
  score: number;
  percentage: number;
}

// 카테고리 표시명 변환
export function getCategoryDisplayName(category: string): string {
  const displayNames: { [key: string]: string } = {
    'development': 'Development',
    'design': 'Design',
    'documentation': 'Documentation',
    'llm': 'LLM',
    'others': 'Others'
  };
  return displayNames[category.toLowerCase()] || category;
}

// 점수를 분 단위로 변환 (소수점 제거)
export function formatScoreToMinutes(score: number): string {
  const minutes = Math.floor(score / 60);
  return `${minutes}m`;
}

export function processLeaderboardDetails(
  details: Array<{ category: string; score: number }>
): ProcessedDetail[] {
  if (!details || details.length === 0) {
    return [];
  }

  // 전체 점수 계산
  const totalScore = details.reduce((sum, item) => sum + item.score, 0);
  
  // 점수가 0인 경우 처리
  if (totalScore === 0) {
    return details.map(item => ({
      ...item,
      percentage: 0
    }));
  }

  const sortedDetails = [...details].sort((a, b) => b.score - a.score);

  if (sortedDetails.length <= 2) {
    return sortedDetails.map(item => ({
      ...item,
      percentage: Math.round((item.score / totalScore) * 100)
    }));
  }

  const topTwo = sortedDetails.slice(0, 2);
  const others = sortedDetails.slice(2);
  const othersSum = others.reduce((sum, item) => sum + item.score, 0);

  return [
    ...topTwo.map(item => ({
      ...item,
      percentage: Math.round((item.score / totalScore) * 100)
    })),
    {
      category: 'others',
      score: othersSum,
      percentage: Math.round((othersSum / totalScore) * 100)
    },
  ];
}