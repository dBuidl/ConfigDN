import {ComponentChildren} from "preact";
import {PropsWithChildren, useState} from "preact/compat";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCaretDown} from "@fortawesome/free-solid-svg-icons/faCaretDown";

export default function NavBarDropdownLink(props: { children: ComponentChildren }) {
    const [isOpen, setIsOpen] = useState(false);

    return <button onClick={() => setIsOpen(!isOpen)}
                   className={`relative inline-flex min-h-10 cursor-pointer items-center rounded-xl border-0 bg-transparent px-3 text-sm font-semibold text-muted transition hover:bg-panel hover:text-copy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime ${isOpen ? 'bg-panel text-copy' : ''}`}>
        {props.children}
    </button>
}

export function NavBarDropdownLinkText(props: PropsWithChildren) {
    return <span className="whitespace-nowrap">{props.children} <FontAwesomeIcon icon={faCaretDown} />
    </span>
}

export function NavBarDropdownItemContainer(props: PropsWithChildren) {
    return <span className="absolute right-0 top-14 z-50 flex min-w-44 flex-col overflow-hidden rounded-2xl border border-line bg-panel-raised p-1.5 text-left shadow-2xl">{props.children}</span>
}

export function NavBarDropdownItem(props: PropsWithChildren) {
    return <span className="block">{props.children}</span>
}
