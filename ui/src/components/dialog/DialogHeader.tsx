import {PropsWithChildren} from "preact/compat";

export default function DialogHeader(props: PropsWithChildren) {
    return <div className="border-b border-line/70 px-6 py-5 [&_.dialog-heading]:text-xl [&_.dialog-heading]:font-semibold [&_.dialog-heading]:tracking-tight [&_.dialog-heading]:text-copy">
        {props.children}
    </div>;
}
