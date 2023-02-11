import {PropsWithChildren} from "preact/compat";

export default function DashboardObjectHeaderIcon(props: PropsWithChildren) {
    return <div class="dashboard-objects-object-icon">
        {props.children}
    </div>;
}