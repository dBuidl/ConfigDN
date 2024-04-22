import {PropsWithChildren} from "preact/compat";

export default function DashboardObjectHeader(props: PropsWithChildren) {
    return <div className="dashboard-objects-object-header">
        {props.children}
    </div>;
}