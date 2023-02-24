import {useSelect} from "downshift";
import React, {useEffect} from "preact/compat";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCaretUp} from "@fortawesome/free-solid-svg-icons/faCaretUp";
import {faCaretDown} from "@fortawesome/free-solid-svg-icons/faCaretDown";

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

interface DashboardSelectProps {
    items: DashboardSelectItem[]
    onSelectedItemChange?: (value: DashboardSelectItem | null) => void
    defaultValue?: DashboardSelectItem | null
}

export default function DashboardSelect(props: DashboardSelectProps) {
    const {
        isOpen,
        selectedItem,
        getToggleButtonProps,
        getLabelProps,
        getMenuProps,
        highlightedIndex,
        getItemProps,
        inputValue,
    } = useSelect({
        items: props.items,
        defaultSelectedItem: props.defaultValue,
        itemToString,
    })

    useEffect(() => {
        // call if the selected item changes
        props.onSelectedItemChange?.(selectedItem);
    }, [selectedItem]);

    // @ts-ignore
    return (
        <div class="dialog-input-dropdown">
            <div
                className="dialog-input-dropdown-dropdown"
                {...getToggleButtonProps()}
            >
                <label {...getLabelProps()}
                       class="dialog-input-dropdown-dropdown-text">{selectedItem ? itemToString(selectedItem) : 'Select User'}</label>
                <span class="dialog-input-dropdown-dropdown-icon">{isOpen ? <FontAwesomeIcon icon={faCaretUp}/> :
                    <FontAwesomeIcon icon={faCaretDown}/>}</span>
            </div>
            <ul
                className={`dialog-input-dropdown-dropdown-items ${
                    !isOpen && 'dialog-input-dropdown-dropdown-items__hidden'
                }`}
                {...getMenuProps()}
            >
                {isOpen &&
                    filterAndReplaceFilteredWithNulls(props.items, inputValue)
                        .map((item, index) => (
                            item &&
                            <li
                                className={`${highlightedIndex === index && 'dialog-input-dropdown-dropdown-item__highlighted'} ${selectedItem === item && 'dialog-input-dropdown-dropdown-item__selected'} dialog-input-dropdown-dropdown-item`}
                                key={`${item.value}${index}`}
                                {...getItemProps({item, index})}
                            >
                                <span
                                    class="dialog-input-dropdown-dropdown-item-name">{item.title}</span>
                                <span
                                    className="dialog-input-dropdown-dropdown-item-username">{item.description ?? ""}</span>
                            </li>
                        ))}
            </ul>
        </div>
    )
}