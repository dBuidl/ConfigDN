import {PropsWithChildren} from "preact/compat";

export default function DashboardObjectHeaderName(props: PropsWithChildren) {
    return <div class="dashboard-objects-object-name">
        {props.children}
    </div>;
}