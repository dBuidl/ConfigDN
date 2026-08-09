import {PropsWithChildren} from "preact/compat";

interface PropsWithChildrenAndOnClick extends PropsWithChildren {
    onClick?: () => void;
}

export default function DashboardObject(props: PropsWithChildrenAndOnClick) {
    return <div role={"button"} tabIndex={props.onClick ? 0 : -1} className={`relative min-h-28 overflow-hidden rounded-2xl border border-line bg-panel p-4 transition ${props.onClick ? "cursor-pointer hover:-translate-y-0.5 hover:border-cyan/70 hover:bg-panel-raised hover:shadow-[0_16px_40px_rgba(0,0,0,0.22)] focus:outline-none focus:ring-2 focus:ring-lime" : ""}`}
                onClick={props.onClick ? props.onClick : () => null} /* we love keyboard too */ onKeyDown={e => {if (e.key === "Enter" && props.onClick) {props.onClick();}}
    } >
        {props.children}
    </div>;
}
