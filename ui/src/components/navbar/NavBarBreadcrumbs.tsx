import {ConfigRecord, EnvironmentRecord, ProjectRecord, TeamRecord} from "../../types/Structures";
import React, {useEffect} from "preact/compat";
import {Link, useNavigate} from "react-router-dom";
import SelectInput, {DashboardSelectItem} from "../dashboard/SelectInput";
import pocketbase from "../../libraries/Pocketbase";

interface NavBarBreadcrumbsProps {
    team?: TeamRecord;
    project?: ProjectRecord;
    config?: ConfigRecord;
    environment?: EnvironmentRecord;
}

function createItemsFromEnvironments(environments: EnvironmentRecord[]): DashboardSelectItem[] {
    return environments.map((environment) => ({
        value: environment.id,
        title: environment.name
    }));
}

export default function NavBarBreadcrumbs(props: NavBarBreadcrumbsProps) {
    const navigate = useNavigate();
    const [possibleEnvironments, setPossibleEnvironments] = React.useState<DashboardSelectItem[]>(createItemsFromEnvironments(props.environment ? [props.environment] : []));
    const selectedEnvironment = props.environment ? {
        value: props.environment.id,
        title: props.environment.name
    } : null;

    useEffect(() => {
        if (props.project) {
            pocketbase.collection('environment').getFullList(undefined, {filter: `project = "${props.project.id}"`}).then((environments) => {
                setPossibleEnvironments(createItemsFromEnvironments(environments as EnvironmentRecord[]));
            });
        }
    }, [props.project]);

    const onEnvironmentDropDownChange = (item: DashboardSelectItem | null) => {
        if (item === null) return;

        navigate(`/dashboard/${props.team?.id}/${props.project?.id}/${props.config?.id}/${item.value}`);
    }

    // display specified parts of the breadcrumb with the separator ">" between them
    return <div className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto whitespace-nowrap text-sm font-semibold text-copy sm:text-base">
        {props.team && <>
            <Link className="max-w-36 overflow-hidden text-ellipsis rounded-lg px-2 py-1 hover:bg-panel hover:text-lime sm:max-w-60" to={`/dashboard/${props.team.id}`}>{props.team.name}</Link>
        </>}
        {props.project && <>
            <div className="text-line">&gt;</div>
            <Link className="max-w-36 overflow-hidden text-ellipsis rounded-lg px-2 py-1 hover:bg-panel hover:text-lime sm:max-w-60"
                  to={`/dashboard/${props.team?.id}/${props.project.id}`}>{props.project.name}</Link>
        </>}
        {props.config && <>
            <div className="text-line">&gt;</div>
            {props.environment ?
                <Link className="max-w-36 overflow-hidden text-ellipsis rounded-lg px-2 py-1 hover:bg-panel hover:text-lime sm:max-w-60"
                      to={`/dashboard/${props.team?.id}/${props.project?.id}/${props.config.id}/${props.environment.id}`}>{props.config.name}</Link> :
                <p>{props.config.name}</p>
            }
        </>}
        {props.environment &&
            // env should be a dropdown allowing you to select the environment you want to view
            <>
                <div className="text-line">&gt;</div>
                <SelectInput items={possibleEnvironments} defaultValue={selectedEnvironment}
                             onSelectedItemChange={onEnvironmentDropDownChange}/>
            </>
        }
    </div>;
}
