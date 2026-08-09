import {useSelect} from "downshift";
import {createPortal, useEffect, useRef, useState} from "preact/compat";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCaretUp} from "@fortawesome/free-solid-svg-icons/faCaretUp";
import {faCaretDown} from "@fortawesome/free-solid-svg-icons/faCaretDown";
import useDropdownPosition from "../../hooks/useDropdownPosition";

function itemToString(item: DashboardSelectItem | null) {
    return item ? item.title
        : ''
}

function filterAndReplaceFilteredWithNulls(items: DashboardSelectItem[], inputValue: string) {
    return items.map(item => item.title.toLowerCase().includes(inputValue.toLowerCase()) || item.description?.toLowerCase().includes(inputValue.toLowerCase()) ? item : null)
}

export interface DashboardSelectItem {
    value: string
    title: string
    description?: string

}

interface SelectInputProps {
    items: DashboardSelectItem[]
    onSelectedItemChange?: (value: DashboardSelectItem | null) => void
    defaultValue?: DashboardSelectItem | null
    selectText?: string
}

export default function SelectInput(props: SelectInputProps) {
    const [selectedValue, setSelectedValue] = useState<DashboardSelectItem | null>(props.defaultValue ?? null);
    const toggleRef = useRef<HTMLButtonElement>(null);
    const {
        isOpen,
        selectedItem,
        getToggleButtonProps,
        getMenuProps,
        highlightedIndex,
        getItemProps,
        inputValue,
    } = useSelect({
        items: props.items,
        selectedItem: selectedValue,
        itemToString,
        onSelectedItemChange: ({selectedItem}) => {
            const nextItem = selectedItem ?? null;
            setSelectedValue(nextItem);
            props.onSelectedItemChange?.(nextItem);
        },
    })

    useEffect(() => {
        setSelectedValue(props.defaultValue ?? null);
    }, [props.defaultValue?.value]);

    const dropdownPosition = useDropdownPosition(isOpen, toggleRef);
    const menuProps = getMenuProps();
    const menu = isOpen && dropdownPosition && createPortal(
        <ul
            className="fixed z-[100] max-h-64 min-w-44 overflow-y-auto rounded-xl border border-line bg-panel-raised p-1.5 shadow-2xl"
            style={{top: `${dropdownPosition.top}px`, left: `${dropdownPosition.left}px`, width: `${dropdownPosition.width}px`}}
            {...menuProps}
        >
            {filterAndReplaceFilteredWithNulls(props.items, inputValue)
                .map((item, index) => (
                    item &&
                    <li
                        className={`cursor-pointer rounded-lg px-3 py-2 text-sm hover:bg-panel ${highlightedIndex === index || selectedItem?.value === item.value ? 'bg-cyan/10 text-cyan' : ''}`}
                        key={`${item.value}${index}`}
                        {...getItemProps({item, index})}
                    >
                        <span className="block font-semibold">{item.title}</span>
                        <span className="block text-xs text-muted">{item.description ?? ""}</span>
                    </li>
                ))}
        </ul>,
        document.body,
    );

    return (
        <div className="relative min-w-28">
            <button
                type="button"
                className="flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg border border-line bg-panel px-2.5 py-1.5 text-left text-sm text-copy hover:border-cyan"
                {...getToggleButtonProps({ref: toggleRef})}
            >
                <span className="min-w-0 flex-1 overflow-hidden text-ellipsis">{selectedItem ? itemToString(selectedItem) : props.selectText ?? 'Select Item'}</span>
                <span>{isOpen ? <FontAwesomeIcon icon={faCaretUp}/> :
                    <FontAwesomeIcon icon={faCaretDown}/>}</span>
            </button>
            {menu}
        </div>
    )
}
