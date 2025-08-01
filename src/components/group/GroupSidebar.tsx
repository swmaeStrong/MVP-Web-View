'use client';

import { useTheme } from '@/hooks/ui/useTheme';
import { Plus, Search, Settings, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCurrentUser } from '@/stores/userStore';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

interface GroupSidebarProps {
  groups: Group.GroupApiResponse[];
  error: any;
  isLoading?: boolean;
}

const navItems: NavItem[] = [
  { name: 'Search', href: '/group/find', icon: Search },
  { name: 'Create', href: '/group/create', icon: Plus },
];

export default function GroupSidebar({ groups, isLoading, error }: GroupSidebarProps) {
  const { getThemeClass, getThemeTextColor } = useTheme();
  const pathname = usePathname();
  const currentUser = useCurrentUser();

  // Get selected group ID from URL
  const selectedGroupId = pathname.includes('/group/team/') 
    ? pathname.split('/group/team/')[1]?.split('/')[0] 
    : null;

  const isActive = (href: string) => {
    if (href === '/group') {
      return pathname === href;
    }
    
    // 그룹 서브메뉴의 경우 정확한 매칭 필요
    if (href.includes('/group/team/')) {
      // Main 페이지: 정확히 해당 경로만 매칭
      if (href.endsWith(`/group/team/${selectedGroupId}`)) {
        return pathname === href;
      }
      // Settings 페이지: settings로 끝나는 경우만 매칭
      if (href.endsWith('/settings')) {
        return pathname === href;
      }
    }
    
    // 기타 경로는 기존 로직 유지
    return pathname === href || pathname.startsWith(href + '/');
  };

  // 현재 선택된 그룹 찾기
  const selectedGroup = groups.find(group => group.groupId.toString() === selectedGroupId);
  
  // 현재 사용자가 그룹장인지 확인
  const isGroupOwner = selectedGroup && currentUser && selectedGroup.groupOwner.userId === currentUser.id;

  // Group submenu items - 그룹장만 Settings 메뉴 표시
  const groupSubMenuItems = [
    { name: 'Main', href: `/group/team/${selectedGroupId}`, icon: TrendingUp },
    ...(isGroupOwner ? [{ name: 'Settings', href: `/group/team/${selectedGroupId}/settings`, icon: Settings }] : []),
  ];

  return (
    <aside
      className={`fixed top-0 left-0 h-full w-40 ${getThemeClass('component')} ${getThemeClass('border')} border-r z-40`}
    >
      <div className="p-4 h-full flex flex-col">
        {/* Groups Section */}
        <div className="mb-6 pb-4 border-b border-gray-600">
          <div className={`text-xs font-semibold ${getThemeTextColor('secondary')} uppercase tracking-wider mb-3 px-4`}>
            My Groups
          </div>
          <div className="space-y-1">
            {error && (
              <div className="px-4 py-2">
                <span className={`text-xs ${getThemeTextColor('secondary')}`}>
                  Failed to load groups
                </span>
              </div>
            )}
            
            {!error && groups.length === 0 && (
              <div className="px-4 py-2">
                <span className={`text-xs ${getThemeTextColor('secondary')}`}>
                  No groups yet
                </span>
              </div>
            )}
            
            {!error && groups.map((group) => {
              const isGroupSelected = selectedGroupId === group.groupId.toString();
              
              return (
                <div key={group.groupId}>
                  <Link
                    href={`/group/team/${group.groupId}`}
                    className={`flex items-center justify-between px-4 py-2 rounded-md transition-all duration-200 transform ${
                      isGroupSelected
                        ? `text-white bg-[#3F72AF] shadow-lg`
                        : `${getThemeTextColor('secondary')} hover:${getThemeTextColor('primary')} hover:bg-[#3F72AF]/10 hover:scale-105 hover:shadow-md`
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm truncate">{group.name}</span>
                    </div>
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
                            className={`flex items-center gap-3 px-3 py-1.5 rounded transition-all duration-200 transform relative ${
                              active
                                ? `${getThemeTextColor('primary')} font-medium bg-[#3F72AF]/15`
                                : `${getThemeTextColor('secondary')} hover:${getThemeTextColor('primary')} hover:bg-[#3F72AF]/10 hover:scale-105 hover:shadow-sm`
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
                className={`flex items-center gap-3 px-4 py-2 rounded-md transition-all duration-200 transform ${
                  active
                    ? `text-white bg-[#3F72AF] shadow-lg`
                    : `${getThemeTextColor('secondary')} hover:${getThemeTextColor('primary')} hover:bg-[#3F72AF]/10 hover:scale-105 hover:shadow-md`
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