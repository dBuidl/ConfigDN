import {PropsWithChildren} from "preact/compat";

export default function DialogHeader(props: PropsWithChildren) {
    return <div className="dialog-header">
        {props.children}
    </div>;
}