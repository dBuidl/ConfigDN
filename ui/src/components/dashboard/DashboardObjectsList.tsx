import {PropsWithChildren} from "preact/compat";

export default function DashboardObjectsList(props: PropsWithChildren) {
    return <div className="dashboard-objects-list">
        {props.children}
    </div>;
}