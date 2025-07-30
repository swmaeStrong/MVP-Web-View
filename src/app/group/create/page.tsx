'use client';

import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/shadcn/ui/button';
import { Card, CardContent, CardHeader } from '@/shadcn/ui/card';
import { spacing } from '@/styles/design-system';
import { Plus, Users, Lock, Globe, Tag } from 'lucide-react';
import { useState } from 'react';

export default function CreateTeamPage() {
  const { getThemeClass, getThemeTextColor, getCommonCardClass } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPublic: true,
    tags: '',
    maxMembers: 10,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Mock API call
    setTimeout(() => {
      console.log('Team created:', formData);
      setIsLoading(false);
      // Reset form or redirect
    }, 2000);
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className={`text-3xl font-bold mb-2 ${getThemeTextColor('primary')}`}>
          Create Team
        </h1>
        <p className={`text-lg ${getThemeTextColor('secondary')}`}>
          Start a new team and invite others to collaborate
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <Card className={getCommonCardClass()}>
            <CardHeader>
              <h2 className={`text-xl font-semibold ${getThemeTextColor('primary')}`}>
                Team Information
              </h2>
            </CardHeader>
            <CardContent className={spacing.inner.normal}>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Team Name */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${getThemeTextColor('primary')}`}>
                    Team Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="Enter team name"
                    className={`w-full px-3 py-2 rounded-md border ${getThemeClass('border')} ${getThemeClass('component')} ${getThemeTextColor('primary')} placeholder:${getThemeTextColor('secondary')} focus:outline-none focus:ring-2 focus:ring-[#3F72AF]`}
                  />
                </div>

                {/* Description */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${getThemeTextColor('primary')}`}>
                    Description
                  </label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Describe your team's purpose and goals"
                    className={`w-full px-3 py-2 rounded-md border ${getThemeClass('border')} ${getThemeClass('component')} ${getThemeTextColor('primary')} placeholder:${getThemeTextColor('secondary')} focus:outline-none focus:ring-2 focus:ring-[#3F72AF] resize-none`}
                  />
                </div>

                {/* Privacy Setting */}
                <div>
                  <label className={`block text-sm font-medium mb-3 ${getThemeTextColor('primary')}`}>
                    Privacy Setting
                  </label>
                  <div className="space-y-3">
                    <div 
                      className={`flex items-center gap-3 p-3 rounded-md border cursor-pointer transition-colors ${
                        formData.isPublic 
                          ? `${getThemeClass('componentSecondary')} border-[#3F72AF]` 
                          : `${getThemeClass('component')} ${getThemeClass('border')}`
                      }`}
                      onClick={() => handleChange('isPublic', true)}
                    >
                      <Globe className={`h-5 w-5 ${formData.isPublic ? getThemeTextColor('primary') : getThemeTextColor('secondary')}`} />
                      <div>
                        <div className={`font-medium ${formData.isPublic ? getThemeTextColor('primary') : getThemeTextColor('secondary')}`}>
                          Public Team
                        </div>
                        <div className={`text-sm ${getThemeTextColor('secondary')}`}>
                          Anyone can discover and join this team
                        </div>
                      </div>
                    </div>
                    
                    <div 
                      className={`flex items-center gap-3 p-3 rounded-md border cursor-pointer transition-colors ${
                        !formData.isPublic 
                          ? `${getThemeClass('componentSecondary')} border-[#3F72AF]` 
                          : `${getThemeClass('component')} ${getThemeClass('border')}`
                      }`}
                      onClick={() => handleChange('isPublic', false)}
                    >
                      <Lock className={`h-5 w-5 ${!formData.isPublic ? getThemeTextColor('primary') : getThemeTextColor('secondary')}`} />
                      <div>
                        <div className={`font-medium ${!formData.isPublic ? getThemeTextColor('primary') : getThemeTextColor('secondary')}`}>
                          Private Team
                        </div>
                        <div className={`text-sm ${getThemeTextColor('secondary')}`}>
                          Only invited members can join
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${getThemeTextColor('primary')}`}>
                    Tags
                  </label>
                  <div className="relative">
                    <Tag className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${getThemeTextColor('secondary')}`} />
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => handleChange('tags', e.target.value)}
                      placeholder="React, TypeScript, Frontend (comma separated)"
                      className={`w-full pl-10 pr-4 py-2 rounded-md border ${getThemeClass('border')} ${getThemeClass('component')} ${getThemeTextColor('primary')} placeholder:${getThemeTextColor('secondary')} focus:outline-none focus:ring-2 focus:ring-[#3F72AF]`}
                    />
                  </div>
                </div>

                {/* Max Members */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${getThemeTextColor('primary')}`}>
                    Maximum Members
                  </label>
                  <select
                    value={formData.maxMembers}
                    onChange={(e) => handleChange('maxMembers', parseInt(e.target.value))}
                    className={`w-full px-3 py-2 rounded-md border ${getThemeClass('border')} ${getThemeClass('component')} ${getThemeTextColor('primary')} focus:outline-none focus:ring-2 focus:ring-[#3F72AF]`}
                  >
                    <option value={5}>5 members</option>
                    <option value={10}>10 members</option>
                    <option value={20}>20 members</option>
                    <option value={50}>50 members</option>
                    <option value={100}>100 members</option>
                  </select>
                </div>

                {/* Submit Button */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={isLoading || !formData.name.trim()}
                    className={`flex-1 ${getThemeClass('componentSecondary')} ${getThemeTextColor('primary')} hover:${getThemeClass('component')} transition-colors disabled:opacity-50`}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border border-current border-t-transparent"></div>
                        Creating...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Create Team
                      </div>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className={`px-6 ${getThemeClass('component')} ${getThemeClass('border')} ${getThemeTextColor('secondary')} hover:${getThemeClass('componentSecondary')}`}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Side Info */}
        <div className="space-y-4">
          <Card className={getCommonCardClass()}>
            <CardHeader>
              <h3 className={`text-lg font-semibold ${getThemeTextColor('primary')}`}>
                Team Benefits
              </h3>
            </CardHeader>
            <CardContent className={spacing.inner.normal}>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
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
                
                <div className="flex items-start gap-3">
                  <Plus className={`h-5 w-5 mt-0.5 ${getThemeTextColor('primary')}`} />
                  <div>
                    <div className={`font-medium ${getThemeTextColor('primary')}`}>
                      Track Progress
                    </div>
                    <div className={`text-sm ${getThemeTextColor('secondary')}`}>
                      Monitor team productivity and achievements
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={getCommonCardClass()}>
            <CardContent className={spacing.inner.normal}>
              <div className={`text-center ${getThemeTextColor('secondary')}`}>
                <div className="text-2xl font-bold mb-1">2,450+</div>
                <div className="text-sm">Teams created this month</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}