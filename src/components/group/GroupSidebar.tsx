'use client';

import { useTheme } from '@/hooks/ui/useTheme';
import { Plus, Search, Settings, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

interface Group {
  id: number;
  name: string;
  members: number;
  active: boolean;
}

interface GroupSidebarProps {
  teams: Group[];
}

const navItems: NavItem[] = [
  { name: 'Find Group', href: '/group/find', icon: Search },
  { name: 'Create Group', href: '/group/create', icon: Plus },
];

export default function GroupSidebar({ teams }: GroupSidebarProps) {
  const { getThemeClass, getThemeTextColor } = useTheme();
  const pathname = usePathname();

  // Get selected group ID from URL
  const selectedGroupId = pathname.includes('/group/team/') 
    ? pathname.split('/group/team/')[1]?.split('/')[0] 
    : null;

  const isActive = (href: string) => {
    if (href === '/group') {
      return pathname === href;
    }
    return pathname === href || pathname.startsWith(href + '/');
  };

  // Group submenu items
  const groupSubMenuItems = [
    { name: 'Main', href: `/group/team/${selectedGroupId}`, icon: TrendingUp },
    { name: 'Settings', href: `/group/team/${selectedGroupId}/settings`, icon: Settings },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 h-full w-48 ${getThemeClass('component')} ${getThemeClass('border')} border-r z-40`}
    >
      <div className="p-4 h-full flex flex-col">
        {/* Groups Section */}
        <div className="mb-6 pb-4 border-b border-gray-600">
          <div className={`text-xs font-semibold ${getThemeTextColor('secondary')} uppercase tracking-wider mb-3 px-4`}>
            My Groups
          </div>
          <div className="space-y-1">
            {teams.map((group) => {
              const isGroupSelected = selectedGroupId === group.id.toString();
              
              return (
                <div key={group.id}>
                  <Link
                    href={`/group/team/${group.id}`}
                    className={`flex items-center justify-between px-4 py-2 rounded-md transition-colors duration-200 ${
                      isGroupSelected
                        ? `text-white bg-[#3F72AF]`
                        : `${getThemeTextColor('secondary')} hover:${getThemeTextColor('primary')}`
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm truncate">{group.name}</span>
                    </div>
                    <span className={`text-xs ${isGroupSelected ? 'text-white' : getThemeTextColor('secondary')}`}>
                      {group.members}
                    </span>
                  </Link>
                  
                  {/* Group Submenu - Show right below the selected group */}
                  {isGroupSelected && (
                    <div className="ml-4 mt-1 space-y-1">
                      {groupSubMenuItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.href);
                        
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-1.5 rounded transition-colors duration-150 relative ${
                              active
                                ? `${getThemeTextColor('primary')} font-medium`
                                : `${getThemeTextColor('secondary')} hover:${getThemeTextColor('primary')}`
                            }`}
                          >
                            {/* Simple active indicator */}
                            <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                              active ? 'bg-[#3F72AF]' : 'bg-transparent'
                            }`} />
                            
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
}