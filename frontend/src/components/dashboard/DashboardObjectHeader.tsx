import {PropsWithChildren} from "preact/compat";

export default function DashboardObjectHeader(props: PropsWithChildren) {
    return <div class="dashboard-objects-object-header">
        {props.children}
    </div>;
}