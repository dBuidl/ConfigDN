import {useSelect} from "downshift";
import {useEffect} from "preact/compat";
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

interface SelectInputProps {
    items: DashboardSelectItem[]
    onSelectedItemChange?: (value: DashboardSelectItem | null) => void
    defaultValue?: DashboardSelectItem | null
    selectText?: string
}

export default function SelectInput(props: SelectInputProps) {
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
        <div className="relative min-w-28">
            <div
                className="flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg border border-line bg-panel px-2.5 py-1.5 text-left text-sm text-copy hover:border-cyan"
                {...getToggleButtonProps()}
            >
                <label {...getLabelProps()}
                       className="min-w-0 flex-1 overflow-hidden text-ellipsis">{selectedItem ? itemToString(selectedItem) : props.selectText ?? 'Select Item'}</label>
                <span>{isOpen ? <FontAwesomeIcon icon={faCaretUp}/> :
                    <FontAwesomeIcon icon={faCaretDown}/>}</span>
            </div>
            <ul
                className={`absolute left-0 top-full z-50 mt-2 max-h-64 min-w-full overflow-y-auto rounded-xl border border-line bg-panel-raised p-1.5 shadow-2xl ${!isOpen ? 'hidden' : ''}`}
                {...getMenuProps()}
            >
                {isOpen &&
                    filterAndReplaceFilteredWithNulls(props.items, inputValue)
                        .map((item, index) => (
                            item &&
                            <li
                                className={`cursor-pointer rounded-lg px-3 py-2 text-sm hover:bg-panel ${highlightedIndex === index || selectedItem === item ? 'bg-cyan/10 text-cyan' : ''}`}
                                key={`${item.value}${index}`}
                                {...getItemProps({item, index})}
                            >
                                <span
                                    className="block font-semibold">{item.title}</span>
                                <span
                                    className="block text-xs text-muted">{item.description ?? ""}</span>
                            </li>
                        ))}
            </ul>
        </div>
    )
}
