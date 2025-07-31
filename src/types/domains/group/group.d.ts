declare namespace Group {
	interface GroupApiResponse {
		goupId: number;
		name: string,
		groupOwner: GroupUserInfo,
		groupTag: string[] | null,
		descripotion: string | null,
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
  