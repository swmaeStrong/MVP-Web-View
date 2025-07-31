'use client';

import { useTheme } from '@/hooks/ui/useTheme';
import { spacing } from '@/styles/design-system';
import GroupSidebar from '@/components/group/GroupSidebar';
import { useMyGroups } from '@/hooks/queries/useMyGroups';

interface GroupLayoutProps {
  children: React.ReactNode;
}

export default function GroupLayout({ children }: GroupLayoutProps) {
  const { getThemeClass } = useTheme();
  const { data: groups, isLoading, error } = useMyGroups();

  return (
    <div className={`min-h-screen ${getThemeClass('background')}`}>
      <div className="flex">
        {/* Sidebar */}
        <GroupSidebar groups={groups || []} isLoading={isLoading} error={error} />
        
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