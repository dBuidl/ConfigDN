import pocketbase from "../../libraries/Pocketbase";
import {ConfigRecord, EnvironmentRecord, ProjectRecord, TeamRecord} from "../../types/Structures";
import {useLoaderData, useNavigate} from "react-router-dom";
import React from "preact/compat";
import {ContentNavigation, ContentWithNavigation} from "../../components/Content";
import "../../styles/dashboard/project.scss";

export default function Project() {
    const [team, project, configs, environments] = useLoaderData() as ProjectLoaderData;
    const navigate = useNavigate();

    return <>
        <ContentNavigation>
            <h1>{team.name}/{project.name}</h1>
        </ContentNavigation>
        <ContentWithNavigation class={"page-project"}>
            <h2>Environments</h2>
            <div class={"environment-cards"}>
                {environments.map((environment: EnvironmentRecord) => <div class={"environment-card"}>
                    <img src={`https://robohash.org/${environment.name}.png?set=set4&size=150x150`}
                         alt={environment.name}/>
                    <h3>{environment.name}</h3>
                </div>)}
            </div>
            <h2>Configs</h2>
            <div class={"config-cards"}>
                {configs.map((config: ConfigRecord) => <div class={"config-card"}
                                                            onClick={() => environments.length === 0 ? navigate(`./${config.id}`) : navigate(`./${config.id}/${environments[0].id}`)}>
                    <img src={`https://robohash.org/${config.name}.png?set=set4&size=150x150`} alt={config.name}/>
                    <h3>{config.name}</h3>
                </div>)}
            </div>
        </ContentWithNavigation>
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