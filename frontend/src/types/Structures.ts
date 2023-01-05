// This file contains the structures of the PocketBase database as well as some custom types to explain the data.

export interface BaseRecord {
    collectionId: string;
    collectionName: string;
    created: string;
    updated: string;
    id: tPocketbaseID;
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
    admins: tPocketbaseID[],
    editors: tPocketbaseID[],
    expand: {
        admins?: UserRecord[],
        editors?: UserRecord[],
        viewers?: UserRecord[],
        owner?: UserRecord,
    },
    identifier: tUUIDv4,
    name: string,
    owner: tPocketbaseID,
    viewers: tPocketbaseID[],
}

export interface ProjectRecord extends BaseRecord {
    team: tPocketbaseID,
    name: string,
}

export interface ConfigRecord extends BaseRecord {
    project: tPocketbaseID,
    name: string,
}

export interface FlagRecord extends BaseRecord {
    name: string;
    identifier: string;
    config: tPocketbaseID;
    type: tFlagType;
    valuesSource: tURL | null;
    valuesFilter: tRegexString | null;
    allowedValues: object | null;
}

export interface EnvironmentRecord extends BaseRecord {
    name: string;
    project: tPocketbaseID;
}

export interface ValueRecord extends BaseRecord {
    flag: tPocketbaseID;
    environment: tPocketbaseID;
    value: object | null;
}

export interface ApiKeyRecord extends BaseRecord {
    environment: tPocketbaseID;
    name: string;
    key: string;
    config: tPocketbaseID;
}

// A string that represents a regular expression
export type tRegexString = string;

// A string that represents a URL
export type tURL = string;

// A string that represents an ID in another PocketBase table
export type tPocketbaseID = string;

// A string that represents a UUIDv4
export type tUUIDv4 = string;

export type tFlagType = "boolean" | "string" | "number" | "json" | "array";