import pocketbase from "../../libraries/Pocketbase";
import {useLoaderData, useNavigate} from "react-router-dom";
import {TeamRecord} from "../../types/Structures";
import DashboardObjects from "../../components/dashboard/DashboardObjects";
import DashboardObjectsTitle from "../../components/dashboard/DashboardObjectsTitle";
import DashboardObjectsList from "../../components/dashboard/DashboardObjectsList";
import DashboardObject from "../../components/dashboard/DashboardObject";
import DashboardObjectHeader from "../../components/dashboard/DashboardObjectHeader";
import DashboardObjectHeaderIcon from "../../components/dashboard/DashboardObjectHeaderIcon";
import DashboardObjectHeaderName from "../../components/dashboard/DashboardObjectHeaderName";
import React from "preact/compat";
import Content from "../../components/general/Content";
// @ts-ignore
import Jdenticon from "react-jdenticon";
import DashboardNavbar from "../../components/navbar/DashboardNavbar";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons/faPlus";
import useDialog from "../../hooks/useDialog";
import Dialog from "../../components/dialog/Dialog";
import DialogHeader from "../../components/dialog/DialogHeader";
import DialogBody from "../../components/dialog/DialogBody";
import DialogFooter from "../../components/dialog/DialogFooter";

export default function Overview() {
    const [teams] = useLoaderData() as OverviewData;
    const navigate = useNavigate();
    const [setCreateTeamDialogShowing, createTeamDialog] = useDialog(<Dialog>
        <DialogHeader>
            <h1 class="dialog-heading">Create Team</h1>
        </DialogHeader>
        <DialogBody class="dialog-form">
            <p class="di">Enter the name of the team you want to create.</p>
            <input type="text" placeholder="Team Name"/>
        </DialogBody>
        <DialogFooter>
            <button className="dialog-action dialog-action__save"
                    onClick={() => null}>Create
            </button>
            <button className="dialog-action dialog-action__cancel"
                    onClick={() => setCreateTeamDialogShowing(false)}>Cancel
            </button>
        </DialogFooter>
    </Dialog>);

    return <>
        <DashboardNavbar/>
        <Content pageName={"dashboard"}>
            {/* List of teams */}
            <DashboardObjects>
                <DashboardObjectsTitle>Teams</DashboardObjectsTitle>
                <DashboardObjectsList>
                    {teams.map((team: TeamRecord) => <DashboardObject key={team.id}
                                                                      onClick={() => navigate(`./${team.id}`)}>
                        <DashboardObjectHeader>
                            <DashboardObjectHeaderIcon>
                                <Jdenticon value={team.name}/>
                            </DashboardObjectHeaderIcon>
                            <DashboardObjectHeaderName>{team.name}</DashboardObjectHeaderName>
                        </DashboardObjectHeader>
                    </DashboardObject>)}
                    <DashboardObject
                        onClick={() => setCreateTeamDialogShowing(true)}>
                        <DashboardObjectHeader>
                            <DashboardObjectHeaderIcon>
                                <FontAwesomeIcon icon={faPlus}/>
                            </DashboardObjectHeaderIcon>
                            <DashboardObjectHeaderName>New Team</DashboardObjectHeaderName>
                        </DashboardObjectHeader>
                    </DashboardObject>
                </DashboardObjectsList>
            </DashboardObjects>
            {createTeamDialog}
        </Content>
    </>;
}

export type OverviewData = [TeamRecord[]];

export function overviewLoader() {
    return Promise.all([
        pocketbase.collection('team').getFullList(),
    ]);
}