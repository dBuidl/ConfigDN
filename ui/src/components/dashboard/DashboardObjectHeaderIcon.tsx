import {PropsWithChildren} from "preact/compat";

export default function DashboardObjectHeaderIcon(props: PropsWithChildren) {
    return <div className="dashboard-objects-object-icon">
        {props.children}
    </div>;
}