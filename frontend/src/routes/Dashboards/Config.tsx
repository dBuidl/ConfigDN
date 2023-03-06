import pocketbase from "../../libraries/Pocketbase";
import {Link, useLoaderData} from "react-router-dom";
import React, {useEffect, useState} from "preact/compat";
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
import SelectInput, {DashboardSelectItem} from "../../components/dashboard/SelectInput";

export type tPocketbaseAsyncResponse = Promise<tPocketbaseResponse>;
export type tPocketbaseResponse = [1, Record] | [0, any] | [-1, string];

function specialJsonStringify(value: any, type: any) {
    switch (type) {
        case 'json':
            return JSON.stringify(value);
        case 'array':
            return JSON.stringify(value);
        case 'string':
            return stringStringify(value);
        case 'boolean':
            return JSON.stringify(value);
        case 'number':
            return JSON.stringify(value);
        default:
            return JSON.stringify(value);
    }
}

function stringParse(value: string) {
    // remove quotes from before and after string (and unescape quotes)
    // but only if the string is quoted
    if (value.startsWith('"') && value.endsWith('"')) {
        return value.substring(1, value.length - 1).replace('\\"', '"');
    } else {
        return value;
    }
}

function stringStringify(value: string) {
    // escape quotes and add quotes before and after string
    return '"' + value.replace('"', '\\"') + '"';
}

function specialJsonLoad(value: any, type: any) {
    if (type === "string") return stringParse(value);
    return specialJsonStringify(value, type);
}

function specialJsonParse(value: string, type: any) {
    console.log(value, type)
    switch (type) {
        case 'json':
            return JSON.parse(value);
        case 'array':
            return JSON.parse(value);
        case 'string':
            return stringParse(value);
        case 'boolean':
            return JSON.parse(value);
        case 'number':
            return JSON.parse(value);
        default:
            return JSON.parse(value);
    }
}

function getDefaultValueRecordString(type: string): ValueRecordString {
    return {
        id: '',
        config: '',
        environment: '',
        key: '',
        type: type,
        value: specialJsonStringify(getDefaultValue(type), type),
    } as unknown as ValueRecordString;
}

function getDefaultValue(type: string) {
    switch (type) {
        case 'string':
            return '';
        case 'boolean':
            return false;
        case 'number':
            return 0;
        case 'json':
            return {};
        case 'array':
            return [];
        default:
            return '';
    }
}

