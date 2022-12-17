import pocketbase from "../../libraries/Pocketbase";

export default function Config() {
    return <></>;
}

export interface ConfigLoaderParams {
    team: string;
    project: string;
    config: string;
    environment?: string;
}

// takes object { params: ConfigLoaderParams, request: Request }
export function configLoader({params}: { params: ConfigLoaderParams }) {
    if (params.environment) {
        return Promise.all([
            pocketbase.collection('team').getOne(params.team, {}),
            pocketbase.collection('project').getOne(params.project, {}),
            pocketbase.collection('config').getOne(params.config, {}),
            pocketbase.collection('environment').getOne(params.environment, {}),
        ]);
    } else {
        return Promise.all([
            pocketbase.collection('team').getOne(params.team, {}),
            pocketbase.collection('project').getOne(params.project, {}),
            pocketbase.collection('config').getOne(params.project, {}),
            pocketbase.collection('environment').getList(1, 1, {config: params.config}),
        ]);
    }
}