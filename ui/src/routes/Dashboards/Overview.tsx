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
import React, {useEffect} from "preact/compat";
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
import {faTrash} from "@fortawesome/free-solid-svg-icons/faTrash";
import DashboardObjectActions from "../../components/dashboard/DashboardObjectActions";
import DashboardObjectAction from "../../components/dashboard/DashboardObjectAction";

export default function Overview() {
    const [teamsData] = useLoaderData() as OverviewData;
    const [teams, setTeams] = React.useState<TeamRecord[]>([]);
    const [newTeamName, setNewTeamName] = React.useState<string>('');
    const [error, setError] = React.useState<string>('');
    const [teamToDelete, setTeamToDelete] = React.useState<TeamRecord | null>(null);
    const [teamToDeleteError, setTeamToDeleteError] = React.useState<string>('');

    const navigate = useNavigate();

    useEffect(() => {
        setTeams(teamsData);
    }, [teamsData]);

    const createTeam = () => {
        if (newTeamName.length === 0) {
            setError('Error: Team name cannot be empty.');
            setTimeout(() => setError(''), 5000);
            return;
        }

        pocketbase.collection('team').create({
            name: newTeamName,
            owner: [pocketbase.authStore?.model?.id],
        }).then((team) => {
            setTeams([...teams, team as TeamRecord]);
            setNewTeamName('');
            setCreateTeamDialogShowing(false);
        }).catch((error) => {
            setError("Error Creating Team: " + error.message);
            setTimeout(() => setError(''), 5000);
        });
    }

    const deleteTeam = () => {
        if (teamToDelete === null) {
            return;
        }

        pocketbase.collection('team').delete(teamToDelete.id).then(() => {
            setTeams(tms => tms.filter((team) => team.id !== teamToDelete.id));
            setTeamToDelete(null);
            setDeleteTeamDialogShowing(false);
        }).catch((error) => {
            setTeamToDeleteError("Error Deleting Team: " + error.message);
            setTimeout(() => setTeamToDeleteError(''), 5000);
        });
    }

    const [setDeleteTeamDialogShowing, deleteTeamDialog] = useDialog(<Dialog>
        <DialogHeader>
            <h1 className="dialog-heading">Delete Team</h1>
        </DialogHeader>
        <DialogBody className="dialog-form">
            <p>Are you sure you want to delete the team {teamToDelete?.name}? This is irreversible and will delete all
                associated configs, projects, environments and API Keys.</p>
        </DialogBody>
        <DialogFooter>
            <button className="dialog-action dialog-action__delete" onClick={deleteTeam}>Delete</button>
            <button className="dialog-action dialog-action__cancel"
                    onClick={() => setDeleteTeamDialogShowing(false)}>Cancel
            </button>
            <p className="dialog-error">{teamToDeleteError}</p>
        </DialogFooter>
    </Dialog>, {
        afterSetShowing: (showing) => {
            if (!showing) {
                setTeamToDelete(null);
                setTeamToDeleteError('');
            }
        }
    });

    // create team dialog
    const [setCreateTeamDialogShowing, createTeamDialog] = useDialog(<Dialog>
        <DialogHeader>
            <h1 className="dialog-heading">Create Team</h1>
        </DialogHeader>
        <DialogBody className="dialog-form">
            <label className="dialog-input-label">Team Name:</label>
            <input className="dialog-input" value={newTeamName} onChange={(e) => setNewTeamName(e?.currentTarget.value)}
                   type="text"
                   placeholder="Team Name"/>
        </DialogBody>
        <DialogFooter>
            <button className="dialog-action dialog-action__save"
                    onClick={() => createTeam()}>Create
            </button>
            <button className="dialog-action dialog-action__cancel"
                    onClick={() => setCreateTeamDialogShowing(false)}>Cancel
            </button>
            <p className="dialog-error">{error}</p>
        </DialogFooter>
    </Dialog>, {
        afterSetShowing: (showing) => {
            if (!showing) {
                setNewTeamName('');
            }
        }
    });

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
                            <DashboardObjectActions>
                                {team.owner === pocketbase.authStore.model?.id ?
                                    <DashboardObjectAction onClick={(e) => {
                                        e.stopPropagation();

                                        setTeamToDelete(team);
                                        setDeleteTeamDialogShowing(true);
                                    }}>
                                        <FontAwesomeIcon icon={faTrash}/>
                                    </DashboardObjectAction> : null}
                            </DashboardObjectActions>
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
            {deleteTeamDialog}
        </Content>
    </>;
}

export type OverviewData = [TeamRecord[]];

export function overviewLoader() {
    return Promise.all([
        pocketbase.collection('team').getFullList(),
    ]);
}