import {PropsWithChildren} from "preact/compat";

export default function SettingButtons(props: PropsWithChildren) {
    return <div className="my-8 flex flex-wrap gap-2">
        {props.children}
    </div>;
}
