import {Link} from "react-router-dom";
import {ComponentChildren} from "preact";
import {useState} from "preact/compat";

export default function NavBarLink(props: { isExternal?: boolean, href: string, children: ComponentChildren, className?: string }) {
    const [isAnimating, setIsAnimating] = useState(false);

    function onClick() {
        setIsAnimating(true);

        setTimeout(() => {
            setIsAnimating(false);
        }, 500);
    }

    if (props.isExternal) {
        return <a href={props.href} onClick={onClick}
                  className={`inline-flex min-h-10 items-center rounded-xl px-3 text-sm font-semibold text-muted transition hover:bg-panel hover:text-copy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime sm:px-3 ${isAnimating ? 'bg-panel text-copy' : ''} ${props.className ?? ''}`}>
            <span className="whitespace-nowrap">{props.children}</span>
        </a>
    }

    return <Link to={props.href} onClick={onClick}
                 className={`inline-flex min-h-10 items-center rounded-xl px-3 text-sm font-semibold text-muted transition hover:bg-panel hover:text-copy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime sm:px-3 ${isAnimating ? 'bg-panel text-copy' : ''} ${props.className ?? ''}`}>
        <span className="whitespace-nowrap">{props.children}</span>
    </Link>
}
