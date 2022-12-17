import React from "preact/compat";
import "../styles/sidebar.scss";
import pocketbase from "../libraries/Pocketbase";
import {ClientResponseError} from "pocketbase";
import {Link} from "react-router-dom";

export interface SidebarConfig {
    id: string;
    name: string;
    url: string;
}

export interface SidebarProject {
    id: string;
    name: string;
    url: string;
    configs: SidebarConfig[];
}

export interface SidebarTeam {
    name: string;
    id: string;
    url: string;
    projects: SidebarProject[];
}

export default function Sidebar() {
    const [data, setData] = React.useState<SidebarTeam[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string>("");

    React.useEffect(() => {
        (async () => {
            // load pocketbase config -> project -> team (wrong order but saves us 2 more requests, and it's just easier to flip it)
            try {
                const teams = await pocketbase.collection('team').getFullList();
                const projects = await pocketbase.collection('project').getFullList();
                const configs = await pocketbase.collection('config').getFullList();

                // turn into SidebarTeam with SidebarProject with SidebarConfig
                setData(teams.map((team: any) => {
                    return {
                        name: team.name,
                        id: team.id,
                        url: team.url,
                        projects: projects.filter((project: any) => project.team === team.id).map((project: any) => {
                            return {
                                id: project.id,
                                name: project.name,
                                url: project.url,
                                configs: configs.filter((config: any) => config.project === project.id).map((config: any) => {
                                    return {
                                        id: config.id,
                                        name: config.name,
                                        url: config.url,
                                    }
                                })
                            }
                        })
                    }
                }));

                setLoading(false);
            } catch (e) {
                if (e instanceof ClientResponseError) {
                    setError(e.data.message);
                } else {
                    console.error(e);
                }
                setLoading(false);
            }
        })();
    }, []);


    return <div className="sidebar">
        {loading && <div className="loading">Loading...</div>}

        {/* print data hierarchy here */}
        {data.map((team: SidebarTeam) => {
            return <div className="team">
                <div className="team-name">
                    <Link to={team.id}>{team.name}</Link>
                    <div className="team-projects">
                        {team.projects.map((project: SidebarProject) => {
                            return <div className="project">
                                <div className="project-name">
                                    <Link
                                        to={team.id + "/" + project.id}>{project.name}</Link>
                                    <div className="project-configs">
                                        {project.configs.map((config: SidebarConfig) => {
                                            return <div className="config">
                                                <div className="config-name">
                                                    <Link
                                                        to={team.id + "/" + project.id + "/" + config.id}>{config.name}</Link>
                                                </div>
                                            </div>
                                        })}
                                    </div>
                                </div>
                            </div>
                        })}
                    </div>
                </div>
            </div>
        })}

        {error && <div className="error">{error}</div>}
    </div>;
}