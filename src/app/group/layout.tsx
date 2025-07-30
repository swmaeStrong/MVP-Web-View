'use client';

import { useTheme } from '@/hooks/useTheme';
import { spacing } from '@/styles/design-system';
import { Plus, Search, Settings, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

// Team data (would come from API)
const teams = [
  { id: 1, name: 'Team Alpha', members: 5, active: true },
  { id: 2, name: 'Team Beta', members: 3, active: false },
  { id: 3, name: 'Team Gamma', members: 7, active: true },
];

const navItems: NavItem[] = [
  { name: 'Find Team', href: '/group/find', icon: Search },
  { name: 'Create Team', href: '/group/create', icon: Plus },
];

const GroupSidebar = () => {
  const { getThemeClass, getThemeTextColor, getCommonCardClass } = useTheme();
  const pathname = usePathname();

  // Get selected team ID from URL
  const selectedTeamId = pathname.includes('/group/team/') 
    ? pathname.split('/group/team/')[1]?.split('/')[0] 
    : null;

  const isActive = (href: string) => {
    if (href === '/group') {
      return pathname === href;
    }
    return pathname === href || pathname.startsWith(href + '/');
  };

  // Team submenu items
  const teamSubMenuItems = [
    { name: 'Main', href: `/group/team/${selectedTeamId}`, icon: TrendingUp },
    { name: 'Settings', href: `/group/team/${selectedTeamId}/settings`, icon: Settings },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 h-full w-48 ${getThemeClass('component')} ${getThemeClass('border')} border-r z-40`}
    >
      <div className="p-4 h-full flex flex-col">
        {/* Teams Section */}
        <div className="mb-6 pb-4 border-b border-gray-600">
          <h3 className={`text-xs font-semibold ${getThemeTextColor('secondary')} uppercase tracking-wider mb-3 px-4`}>
            My Teams
          </h3>
          <div className="space-y-1">
            {teams.map((team) => {
              const isTeamSelected = selectedTeamId === team.id.toString();
              
              return (
                <div key={team.id}>
                  <Link
                    href={`/group/team/${team.id}`}
                    className={`flex items-center justify-between px-4 py-2 rounded-md transition-colors ${
                      isTeamSelected
                        ? `${getThemeClass('border')} text-white bg-[#3F72AF] ring-2 ring-[#3F72AF]`
                        : `${getThemeTextColor('secondary')} hover:${getThemeClass('border')} hover:${getThemeTextColor('primary')}`
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm truncate">{team.name}</span>
                    </div>
                    <span className={`text-xs ${isTeamSelected ? 'text-white' : getThemeTextColor('secondary')}`}>
                      {team.members}
                    </span>
                  </Link>
                  
                  {/* Team Submenu - Show right below the selected team */}
                  {isTeamSelected && (
                    <div className="ml-4 mt-1 space-y-1">
                      {teamSubMenuItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.href);
                        
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-1.5 transition-colors ${
                              active
                                ? `${getThemeTextColor('primary')} border-b-2 border-[#3F72AF]`
                                : `${getThemeTextColor('secondary')} hover:${getThemeTextColor('primary')}`
                            }`}
                          >
                            <Icon size={14} className="flex-shrink-0" />
                            <span className="text-xs">{item.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                  active
                    ? `text-white bg-[#3F72AF] ring-2 ring-[#3F72AF]`
                    : `${getThemeTextColor('secondary')} hover:${getThemeClass('border')} hover:${getThemeTextColor('primary')}`
                }`}
              >
                <Icon size={20} className="flex-shrink-0" />
                <span className="text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

      </div>
    </aside>
  );
};

interface GroupLayoutProps {
  children: React.ReactNode;
}

export default function GroupLayout({ children }: GroupLayoutProps) {
  const { getThemeClass } = useTheme();

  return (
    <div className={`min-h-screen ${getThemeClass('background')}`}>
      <div className="flex">
        {/* Sidebar */}
        <GroupSidebar />
        
        {/* Main Content */}
        <div className="flex-1 ml-48">
          <main className={`${spacing.inner.normal} transition-all duration-300`}>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}