import pocketbase from "../../libraries/Pocketbase";
import {useLoaderData, useNavigate} from "react-router-dom";
import {ProjectRecord, TeamRecord} from "../../types/Structures";
import ExpandUserSection from "../../components/ExpandUserSection";

export default function Team() {
    const [team, projects] = useLoaderData() as TeamLoaderData;
    const navigate = useNavigate();

    return <>
        <h1>{team.name}</h1>

        {/* List of people (only shown to the owner), loop through each expand prop and render a <ExpandUserSection /> */}
        {team.owner === pocketbase.authStore.model?.id && <>
            <ExpandUserSection title={"Owner"} expand={team.expand.owner}/>
            <ExpandUserSection title={"Admins"} expand={team.expand.admins}/>
            <ExpandUserSection title={"Editors"} expand={team.expand.editors}/>
            <ExpandUserSection title={"Viewers"} expand={team.expand.viewers}/>
        </>}

        {/* List of projects */}
        <h2>Projects</h2>
        <div class={"project-cards"}>
            {projects.map((project: ProjectRecord) => <div class={"project-card"}
                                                           onClick={() => navigate(`./${project.id}`)}>
                <img src={`https://robohash.org/${project.name}.png?set=set4&size=150x150`} alt={project.name}/>
                <h3>{project.name}</h3>
            </div>)}
        </div>
    </>;
}

export function teamLoader({params}: { params: any }) {
    return Promise.all([
        pocketbase.collection('team').getOne(params.team, {expand: "owner,admins,editors,viewers"}),
        pocketbase.collection('project').getFullList(undefined, {filter: `team = "${params.team}"`}),
    ]);
}

export type TeamLoaderData = [TeamRecord, Array<ProjectRecord>];