export default function Config() {
    const [environment, team, project, config, flagsData, valuesInDB, apiKeysData] = useLoaderData() as ConfigLoaderData;

    // These values can be updated during the session, so we need to keep track of them separately
    const [flags, setFlags] = useState<FlagRecord[]>([]);
    const [apiKeys, setApiKeys] = useState<ApiKeyRecord[]>(apiKeysData);

    const [originalValues, setOriginalValues] = useState<ValueRecordString[]>([]);
    const [editedValues, setEditedValues] = useState<ValueRecordString[]>([]);

    const [newFlagName, setNewFlagName] = useState<string>('');
    const [newFlagIdentifier, setNewFlagIdentifier] = useState<string>('');
    const [newFlagIdentifierIsDefault, setNewFlagIdentifierIsDefault] = useState<boolean>(true);
    const [newFlagType, setNewFlagType] = useState<DashboardSelectItem | null>(null);
    const [newFlagError, setNewFlagError] = useState<string>('');

    useEffect(() => {
        setFlags(flagsData);
    }, [flagsData]);

    useEffect(() => {
        console.log(valuesInDB, flagsData)
        const newValues = valuesInDB.map((v) => {
            const type = flagsData.find(f => f.id === v.flag)?.type;

            v = v.clone() as ValueRecordString;

            v.value = specialJsonLoad(v.value, type);

            return v as ValueRecordString;
        });

        setOriginalValues(JSON.parse(JSON.stringify(newValues)));
        setEditedValues(JSON.parse(JSON.stringify(newValues)));
    }, [valuesInDB, flagsData]);

    useEffect(() => {
        setApiKeys(apiKeysData);
    }, [apiKeysData]);

    const createNewFlag = () => {
        // create flag and value records
        if (newFlagName === '') {
            setNewFlagError('Flag name cannot be blank');
            setTimeout(() => setNewFlagError(''), 5000);
            return;
        }

        if (newFlagIdentifier === '') {
            setNewFlagError('Flag identifier cannot be blank');
            setTimeout(() => setNewFlagError(''), 5000);
            return;
        }

        if (newFlagType === null) {
            setNewFlagError('Flag type cannot be blank');
            setTimeout(() => setNewFlagError(''), 5000);
            return;
        }

        if (environment === undefined) {
            setNewFlagError('Environment not found');
            setTimeout(() => setNewFlagError(''), 5000);
            return;
        }

        pocketbase.collection('flag').create({
            config: config.id,
            type: newFlagType.value,
            name: newFlagName,
            identifier: newFlagIdentifier
        }).then((responseFlag) => {
            pocketbase.collection('value').create({
                environment: environment.id,
                flag: responseFlag.id,
                value: getDefaultValue(newFlagType.value)
            }).then((response) => {
                setFlags(flags => {
                    return [...flags, responseFlag.clone() as FlagRecord];
                });

                // update value to use string
                response.value = specialJsonStringify(response.value, newFlagType.value);

                setEditedValues(editedValues => [...editedValues, response.clone() as ValueRecordString]);
                setOriginalValues(originalValues => [...originalValues, response.clone() as ValueRecordString]);

                setNewFlagDialogShowing(false);
            }).catch((error) => {
                console.error(error);
            });
        }).catch((error) => {
            console.error(error);
            setNewFlagError('An error occurred while creating the flag');
        });
    }

    const [setNewFlagDialogShowing, newFlagDialog] = useDialog(<Dialog>
        <DialogHeader>
            <h1 className="dialog-heading">Create Flag</h1>
        </DialogHeader>
        <DialogBody class="dialog-form">
            <label class="dialog-input-label">Flag Name:</label>
            <input type="text" class="dialog-input" value={newFlagName} placeholder="Flag Name"
                   onInput={(e) => {
                       setNewFlagName(e.currentTarget.value);

                       if (newFlagIdentifierIsDefault) {
                           // camelcase the name
                           let camelCased = e.currentTarget.value.replace(/^\w|[A-Z]|\b\w/g, function (word, index) {
                               return index === 0 ? word.toLowerCase() : word.toUpperCase();
                           }).replace(/\W+/g, '');

                           setNewFlagIdentifier(camelCased);
                       }
                   }}/>
            <label class="dialog-input-label">Flag Identifier:</label>
            <input type="text" class="dialog-input" value={newFlagIdentifier} placeholder="Flag Identifier"
                   onInput={(e) => {
                       setNewFlagIdentifierIsDefault(false);
                       setNewFlagIdentifier(e.currentTarget.value);
                   }}/>
            <label class="dialog-input-label">Flag Type:</label>
            <SelectInput selectText="Select Type" items={flagTypeArray} onSelectedItemChange={setNewFlagType}/>
        </DialogBody>
        <DialogFooter>
            <button class="dialog-action dialog-action__save" onClick={() => createNewFlag()}>Create
            </button>
            <button class="dialog-action dialog-action__cancel"
                    onClick={() => setNewFlagDialogShowing(false)}>Cancel
            </button>
            <p className="dialog-error">{newFlagError}</p>
        </DialogFooter>
    </Dialog>, {
        afterSetShowing: (showing) => {
            if (!showing) {
                setNewFlagName('');
                setNewFlagIdentifier('');
                setNewFlagType(null);
                setNewFlagIdentifierIsDefault(true);
                setNewFlagError('');
            }
        }
    });

    if (typeof environment === "undefined") {
        return <div class="content">
            <h1>No environments found!</h1>
            <p>Go back to the <Link to="../">project page</Link> to create a new environment.</p>
        </div>;
    }

    // create missing api key
    useEffect(() => {
        if ((apiKeysData.length) === 0 && typeof environment !== "undefined") {
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
    }, [apiKeysData]);

    // create missing values
    useEffect(() => {
        for (let i = 0; i < flagsData.length; i++) {
            const flag = flagsData[i];

            if (valuesInDB.find((v) => v.flag === flag.id) === undefined) {
                pocketbase.collection('value').create({
                    environment: environment.id,
                    flag: flag.id,
                    value: getDefaultValue(flag.type)
                }).then((response) => {
                    // update value to use string
                    response.value = specialJsonStringify(response.value, flag.type);

                    setEditedValues(editedValues => [...editedValues, response.clone() as ValueRecordString]);
                    setOriginalValues(originalValues => [...originalValues, response.clone() as ValueRecordString]);
                }).catch((error) => {
                    console.error(error);
                });
            }
        }
    }, [flagsData, valuesInDB]);

    function setEditedValue(value: ValueRecordString) {
        setEditedValues(ev => ev.map((v) => v.id === value.id ? value : v));
    }

    const getEditedValue = (flag: FlagRecord): ValueRecordString => {
        return editedValues.find((v) => v.flag === flag.id) ?? getDefaultValueRecordString(flag.type) as ValueRecordString; // values don't exist for a very small amount of time, so we need to handle this
    }

    function getOriginalValue(flag: FlagRecord): ValueRecordString {
        return originalValues.find((v) => v.flag === flag.id) ?? getDefaultValueRecordString(flag.type) as ValueRecordString; // values don't exist for a very small amount of time, so we need to handle this
    }

    function setOriginalValue(valueUnsafe: ValueRecordString) {
        // we need to clone the value here because otherwise the originalValues state will be updated with the edited value
        const value = JSON.parse(JSON.stringify(valueUnsafe));

        setOriginalValues(ov => ov.map((v) => v.id === value.id ? value : v));
    }

    function toValueRecordString(value: ValueRecord): ValueRecordString {
        const type = flagsData.find((f) => f.id === value.flag)?.type;

        const newValue = value.clone();
        newValue.value = specialJsonLoad(value.value, type);

        return newValue as ValueRecordString;
    }

    function saveChanges(e: Event) {
        e.preventDefault();

        for (let i = 0; i < editedValues.length; i++) {
            const editedValue = editedValues[i];
            const previousValueIndex = originalValues.findIndex(value => value.id === editedValue.id);
            const previousValue = originalValues[previousValueIndex];

            if (JSON.stringify(previousValue.value) !== JSON.stringify(editedValues[i].value)) {
                const editedValueClone = editedValue.clone();
                editedValueClone.value = specialJsonStringify(editedValue.value, flagsData.find((f) => f.id === editedValue.flag)?.type);

                pocketbase.collection('value').update(editedValue.id, editedValueClone);
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
            const newVal = value.clone();
            newVal.value = specialJsonParse(value.value, flagsData.find((f) => f.id === value.flag)?.type)

            const record = await pocketbase.collection('value').update(value.id, newVal);
            setOriginalValue(toValueRecordString(record as ValueRecord));
            setEditedValue(toValueRecordString(record as ValueRecord));
            return [1, record];
        } catch (e: any) {
            return [0, e];
        }
    }

    const onDelete = (e: Event, flag: FlagRecord) => {
        e.stopPropagation();

        // this is called after deletion is confirmed
        // delete the flag here (it automatically propagates to the values)
        pocketbase.collection('flag').delete(flag.id).then(() => {
            // update flags and values
            setFlags(flags.filter((f) => f.id !== flag.id));
            setEditedValues(editedValues.filter((v) => v.flag !== flag.id));
            setOriginalValues(originalValues.filter((v) => v.flag !== flag.id));
        });
    }

    function resetAll() {
        setEditedValues(JSON.parse(JSON.stringify(originalValues)));
    }

    return <>
        <DashboardNavbar>
            <NavBarBreadcrumbs team={team} project={project} environment={environment}
                               config={config}/>
        </DashboardNavbar>
        <Content pageName="dashboard dashboard-config">
            <SettingCards>
                <h2>Flags</h2>
                {flags.map((flag: FlagRecord) => <SettingCard flag={flag} originalValue={getOriginalValue(flag)}
                                                              onDelete={onDelete}
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
        {newFlagDialog}
    </>;
}

// Loads data for the config page (remember to change the order above if you change this)specialJsonLoad
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
