import {ComponentChildren} from "preact";
import {PropsWithChildren, useState} from "preact/compat";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCaretDown} from "@fortawesome/free-solid-svg-icons/faCaretDown";

export default function NavBarDropdownLink(props: { children: ComponentChildren }) {
    const [isOpen, setIsOpen] = useState(false);

    return <button onClick={() => setIsOpen(!isOpen)}
                   className={`navbar-link navbar-link-dropdown navbar-link__animated ${isOpen ? 'navbar-link-dropdown__active' : ''}`}>
        {props.children}
    </button>
}

export function NavBarDropdownLinkText(props: PropsWithChildren) {
    return <span className="navbar-link__text">{props.children} <FontAwesomeIcon icon={faCaretDown} />
    </span>
}

export function NavBarDropdownItemContainer(props: PropsWithChildren) {
    return <span className={"navbar-link-dropdown-items"}>{props.children}</span>
}

export function NavBarDropdownItem(props: PropsWithChildren) {
    return <span className={"navbar-link-dropdown-items-item"}>{props.children}</span>
}