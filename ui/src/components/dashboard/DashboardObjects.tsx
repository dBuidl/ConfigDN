import {PropsWithChildren} from "preact/compat";

export default function DashboardObjects(props: PropsWithChildren) {
    return <div className="mb-10">
        {props.children}
    </div>;
}
