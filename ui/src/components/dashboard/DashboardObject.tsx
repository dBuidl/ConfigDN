import {PropsWithChildren} from "preact/compat";

interface PropsWithChildrenAndOnClick extends PropsWithChildren {
    onClick?: () => void;
}

export default function DashboardObject(props: PropsWithChildrenAndOnClick) {
    return <div role={"button"} className={`dashboard-objects-object ${props.onClick ? "dashboard-objects-object__clickable" : ""}`}
                onClick={props.onClick ? props.onClick : () => null} /* we love keyboard too */ onKeyDown={e => {if (e.key === "Enter" && props.onClick) {props.onClick();}}
    } >
        {props.children}
    </div>;
}