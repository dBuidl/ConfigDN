import pocketbase from "../../libraries/Pocketbase";
import {useLoaderData, useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "preact/compat";
import {
    ApiKeyRecord,
    ConfigRecord,
    EnvironmentRecord, FlagRecord,
    ProjectRecord,
    TeamRecord, tPocketbaseID,
    ValueRecord
} from "../../types/Structures";
import {fieldTypeToInputType} from "../../types/Conversions";
import {Content} from "../../components/Content";

export default function Config() {
    const [environment, ...others] = useLoaderData() as ConfigLoaderData;
    const navigate = useNavigate();

    // redirect if no environment was selected
    useEffect(() => {
        if (Array.isArray(environment) && environment.length > 0) navigate('./' + environment[0].id); // redirect to url with /environmentID appended (so it can load full data)
    }, [environment]);

    // show alternate text depending on environment existence
    if (Array.isArray(environment)) { // if it's set, it's an object, if it's not set, it's an array
        if (environment.length >= 1) {
            return <div class="content">
                <h1>Loading...</h1>
            </div>;
        }
    }

    if (others.length === 0 || Array.isArray(environment)) {
        return <div class="content">
            <h1>No environments found!</h1>
        </div>;
    }

    // if we're here, we have the other data
    const [team, project, config, flags, values, apiKeys] = others;

    const [editedValues, setEditedValues] = useState<Map<tPocketbaseID, object>>(new Map(values.map((value: ValueRecord) => [value.flag, value])));

    console.log(others);

    return <Content>
        <h1>{`${project.name}/${config.name} (${environment.name})`}</h1>
        <h2>Flags</h2>
        <div class={"flag-cards"}>
            {flags.map((flag: FlagRecord) => <div class={"flag-card"}>
                <h3>{flag.name}</h3>
                <p>{flag.identifier}</p>
                {values.filter((value: ValueRecord) => value.flag === flag.id).map((value: ValueRecord) => <div
                    class={"value-card"}>
                    <input value={JSON.stringify(value.value)} type={fieldTypeToInputType(flag.type)}/>
                </div>)}
            </div>)}
        </div>
    </Content>;
}

// Loads data for the config page (remember to change the order above if you change this)
export function configLoader({params}: { params: any }) {
    if (params.environment) {
        return Promise.all([
            pocketbase.collection('environment').getOne(params.environment, {}),
            pocketbase.collection('team').getOne(params.team, {expand: 'owner,admins,editors,viewers'}),
            pocketbase.collection('project').getOne(params.project, {}),
            pocketbase.collection('config').getOne(params.config, {}),
            pocketbase.collection('flag').getFullList(undefined, {filter: `config = "${params.config}"`}),
            pocketbase.collection('value').getFullList(undefined, {filter: `environment = "${params.environment}" && flag.config = "${params.config}"`}),
            pocketbase.collection('api_key').getList(1, 50, {filter: `config = "${params.config}" && environment = "${params.environment}"`}),
        ]);
    } else {
        return Promise.all([
            pocketbase.collection('environment').getFullList(undefined, {filter: `project = "${params.project}"`}),
        ]);
    }
}

export type ConfigLoaderData =
    [EnvironmentRecord, TeamRecord, ProjectRecord, ConfigRecord, FlagRecord[], ValueRecord[], ApiKeyRecord[]]
    | [EnvironmentRecord[]];
