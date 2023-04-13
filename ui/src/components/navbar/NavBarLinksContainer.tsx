import {ComponentChildren} from "preact";

export default function NavBarLinksContainer(props: { children: ComponentChildren }) {
    return <div className="navbar-links">
        {props.children}
    </div>;
}