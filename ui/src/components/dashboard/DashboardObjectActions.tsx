import {PropsWithChildren} from "preact/compat";

export default function DashboardObjectActions(props: PropsWithChildren) {
    return <div className="relative z-20 ml-auto flex items-center gap-1">
        {props.children}
    </div>;
}
