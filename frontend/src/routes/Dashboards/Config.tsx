import pocketbase from "../../libraries/Pocketbase";
import {useLoaderData} from "react-router-dom";
import {useEffect, useState} from "preact/compat";

export default function Config() {
    const loaderData = useLoaderData();
    const [config, setConfig] = useState<any>(null);

    useEffect(() => {
        console.log(loaderData);
    }, [loaderData]);


    console.log(loaderData)

    return <></>;
}

// takes object { params: ConfigLoaderParams, request: Request }
export function configLoader({params}: { params: any }) {
    if (params.environment) {
        return Promise.all([
            pocketbase.collection('team').getOne(params.team, {expand: 'owner,admins,editors,viewers'}),
            pocketbase.collection('project').getOne(params.project, {}),
            pocketbase.collection('config').getOne(params.config, {}),
            pocketbase.collection('flag').getFullList(undefined, {config: params.config}),
            pocketbase.collection('value').getFullList(undefined, {config: params.config}),
            pocketbase.collection('environment').getOne(params.environment, {}),
            pocketbase.collection('api_key').getList(1, 50, {"environment.team": params.team, "config": params.config}),
        ]);
    } else {
        return Promise.all([
            pocketbase.collection('team').getOne(params.team, {expand: 'owner,admins,editors,viewers'}),
            pocketbase.collection('project').getOne(params.project, {}),
            pocketbase.collection('config').getOne(params.config, {}),
            pocketbase.collection('flag').getFullList(undefined, {config: params.config}),
            pocketbase.collection('value').getFullList(undefined, {config: params.config}),
            pocketbase.collection('environment').getList(1, 1, {team: params.team}),
            pocketbase.collection('api_key').getList(1, 50, {"environment.team": params.team, "config": params.config}),
        ]);
    }
}