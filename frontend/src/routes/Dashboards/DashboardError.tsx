import {useRouteError} from "react-router-dom";
import {ClientResponseError} from "pocketbase";
import Error404SVG from "../../assets/images/vector/404.svg";
import ErrorSVG from "../../assets/images/vector/error.svg";
import React from "preact/compat";

export default function DashboardError(props: any) {
    const error: any = useRouteError();

    if (error instanceof ClientResponseError) {
        switch (error.status) {
            case 404:
                return <div class="content error-page">
                    <img src={Error404SVG} alt="404"/>
                    <h1>Error 404</h1>
                    <p>{error.message}</p>
                </div>;
            default:
                return <div class="content error-page">
                    <img src={ErrorSVG} alt="500"/>
                    <h1>500</h1>
                    <p>{error.message}</p>
                </div>;
        }
    } else {
        return <div class="content error-page">
            <img src={ErrorSVG} alt="500"/>
            <h1>500</h1>
            <p>{error.message}</p>
        </div>;
    }
}