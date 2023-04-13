import {PropsWithChildren} from "preact/compat";

export default function SettingButtons(props: PropsWithChildren) {
    return <div className="setting-buttons">
        {props.children}
    </div>;
}