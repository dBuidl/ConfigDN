import {PropsWithChildren} from "preact/compat";

export default function DashboardObjectBody(props: PropsWithChildren) {
    return <div className="dashboard-objects-object-body">
        {props.children}
    </div>;
}