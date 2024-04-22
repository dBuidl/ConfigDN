import {useCombobox} from "downshift";
import {UserRecord} from "../../types/Structures";
import {useEffect} from "preact/compat";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCaretUp} from "@fortawesome/free-solid-svg-icons/faCaretUp";
import {faCaretDown} from "@fortawesome/free-solid-svg-icons/faCaretDown";

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

    // @ts-ignore
    return (
        <div className="dialog-input-dropdown">
            <div
                className="dialog-input-dropdown-dropdown"
                {...getToggleButtonProps()}
            >
                {!isOpen ?
                    <label {...getLabelProps()}
                           className="dialog-input-dropdown-dropdown-text">{selectedItem ? itemToString(selectedItem) : 'Select User'}</label> :
                    <input {...getInputProps()} className="dialog-input-dropdown-dropdown-input"
                           placeholder={"Search Users"}/>}
                <span className="dialog-input-dropdown-dropdown-icon">{isOpen ? <FontAwesomeIcon icon={faCaretUp}/> :
                    <FontAwesomeIcon icon={faCaretDown}/>}</span>
            </div>
            <ul
                className={`dialog-input-dropdown-dropdown-items ${
                    !isOpen && 'dialog-input-dropdown-dropdown-items__hidden'
                }`}
                {...getMenuProps()}
            >
                {isOpen &&
                    filterAndReplaceFilteredWithNulls(props.users, inputValue)
                        .map((item, index) => (
                            item &&
                            <li
                                className={`${highlightedIndex === index && 'dialog-input-dropdown-dropdown-item__highlighted'} ${selectedItem === item && 'dialog-input-dropdown-dropdown-item__selected'} dialog-input-dropdown-dropdown-item`}
                                key={`${item.value}${index}`}
                                {...getItemProps({item, index})}
                            >
                                <span
                                    className="dialog-input-dropdown-dropdown-item-name">{item.username}</span>
                                <span
                                    className="dialog-input-dropdown-dropdown-item-username">{item.name ?? ""}</span>
                            </li>
                        ))}
            </ul>
        </div>
    );
}