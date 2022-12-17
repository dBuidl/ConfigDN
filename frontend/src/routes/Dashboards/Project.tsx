import pocketbase from "../../libraries/Pocketbase";

export default function Project() {
    return <></>;
}

export function projectLoader({params}: { params: any }) {
    return Promise.all([
        pocketbase.collection('team').getOne(params.team, {}),
        pocketbase.collection('project').getOne(params.project, {}),
    ]);
}