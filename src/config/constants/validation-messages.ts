// 그룹 관련 validation 메시지 상수
export const GROUP_VALIDATION_MESSAGES = {
  GROUP_NAME: {
    REQUIRED: 'Group name is required',
    TAKEN: 'Group name is already taken. Please choose a different name.',
  },
  DESCRIPTION: {
    MIN_LENGTH: 'Description must be at least 10 characters',
    MAX_LENGTH: 'Description must be less than 500 characters',
  },
  GROUND_RULES: {
    REQUIRED: 'At least one ground rule is required',
    EMPTY: 'Please add at least one non-empty ground rule',
  },
  TAGS: {
    REQUIRED: 'At least one tag is required',
    MAX_LIMIT: 'Maximum 5 tags allowed',
  },
} as const;

// 공통 성공/에러 메시지
export const GROUP_ACTION_MESSAGES = {
  CREATE: {
    LOADING: 'Creating group...',
    SUCCESS: 'Group created successfully!',
    ERROR: 'Failed to create group.',
  },
  UPDATE: {
    LOADING: 'Updating group information...',
    SUCCESS: 'Group information updated successfully.',
    ERROR: 'Failed to update group information.',
  },
  DELETE: {
    LOADING: 'Deleting group...',
    SUCCESS: 'Group deleted successfully.',
    ERROR: 'Failed to delete group.',
  },
} as const;