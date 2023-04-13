// This file contains the structures of the PocketBase database as well as some custom types to explain the data.

import {Record} from "pocketbase";
import {DashboardSelectItem} from "../components/dashboard/SelectInput";

export interface UserRecord extends Record {
    avatar: string;
    email: string;
    emailVisibility: boolean;
    name: string;
    username: string;
    verified: boolean;
}

export interface TeamRecord extends Record {
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

export interface ProjectRecord extends Record {
    team: tPocketbaseID,
    name: string,
}

export interface ConfigRecord extends Record {
    project: tPocketbaseID,
    name: string,
}

export interface FlagRecord extends Record {
    name: string;
    identifier: string;
    config: tPocketbaseID;
    type: tFlagType;
    valuesSource: tURL | null;
    valuesFilter: tRegexString | null;
    allowedValues: object | null;
}

export interface EnvironmentRecord extends Record {
    name: string;
    project: tPocketbaseID;
}

export interface ValueRecord extends Record {
    flag: tPocketbaseID;
    environment: tPocketbaseID;
    value: object | string | number | null;
}

export interface ValueRecordString extends ValueRecord {
    value: string;
}

export interface ApiKeyRecord extends Record {
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

export const flagTypeArray: DashboardSelectItem[] = [
    {value: "boolean", title: "Boolean", description: "True or false"},
    {value: "string", title: "String", description: "A string of text"},
    {value: "number", title: "Number", description: "A number"},
    {value: "json", title: "JSON", description: "A JSON object"},
    {value: "array", title: "Array", description: "A JSON array of values"},
]