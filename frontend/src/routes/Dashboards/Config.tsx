import pocketbase from "../../libraries/Pocketbase";
import {useLoaderData} from "react-router-dom";
import React, {useState} from "preact/compat";
import {
    ApiKeyRecord,
    ConfigRecord,
    EnvironmentRecord,
    FlagRecord,
    ProjectRecord,
    TeamRecord,
    ValueRecord
} from "../../types/Structures";
import {ContentNavigation, ContentWithNavigation} from "../../components/Content";
import FlagCard from "../../components/FlagCard";

export default function Config() {
    const [environment, ...others] = useLoaderData() as ConfigLoaderData;

    if (typeof environment !== "undefined") {
        // if we're here, we have the other data
        const [team, project, config, flags, values, apiKeys] = others;

        const [editedValues, setEditedValues] = useState<ValueRecord[]>(JSON.parse(JSON.stringify(values))); // deep copy

        function setEditedValue(value: ValueRecord) {
            setEditedValues(editedValues.map((v) => v.id === value.id ? value : v));
        }

        const getEditedValue = (flag: FlagRecord): ValueRecord => {
            return editedValues.find((v) => v.flag === flag.id) as ValueRecord; // values are created at the same time as flags, so we know it'll exist here
        }

        function getOriginalValue(flag: FlagRecord): ValueRecord {
            return values.find((v) => v.flag === flag.id) as ValueRecord; // values are created at the same time as flags, so we know it'll exist here
        }

        function saveChanges(e: Event) {
            e.preventDefault();
            console.log(editedValues);

            for (let i = 0; i < editedValues.length; i++) {
                const editedValue = editedValues[i];
                const previousValueIndex = values.findIndex(value => value.id === editedValue.id);
                const previousValue = values[previousValueIndex];

                if (JSON.stringify(previousValue.value) !== JSON.stringify(editedValues[i].value)) {
                    pocketbase.collection('value').update(editedValue.id, editedValue);
                    values[previousValueIndex] = JSON.parse(JSON.stringify(editedValue));
                }
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
                                                               setValue={setEditedValue}/>)}
                </div>
                <button onClick={saveChanges
                }>Save Changes
                </button>
            </ContentWithNavigation>
        </>;
    } else {
        return <div class="content">
            {/* todo: should probably suggest how to create an environment here */}
            <h1>No environments found!</h1>
        </div>;
    }
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
