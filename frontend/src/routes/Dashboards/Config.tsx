import pocketbase from "../../libraries/Pocketbase";
import {Link, useLoaderData} from "react-router-dom";
import React, {useEffect, useMemo, useState} from "preact/compat";
import {
    ApiKeyRecord,
    ConfigRecord,
    EnvironmentRecord,
    FlagRecord, flagTypeArray,
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
import cryptoRandomString from "crypto-random-string";
import useDialog from "../../hooks/useDialog";
import Dialog from "../../components/dialog/Dialog";
import DialogHeader from "../../components/dialog/DialogHeader";
import DialogBody from "../../components/dialog/DialogBody";
import DialogFooter from "../../components/dialog/DialogFooter";
import DashboardSelect, {DashboardSelectItem} from "../../components/dashboard/DashboardSelect";

export type tPocketbaseAsyncResponse = Promise<tPocketbaseResponse>;
export type tPocketbaseResponse = [1, Record] | [0, any] | [-1, string];

export default function Config() {
    const [environment, team, project, config, flagsData, valuesInDB, apiKeysData] = useLoaderData() as ConfigLoaderData;
    const valuesProcessedData = useMemo(() => valuesInDB.map((v) => {
        v.value = JSON.stringify(v.value);

        return v as ValueRecordString;
    }), [valuesInDB]);

    // These values can be updated during the session, so we need to keep track of them separately
    const [valuesProcessed, setValuesProcessed] = useState<ValueRecordString[]>(valuesProcessedData);
    const [flags, setFlags] = useState<FlagRecord[]>(flagsData);
    const [apiKeys, setApiKeys] = useState<ApiKeyRecord[]>(apiKeysData);

    const [originalValues, setOriginalValues] = useState<ValueRecordString[]>(valuesProcessed);
    const [editedValues, setEditedValues] = useState<ValueRecordString[]>(JSON.parse(JSON.stringify(originalValues)));

    const [newFlagName, setNewFlagName] = useState<string>('');
    const [newFlagIdentifier, setNewFlagIdentifier] = useState<string>('');
    const [newFlagType, setNewFlagType] = useState<DashboardSelectItem | null>(null);
    const [newFlagError, setNewFlagError] = useState<string>('');

    const createNewFlag = () => {
        // todo: finish this function
    }

    const [setNewFlagDialogShowing, newFlagDialog] = useDialog(<Dialog>
        <DialogHeader>
            <h1 className="dialog-heading">Create Flag</h1>
        </DialogHeader>
        <DialogBody class="dialog-form">
            <label class="dialog-input-label">Flag Name:</label>
            <input type="text" class="dialog-input" value={newFlagName} placeholder="Flag Name"
                   onInput={(e) => setNewFlagName(e.currentTarget.value)}/>
            <label class="dialog-input-label">Flag Identifier:</label>
            <input type="text" class="dialog-input" value={newFlagIdentifier} placeholder="Flag Identifier"
                   onInput={(e) => setNewFlagIdentifier(e.currentTarget.value)}/>
            <label class="dialog-input-label">Flag Type:</label>
            <DashboardSelect items={flagTypeArray}/>
        </DialogBody>
        <DialogFooter>
            <button class="dialog-action dialog-action__save" onClick={() => createNewFlag()}>Create
            </button>
            <button class="dialog-action dialog-action__cancel"
                    onClick={() => setNewFlagDialogShowing(false)}>Cancel
            </button>
            <p className="dialog-error">{newFlagError}</p>
        </DialogFooter>
    </Dialog>);

    if (typeof environment === "undefined") {
        return <div class="content">
            {/* todo: should probably suggest how to create an environment here */}
            <h1>No environments found!</h1>
            <p>Go back to the <Link to="../">project page</Link> to create a new environment.</p>
        </div>;
    }

    useEffect(() => {
        console.log('apiKeys', apiKeys)
        console.log('environment', environment)

        if ((apiKeys.length) === 0 && typeof environment !== "undefined") {
            pocketbase.collection('api_key').create({
                environment: environment.id,
                config: config.id,
                name: `Default API Key For ${team.name}/${project.name}/${config.name}/${environment.name}`,
                key: cryptoRandomString({length: 45, type: 'alphanumeric'})
            }).then((response) => {
                setApiKeys([response as ApiKeyRecord]);
            }).catch((error) => {
                console.error(error);
            });
        }
    }, [apiKeys]);

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
                                                              setValue={setEditedValue}/>)}
            </SettingCards>

            <SettingButtons>
                <SettingButton onClick={() => setNewFlagDialogShowing(true)}
                               type={"New Flag"}/>
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
            pocketbase.collection('api_key').getFullList(undefined, {filter: `config = "${params.config}" && environment = "${params.environment}"`}),
        ]);
    } else {
        return Promise.all([
            pocketbase.collection('environment').getList(undefined, 1, {filter: `project = "${params.project}"`}).then((environments) => environments.items[0] || undefined),
        ]);
    }
}

export type ConfigLoaderData =
    [EnvironmentRecord | undefined, TeamRecord, ProjectRecord, ConfigRecord, FlagRecord[], ValueRecord[], ApiKeyRecord[]];
