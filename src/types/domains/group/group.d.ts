declare namespace Group {
	interface GroupApiResponse {
		groupId: number;
		name: string,
		groupOwner: GroupUserInfo,
		tags: string[] | null,
		description: string | null,
	}

	interface GroupUserInfo {
		userId: string,
		nickname: string,
	}
	
	interface GroupDetailApiResponse {
		owner: GroupUserInfo,
		members: GroupUserInfo[],
		groupTag: string[] | null,
		description: string | null,
		groundRule: string,
		isPublic: boolean,
		createdAt: string
	}
	
	interface CreateGroupApiRequest {
		groupName: string,
		isPublic: boolean,
		groundRule: string,
		groupTag: string[] | null,
		description: string | null,
	}

}
  