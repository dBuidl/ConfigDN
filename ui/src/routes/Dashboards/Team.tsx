import pocketbase from "../../libraries/Pocketbase";
import {useLoaderData, useNavigate} from "react-router-dom";
import {ProjectRecord, TeamRecord, UserRecord} from "../../types/Structures";
import DashboardUserSection from "../../components/dashboard/DashboardUserSection";
import {useEffect, useState} from "preact/compat";
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
import SelectInput, {DashboardSelectItem} from "../../components/dashboard/SelectInput";
import DashboardObjectActions from "../../components/dashboard/DashboardObjectActions";
import DashboardObjectAction from "../../components/dashboard/DashboardObjectAction";
import {faTrash} from "@fortawesome/free-solid-svg-icons/faTrash";
import DashboardObjectBody from "../../components/dashboard/DashboardObjectBody";

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
    {
        value: "owner",
        title: "Owner",
        description: "Owns this team and can change it in any way. Selecting this option will change the ownership of this team."
    }
];

export default function Team() {
    const [teamData, projectsData, userData] = useLoaderData() as TeamLoaderData;
    const [projects, setProjects] = useState<ProjectRecord[]>(projectsData);
    const [newProjectName, setNewProjectName] = useState<string>("");
    const [userToAdd, setUserToAddInner] = useState<UserRecord | null>(null);
    const [userRole, setUserRoleInner] = useState<DashboardSelectItem | null>(userRoles[0]);
    const [error, setError] = useState<string>("");
    const [memberError, setMemberError] = useState<string>("");
    const [team, setTeam] = useState<TeamRecord>(teamData);
    const [reset, setReset] = useState<boolean>(false);
    const [terribleActionConfirm, setTerribleActionConfirm] = useState<boolean>(false);

    const [deleteObjectType, setDeleteObjectType] = useState<string>("");
    const [deleteObject, setDeleteObject] = useState<ProjectRecord | UserRecord | null>(null);
    const [deleteObjectError, setDeleteObjectError] = useState<string>("");

    // reset the terrible action confirmed if either input is changed.
    function setUserRole(item: DashboardSelectItem | null) {
        setTerribleActionConfirm(false);

        setUserRoleInner(item);
    }

    function setUserToAdd(item: UserRecord | null) {
        setTerribleActionConfirm(false);

        setUserToAddInner(item);
    }

    const navigate = useNavigate();

    useEffect(() => {
        setTeam(teamData);
    }, [teamData]);

    useEffect(() => {
        setProjects(projectsData);
    }, [projectsData]);

    const [setDeleteObjectDialogShowing, deleteObjectDialog] = useDialog(<Dialog>
        <DialogHeader>
            <h1 class="dialog-heading">Delete {deleteObjectType}</h1>
        </DialogHeader>
        <DialogBody class="dialog-form">
            <p>Are you sure you want to remove
                the {deleteObjectType} {deleteObject?.username ?? deleteObject?.name}?</p>
        </DialogBody>
        <DialogFooter>
            <button className="dialog-action dialog-action__delete" onClick={() => deleteObjectFunc()}>Remove</button>
            <button className="dialog-action dialog-action__cancel"
                    onClick={() => setDeleteObjectDialogShowing(false)}>Cancel
            </button>
            <p class="dialog-error">{deleteObjectError}</p>
        </DialogFooter>
    </Dialog>, {
        afterSetShowing: (showing) => {
            if (!showing) {
                setDeleteObjectType("");
                setDeleteObject(null);
                setDeleteObjectError("");
            }
        }
    });

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
            <SelectInput items={userRoles} onSelectedItemChange={setUserRole} defaultValue={userRole}/>
        </DialogBody>
        <DialogFooter>
            <button className={"dialog-action " + (userRole?.value === "owner" ? " dialog-action__delete" : " dialog-action__save")}
                    onClick={() => addTeamMember()}>{userRole?.value === "owner" ? "Transfer Ownership" : "Add Member"}
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
                setTerribleActionConfirm(false);
            } else {
                setReset(false);
            }
        }
    });

    const deleteObjectFunc = async () => {
        if (deleteObject === null) {
            return;
        }

        if (deleteObjectType === "") {
            return;
        }

        if (deleteObjectType === "project") {
            pocketbase.collection("project").delete(deleteObject.id).then(() => {
                setProjects(projects.filter((p) => p.id !== deleteObject.id));
                setDeleteObjectDialogShowing(false);
            }).catch((e) => {
                setDeleteObjectError(e.message);
            });
        }

        if (deleteObjectType === "user") {
            // update team to remove the specified user
            pocketbase.collection("team").update(team.id, {
                admins: team.admins.filter((u) => u !== deleteObject.id),
                editors: team.editors.filter((u) => u !== deleteObject.id),
                viewers: team.viewers.filter((u) => u !== deleteObject.id),
            }).then(() => {
                setTeam((t) => {
                    t.admins = t.admins.filter((u) => u !== deleteObject.id);
                    t.editors = t.editors.filter((u) => u !== deleteObject.id);
                    t.viewers = t.viewers.filter((u) => u !== deleteObject.id);

                    if (t.expand.admins) {
                        t.expand.admins = t.expand.admins.filter((u) => u.id !== deleteObject.id);
                    }

                    if (t.expand.editors) {
                        t.expand.editors = t.expand.editors.filter((u) => u.id !== deleteObject.id);
                    }

                    if (t.expand.viewers) {
                        t.expand.viewers = t.expand.viewers.filter((u) => u.id !== deleteObject.id);
                    }

                    return t;
                });

                setDeleteObjectDialogShowing(false);
            }).catch((e) => {
                setDeleteObjectError(e.message);
            });
        }
    }

    const onUserDelete = (e: Event, user: UserRecord) => {
        e.stopPropagation();
        setDeleteObjectType("user");
        setDeleteObject(user);
        setDeleteObjectDialogShowing(true);
    }

    const onProjectDelete = (e: Event, project: ProjectRecord) => {
        e.stopPropagation();
        setDeleteObjectType("project");
        setDeleteObject(project);
        setDeleteObjectDialogShowing(true);
    }

    const addTeamMember = () => {
        // check vars
        if (userToAdd === null) {
            setMemberError("Please select a user to add");
            setTimeout(() => setMemberError(''), 5000);
            return;
        }

        if (userRole?.value === "owner") {
            if (!terribleActionConfirm) {
                setMemberError("Please click again to confirm that you want to transfer ownership");
                setTimeout(() => setMemberError(''), 5000);
                setTerribleActionConfirm(true);
                return;
            }
        } else {
            setTerribleActionConfirm(false);
        }

        // check if the userRole is owner and warn them that they are about to transfer ownership
        if (userRole?.value === "owner") {
            if (team.owner === userToAdd.id) {
                setMemberError("User is already the owner of the team");
                setTimeout(() => setMemberError(''), 5000);
                return;
            }
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

        let bodyParams: any = {
            [userRole.value]: [...team[userRole.value], userToAdd.id],
        }

        if (userRole.value === "owner") {
            bodyParams = {
                ...bodyParams,
                owner: userToAdd.id,
            }
        }

        // add user to team (or replace owner)
        pocketbase.collection('team').update(team.id, bodyParams).then(() => {
            // need to add it manually because otherwise we lose the extra data
            const userObjectClone = {...userToAdd} as UserRecord;

            setTeam(team => {
                let teamClone = {...team} as TeamRecord;

                if (userRole.value === "owner") {
                    teamClone.owner = userObjectClone.id;
                } else {
                    teamClone[userRole.value].push(userObjectClone.id);

                    // @ts-ignore
                    if (teamClone.expand[userRole.value]) {
                        // @ts-ignore
                        teamClone.expand[userRole.value].push(userObjectClone);
                    }
                }

                return teamClone;
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
                            <DashboardObjectActions>
                                <DashboardObjectAction onClick={(e) => onProjectDelete(e, project)}>
                                    <FontAwesomeIcon icon={faTrash}/>
                                </DashboardObjectAction>
                            </DashboardObjectActions>
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
                    <DashboardUserSection title={"Owner"} expand={team.expand.owner} onUserDelete={onUserDelete}/>
                    <DashboardUserSection title={"Admin"} expand={team.expand.admins} onUserDelete={onUserDelete}/>
                    <DashboardUserSection title={"Editor"} expand={team.expand.editors} onUserDelete={onUserDelete}/>
                    <DashboardUserSection title={"Viewer"} expand={team.expand.viewers} onUserDelete={onUserDelete}/>
                    <DashboardObject
                        onClick={() => setUserAddDialogShowing(true)}>
                        <DashboardObjectHeader>
                            <DashboardObjectHeaderIcon>
                                <FontAwesomeIcon icon={faPlus}/>
                            </DashboardObjectHeaderIcon>
                            <DashboardObjectHeaderName>Add Member</DashboardObjectHeaderName>
                        </DashboardObjectHeader>
                        <DashboardObjectBody>
                            <p>Also allows transfer of ownership.</p>
                        </DashboardObjectBody>
                    </DashboardObject>
                </DashboardObjectsList>
            </DashboardObjects>}
        </Content>
        {projectCreateDialog}
        {userAddDialog}
        {deleteObjectDialog}
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