declare namespace Group {
	interface GroupApiResponse {
		groupId: number;
		name: string,
		groupOwner: GroupUserInfo,
		tags: string[] | null,
		description: string | null,
		memberCount: number,
		isPublic: boolean,
	}

	interface GroupUserInfo {
		userId: string,
		nickname: string,
	}

	interface GroupMemberInfo {
		userId: string,
		nickname: string,
		profileImageUrl: string,
		lastActivityTimestamp: number,
		sessionMinutes: number,
	}
	
	interface GroupDetailApiResponse {
		owner: GroupUserInfo,
		members: GroupMemberInfo[],
		name: string,
		tags: string[],
		description: string,
		groundRule: string,
		isPublic: boolean,
		password: string | null,
		createdAt: string
	}
	
	interface CreateGroupApiRequest {
		name: string,
		isPublic: boolean,
		groundRule: string,
		tags: string[],
		description: string,
	}

	interface UpdateGroupApiRequest {
		description: string,
		tags: string[],
		groundRule: string,
		name: string,
		isPublic: boolean,
	}

	interface TransferOwnershipApiRequest {
		userId: string,
	}

	interface JoinGroupApiRequest {
		password: string | null,
	}

	interface SetGroupGoalApiRequest {
		category: 'Development' | 'Design' | 'Documentation' | 'Education',
		goalSeconds: number,
		period: 'DAILY' | 'WEEKLY',
	}

	interface DeleteGroupGoalApiRequest {
		category: string,
		period: string,
	}

	interface GroupGoalMember {
		userId: string,
		currentSeconds: number,
	}

	interface GroupGoalsApiResponse {
		category: string,
		goalSeconds: number,
		periodType: 'DAILY' | 'WEEKLY',
		members: GroupGoalMember[],
	}

	interface GroupLeaderboardMember {
		userId: string,
		nickname: string,
		profileImageUrl: string,
		score: number,
		rank: number,
		isOnline: boolean,
		lastActivityTime: number,
		details: {
			category: string,
			score: number,
		}[],
	}

	interface GroupLeaderboardApiResponse {
		groupId: number,
		groupName: string,
		category: string,
		periodType: 'DAILY' | 'WEEKLY',
		date: string,
		members: GroupLeaderboardMember[],
	}

}
  