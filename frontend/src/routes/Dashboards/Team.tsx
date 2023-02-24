import pocketbase from "../../libraries/Pocketbase";
import {useLoaderData, useNavigate} from "react-router-dom";
import {ProjectRecord, TeamRecord, UserRecord} from "../../types/Structures";
import DashboardUserSection from "../../components/dashboard/DashboardUserSection";
import React, {useState} from "preact/compat";
import DashboardObjects from "../../components/dashboard/DashboardObjects";
import DashboardObjectsTitle from "../../components/dashboard/DashboardObjectsTitle";
import DashboardObjectsList from "../../components/dashboard/DashboardObjectsList";
import DashboardObject from "../../components/dashboard/DashboardObject";
import DashboardObjectHeader from "../../components/dashboard/DashboardObjectHeader";
import DashboardObjectHeaderName from "../../components/dashboard/DashboardObjectHeaderName";
import DashboardObjectHeaderIcon from "../../components/dashboard/DashboardObjectHeaderIcon";
// @ts-ignore
import Jdenticon from "react-jdenticon";
import Content from "../../components/general/Content";
import DashboardNavbar from "../../components/navbar/DashboardNavbar";
import NavBarBreadcrumbs from "../../components/navbar/NavBarBreadcrumbs";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons/faPlus";
import useDialog from "../../hooks/useDialog";
import Dialog from "../../components/dialog/Dialog";
import DialogHeader from "../../components/dialog/DialogHeader";
import DialogBody from "../../components/dialog/DialogBody";
import DialogFooter from "../../components/dialog/DialogFooter";
import DashboardUserSelect from "../../components/dashboard/DashboardUserSelect";
import DashboardSelect, {DashboardSelectItem} from "../../components/dashboard/DashboardSelect";

const userRoles: DashboardSelectItem[] = [
    {
        value: "viewers",
        title: "Viewer",
        description: "Can view all flags and values but can't edit anything.",
    },
    {
        value: "editors",
        title: "Editor",
        description: "Can manage, create and delete all flags and values.",
    },
    {
        value: "admins",
        title: "Admin",
        description: "Can manage, create and delete all projects, configs, environments, flags and values.",
    },
];

