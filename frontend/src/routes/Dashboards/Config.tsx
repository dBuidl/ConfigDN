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
import SettingCard from "../../components/dashboard/config/SettingCard";
import {Record} from "pocketbase";
import Content from "../../components/general/Content";
import DashboardSpacer from "../../components/dashboard/DashboardSpacer";
import ApiInfo from "../../components/dashboard/config/ApiInfo";
import SettingButtons from "../../components/dashboard/config/SettingButtons";
import SettingButton from "../../components/dashboard/config/SettingButton";
import SettingCards from "../../components/dashboard/config/SettingCards";
import DashboardNavbar from "../../components/navbar/DashboardNavbar";
import NavBarBreadcrumbs from "../../components/navbar/NavBarBreadcrumbs";

export type tPocketbaseAsyncResponse = Promise<tPocketbaseResponse>;
export type tPocketbaseResponse = [1, Record] | [0, any] | [-1, string];

export default function Config() {
    const [environment, team, project, config, flags, valuesInDB, apiKeys] = useLoaderData() as ConfigLoaderData;
    const valuesProcessed = useMemo(() => valuesInDB.map((v) => {
        v.value = JSON.stringify(v.value);

        return v as ValueRecordString;
    }), [valuesInDB]);
    const [originalValues, setOriginalValues] = useState<ValueRecordString[]>(valuesProcessed);
    const [editedValues, setEditedValues] = useState<ValueRecordString[]>(JSON.parse(JSON.stringify(originalValues)));

    if (typeof environment === "undefined") {
        return <div class="content">
            {/* todo: should probably suggest how to create an environment here */}
            <h1>No environments found!</h1>
        </div>;
    }

    function setEditedValue(value: ValueRecordString) {
        setEditedValues(ev => ev.map((v) => v.id === value.id ? value : v));
    }

    const getEditedValue = (flag: FlagRecord): ValueRecordString => {
        return editedValues.find((v) => v.flag === flag.id) as ValueRecordString; // values are created at the same time as flags, so we know it'll exist here
    }

    function getOriginalValue(flag: FlagRecord): ValueRecordString {
        return originalValues.find((v) => v.flag === flag.id) as ValueRecordString; // values are created at the same time as flags, so we know it'll exist here
    }

    function setOriginalValue(valueUnsafe: ValueRecordString) {
        // we need to clone the value here because otherwise the originalValues state will be updated with the edited value
        const value = JSON.parse(JSON.stringify(valueUnsafe));

        setOriginalValues(ov => ov.map((v) => v.id === value.id ? value : v));
    }

    function toValueRecordString(value: ValueRecord): ValueRecordString {
        return {
            ...value,
            value: JSON.stringify(value.value)
        } as ValueRecordString;
    }

    function saveChanges(e: Event) {
        e.preventDefault();

        for (let i = 0; i < editedValues.length; i++) {
            const editedValue = editedValues[i];
            const previousValueIndex = originalValues.findIndex(value => value.id === editedValue.id);
            const previousValue = originalValues[previousValueIndex];

            if (JSON.stringify(previousValue.value) !== JSON.stringify(editedValues[i].value)) {
                pocketbase.collection('value').update(editedValue.id, {
                    ...editedValue,
                    value: JSON.parse(editedValue.value)
                });
                setOriginalValue(editedValue); // the function ensures it'll be a distinct clone
            }
        }
    }

    async function saveOne(value: ValueRecordString): tPocketbaseAsyncResponse {
        const previousValueIndex = originalValues.findIndex(val => val.id === value.id);

        // check if previous value is the same as the new value
        if (JSON.stringify(originalValues[previousValueIndex].value) === JSON.stringify(value.value)) {
            return [-1, "Value is the same as the previous value"];
        }

        try {
            const newVal = {
                ...value,
                value: JSON.parse(value.value)
            }

            const record = await pocketbase.collection('value').update(value.id, newVal);
            setOriginalValue(toValueRecordString(record as ValueRecord));
            setEditedValue(toValueRecordString(record as ValueRecord));
            return [1, record];
        } catch (e: any) {
            return [0, e];
        }
    }

    function resetAll() {
        setEditedValues(JSON.parse(JSON.stringify(originalValues)));
    }

    return <>
        <DashboardNavbar>
            <NavBarBreadcrumbs team={team} project={project} environment={environment} config={config}/>
        </DashboardNavbar>
        <Content pageName="dashboard dashboard-config">
            <SettingCards>
                <h2>Flags</h2>
                {flags.map((flag: FlagRecord) => <SettingCard flag={flag} originalValue={getOriginalValue(flag)}
                                                              value={getEditedValue(flag)}
                                                              saveValue={saveOne}
                                                              setValue={setEditedValue}/>)}id = @request.auth.id
            </SettingCards>

            <SettingButtons>
                <SettingButton type={"New Flag"}/> {/* todo: hook this up */}
                <SettingButton onClick={resetAll} type={"Reset All"}/>
                <SettingButton onClick={saveChanges} type={"Save All"}/>
            </SettingButtons>

            <DashboardSpacer/>

            <ApiInfo config={config.name} environment={environment.name} apiKey={apiKeys[0]?.key}/>
        </Content>
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
