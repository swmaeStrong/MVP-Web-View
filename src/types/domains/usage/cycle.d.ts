export interface CycleSegment {
  id?: string;
  type: 'work' | 'distraction' | 'afk';
  category?: string;
  startTime: string;
  endTime: string;
  duration: number; // minutes
  color?: string;
}

export interface CycleData {
  id: string;
  startTime: string;
  endTime: string;
  duration: number; // minutes
  segments: CycleSegment[];
  categories?: {
    name: string;
    duration: number; // minutes
    percentage: number;
    color: string;
  }[];
  totalProductivity: number; // 0-100
  focusScore?: number; // 0-100
  breakTime: number; // minutes
  afkTime: number; // minutes
  transitionTime?: number; // minutes
  title?: string; // 세션 제목
}

export interface CycleCarouselProps {
  cycles: CycleData[];
  currentCycleIndex: number;
  onCycleChange: (index: number) => void;
}