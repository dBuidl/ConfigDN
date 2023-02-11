import {PropsWithChildren} from "preact/compat";

export default function DashboardObjectsList(props: PropsWithChildren) {
    return <div class="dashboard-objects-list">
        {props.children}
    </div>;
}