import {PropsWithChildren} from "preact/compat";

export default function DashboardObjectHeader(props: PropsWithChildren) {
    return <div className="relative z-10 flex items-center gap-3">
        {props.children}
    </div>;
}
