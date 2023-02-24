import {ComponentChild} from "preact";
import {StateUpdater, useEffect, useState} from "preact/compat";
import DialogOverlay from "../components/dialog/DialogOverlay";

interface DialogOptions {
    afterSetShowing?: (showing: boolean) => void;
}

export default function useDialog(dialog: ComponentChild, options?: DialogOptions): [StateUpdater<boolean>, ComponentChild] {
    const [showing, setShowing] = useState(false);

    // call afterSetShowing when showing changes
    useEffect(() => {
        if (options?.afterSetShowing) {
            options.afterSetShowing(showing);
        }
    }, [showing]);

    function onOverlayClick(event: Event) {
        if (event.target === event.currentTarget) {
            setShowing(false);
        }
    }

    // return the function to set whether the dialog is showing and the dialog itself or null
    return [setShowing, showing ? <DialogOverlay onClick={onOverlayClick}>{dialog}</DialogOverlay> : null];
}