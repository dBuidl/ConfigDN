// This file contains the structures of the PocketBase database as well as some custom types to explain the data.

import {RecordModel} from "pocketbase";
import {DashboardSelectItem} from "../components/dashboard/SelectInput";

export interface UserRecord extends RecordModel {
    avatar: string;
    email: string;
    emailVisibility: boolean;
    name: string;
    username: string;
    verified: boolean;
}

export interface TeamRecord extends RecordModel {
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

export interface ProjectRecord extends RecordModel {
    team: tPocketbaseID,
    name: string,
}

export interface ConfigRecord extends RecordModel {
    project: tPocketbaseID,
    name: string,
}

export interface FlagRecord extends RecordModel {
    name: string;
    identifier: string;
    config: tPocketbaseID;
    type: tFlagType;
    valuesSource: tURL | null;
    valuesFilter: tRegexString | null;
    allowedValues: object | null;
}

export interface EnvironmentRecord extends RecordModel {
    name: string;
    project: tPocketbaseID;
}

export interface ValueRecord extends RecordModel {
    flag: tPocketbaseID;
    environment: tPocketbaseID;
    value: object | string | number | null;
}

export interface ValueRecordString extends ValueRecord {
    value: string;
}

export interface ApiKeyRecord extends RecordModel {
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

export type tWebMailAPIResponse = { success: true, message: string, email: string, web_mail_url: string, service_name: string } | { success: false, message: string, email?: string };