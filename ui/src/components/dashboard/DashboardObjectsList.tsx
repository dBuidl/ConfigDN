import {PropsWithChildren} from "preact/compat";

export default function DashboardObjectsList(props: PropsWithChildren) {
    return <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {props.children}
    </div>;
}
