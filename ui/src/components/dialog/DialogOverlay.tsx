import {PropsWithChildren} from "preact/compat";

interface DialogOverlayProps extends PropsWithChildren {
    onClick?: (e: Event) => void;
}

export default function DialogOverlay(props: DialogOverlayProps) {
    return <div role={"button"} className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-ink/75 p-4 backdrop-blur-sm" onClick={props.onClick ? props.onClick : () => null} onKeyDown={(e) => {if (e.key === "Enter" && props.onClick) {props.onClick(e);}}}>
        {props.children}
    </div>;
}
