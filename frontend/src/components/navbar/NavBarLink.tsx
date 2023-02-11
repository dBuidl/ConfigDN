import {Link} from "react-router-dom";
import {ComponentChildren} from "preact";
import {useState} from "preact/compat";

export default function NavBarLink(props: { isExternal?: boolean, href: string, children: ComponentChildren }) {
    const [isAnimating, setIsAnimating] = useState(false);

    function onClick() {
        setIsAnimating(true);

        setTimeout(() => {
            setIsAnimating(false);
        }, 500);
    }

    if (props.isExternal) {
        return <a href={props.href} onClick={onClick}
                  className={`navbar-link navbar-link__animated ${isAnimating ? 'navbar-link__active' : ''}`}>
            <span className="navbar-link__text">{props.children}</span>
            <span className="navbar-link__decoration">
              <span className="navbar-link__decoration__switch"></span>
            </span>
        </a>
    }

    return <Link to={props.href} onClick={onClick}
                 className={`navbar-link navbar-link__animated ${isAnimating ? 'navbar-link__active' : ''}`}>
        <span className="navbar-link__text">{props.children}</span>
        <span className="navbar-link__decoration">
              <span className="navbar-link__decoration__switch"></span>
            </span>
    </Link>
}