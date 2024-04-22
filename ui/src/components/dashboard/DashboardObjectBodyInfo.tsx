import {PropsWithChildren} from "preact/compat";

export default function DashboardObjectBodyInfo(props: PropsWithChildren) {
    return <div className="dashboard-objects-object-body-info">
        {props.children}
    </div>;
}