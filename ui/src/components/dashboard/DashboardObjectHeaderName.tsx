import {PropsWithChildren} from "preact/compat";

export default function DashboardObjectHeaderName(props: PropsWithChildren) {
    return <div className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-base font-semibold text-copy">
        {props.children}
    </div>;
}
