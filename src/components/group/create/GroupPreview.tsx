'use client';

import { useTheme } from '@/hooks/ui/useTheme';
import { Avatar, AvatarFallback } from '@/shadcn/ui/avatar';
import { Badge } from '@/shadcn/ui/badge';
import { Card, CardContent } from '@/shadcn/ui/card';
import { Globe, Hash, Lock, Target, TrendingUp, Users } from 'lucide-react';

interface GroupPreviewProps {
  groupName: string;
  description: string;
  isPublic: 'public' | 'private';
  groundRules: string[];
  tags: string[];
}

export default function GroupPreview({ 
  groupName, 
  description, 
  isPublic, 
  groundRules, 
  tags 
}: GroupPreviewProps) {
  const { getThemeClass, getThemeTextColor, getCommonCardClass } = useTheme();

  return (
    <div className="lg:col-span-1 space-y-6">
      <Card className={getCommonCardClass()}>
        <CardContent className="p-6">
          <div className={`text-lg font-semibold ${getThemeTextColor('primary')} mb-4`}>
            Preview
          </div>
          
          <div className="space-y-4">
            {/* Group Header */}
            <div className="flex items-center gap-6">
              <Avatar className="w-12 h-12">
                <AvatarFallback className={`text-lg font-bold ${getThemeClass('componentSecondary')} ${getThemeTextColor('primary')}`}>
                  {groupName?.charAt(0) || 'G'}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <div className={`text-sm font-bold ${getThemeTextColor('primary')} truncate`}>
                    {groupName || 'Group Name'}
                  </div>
                  <Badge variant={isPublic === 'public' ? "default" : "secondary"} className={`gap-1 flex-shrink-0 text-xs ${
                    isPublic === 'public'
                      ? 'bg-green-100 text-green-700 hover:bg-green-100'
                      : 'bg-amber-100 text-amber-700 hover:bg-amber-100'
                  }`}>
                    {isPublic === 'public' ? (
                      <>
                        <Globe className="h-2 w-2" />
                        Public
                      </>
                    ) : (
                      <>
                        <Lock className="h-2 w-2" />
                        Private
                      </>
                    )}
                  </Badge>
                </div>
                
              </div>
            </div>
            
            {/* Description */}
            <p className={`text-xs ${getThemeTextColor('secondary')} leading-relaxed whitespace-pre-wrap`}>
              {description || 'Group description will appear here...'}
            </p>
            
            {/* Ground Rule */}
            {groundRules && groundRules.some(rule => rule.trim().length > 0) && (
              <div>
                <div className={`text-xs font-semibold ${getThemeTextColor('primary')} mb-2`}>
                  Ground Rules
                </div>
                <div className="space-y-2">
                  {groundRules
                    .filter(rule => rule.trim().length > 0)
                    .map((rule, index) => (
                      <div key={index} className={`text-xs ${getThemeTextColor('secondary')} ${getThemeClass('componentSecondary')} p-2 rounded flex items-start gap-2`}>
                        <span className={`font-semibold ${getThemeTextColor('primary')} flex-shrink-0`}>
                          {index + 1}.
                        </span>
                        <span>{rule}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}
            
            {/* Tags */}
            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="outline" 
                    className={`gap-1 text-xs ${getThemeClass('border')} ${getThemeTextColor('secondary')}`}
                  >
                    <Hash className="h-2 w-2" />
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Group Benefits */}
      <Card className={getCommonCardClass()}>
        <CardContent className="p-6">
          <div className={`text-lg font-semibold ${getThemeTextColor('primary')} mb-4`}>
            Group Benefits
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <Users className={`h-5 w-5 mt-0.5 ${getThemeTextColor('primary')}`} />
              <div>
                <div className={`font-medium ${getThemeTextColor('primary')}`}>
                  Collaborate
                </div>
                <div className={`text-sm ${getThemeTextColor('secondary')}`}>
                  Work together on projects and share progress
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <Target className={`h-5 w-5 mt-0.5 ${getThemeTextColor('primary')}`} />
              <div>
                <div className={`font-medium ${getThemeTextColor('primary')}`}>
                  Set Common Goals
                </div>
                <div className={`text-sm ${getThemeTextColor('secondary')}`}>
                  Create shared objectives and track achievement progress
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <TrendingUp className={`h-5 w-5 mt-0.5 ${getThemeTextColor('primary')}`} />
              <div>
                <div className={`font-medium ${getThemeTextColor('primary')}`}>
                  Monitor Progress
                </div>
                <div className={`text-sm ${getThemeTextColor('secondary')}`}>
                  View group productivity and goal completion rates
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}