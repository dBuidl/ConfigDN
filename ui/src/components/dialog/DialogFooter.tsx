import {PropsWithChildren} from "preact/compat";

export default function DialogFooter(props: PropsWithChildren) {
    return <div className="dialog-footer">
        {props.children}
    </div>;
}