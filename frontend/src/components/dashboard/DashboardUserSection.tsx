import {UserRecord} from "../../types/Structures";
import {JSX} from "preact";
import ExpandIsEmpty from "../../helpers/ExpandIsEmpty";
import DashboardObjectHeader from "./DashboardObjectHeader";
import DashboardObjectHeaderIcon from "./DashboardObjectHeaderIcon";
import DashboardObjectHeaderName from "./DashboardObjectHeaderName";
import DashboardObjectBody from "./DashboardObjectBody";
import DashboardObjectBodyInfo from "./DashboardObjectBodyInfo";
import DashboardObject from "./DashboardObject";
import React from "preact/compat";
// @ts-ignore
import Jdenticon from "react-jdenticon";

export default function DashboardUserSection(props: { title: string, expand: UserRecord[] | UserRecord | undefined }): JSX.Element {
    const {expand} = props;

    if (typeof expand === "undefined" || ExpandIsEmpty(expand)) {
        return <></>;
    }

    if (Array.isArray(expand)) {
        return <>
            {expand.map((user: UserRecord) => <DashboardObject>
                <DashboardObjectHeader>
                    <DashboardObjectHeaderIcon>
                        <Jdenticon value={user.username}/>
                    </DashboardObjectHeaderIcon>
                    <DashboardObjectHeaderName>{user.username}</DashboardObjectHeaderName>
                </DashboardObjectHeader>
                <DashboardObjectBody>
                    <DashboardObjectBodyInfo>
                        {props.title}
                        {user.name ? <p>{user.name}</p> : <></>}
                    </DashboardObjectBodyInfo>
                </DashboardObjectBody>
            </DashboardObject>)}
        </>;
    }

    return <DashboardObject>
        <DashboardObjectHeader>
            <DashboardObjectHeaderIcon>
                <Jdenticon value={expand.username}/>
            </DashboardObjectHeaderIcon>
            <DashboardObjectHeaderName>{expand.username}</DashboardObjectHeaderName>
        </DashboardObjectHeader>
        <DashboardObjectBody>
            <DashboardObjectBodyInfo>
                {props.title}
                {expand.name ? <p>{expand.name}</p> : <></>}
            </DashboardObjectBodyInfo>
        </DashboardObjectBody>
    </DashboardObject>;
}