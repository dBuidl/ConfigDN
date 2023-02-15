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

export default function Overview() {
    const [teams] = useLoaderData() as OverviewData;
    const navigate = useNavigate();

    return <>
        <DashboardNavbar/>
        <Content pageName={"dashboard"}>
            {/* List of teams */}
            <DashboardObjects>
                <DashboardObjectsTitle>Teams</DashboardObjectsTitle>
                <DashboardObjectsList>
                    {teams.map((team: TeamRecord) => <DashboardObject
                        onClick={() => navigate(`./${team.id}`)}>
                        <DashboardObjectHeader>
                            <DashboardObjectHeaderIcon>
                                <Jdenticon value={team.name}/>
                            </DashboardObjectHeaderIcon>
                            <DashboardObjectHeaderName>{team.name}</DashboardObjectHeaderName>
                        </DashboardObjectHeader>
                    </DashboardObject>)}
                </DashboardObjectsList>
            </DashboardObjects>
        </Content>
    </>;
}

export type OverviewData = [TeamRecord[]];

export function overviewLoader() {
    return Promise.all([
        pocketbase.collection('team').getFullList(),
    ]);
}