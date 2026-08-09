import {PropsWithChildren} from "preact/compat";

interface DashboardObjectActionsProps {
    onClick?: (e: Event) => void;
}

export default function DashboardObjectAction(props: PropsWithChildren<DashboardObjectActionsProps>) {
    // an action (button) in the footer of an object (team/project/config/environment)
    return <button className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent text-muted hover:bg-red/10 hover:text-red" onClick={props.onClick ? props.onClick : () => null}>
        {props.children}
    </button>;
}
