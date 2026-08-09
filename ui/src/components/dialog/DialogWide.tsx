import {PropsWithChildren} from "preact/compat";

export default function DialogWide(props: PropsWithChildren) {
    return <div className="w-full max-w-3xl overflow-hidden rounded-3xl border border-line bg-panel shadow-2xl">
        {props.children}
    </div>;
}
