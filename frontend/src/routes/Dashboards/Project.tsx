import pocketbase from "../../libraries/Pocketbase";
import {ConfigRecord, EnvironmentRecord, ProjectRecord, TeamRecord} from "../../types/Structures";
import {useLoaderData, useNavigate} from "react-router-dom";
import React from "preact/compat";
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

export default function Project() {
    const [team, project, configsData, environmentsData] = useLoaderData() as ProjectLoaderData;
    const navigate = useNavigate();

    const [configs, setConfigs] = React.useState<ConfigRecord[]>(configsData);
    const [environments, setEnvironments] = React.useState<EnvironmentRecord[]>(environmentsData);

    const [newConfigName, setNewConfigName] = React.useState<string>('');
    const [newEnvironmentName, setNewEnvironmentName] = React.useState<string>('');
    const [configError, setConfigError] = React.useState<string>('');
    const [environmentError, setEnvironmentError] = React.useState<string>('');

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