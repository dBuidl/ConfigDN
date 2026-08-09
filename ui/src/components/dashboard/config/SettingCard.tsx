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
    const {flag, originalValue, value, setValue: setValue2, saveValue} = props;

    function setValue(value: string) {
        let clone = {...props.value} as ValueRecordString;

        clone.value = value;

        setValue2(clone);
    }

    const [setDialogShowing, dialog] = useDialog(<DialogWide>
        <DialogHeader>
            <h1 className="dialog-heading">Update {flag.name} Value</h1>
        </DialogHeader>
        <DialogBody>
                        <textarea className="min-h-64 w-full resize-y rounded-xl border border-line bg-ink p-4 font-mono text-sm text-copy outline-none focus:border-cyan" value={value.value}
                                  onInput={e => setValue(e.currentTarget.value)}/>
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
                                                               className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-line bg-transparent px-2.5 py-2 text-xs font-semibold text-muted hover:border-cyan hover:text-cyan"
                                                              title="Expand Editor"><FontAwesomeIcon
        icon={faUpRightAndDownLeftFromCenter}/></button>;

    switch (inputType) {
        case "text":
            input = <input type={inputType} value={value.value} className="min-w-0 flex-1 rounded-xl border border-line bg-ink px-3 py-2 text-sm text-copy outline-none focus:border-cyan"
                           onInput={e => setValue(e.currentTarget.value)}/>;
            break;
        case "number":
            input = <input type={inputType} value={value.value} className="min-w-0 flex-1 rounded-xl border border-line bg-ink px-3 py-2 text-sm text-copy outline-none focus:border-cyan"
                           onInput={e => setValue(e.currentTarget.value)}/>
            inputExpandButton = null;
            break;
        case "checkbox":
            input = <label className="relative inline-flex cursor-pointer">
                <input type={inputType} checked={value.value === "true"} className="peer sr-only"
                       onClick={e => setValue(e.currentTarget.checked ? "true" : "false")}/>
                <span className="relative h-7 w-12 rounded-full bg-line after:absolute after:left-1 after:top-1 after:h-5 after:w-5 after:rounded-full after:bg-muted after:transition peer-checked:bg-lime peer-checked:after:translate-x-5 peer-checked:after:bg-ink"></span>
            </label>;
            inputExpandButton = null;
            break;
    }

    const onReset = (e: Event) => {
        e.preventDefault();
        setValue(originalValue.value);
    }

    function getLastSaveStatusMessage() {
        if (lastSaveStatus === null) return null;

        if (lastSaveStatus[0] === 1) {
            return <p className="text-xs text-lime">Value saved successfully.</p>
        } else if (lastSaveStatus[0] === 0) {
            if (lastSaveStatus[1].toString().startsWith("SyntaxError: JSON.parse")) {
                return <p className="text-xs text-red">JSON is not correctly formatted.</p>
            }
            return <p className="text-xs text-red">Failed to save value.</p>
        } else {
            return <p className="text-xs text-red">{lastSaveStatus[1]}</p>
        }
    }

    return <div className="overflow-hidden rounded-2xl border border-line bg-panel">
        <div className="flex items-start justify-between gap-3 border-b border-line/70 px-4 py-3">
            <h3 className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap font-semibold text-copy">{flag.name}</h3>
            <p className="shrink-0 rounded-md bg-ink px-2 py-1 font-mono text-[0.65rem] text-cyan">{flag.identifier}</p>
        </div>
        <div className="flex min-h-28 items-center gap-2 p-4">
            {input}
            {inputExpandButton}
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2 border-t border-line/70 px-4 py-3">
            <span className="mr-auto">{getLastSaveStatusMessage()}</span>
            <button className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-line bg-transparent px-2.5 py-2 text-xs font-semibold text-muted hover:border-cyan hover:text-cyan" onClick={() => setDeleteDialogShowing(true)}>
                <FontAwesomeIcon icon={faTrash}/>
            </button>
            <button className="cursor-pointer rounded-lg border border-line bg-transparent px-2.5 py-2 text-xs font-semibold text-muted hover:border-cyan hover:text-cyan disabled:cursor-not-allowed disabled:opacity-35" onClick={onReset} disabled={originalValue.value === value.value}>Reset
            </button>
            <button className="cursor-pointer rounded-lg border border-lime bg-lime px-2.5 py-2 text-xs font-semibold text-ink hover:bg-transparent hover:text-lime disabled:cursor-not-allowed disabled:opacity-35" onClick={save} disabled={originalValue.value === value.value}>Save
            </button>
        </div>
        {dialog}
        {deleteDialog}
    </div>;
}
