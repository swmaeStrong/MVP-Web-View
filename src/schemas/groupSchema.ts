import * as z from 'zod';

// 공통 그룹 스키마
export const baseGroupSchema = z.object({
  name: z.string().min(1, 'Group name is required'),
  description: z.string().max(500, 'Description must be less than 500 characters'),
  isPublic: z.boolean(),
  groundRules: z.array(z.string()).min(1, 'At least one ground rule is required').refine(
    (rules) => rules.some(rule => rule.trim().length > 0),
    'At least one ground rule is required'
  ),
  tags: z.array(z.string()).min(1, 'At least one tag is required').max(5, 'Maximum 5 tags allowed'),
});

// 그룹 생성용 스키마 (form 필드명에 맞춤)
export const createGroupSchema = z.object({
  groupName: z.string().min(1, 'Group name is required'),
  description: z.string().max(500, 'Description must be less than 500 characters'),
  isPublic: z.enum(['public', 'private']),
  groundRules: z.array(z.string()).min(1, 'At least one ground rule is required').refine(
    (rules) => rules.some(rule => rule.trim().length > 0),
    'At least one ground rule is required'
  ),
  tags: z.array(z.string()).min(1, 'At least one tag is required').max(5, 'Maximum 5 tags allowed'),
});

// 그룹 편집용 스키마 (더 유연한 validation)
export const updateGroupSchema = z.object({
  name: z.string().min(1, 'Group name is required'),
  description: z.string().max(500, 'Description must be less than 500 characters'),
  isPublic: z.boolean(),
  groundRules: z.array(z.string()).optional(),
  tags: z.array(z.string()).min(1, 'At least one tag is required').max(5, 'Maximum 5 tags allowed'),
});

// 타입 정의
export type CreateGroupFormData = z.infer<typeof createGroupSchema>;
export type UpdateGroupFormData = z.infer<typeof updateGroupSchema>;
export type BaseGroupData = z.infer<typeof baseGroupSchema>;