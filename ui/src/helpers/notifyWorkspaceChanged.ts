export const WORKSPACE_CHANGED_EVENT = "configdn:workspace-changed";

export default function notifyWorkspaceChanged() {
    window.dispatchEvent(new Event(WORKSPACE_CHANGED_EVENT));
}
