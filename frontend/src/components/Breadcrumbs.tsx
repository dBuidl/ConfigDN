import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronRight} from "@fortawesome/free-solid-svg-icons/faChevronRight";
import {JSX} from "preact";
import React from "preact/compat";

export interface BreadcrumbsProps {
    route: Array<{ name: string, path: string }>
}

export default function Breadcrumbs(props: BreadcrumbsProps): JSX.Element {
    const {route} = props;

    return <>{route.map((item, index) => {
        return <li key={index} className="breadcrumb-item">
            <Link to={item.path}>{item.name}</Link>1
            {route.length - 1 !== index &&
                <span className="breadcrumb-separator"><FontAwesomeIcon icon={faChevronRight}/></span>}
        </li>;
    })}</>;
}