import {ComponentChildren} from "preact";

export default function NavBarLinksContainer(props: { children: ComponentChildren }) {
    return <div className="flex min-w-0 flex-1 items-center justify-end gap-1">
        {props.children}
    </div>;
}
