import {PropsWithChildren} from "preact/compat";

interface DashboardObjectActionsProps {
    onClick?: (e: Event) => void;
}

export default function DashboardObjectAction(props: PropsWithChildren<DashboardObjectActionsProps>) {
    // an action (button) in the footer of an object (team/project/config/environment)
    return <button className="dashboard-objects-object-action" onClick={props.onClick ? props.onClick : () => null}>
        {props.children}
    </button>;
}