import {PropsWithChildren} from "preact/compat";

export default function DashboardObjects(props: PropsWithChildren) {
    return <div className="dashboard-objects">
        {props.children}
    </div>;
}