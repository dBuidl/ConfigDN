import {useParams} from "react-router-dom";
import React from "preact/compat";
import Breadcrumbs from "../../components/Breadcrumbs";

export default function DashboardNavbar(props: { route: Array<{ name: string, path: string }> }) {
    return <>
        <Breadcrumbs route={props.route}/>
    </>;
}