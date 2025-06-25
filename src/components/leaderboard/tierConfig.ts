// 티어별 CSS 애니메이션 정의
export const tierAnimationStyles = `
  @keyframes challenger-inner-glow {
    0% { 
      background: linear-gradient(135deg, 
        rgba(254, 240, 138, 0.25) 0%, 
        rgba(252, 211, 77, 0.15) 25%, 
        rgba(147, 197, 253, 0.15) 75%, 
        rgba(219, 234, 254, 0.25) 100%);
    }
    25% { 
      background: linear-gradient(135deg, 
        rgba(254, 240, 138, 0.3) 0%, 
        rgba(252, 211, 77, 0.2) 25%, 
        rgba(147, 197, 253, 0.2) 75%, 
        rgba(219, 234, 254, 0.3) 100%);
    }
    50% { 
      background: linear-gradient(135deg, 
        rgba(254, 240, 138, 0.35) 0%, 
        rgba(252, 211, 77, 0.25) 25%, 
        rgba(147, 197, 253, 0.25) 75%, 
        rgba(219, 234, 254, 0.35) 100%);
    }
    75% { 
      background: linear-gradient(135deg, 
        rgba(254, 240, 138, 0.3) 0%, 
        rgba(252, 211, 77, 0.2) 25%, 
        rgba(147, 197, 253, 0.2) 75%, 
        rgba(219, 234, 254, 0.3) 100%);
    }
    100% { 
      background: linear-gradient(135deg, 
        rgba(254, 240, 138, 0.25) 0%, 
        rgba(252, 211, 77, 0.15) 25%, 
        rgba(147, 197, 253, 0.15) 75%, 
        rgba(219, 234, 254, 0.25) 100%);
    }
  }

  @keyframes grandmaster-inner-glow {
    0% { 
      background: linear-gradient(135deg, 
        rgba(254, 202, 202, 0.25) 0%, 
        rgba(252, 165, 165, 0.15) 25%, 
        rgba(251, 207, 232, 0.15) 75%, 
        rgba(253, 230, 138, 0.25) 100%);
    }
    25% { 
      background: linear-gradient(135deg, 
        rgba(254, 202, 202, 0.3) 0%, 
        rgba(252, 165, 165, 0.2) 25%, 
        rgba(251, 207, 232, 0.2) 75%, 
        rgba(253, 230, 138, 0.3) 100%);
    }
    50% { 
      background: linear-gradient(135deg, 
        rgba(254, 202, 202, 0.35) 0%, 
        rgba(252, 165, 165, 0.25) 25%, 
        rgba(251, 207, 232, 0.25) 75%, 
        rgba(253, 230, 138, 0.35) 100%);
    }
    75% { 
      background: linear-gradient(135deg, 
        rgba(254, 202, 202, 0.3) 0%, 
        rgba(252, 165, 165, 0.2) 25%, 
        rgba(251, 207, 232, 0.2) 75%, 
        rgba(253, 230, 138, 0.3) 100%);
    }
    100% { 
      background: linear-gradient(135deg, 
        rgba(254, 202, 202, 0.25) 0%, 
        rgba(252, 165, 165, 0.15) 25%, 
        rgba(251, 207, 232, 0.15) 75%, 
        rgba(253, 230, 138, 0.25) 100%);
    }
  }

  @keyframes master-inner-glow {
    0% { 
      background: linear-gradient(135deg, 
        rgba(221, 214, 254, 0.25) 0%, 
        rgba(196, 181, 253, 0.15) 25%, 
        rgba(199, 210, 254, 0.15) 75%, 
        rgba(224, 231, 255, 0.25) 100%);
    }
    25% { 
      background: linear-gradient(135deg, 
        rgba(221, 214, 254, 0.3) 0%, 
        rgba(196, 181, 253, 0.2) 25%, 
        rgba(199, 210, 254, 0.2) 75%, 
        rgba(224, 231, 255, 0.3) 100%);
    }
    50% { 
      background: linear-gradient(135deg, 
        rgba(221, 214, 254, 0.35) 0%, 
        rgba(196, 181, 253, 0.25) 25%, 
        rgba(199, 210, 254, 0.25) 75%, 
        rgba(224, 231, 255, 0.35) 100%);
    }
    75% { 
      background: linear-gradient(135deg, 
        rgba(221, 214, 254, 0.3) 0%, 
        rgba(196, 181, 253, 0.2) 25%, 
        rgba(199, 210, 254, 0.2) 75%, 
        rgba(224, 231, 255, 0.3) 100%);
    }
    100% { 
      background: linear-gradient(135deg, 
        rgba(221, 214, 254, 0.25) 0%, 
        rgba(196, 181, 253, 0.15) 25%, 
        rgba(199, 210, 254, 0.15) 75%, 
        rgba(224, 231, 255, 0.25) 100%);
    }
  }

  @keyframes diamond-inner-glow {
    0% { 
      background: linear-gradient(135deg, 
        rgba(219, 234, 254, 0.25) 0%, 
        rgba(147, 197, 253, 0.15) 25%, 
        rgba(165, 243, 252, 0.15) 75%, 
        rgba(224, 242, 254, 0.25) 100%);
    }
    25% { 
      background: linear-gradient(135deg, 
        rgba(219, 234, 254, 0.3) 0%, 
        rgba(147, 197, 253, 0.2) 25%, 
        rgba(165, 243, 252, 0.2) 75%, 
        rgba(224, 242, 254, 0.3) 100%);
    }
    50% { 
      background: linear-gradient(135deg, 
        rgba(219, 234, 254, 0.35) 0%, 
        rgba(147, 197, 253, 0.25) 25%, 
        rgba(165, 243, 252, 0.25) 75%, 
        rgba(224, 242, 254, 0.35) 100%);
    }
    75% { 
      background: linear-gradient(135deg, 
        rgba(219, 234, 254, 0.3) 0%, 
        rgba(147, 197, 253, 0.2) 25%, 
        rgba(165, 243, 252, 0.2) 75%, 
        rgba(224, 242, 254, 0.3) 100%);
    }
    100% { 
      background: linear-gradient(135deg, 
        rgba(219, 234, 254, 0.25) 0%, 
        rgba(147, 197, 253, 0.15) 25%, 
        rgba(165, 243, 252, 0.15) 75%, 
        rgba(224, 242, 254, 0.25) 100%);
    }
  }
`;

