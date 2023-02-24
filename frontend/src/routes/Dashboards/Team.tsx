import pocketbase from "../../libraries/Pocketbase";
import {useLoaderData, useNavigate} from "react-router-dom";
import {ProjectRecord, TeamRecord} from "../../types/Structures";
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

export default function Team() {
    const [teamData, projectsData] = useLoaderData() as TeamLoaderData;
    const [projects, setProjects] = useState<ProjectRecord[]>(projectsData);
    const [newProjectName, setNewProjectName] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [team, setTeam] = useState<TeamRecord>(teamData);
    const navigate = useNavigate();

    // Create project dialog TODO: Finish this & Do one for adding users to a team
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
                    onClick={() => null}>Create
            </button>
            <button className="dialog-action dialog-action__cancel"
                    onClick={() => setProjectCreateDialogShowing(false)}>Cancel
            </button>
            <p class="dialog-error">{error}</p>
        </DialogFooter>
    </Dialog>, {});

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
                        onClick={() => null}>
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
                        onClick={() => null}>
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
    </>;
}

export function teamLoader({params}: { params: any }) {
    return Promise.all([
        pocketbase.collection('team').getOne(params.team, {expand: "owner,admins,editors,viewers"}),
        pocketbase.collection('project').getFullList(undefined, {filter: `team = "${params.team}"`}),
    ]);
}

export type TeamLoaderData = [TeamRecord, Array<ProjectRecord>];