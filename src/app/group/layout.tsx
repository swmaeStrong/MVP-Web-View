'use client';

import { useTheme } from '@/hooks/ui/useTheme';
import { spacing } from '@/styles/design-system';
import GroupSidebar from '@/components/group/GroupSidebar';

// Team data (would come from API)
const teams = [
  { id: 1, name: 'Team Alpha', members: 5, active: true },
  { id: 2, name: 'Team Beta', members: 3, active: false },
  { id: 3, name: 'Team Gamma', members: 7, active: true },
];

interface GroupLayoutProps {
  children: React.ReactNode;
}

export default function GroupLayout({ children }: GroupLayoutProps) {
  const { getThemeClass } = useTheme();

  return (
    <div className={`min-h-screen ${getThemeClass('background')}`}>
      <div className="flex">
        {/* Sidebar */}
        <GroupSidebar teams={teams} />
        
        {/* Main Content */}
        <div className="flex-1 ml-40">
          <main className={`${spacing.inner.normal} transition-all duration-300`}>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}