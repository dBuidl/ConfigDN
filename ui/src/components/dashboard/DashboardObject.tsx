import {PropsWithChildren} from "preact/compat";

interface PropsWithChildrenAndOnClick extends PropsWithChildren {
    onClick?: () => void;
}

export default function DashboardObject(props: PropsWithChildrenAndOnClick) {
    return <div class={`dashboard-objects-object ${props.onClick ? "dashboard-objects-object__clickable" : ""}`}
                onClick={props.onClick ? props.onClick : () => null}>
        {props.children}
    </div>;
}