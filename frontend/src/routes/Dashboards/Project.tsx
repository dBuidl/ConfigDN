import pocketbase from "../../libraries/Pocketbase";

export default function Project() {
    return <></>;
}

export function projectLoader({params}: { params: any }) {
    return Promise.all([
        pocketbase.collection('team').getOne(params.team, {}),
        pocketbase.collection('project').getOne(params.project, {}),
        pocketbase.collection('config').getFullList(undefined, {project: params.project}),
        pocketbase.collection('environment').getFullList(undefined, {team: params.team}),
    ]);
}