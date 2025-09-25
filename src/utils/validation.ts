import * as z from 'zod';

// 번역 키 기반의 validation 메시지 생성기
export function createValidationSchema(t: (key: string) => string) {
  return {
    // 그룹 생성용 스키마
    createGroupSchema: z.object({
      groupName: z.string().min(1, t('group.validation.groupNameRequired')),
      description: z.string().max(500, t('group.validation.descriptionMaxLength')),
      isPublic: z.enum(['public', 'private']),
      groundRules: z.array(z.string()).min(1, t('group.validation.groundRulesRequired')).refine(
        (rules) => rules.some(rule => rule.trim().length > 0),
        t('group.validation.groundRulesEmpty')
      ),
      tags: z.array(z.string()).min(1, t('group.validation.tagsRequired')).max(5, t('group.validation.tagsMaxLimit')),
    }),

    // 그룹 업데이트용 스키마
    updateGroupSchema: z.object({
      name: z.string().min(1, t('group.validation.groupNameRequired')),
      description: z.string().max(500, t('group.validation.descriptionMaxLength')),
      isPublic: z.boolean(),
      groundRules: z.array(z.string()).optional(),
      tags: z.array(z.string()).min(1, t('group.validation.tagsRequired')).max(5, t('group.validation.tagsMaxLimit')),
    }),
  };
}

// 기본 타입들 (기존 스키마에서 추출한 타입들을 유지)
export type CreateGroupFormData = {
  groupName: string;
  description: string;
  isPublic: 'public' | 'private';
  groundRules: string[];
  tags: string[];
};

export type UpdateGroupFormData = {
  name: string;
  description: string;
  isPublic: boolean;
  groundRules?: string[];
  tags: string[];
};