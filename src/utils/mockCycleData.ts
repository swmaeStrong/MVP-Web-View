import { CycleData, CycleSegment } from '@/types/cycle';

export const generateMockCycles = (date: string): CycleData[] => {
  const cycles: CycleData[] = [];
  const baseDate = new Date(date);
  
  // Generate 5-8 cycles for the day
  const cycleCount = Math.floor(Math.random() * 4) + 5;
  
  const categories = [
    { name: 'Development', color: '#9333ea' },
    { name: 'Documentation', color: '#6366f1' },
    { name: 'LLM', color: '#06b6d4' },
    { name: 'Design', color: '#f59e0b' },
    { name: 'Browsing', color: '#10b981' },
    { name: 'Communication', color: '#ec4899' }
  ];

  let currentTime = new Date(baseDate);
  currentTime.setHours(9, 0, 0, 0); // Start at 9 AM

  for (let i = 0; i < cycleCount; i++) {
    const duration = Math.floor(Math.random() * 75) + 25; // 25-100 minutes
    const startTime = new Date(currentTime);
    const endTime = new Date(currentTime.getTime() + duration * 60000);
    
    // Generate segments for this cycle
    const segments: CycleSegment[] = [];
    let segmentTime = new Date(startTime);
    let remainingMinutes = duration;
    
    while (remainingMinutes > 0) {
      // Randomly choose segment type (only work, break, afk)
      const rand = Math.random();
      let segmentType: 'work' | 'break' | 'afk';
      let segmentDuration: number;
      
      if (rand < 0.75) {
        // 75% chance of work
        segmentType = 'work';
        segmentDuration = Math.min(Math.floor(Math.random() * 25) + 10, remainingMinutes); // 10-35 minutes
      } else if (rand < 0.9) {
        // 15% chance of break
        segmentType = 'break';
        segmentDuration = Math.min(Math.floor(Math.random() * 10) + 5, remainingMinutes); // 5-15 minutes
      } else {
        // 10% chance of AFK
        segmentType = 'afk';
        segmentDuration = Math.min(Math.floor(Math.random() * 8) + 2, remainingMinutes); // 2-10 minutes
      }
      
      const segmentStart = new Date(segmentTime);
      const segmentEnd = new Date(segmentTime.getTime() + segmentDuration * 60000);
      
      const segment: CycleSegment = {
        type: segmentType,
        startTime: segmentStart.toISOString(),
        endTime: segmentEnd.toISOString(),
        duration: segmentDuration
      };
      
      // Add category and color for work segments
      if (segmentType === 'work') {
        const category = categories[Math.floor(Math.random() * categories.length)];
        segment.category = category.name;
        segment.color = category.color;
      }
      
      segments.push(segment);
      segmentTime = segmentEnd;
      remainingMinutes -= segmentDuration;
    }
    
    // Calculate totals
    const breakTime = segments.filter(s => s.type === 'break').reduce((sum, s) => sum + s.duration, 0);
    const afkTime = segments.filter(s => s.type === 'afk').reduce((sum, s) => sum + s.duration, 0);
    const transitionTime = 0; // No transition segments
    
    // Generate category summary from work segments
    const categoryMap = new Map<string, { duration: number, color: string }>();
    segments.filter(s => s.type === 'work' && s.category).forEach(segment => {
      const existing = categoryMap.get(segment.category!) || { duration: 0, color: segment.color! };
      categoryMap.set(segment.category!, {
        duration: existing.duration + segment.duration,
        color: segment.color!
      });
    });
    
    const cycleCategories = Array.from(categoryMap.entries()).map(([name, data]) => ({
      name,
      duration: data.duration,
      percentage: Math.round((data.duration / duration) * 100),
      color: data.color
    })).sort((a, b) => b.duration - a.duration);

    // 연속된 같은 타입의 세그먼트 병합
    const mergedSegments: CycleSegment[] = [];
    segments.forEach(segment => {
      const lastSegment = mergedSegments[mergedSegments.length - 1];
      
      // 이전 세그먼트와 같은 타입이고 연속된 시간이면 병합
      if (lastSegment && 
          lastSegment.type === segment.type && 
          new Date(lastSegment.endTime).getTime() === new Date(segment.startTime).getTime()) {
        lastSegment.endTime = segment.endTime;
        lastSegment.duration += segment.duration;
      } else {
        mergedSegments.push({ ...segment });
      }
    });

    cycles.push({
      id: (i + 1).toString(),
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      duration,
      segments: mergedSegments,
      categories: cycleCategories,
      totalProductivity: Math.floor(Math.random() * 30) + 70, // 70-100
      focusScore: Math.floor(Math.random() * 25) + 75, // 75-100
      breakTime,
      afkTime,
      transitionTime
    });

    // Add break time between cycles
    currentTime = new Date(endTime.getTime() + (Math.floor(Math.random() * 30) + 10) * 60000);
  }

  return cycles;
};