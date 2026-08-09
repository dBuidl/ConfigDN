import {PropsWithChildren} from "preact/compat";

export default function DashboardObjectBody(props: PropsWithChildren) {
    return <div className="relative z-10 mt-3 border-t border-line/60 pt-3 text-sm text-muted">
        {props.children}
    </div>;
}
