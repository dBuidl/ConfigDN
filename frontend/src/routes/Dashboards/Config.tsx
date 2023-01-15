import pocketbase from "../../libraries/Pocketbase";
import {useLoaderData} from "react-router-dom";
import React, {useMemo, useState} from "preact/compat";
import {
    ApiKeyRecord,
    ConfigRecord,
    EnvironmentRecord,
    FlagRecord,
    ProjectRecord,
    TeamRecord,
    ValueRecord, ValueRecordString
} from "../../types/Structures";
import {ContentNavigation, ContentWithNavigation} from "../../components/Content";
import FlagCard from "../../components/FlagCard";
import {Record} from "pocketbase";
import "../../styles/dashboard/config.scss";

export type tPocketbaseAsyncResponse = Promise<[true, Record] | [false, any]>;
export type tPocketbaseResponse = [true, Record] | [false, any];

export default function Config() {
    const [environment, team, project, config, flags, valuesInDB, apiKeys] = useLoaderData() as ConfigLoaderData;

    if (typeof environment === "undefined") {
        return <div class="content">
            {/* todo: should probably suggest how to create an environment here */}
            <h1>No environments found!</h1>
        </div>;
    }

    const values = useMemo(() => valuesInDB.map(v => {
        v.value = JSON.stringify(v.value);

        return v;
    }) as ValueRecordString[], [valuesInDB])

    const [editedValues, setEditedValues] = useState<ValueRecordString[]>(JSON.parse(JSON.stringify(values))); // deep copy
    console.log(editedValues);

    function setEditedValue(value: ValueRecordString) {
        setEditedValues(ev => ev.map((v) => v.id === value.id ? value : v));
    }

    const getEditedValue = (flag: FlagRecord): ValueRecordString => {
        return editedValues.find((v) => v.flag === flag.id) as ValueRecordString; // values are created at the same time as flags, so we know it'll exist here
    }

    function getOriginalValue(flag: FlagRecord): ValueRecordString {
        return values.find((v) => v.flag === flag.id) as ValueRecordString; // values are created at the same time as flags, so we know it'll exist here
    }

    function saveChanges(e: Event) {
        e.preventDefault();

        for (let i = 0; i < editedValues.length; i++) {
            const editedValue = editedValues[i];
            const previousValueIndex = values.findIndex(value => value.id === editedValue.id);
            const previousValue = values[previousValueIndex];

            if (JSON.stringify(previousValue.value) !== JSON.stringify(editedValues[i].value)) {
                pocketbase.collection('value').update(editedValue.id, {
                    ...editedValue,
                    value: JSON.parse(editedValue.value)
                });
                values[previousValueIndex] = JSON.parse(JSON.stringify(editedValue));
            }
        }
    }

    async function saveOne(value: ValueRecordString): tPocketbaseAsyncResponse {
        const previousValueIndex = values.findIndex(value => value.id === value.id);

        try {
            const record = await pocketbase.collection('value').update(value.id, {
                ...value,
                value: JSON.parse(value.value)
            });
            values[previousValueIndex] = JSON.parse(JSON.stringify(record));
            return [true, record];
        } catch (e: any) {
            return [false, e];
        }
    }

    return <>
        <ContentNavigation>
            <h1>{team.name}/{project.name}/{config.name} ({environment.name})</h1>
        </ContentNavigation>
        <ContentWithNavigation class="page-config">
            <h2>Flags</h2>
            <div class={"flag-cards"}>
                {flags.map((flag: FlagRecord) => <FlagCard flag={flag} originalValue={getOriginalValue(flag)}
                                                           value={getEditedValue(flag)}
                                                           saveValue={saveOne}
                                                           setValue={setEditedValue}/>)}
            </div>
            <button onClick={saveChanges
            }>Save Changes
            </button>
        </ContentWithNavigation>
    </>;
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
            pocketbase.collection('environment').getList(undefined, 1, {filter: `project = "${params.project}"`}).then((environments) => environments.items[0] || undefined),
        ]);
    }
}

export type ConfigLoaderData =
    [EnvironmentRecord | undefined, TeamRecord, ProjectRecord, ConfigRecord, FlagRecord[], ValueRecord[], ApiKeyRecord[]];