// 티어별 설정
export const tierConfig = {
  challenger: {
    icon: '/icons/rank/challenger.png',
    title: 'CHALLENGER',
    borderClass: 'border border-yellow-200',
    glowAnimation: 'challenger-inner-glow 6s ease-in-out infinite',
    rankBg: 'bg-gradient-to-r from-yellow-400 to-blue-500',
    rankText: 'text-white',
    nameColor:
      'text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-blue-600 font-extrabold',
  },
  grandmaster: {
    icon: '/icons/rank/grandMaster.png',
    title: 'GRANDMASTER',
    borderClass: 'border border-red-200',
    glowAnimation: 'grandmaster-inner-glow 7s ease-in-out infinite',
    rankBg: 'bg-gradient-to-r from-red-400 to-rose-500',
    rankText: 'text-white font-bold',
    nameColor:
      'text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-600 font-extrabold',
  },
  master: {
    icon: '/icons/rank/master.png',
    title: 'MASTER',
    borderClass: 'border border-purple-200',
    glowAnimation: 'master-inner-glow 8s ease-in-out infinite',
    rankBg: 'bg-gradient-to-r from-purple-500 to-indigo-500',
    rankText: 'text-white font-bold',
    nameColor:
      'text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 font-extrabold',
  },
  diamond: {
    icon: '/icons/rank/diamond.png',
    title: 'DIAMOND',
    borderClass: 'border border-blue-200',
    glowAnimation: 'diamond-inner-glow 9s ease-in-out infinite',
    rankBg: 'bg-gradient-to-r from-blue-400 to-cyan-500',
    rankText: 'text-white font-bold',
    nameColor:
      'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 font-bold',
  },
  emerald: {
    icon: '/icons/rank/emerald.png',
    title: 'EMERALD',
    borderClass: 'border border-emerald-200',
    glowAnimation: '',
    rankBg: 'bg-transparent border-emerald-100',
    rankText: 'text-emerald-500 font-bold',
    nameColor: 'text-emerald-600 font-bold',
  },
  platinum: {
    icon: '/icons/rank/platinum.png',
    title: 'PLATINUM',
    borderClass: 'border border-slate-200',
    glowAnimation: '',
    rankBg: 'bg-transparent border-slate-100',
    rankText: 'text-slate-500 font-bold',
    nameColor: 'text-slate-600 font-bold',
  },
  gold: {
    icon: '/icons/rank/gold.png',
    title: 'GOLD',
    borderClass: 'border border-gray-200',
    glowAnimation: '',
    rankBg: '',
    rankText: 'text-gray-600',
    nameColor: 'text-gray-700',
  },
  silver: {
    icon: '/icons/rank/silver.png',
    title: 'SILVER',
    borderClass: 'border border-gray-200',
    glowAnimation: '',
    rankBg: '',
    rankText: 'text-gray-600',
    nameColor: 'text-gray-700',
  },
  bronze: {
    icon: '/icons/rank/bronze.png',
    title: 'BRONZE',
    borderClass: 'border border-gray-200',
    glowAnimation: '',
    rankBg: '',
    rankText: 'text-gray-600',
    nameColor: 'text-gray-700',
  },
} as const;

export type TierType = keyof typeof tierConfig;

// 순위에 따른 티어 계산
export const getTierByRank = (rank: number, totalUsers: number): TierType => {
  const percentage = (rank / totalUsers) * 100;

  if (percentage <= 1) return 'challenger';
  if (percentage <= 3) return 'grandmaster';
  if (percentage <= 5) return 'master';
  if (percentage <= 10) return 'diamond';
  if (percentage <= 15) return 'emerald';
  if (percentage <= 30) return 'platinum';
  if (percentage <= 50) return 'gold';
  if (percentage <= 80) return 'silver';
  return 'bronze';
};

// 티어별 스타일 가져오기
export const getTierStyle = (rank: number, totalUsers: number) => {
  const tier = getTierByRank(rank, totalUsers);
  return tierConfig[tier];
};
