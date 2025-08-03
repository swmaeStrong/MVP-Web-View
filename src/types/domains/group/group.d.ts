declare namespace Group {
	interface GroupApiResponse {
		groupId: number;
		name: string,
		groupOwner: GroupUserInfo,
		tags: string[] | null,
		description: string | null,
		isPublic: boolean,
	}

	interface GroupUserInfo {
		userId: string,
		nickname: string,
	}
	
	interface GroupDetailApiResponse {
		owner: GroupUserInfo,
		members: GroupUserInfo[],
		name: string,
		tags: string[],
		description: string,
		groundRule: string,
		isPublic: boolean,
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

}
  