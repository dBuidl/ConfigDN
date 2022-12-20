export interface BaseRecord {
    collectionId: string;
    collectionName: string;
    created: string;
    updated: string;
    id: string;
}

export interface UserRecord extends BaseRecord {
    avatar: string;
    email: string;
    emailVisibility: boolean;
    name: string;
    username: string;
    verified: boolean;
}

export interface TeamRecord extends BaseRecord {
    admins: string[],
    editors: string[],
    expand: {
        admins?: UserRecord[],
        editors?: UserRecord[],
        viewers?: UserRecord[],
        owner?: UserRecord,
    }, // todo: define possible values
    identifier: tUUIDv4,
    name: string,
    owner: string,
    viewers: string[],
}

export type tUUIDv4 = string;