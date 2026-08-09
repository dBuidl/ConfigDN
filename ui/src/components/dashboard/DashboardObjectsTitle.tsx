import {PropsWithChildren} from "preact/compat";

export default function DashboardObjectsTitle(props: PropsWithChildren) {
    return <h1 className="mb-4 flex items-end text-2xl font-semibold tracking-tight text-copy after:ml-4 after:mb-1 after:h-px after:flex-1 after:bg-line/70">{props.children}</h1>;
}
