import {ComponentChildren} from "preact";
import {PropsWithChildren, useEffect, useRef, useState} from "preact/compat";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCaretDown} from "@fortawesome/free-solid-svg-icons/faCaretDown";

export default function NavBarDropdownLink(props: { children: ComponentChildren, dropdown: ComponentChildren }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) return;

        const closeOnOutsideClick = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("click", closeOnOutsideClick, true);
        return () => document.removeEventListener("click", closeOnOutsideClick, true);
    }, [isOpen]);

    return <div ref={dropdownRef} className="relative">
        <button type="button" aria-expanded={isOpen} onClick={() => setIsOpen(!isOpen)}
                className={`inline-flex min-h-10 cursor-pointer items-center rounded-xl border-0 bg-transparent px-3 text-sm font-semibold text-muted transition hover:bg-panel hover:text-copy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime ${isOpen ? 'bg-panel text-copy' : ''}`}>
            {props.children}
        </button>
        {isOpen && props.dropdown}
    </div>;
}

export function NavBarDropdownLinkText(props: PropsWithChildren) {
    return <span className="whitespace-nowrap">{props.children} <FontAwesomeIcon icon={faCaretDown} />
    </span>
}

export function NavBarDropdownItemContainer(props: PropsWithChildren) {
    return <div className="absolute right-0 top-14 z-50 flex min-w-44 flex-col overflow-hidden rounded-2xl border border-line bg-panel-raised p-1.5 text-left shadow-2xl">{props.children}</div>
}

export function NavBarDropdownItem(props: PropsWithChildren) {
    return <div className="block w-full">{props.children}</div>
}
