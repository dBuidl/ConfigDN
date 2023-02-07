import React from "preact/compat";
import Breadcrumbs from "../../components/old/Breadcrumbs";

export default function DashboardNavbar(props: { route: Array<{ name: string, path: string }> }) {
    return <>
        <Breadcrumbs route={props.route}/>
    </>;
}