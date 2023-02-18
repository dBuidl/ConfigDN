import {PropsWithChildren} from "preact/compat";

export default function DialogBody(props: PropsWithChildren) {
    return <div className="dialog-body">
        {props.children}
    </div>;
}