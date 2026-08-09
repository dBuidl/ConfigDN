import {useCombobox} from "downshift";
import {UserRecord} from "../../types/Structures";
import {createPortal, useEffect, useRef} from "preact/compat";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCaretUp} from "@fortawesome/free-solid-svg-icons/faCaretUp";
import {faCaretDown} from "@fortawesome/free-solid-svg-icons/faCaretDown";
import useDropdownPosition from "../../hooks/useDropdownPosition";

function itemToString(item: UserRecord | null) {
    return item ? item.username : ''
}

function filterAndReplaceFilteredWithNulls(items: UserRecord[], inputValue: string) {
    return items.map(item => item.name.toLowerCase().includes(inputValue.toLowerCase()) || item.username.toLowerCase().includes(inputValue.toLowerCase()) ? item : null)
}

interface DashboardUserSelectProps {
    users: UserRecord[]
    onSelectedUserChange?: (value: UserRecord | null) => void
    reset?: boolean
}

export default function DashboardUserSelect(props: DashboardUserSelectProps) {
    const toggleRef = useRef<HTMLDivElement>(null);
    const {
        isOpen,
        selectedItem,
        getToggleButtonProps,
        getLabelProps,
        getInputProps,
        getMenuProps,
        highlightedIndex,
        getItemProps,
        inputValue,
        reset
    } = useCombobox({
        items: props.users,
        itemToString,
    })

    useEffect(() => {
        if (props.reset) {
            reset();
        }
    }, [props.reset]);

    useEffect(() => {
        // call if the selected item changes
        props.onSelectedUserChange?.(selectedItem);
    }, [selectedItem]);

    const dropdownPosition = useDropdownPosition(isOpen, toggleRef);
    const menuProps = getMenuProps();
    const menu = isOpen && dropdownPosition && createPortal(
        <ul
            className="fixed z-[100] max-h-64 min-w-44 overflow-y-auto rounded-xl border border-line bg-panel-raised p-1.5 shadow-2xl"
            style={{top: `${dropdownPosition.top}px`, left: `${dropdownPosition.left}px`, width: `${dropdownPosition.width}px`}}
            {...menuProps}
        >
            {filterAndReplaceFilteredWithNulls(props.users, inputValue)
                .map((item, index) => (
                    item &&
                    <li
                        className={`cursor-pointer rounded-lg px-3 py-2 text-sm hover:bg-panel ${highlightedIndex === index || selectedItem === item ? 'bg-cyan/10 text-cyan' : ''}`}
                        key={`${item.value}${index}`}
                        {...getItemProps({item, index})}
                    >
                        <span className="block font-semibold">{item.username}</span>
                        <span className="block text-xs text-muted">{item.name ?? ""}</span>
                    </li>
                ))}
        </ul>,
        document.body,
    );

    return (
        <div ref={toggleRef} className="relative min-w-28">
            <div
                className="flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg border border-line bg-panel px-2.5 py-1.5 text-left text-sm text-copy hover:border-cyan"
                {...getToggleButtonProps()}
            >
                {!isOpen ?
                    <label {...getLabelProps()}
                           className="min-w-0 flex-1 overflow-hidden text-ellipsis">{selectedItem ? itemToString(selectedItem) : 'Select User'}</label> :
                    <input {...getInputProps()} className="w-full border-0 bg-transparent text-copy outline-none"
                           placeholder={"Search Users"}/>}
                <span>{isOpen ? <FontAwesomeIcon icon={faCaretUp}/> :
                    <FontAwesomeIcon icon={faCaretDown}/>}</span>
            </div>
            {menu}
        </div>
    );
}
