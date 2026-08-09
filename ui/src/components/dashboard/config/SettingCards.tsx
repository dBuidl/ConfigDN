import {PropsWithChildren} from "preact/compat";

export default function SettingCards(props: PropsWithChildren) {
    return <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {props.children}
    </div>;
}
