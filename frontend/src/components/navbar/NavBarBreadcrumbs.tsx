import {ConfigRecord, EnvironmentRecord, ProjectRecord, TeamRecord} from "../../types/Structures";
import React from "preact/compat";
import {Link} from "react-router-dom";

interface NavBarBreadcrumbsProps {
    team?: TeamRecord;
    project?: ProjectRecord;
    config?: ConfigRecord;
    environment?: EnvironmentRecord;
}

export default function NavBarBreadcrumbs(props: NavBarBreadcrumbsProps) {
    // display specified parts of the breadcrumb with the separator ">" between them
    return <div className={"navbar-links-breadcrumb"}>
        {props.team && <>
            <Link class="breadcrumb-page" to={`/dashboard/${props.team.id}`}>{props.team.name}</Link>
        </>}
        {props.project && <>
            <div class="breadcrumb-spacer">&gt;</div>
            <Link class="breadcrumb-page"
                  to={`/dashboard/${props.team?.id}/${props.project.id}`}>{props.project.name}</Link>
        </>}
        {props.config && <>
            <div class="breadcrumb-spacer">&gt;</div>
            {props.environment ?
                <Link class="breadcrumb-page"
                      to={`/dashboard/${props.team?.id}/${props.project?.id}/${props.config.id}/${props.environment.id}`}>{props.config.name}</Link> :
                <p>{props.config.name}</p>
            }
        </>}
        {props.environment && <>
            <div className="breadcrumb-spacer">&gt;</div>
            <Link class="breadcrumb-page"
                  to={`/dashboard/${props.team?.id}/${props.project?.id}/${props.config?.id}/${props.environment.id}`}>{props.environment.name}</Link>
        </>}
    </div>;
}