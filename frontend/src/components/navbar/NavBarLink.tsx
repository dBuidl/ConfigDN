import {Link} from "react-router-dom";
import {ComponentChildren} from "preact";

export default function NavBarLink(props: { isExternal?: boolean, href: string, children: ComponentChildren }) {
    if (props.isExternal) {
        return <a href={props.href} className="navbar-link navbar-link__animated">
            <span className="navbar-link__text">{props.children}</span>
            <span className="navbar-link__decoration">
              <span className="navbar-link__decoration__switch"></span>
            </span>
        </a>
    }

    return <Link to={props.href} className="navbar-link navbar-link__animated">
        <span className="navbar-link__text">{props.children}</span>
        <span className="navbar-link__decoration">
              <span className="navbar-link__decoration__switch"></span>
            </span>
    </Link>
}