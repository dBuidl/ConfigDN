import {PropsWithChildren} from "preact/compat";

export default function DashboardObjectBodyInfo(props: PropsWithChildren) {
    return <div className="flex items-center gap-2">
        {props.children}
    </div>;
}
