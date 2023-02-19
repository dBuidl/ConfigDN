import {ComponentChild} from "preact";
import {StateUpdater, useState} from "preact/compat";
import DialogOverlay from "../components/dialog/DialogOverlay";

export default function useDialog(dialog: ComponentChild): [StateUpdater<boolean>, ComponentChild] {
    const [showing, setShowing] = useState(false);

    function onOverlayClick(event: Event) {
        if (event.target === event.currentTarget) {
            setShowing(false);
        }
    }

    // return the function to set whether the dialog is showing and the dialog itself or null
    return [setShowing, showing ? <DialogOverlay onClick={onOverlayClick}>{dialog}</DialogOverlay> : null];
}