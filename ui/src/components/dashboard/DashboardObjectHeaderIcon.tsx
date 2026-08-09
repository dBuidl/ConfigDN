import {PropsWithChildren} from "preact/compat";

export default function DashboardObjectHeaderIcon(props: PropsWithChildren) {
    return <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-line bg-ink text-cyan">
        {props.children}
    </div>;
}
