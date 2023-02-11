import {PropsWithChildren} from "preact/compat";

export default function DashboardObjects(props: PropsWithChildren) {
    return <div class="dashboard-objects">
        {props.children}
    </div>;
}