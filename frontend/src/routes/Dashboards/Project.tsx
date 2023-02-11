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

export default function Project() {
    const [team, project, configs, environments] = useLoaderData() as ProjectLoaderData;
    const navigate = useNavigate();

    return <Content pageName={"dashboard"}>
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
            </DashboardObjectsList>
        </DashboardObjects>
    </Content>;
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