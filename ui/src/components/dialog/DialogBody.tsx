import {PropsWithChildren} from "preact/compat";

interface DialogBodyProps extends PropsWithChildren {
    class?: string;
}

export default function DialogBody(props: DialogBodyProps) {
    return <div className={`dialog-body ${props.class ?? ""}`}>
        {props.children}
    </div>;
}