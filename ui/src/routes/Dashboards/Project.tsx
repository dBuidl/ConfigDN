import pocketbase from "../../libraries/Pocketbase";
import {ConfigRecord, EnvironmentRecord, ProjectRecord, TeamRecord} from "../../types/Structures";
import {useLoaderData, useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "preact/compat";
import Content from "../../components/general/Content";
import DashboardObjectsTitle from "../../components/dashboard/DashboardObjectsTitle";
import DashboardObjectsList from "../../components/dashboard/DashboardObjectsList";
import DashboardObject from "../../components/dashboard/DashboardObject";
import DashboardObjectHeader from "../../components/dashboard/DashboardObjectHeader";
import DashboardObjectHeaderIcon from "../../components/dashboard/DashboardObjectHeaderIcon";
import DashboardObjectHeaderName from "../../components/dashboard/DashboardObjectHeaderName";
import DashboardObjects from "../../components/dashboard/DashboardObjects";
// @ts-ignore
import Jdenticon from "react-jdenticon";
import DashboardNavbar from "../../components/navbar/DashboardNavbar";
import NavBarBreadcrumbs from "../../components/navbar/NavBarBreadcrumbs";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons/faPlus";
import useDialog from "../../hooks/useDialog";
import Dialog from "../../components/dialog/Dialog";
import DialogHeader from "../../components/dialog/DialogHeader";
import DialogBody from "../../components/dialog/DialogBody";
import DialogFooter from "../../components/dialog/DialogFooter";
import DashboardObjectActions from "../../components/dashboard/DashboardObjectActions";
import DashboardObjectAction from "../../components/dashboard/DashboardObjectAction";
import {faTrash} from "@fortawesome/free-solid-svg-icons/faTrash";

export default function Project() {
    const [team, project, configsData, environmentsData] = useLoaderData() as ProjectLoaderData;
    const navigate = useNavigate();

    const [configs, setConfigs] = useState<ConfigRecord[]>([]);
    const [environments, setEnvironments] = useState<EnvironmentRecord[]>([]);

    const [newConfigName, setNewConfigName] = useState<string>('');
    const [newEnvironmentName, setNewEnvironmentName] = useState<string>('');
    const [configError, setConfigError] = useState<string>('');
    const [environmentError, setEnvironmentError] = useState<string>('');

    const [deleteObjectType, setDeleteObjectType] = useState<string>(''); // config or environment
    const [deleteObject, setDeleteObject] = useState<ConfigRecord | EnvironmentRecord | null>(null);
    const [deleteObjectError, setDeleteObjectError] = useState<string>('');

    // Handles react router not updating the page when the user navigates to the same page with different params (and the initial load)
    useEffect(() => {
        setConfigs(configsData);
    }, [configsData]);

    useEffect(() => {
        setEnvironments(environmentsData);
    }, [environmentsData]);

    const createConfig = () => {
        if (newConfigName.length === 0) {
            setConfigError('Error: Config name cannot be empty.');
            setTimeout(() => setConfigError(''), 5000);
            return;
        }

        pocketbase.collection('config').create({
            name: newConfigName,
            project: project.id,
        }).then((configRecord) => {
            setConfigs(configsNow => [...configsNow, configRecord as ConfigRecord]);
            setCreateConfigDialogOpen(false);
        }).catch((e) => {
            console.error(e);
            setConfigError('Error: Could not create config.');
            setTimeout(() => setConfigError(''), 5000);
        });
    }

    const createEnvironment = () => {
        // create environment
        if (newEnvironmentName.length === 0) {
            setEnvironmentError('Error: Environment name cannot be empty.');
            setTimeout(() => setEnvironmentError(''), 5000);
            return;
        }

        pocketbase.collection('environment').create({
            name: newEnvironmentName,
            project: project.id,
        }).then((environmentRecord) => {
            setEnvironments(environmentsNow => [...environmentsNow, environmentRecord as EnvironmentRecord]);
            setCreateEnvironmentDialogOpen(false);
        }).catch((e) => {
            console.error(e);
            setEnvironmentError('Error: Could not create environment.');
            setTimeout(() => setEnvironmentError(''), 5000);
        });
    }

    const [setDeleteObjectDialogOpen, deleteObjectDialog] = useDialog(<Dialog>
        <DialogHeader>
            <h1 className="dialog-heading">Delete {deleteObjectType}</h1>
        </DialogHeader>
        <DialogBody class="dialog-form">
            <p>Are you sure you want to delete the {deleteObjectType} {deleteObject?.name}?</p>
        </DialogBody>
        <DialogFooter>
            <button class="dialog-action dialog-action__delete" onClick={() => deleteObjectFunc()}>Delete
            </button>
            <button class="dialog-action dialog-action__cancel"
                    onClick={() => setDeleteObjectDialogOpen(false)}>Cancel
            </button>
            <p className="dialog-error">{deleteObjectError}</p>
        </DialogFooter>
    </Dialog>, {
        afterSetShowing: (showing) => {
            if (!showing) {
                setDeleteObjectType('');
                setDeleteObject(null);
                setDeleteObjectError('');
            }
        }
    });

    const deleteObjectFunc = () => {
        if (deleteObject === null) {
            setDeleteObjectError('Error: Could not delete object.');
            return;
        }

        if (deleteObjectType === 'config') {
            pocketbase.collection('config').delete(deleteObject?.id).then(() => {
                setConfigs(configsNow => configsNow.filter(config => config.id !== deleteObject?.id));
                setDeleteObjectDialogOpen(false);
            }).catch((e) => {
                console.error(e);
                setDeleteObjectError('Error: Could not delete config.');
                setTimeout(() => setDeleteObjectError(''), 5000);
            });
        } else if (deleteObjectType === 'environment') {
            pocketbase.collection('environment').delete(deleteObject?.id).then(() => {
                setEnvironments(environmentsNow => environmentsNow.filter(environment => environment.id !== deleteObject?.id));
                setDeleteObjectDialogOpen(false);
            }).catch((e) => {
                console.error(e);
                setDeleteObjectError('Error: Could not delete environment.');
                setTimeout(() => setDeleteObjectError(''), 5000);
            });
        }
    }

    const [setCreateConfigDialogOpen, createConfigDialog] = useDialog(<Dialog>
        <DialogHeader>
            <h1 className="dialog-heading">Create Config</h1>
        </DialogHeader>
        <DialogBody class="dialog-form">
            <label class="dialog-input-label">Config Name:</label>
            <input type="text" class="dialog-input" value={newConfigName} placeholder="Config Name"
                   onInput={(e) => setNewConfigName(e.currentTarget.value)}/>
        </DialogBody>
        <DialogFooter>
            <button class="dialog-action dialog-action__save" onClick={() => createConfig()}>Create
            </button>
            <button class="dialog-action dialog-action__cancel"
                    onClick={() => setCreateConfigDialogOpen(false)}>Cancel
            </button>
            <p className="dialog-error">{configError}</p>
        </DialogFooter>
    </Dialog>, {
        afterSetShowing: (showing) => {
            if (!showing) {
                setNewConfigName('');
                setConfigError('');
            }
        }
    });

    const [setCreateEnvironmentDialogOpen, createEnvironmentDialog] = useDialog(<Dialog>
        <DialogHeader>
            <h1 className="dialog-heading">Create Environment</h1>
        </DialogHeader>
        <DialogBody class="dialog-form">
            <label class="dialog-input-label">Environment Name:</label>
            <input type="text" class="dialog-input" value={newEnvironmentName} placeholder="Environment Name"
                   onInput={(e) => setNewEnvironmentName(e.currentTarget.value)}/>
        </DialogBody>
        <DialogFooter>
            <button class="dialog-action dialog-action__save" onClick={() => createEnvironment()}>Create
            </button>
            <button class="dialog-action dialog-action__cancel"
                    onClick={() => setCreateEnvironmentDialogOpen(false)}>Cancel
            </button>
            <p className="dialog-error">{environmentError}</p>
        </DialogFooter>
    </Dialog>, {
        afterSetShowing: (showing) => {
            if (!showing) {
                setNewEnvironmentName('');
                setEnvironmentError('');
            }
        }
    });

    const onDeleteConfig = (e: Event, config: ConfigRecord) => {
        e.stopPropagation();
        setDeleteObjectType('config');
        setDeleteObject(config);
        setDeleteObjectDialogOpen(true);
    }

    const onDeleteEnvironment = (e: Event, environment: EnvironmentRecord) => {
        e.stopPropagation();
        setDeleteObjectType('environment');
        setDeleteObject(environment);
        setDeleteObjectDialogOpen(true);
    }

    return <>
        <DashboardNavbar>
            <NavBarBreadcrumbs team={team} project={project}/>
        </DashboardNavbar>
        <Content pageName={"dashboard"}>
            <DashboardObjects>
                <DashboardObjectsTitle>Environments</DashboardObjectsTitle>
                <DashboardObjectsList>
                    {environments.map((environment: EnvironmentRecord) => <DashboardObject>
                        <DashboardObjectHeader>
                            <DashboardObjectHeaderIcon>
                                <Jdenticon value={environment.name}/>
                            </DashboardObjectHeaderIcon>
                            <DashboardObjectHeaderName>{environment.name}</DashboardObjectHeaderName>
                            <DashboardObjectActions>
                                <DashboardObjectAction onClick={(e) => onDeleteEnvironment(e, environment)}>
                                    <FontAwesomeIcon icon={faTrash}/>
                                </DashboardObjectAction>
                            </DashboardObjectActions>
                        </DashboardObjectHeader>
                    </DashboardObject>)}
                    <DashboardObject
                        onClick={() => setCreateEnvironmentDialogOpen(true)}>
                        <DashboardObjectHeader>
                            <DashboardObjectHeaderIcon>
                                <FontAwesomeIcon icon={faPlus}/>
                            </DashboardObjectHeaderIcon>
                            <DashboardObjectHeaderName>New Environment</DashboardObjectHeaderName>
                        </DashboardObjectHeader>
                    </DashboardObject>
                </DashboardObjectsList>
            </DashboardObjects>

            <DashboardObjects>
                <DashboardObjectsTitle>Configs</DashboardObjectsTitle>
                <DashboardObjectsList>
                    {configs.map((config: ConfigRecord) => <DashboardObject
                        onClick={() => environments.length === 0 ? navigate(`./${config.id}`) : navigate(`./${config.id}/${environments[0].id}`)}>
                        <DashboardObjectHeader>
                            <DashboardObjectHeaderIcon>
                                <Jdenticon value={config.name}/>
                            </DashboardObjectHeaderIcon>
                            <DashboardObjectHeaderName>{config.name}</DashboardObjectHeaderName>
                            <DashboardObjectActions>
                                <DashboardObjectAction onClick={(e) => onDeleteConfig(e, config)}>
                                    <FontAwesomeIcon icon={faTrash}/>
                                </DashboardObjectAction>
                            </DashboardObjectActions>
                        </DashboardObjectHeader>
                    </DashboardObject>)}
                    <DashboardObject
                        onClick={() => setCreateConfigDialogOpen(true)}>
                        <DashboardObjectHeader>
                            <DashboardObjectHeaderIcon>
                                <FontAwesomeIcon icon={faPlus}/>
                            </DashboardObjectHeaderIcon>
                            <DashboardObjectHeaderName>New Config</DashboardObjectHeaderName>
                        </DashboardObjectHeader>
                    </DashboardObject>
                </DashboardObjectsList>
            </DashboardObjects>
        </Content>
        {createConfigDialog}
        {createEnvironmentDialog}
        {deleteObjectDialog}
    </>;
}

export function projectLoader({params}: { params: any }) {
    return Promise.all([
        pocketbase.collection('team').getOne(params.team),
        pocketbase.collection('project').getOne(params.project, {}),
        pocketbase.collection('config').getFullList(undefined, {filter: `project = "${params.project}"`}),
        pocketbase.collection('environment').getFullList(undefined, {filter: `project = "${params.project}"`}),
    ]);
}

export type ProjectLoaderData = [TeamRecord, ProjectRecord, Array<ConfigRecord>, Array<EnvironmentRecord>];