import {PropsWithChildren} from "preact/compat";

export default function DashboardObjectActions(props: PropsWithChildren) {
    return <div className="dashboard-objects-object-actions">
        {props.children}
    </div>;
}