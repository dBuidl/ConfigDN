import {PropsWithChildren} from "preact/compat";

export default function Dialog(props: PropsWithChildren) {
    return <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-line bg-panel shadow-2xl">
        {props.children}
    </div>;
}
