import {PropsWithChildren} from "preact/compat";

export default function DialogWide(props: PropsWithChildren) {
    return <div className="dialog dialog__wide">
        {props.children}
    </div>;
}