import {FlagRecord, ValueRecordString} from "../../../types/Structures";
import React, {useState} from "preact/compat";
import {fieldTypeToInputType} from "../../../types/Conversions";
import {JSX} from "preact";
import {tPocketbaseAsyncResponse, tPocketbaseResponse} from "../../../routes/Dashboards/Config";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUpRightAndDownLeftFromCenter} from "@fortawesome/free-solid-svg-icons/faUpRightAndDownLeftFromCenter";
import DialogWide from "../../dialog/DialogWide";
import DialogBody from "../../dialog/DialogBody";
import DialogFooter from "../../dialog/DialogFooter";
import DialogHeader from "../../dialog/DialogHeader";
import useDialog from "../../../hooks/useDialog";
import {faTrash} from "@fortawesome/free-solid-svg-icons/faTrash";

export default function SettingCard(props: { flag: FlagRecord, originalValue: ValueRecordString, value: ValueRecordString, onDelete: (e: Event, flag: FlagRecord) => void, setValue: (values: ValueRecordString) => void, saveValue: (value: ValueRecordString) => tPocketbaseAsyncResponse }) {
    const [lastSaveStatus, setLastSaveStatus] = useState<tPocketbaseResponse | null>(null);
    const {flag, originalValue, value, setValue, saveValue} = props;
    const [setDialogShowing, dialog] = useDialog(<DialogWide>
        <DialogHeader>
            <h1 className="dialog-heading">Update {flag.name} Value</h1>
        </DialogHeader>
        <DialogBody>
                        <textarea className="dialog-input-large" value={value.value}
                                  onInput={e => setValue({
                                      ...value,
                                      value: e.currentTarget.value
                                  } as ValueRecordString)}/>
        </DialogBody>
        <DialogFooter>
            <button className="dialog-action dialog-action__save"
                    onClick={() => setDialogShowing(false)}>Done
            </button>
        </DialogFooter>
    </DialogWide>);

    const [setDeleteDialogShowing, deleteDialog] = useDialog(<DialogWide>
        <DialogHeader>
            <h1 className="dialog-heading">Delete {flag.name}?</h1>
        </DialogHeader>
        <DialogBody>
            <p>Are you sure you want to delete the flag {flag.name}? This action cannot be undone.</p>
        </DialogBody>
        <DialogFooter>
            <button className="dialog-action dialog-action__delete"
                    onClick={(e) => props.onDelete(e, flag)}>Delete
            </button>
            <button className="dialog-action dialog-action__cancel"
                    onClick={() => setDeleteDialogShowing(false)}>Cancel
            </button>
        </DialogFooter>
    </DialogWide>);


    const inputType = fieldTypeToInputType(flag.type);

    let input: JSX.Element;

    function save() {
        saveValue(value).then((status) => {
            setLastSaveStatus(status);

            setTimeout(() => setLastSaveStatus(null), 5000);
        })
    }

    let inputExpandButton: React.JSX.Element | null = <button onClick={() => setDialogShowing(true)}
                                                              className="setting-card-button"
                                                              title="Expand Editor"><FontAwesomeIcon
        icon={faUpRightAndDownLeftFromCenter}/></button>;

    switch (inputType) {
        case "text":
            input = <input type={inputType} value={value.value} class="setting-card-value"
                           onInput={e => setValue({...value, value: e.currentTarget.value} as ValueRecordString)}/>;
            break;
        case "number":
            input = <input type={inputType} value={value.value} class="setting-card-value"
                           onInput={e => setValue({...value, value: e.currentTarget.value} as ValueRecordString)}/>
            inputExpandButton = null;
            break;
        case "checkbox":
            input = <label className="setting-card-value-switch">
                <input type={inputType} checked={value.value === "true"} className="setting-card-value"
                       onClick={e => setValue({
                           ...value,
                           value: e.currentTarget.checked ? "true" : "false"
                       } as ValueRecordString)}/>
                <span className="setting-card-value-slider"></span>
            </label>;
            inputExpandButton = null;
            break;
    }

    const onReset = (e: Event) => {
        e.preventDefault();
        setValue(originalValue);
    }

    function getLastSaveStatusMessage() {
        if (lastSaveStatus === null) return null;

        if (lastSaveStatus[0] === 1) {
            return <p class="setting-card-save-status-message">Value saved successfully.</p>
        } else if (lastSaveStatus[0] === 0) {
            if (lastSaveStatus[1].toString().startsWith("SyntaxError: JSON.parse")) {
                return <p class="setting-card-save-status-message">JSON is not correctly formatted.</p>
            }
            return <p class="setting-card-save-status-message">Failed to save value.</p>
        } else {
            return <p class="setting-card-save-status-message">{lastSaveStatus[1]}</p>
        }
    }

    return <div class="setting-card">
        <div class="setting-card-header">
            <h3 class="setting-card-title">{flag.name}</h3>
            <p class="setting-card-key">{flag.identifier}</p>
        </div>
        <div class="setting-card-body">
            {input}
            {inputExpandButton}
        </div>
        <div class="setting-card-footer">
            {getLastSaveStatusMessage()}
            <button class="setting-card-button" onClick={() => setDeleteDialogShowing(true)}>
                <FontAwesomeIcon icon={faTrash}/>
            </button>
            <button class="setting-card-button" onClick={onReset} disabled={originalValue.value === value.value}>Reset
            </button>
            <button class="setting-card-button" onClick={save} disabled={originalValue.value === value.value}>Save
            </button>
        </div>
        {dialog}
        {deleteDialog}
    </div>;
}