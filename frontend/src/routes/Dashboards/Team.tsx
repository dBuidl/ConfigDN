import pocketbase from "../../libraries/Pocketbase";

export default function Team() {
    return <></>;
}

export function teamLoader({params}: { params: any }) {
    return Promise.all([
        pocketbase.collection('team').getOne(params.team, {}),
        pocketbase.collection('project').getFullList(undefined, {team: params.team}),
    ]);
}