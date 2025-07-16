'use client';

import { useTheme } from '@/hooks/useTheme';
import { BarChart3, ChevronLeft, Menu, Trophy } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { name: 'Statistics', href: '/statistics', icon: BarChart3 },
  { name: 'Leaderboard', href: '/leaderboard', icon: Trophy },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { getThemeClass, getThemeTextColor } = useTheme();

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full ${getThemeClass('component')} ${getThemeClass('border')} border-r z-40 transition-all duration-300 shadow-lg ${
          isOpen ? 'w-64' : 'w-16'
        }`}
      >
        <div className="p-4 h-full flex flex-col">
          {/* Toggle button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`w-full mb-6 p-2 rounded-md ${getThemeClass('componentSecondary')} hover:${getThemeClass('component')} ${getThemeTextColor('primary')} transition-colors`}
          >
            {isOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
          </button>

          {/* Navigation */}
          <nav className="space-y-2 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center ${isOpen ? 'gap-3 px-4' : 'justify-center px-2'} py-3 rounded-md transition-colors ${
                    active
                      ? `${getThemeClass('componentSecondary')} ${getThemeTextColor('primary')} ring-2 ring-purple-400`
                      : `${getThemeTextColor('secondary')} hover:${getThemeClass('componentSecondary')} hover:${getThemeTextColor('primary')}`
                  }`}
                  title={!isOpen ? item.name : undefined}
                >
                  <Icon size={20} />
                  {isOpen && <span>{item.name}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Logo/Title at bottom */}
          <div className="mt-auto pt-4 border-t border-gray-600">
            {isOpen ? (
              <h2 className={`text-lg font-bold ${getThemeTextColor('primary')} text-center`}>Pawcus</h2>
            ) : (
              <div className={`text-lg font-bold ${getThemeTextColor('primary')} text-center`}>P</div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}