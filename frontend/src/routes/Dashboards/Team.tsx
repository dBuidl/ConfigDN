import pocketbase from "../../libraries/Pocketbase";
import {useLoaderData, useNavigate} from "react-router-dom";
import {ProjectRecord, TeamRecord} from "../../types/Structures";
import DashboardUserSection from "../../components/dashboard/DashboardUserSection";
import React from "preact/compat";
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

export default function Team() {
    const [team, projects] = useLoaderData() as TeamLoaderData;
    const navigate = useNavigate();

    return <Content pageName={"dashboard"}>
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
            </DashboardObjectsList>
        </DashboardObjects>

        {team.owner === pocketbase.authStore.model?.id && <DashboardObjects>
            <DashboardObjectsTitle>Members</DashboardObjectsTitle>
            <DashboardObjectsList>
                <DashboardUserSection title={"Owner"} expand={team.expand.owner}/>
                <DashboardUserSection title={"Admin"} expand={team.expand.admins}/>
                <DashboardUserSection title={"Editor"} expand={team.expand.editors}/>
                <DashboardUserSection title={"Viewer"} expand={team.expand.viewers}/>
            </DashboardObjectsList>
        </DashboardObjects>}
    </Content>;
}

export function teamLoader({params}: { params: any }) {
    return Promise.all([
        pocketbase.collection('team').getOne(params.team, {expand: "owner,admins,editors,viewers"}),
        pocketbase.collection('project').getFullList(undefined, {filter: `team = "${params.team}"`}),
    ]);
}

export type TeamLoaderData = [TeamRecord, Array<ProjectRecord>];