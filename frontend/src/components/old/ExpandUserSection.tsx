import {UserRecord} from "../../types/Structures";
import {JSX} from "preact";
import ExpandIsEmpty from "../../helpers/ExpandIsEmpty";
import pocketbase from "../../libraries/Pocketbase";

export default function ExpandUserSection(props: { title: string, expand: UserRecord[] | UserRecord | undefined }): JSX.Element {
    const {expand} = props;

    if (typeof expand === "undefined" || ExpandIsEmpty(expand)) {
        return <></>;
    }

    if (Array.isArray(expand)) {
        return <>
            <h3>{props.title}</h3>
            <ul>
                {expand.map((user: UserRecord) =>
                    <li>{user.name || user.username} {user.emailVisibility || user.id === pocketbase.authStore.model?.id ? <>&lt;{user.email}&gt;</> : <>&lt;Email
                        Hidden&gt;</>}</li>)}
            </ul>
        </>;
    }

    return <>
        <h3>{props.title}</h3>
        <p>{expand.name || expand.username} {expand.emailVisibility || expand.id === pocketbase.authStore.model?.id ? <>&lt;{expand.email}&gt;</> : <>&lt;Email
            Hidden&gt;</>}</p>
    </>;
}