export default function Team() {
    const [teamData, projectsData, userData] = useLoaderData() as TeamLoaderData;
    const [projects, setProjects] = useState<ProjectRecord[]>(projectsData);
    const [newProjectName, setNewProjectName] = useState<string>("");
    const [userToAdd, setUserToAdd] = useState<UserRecord | null>(null);
    const [userRole, setUserRole] = useState<DashboardSelectItem | null>(userRoles[0]);
    const [error, setError] = useState<string>("");
    const [memberError, setMemberError] = useState<string>("");
    const [team, setTeam] = useState<TeamRecord>(teamData);
    const [reset, setReset] = useState<boolean>(false);
    const navigate = useNavigate();

    const [setProjectCreateDialogShowing, projectCreateDialog] = useDialog(<Dialog>
        <DialogHeader>
            <h1 class="dialog-heading">Create Team</h1>
        </DialogHeader>
        <DialogBody class="dialog-form">
            <label class="dialog-input-label">Project Name:</label>
            <input class="dialog-input" value={newProjectName}
                   onChange={(e) => setNewProjectName(e?.currentTarget.value)}
                   type="text"
                   placeholder="Project Name"/>
        </DialogBody>
        <DialogFooter>
            <button className="dialog-action dialog-action__save"
                    onClick={() => createProject()}>Create
            </button>
            <button className="dialog-action dialog-action__cancel"
                    onClick={() => setProjectCreateDialogShowing(false)}>Cancel
            </button>
            <p class="dialog-error">{error}</p>
        </DialogFooter>
    </Dialog>, {
        afterSetShowing: (showing) => {
            if (!showing) {
                setNewProjectName('');
            }
        }
    });

    const [setUserAddDialogShowing, userAddDialog] = useDialog(<Dialog>
        <DialogHeader>
            <h1 class="dialog-heading">Add User</h1>
        </DialogHeader>
        <DialogBody class="dialog-form">
            <label class="dialog-input-label">User:</label>
            <DashboardUserSelect users={userData} onSelectedUserChange={setUserToAdd} reset={reset}/>
            <label class="dialog-input-label">Role:</label>
            <DashboardSelect items={userRoles} onSelectedItemChange={setUserRole} defaultValue={userRole}/>
        </DialogBody>
        <DialogFooter>
            <button className="dialog-action dialog-action__save"
                    onClick={() => addTeamMember()}>Add Member
            </button>
            <button className="dialog-action dialog-action__cancel"
                    onClick={() => setUserAddDialogShowing(false)}>Cancel
            </button>
            <p class="dialog-error">{memberError}</p>
        </DialogFooter>
    </Dialog>, {
        afterSetShowing: (showing) => {
            if (!showing) {
                setUserToAdd(null);
                setReset(true);
            } else {
                setReset(false);
            }
        }
    });

    const addTeamMember = () => {
        // check vars
        if (userToAdd === null) {
            setMemberError("Please select a user to add");
            setTimeout(() => setMemberError(''), 5000);
            return;
        }

        if (userRole === null) {
            setMemberError("Please select a role for the user");
            setTimeout(() => setMemberError(''), 5000);
            return;
        }

        // check if user is in owner, admins, editors or viewers
        if (team.owner === userToAdd.id) {
            setMemberError("User is already in the team");
            setTimeout(() => setMemberError(''), 5000);
            return;
        }

        if (team.admins.includes(userToAdd.id)) {
            setMemberError("User is already in the team");
            setTimeout(() => setMemberError(''), 5000);
            return;
        }

        if (team.editors.includes(userToAdd.id)) {
            setMemberError("User is already in the team");
            setTimeout(() => setMemberError(''), 5000);
            return;
        }

        if (team.viewers.includes(userToAdd.id)) {
            setMemberError("User is already in the team");
            setTimeout(() => setMemberError(''), 5000);
            return;
        }

        // add user to team
        pocketbase.collection('team').update(team.id, {
            [userRole.value]: [...team[userRole.value], userToAdd.id],
        }).then(() => {
            // need to add it manually because otherwise we lose the extra data
            const userObjectClone = {...userToAdd} as UserRecord;

            setTeam(team => {
                return {
                    ...team,
                    [userRole.value]: [...team[userRole.value], userObjectClone.id],
                    expand: {
                        ...team.expand,
                        // @ts-ignore
                        [userRole.value]: [...team.expand[userRole.value] ?? [], userObjectClone],
                    }
                } as TeamRecord;
            });

            setUserAddDialogShowing(false);
        }).catch((err) => {
            setMemberError("Error adding user to team: " + err);
            setTimeout(() => setMemberError(''), 5000);
        });
    }

    const createProject = () => {
        pocketbase.collection('project').create({
            name: newProjectName,
            team: team.id,
        }).then((project) => {
            setProjects([...projects, project as ProjectRecord]);
            setNewProjectName('');
            setProjectCreateDialogShowing(false);
        }).catch((err) => {
            setError("Error creating project: " + err);
            setTimeout(() => setError(''), 5000);
        });
    }

    return <>
        <DashboardNavbar>
            <NavBarBreadcrumbs team={team}/>
        </DashboardNavbar>
        <Content pageName={"dashboard"}>
            {/* List of projects */}
            <DashboardObjects>
                <DashboardObjectsTitle>Projects</DashboardObjectsTitle>
                <DashboardObjectsList>
                    {projects.map((project: ProjectRecord) => <DashboardObject
                        onClick={() => navigate(`./${project.id}`)}>
                        <DashboardObjectHeader>
                            <DashboardObjectHeaderIcon>
                                <Jdenticon value={project.name}/>
                            </DashboardObjectHeaderIcon>
                            <DashboardObjectHeaderName>{project.name}</DashboardObjectHeaderName>
                        </DashboardObjectHeader>
                    </DashboardObject>)}
                    <DashboardObject
                        onClick={() => setProjectCreateDialogShowing(true)}>
                        <DashboardObjectHeader>
                            <DashboardObjectHeaderIcon>
                                <FontAwesomeIcon icon={faPlus}/>
                            </DashboardObjectHeaderIcon>
                            <DashboardObjectHeaderName>New Project</DashboardObjectHeaderName>
                        </DashboardObjectHeader>
                    </DashboardObject>
                </DashboardObjectsList>
            </DashboardObjects>

            {team.owner === pocketbase.authStore.model?.id && <DashboardObjects>
                <DashboardObjectsTitle>Members</DashboardObjectsTitle>
                <DashboardObjectsList>
                    <DashboardUserSection title={"Owner"} expand={team.expand.owner}/>
                    <DashboardUserSection title={"Admin"} expand={team.expand.admins}/>
                    <DashboardUserSection title={"Editor"} expand={team.expand.editors}/>
                    <DashboardUserSection title={"Viewer"} expand={team.expand.viewers}/>
                    <DashboardObject
                        onClick={() => setUserAddDialogShowing(true)}>
                        <DashboardObjectHeader>
                            <DashboardObjectHeaderIcon>
                                <FontAwesomeIcon icon={faPlus}/>
                            </DashboardObjectHeaderIcon>
                            <DashboardObjectHeaderName>Add Member</DashboardObjectHeaderName>
                        </DashboardObjectHeader>
                    </DashboardObject>
                </DashboardObjectsList>
            </DashboardObjects>}
        </Content>
        {projectCreateDialog}
        {userAddDialog}
    </>;
}

export function teamLoader({params}: { params: any }) {
    return Promise.all([
        pocketbase.collection('team').getOne(params.team, {expand: "owner,admins,editors,viewers"}),
        pocketbase.collection('project').getFullList(undefined, {filter: `team = "${params.team}"`}),
        pocketbase.collection('users').getFullList(),
    ]);
}

export type TeamLoaderData = [TeamRecord, Array<ProjectRecord>, Array<UserRecord>];