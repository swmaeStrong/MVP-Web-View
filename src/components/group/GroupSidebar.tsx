'use client';

import { useTheme } from '@/hooks/ui/useTheme';
import { useCurrentUserData } from '@/hooks/user/useCurrentUser';
import { brandColors } from '@/styles/colors';
import { Plus, Search, Settings, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useMemo } from 'react';

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
  { name: 'Search', href: '/group/search', icon: Search },
  { name: 'Create', href: '/group/create', icon: Plus },
];

export default function GroupSidebar({ groups, isLoading, error }: GroupSidebarProps) {
  const { getThemeClass, getThemeTextColor } = useTheme();
  const pathname = usePathname();
  const currentUser = useCurrentUserData();

  // Get selected group ID from URL - 메모이제이션
  const selectedGroupId = useMemo(() => {
    if (!pathname.includes('/group/') || pathname === '/group' || pathname === '/group/create' || pathname === '/group/search') return null;
    return pathname.split('/group/')[1]?.split('/')[0] || null;
  }, [pathname]);

  // isActive 함수 최적화 - useCallback으로 메모이제이션
  const isActive = useCallback((href: string) => {
    if (href === '/group') {
      return pathname === href;
    }
    
    // 그룹 서브메뉴의 경우 정확한 매칭 필요
    if (href.includes('/group/') && selectedGroupId) {
      // Detail 페이지: /group/[id]/detail 매칭
      if (href.endsWith(`/group/${selectedGroupId}/detail`)) {
        return pathname === href;
      }
      // Settings 페이지: /group/[id]/settings 매칭
      if (href.endsWith('/settings')) {
        return pathname === href;
      }
    }
    
    // 기타 경로는 기존 로직 유지
    return pathname === href || pathname.startsWith(href + '/');
  }, [pathname, selectedGroupId]);

  // 선택된 그룹과 권한 정보 메모이제이션
  const groupInfo = useMemo(() => {
    const selectedGroup = groups.find(group => group.groupId.toString() === selectedGroupId);
    const isGroupOwner = selectedGroup && currentUser && selectedGroup.groupOwner.userId === currentUser.id;
    
    return { selectedGroup, isGroupOwner };
  }, [groups, selectedGroupId, currentUser]);

  // Group submenu items 메모이제이션
  const groupSubMenuItems = useMemo(() => {
    if (!selectedGroupId) return [];
    
    const baseItems = [
      { name: 'Main', href: `/group/${selectedGroupId}/detail`, icon: TrendingUp },
    ];
    
    // 모든 멤버가 Settings 페이지에 접근 가능
    baseItems.push({ name: 'Settings', href: `/group/${selectedGroupId}/settings`, icon: Settings });
    
    return baseItems;
  }, [selectedGroupId, groupInfo.isGroupOwner]);

  return (
    <aside
      className={`fixed top-0 left-0 h-full w-40 ${getThemeClass('background')} ${getThemeClass('border')} border-r z-40`}
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
              const groupHref = `/group/${group.groupId}/detail`;
              
              return (
                <div key={group.groupId}>
                  <Link
                    href={groupHref}
                    prefetch={true}
                    className={`flex items-center justify-between px-4 py-2 rounded-md transition-colors duration-150 ${
                      isGroupSelected
                        ? `text-white ${brandColors.accent.bg}`
                        : `${getThemeTextColor('secondary')} hover:${getThemeTextColor('primary')} hover:${brandColors.accent.bg}/10`
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <span className="text-sm truncate" title={group.name}>
                        {group.name}
                      </span>
                    </div>
                  </Link>
                  
                  {/* Group Submenu - Show right below the selected group */}
                  {isGroupSelected && groupSubMenuItems.length > 0 && (
                    <div className="ml-4 mt-1 space-y-1">
                      {groupSubMenuItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.href);
                        
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            prefetch={true}
                            className={`flex items-center gap-3 px-3 py-1.5 rounded transition-colors duration-150 relative ${
                              active
                                ? `${getThemeTextColor('primary')} font-medium ${brandColors.accent.bg}/15`
                                : `${getThemeTextColor('secondary')} hover:${getThemeTextColor('primary')} hover:${brandColors.accent.bg}/10`
                            }`}
                          >
                            {/* Simple active indicator */}
                            <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                              active ? brandColors.accent.bg : 'bg-transparent'
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
                prefetch={true}
                className={`flex items-center gap-3 px-4 py-2 rounded-md transition-colors duration-150 ${
                  active
                    ? `text-white ${brandColors.accent.bg}`
                    : `${getThemeTextColor('secondary')} hover:${getThemeTextColor('primary')} hover:${brandColors.accent.bg}/10`
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