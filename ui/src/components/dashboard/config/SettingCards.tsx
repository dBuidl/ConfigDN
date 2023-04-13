import {PropsWithChildren} from "preact/compat";

export default function SettingCards(props: PropsWithChildren) {
    return <div className="setting-cards">
        {props.children}
    </div>;
}