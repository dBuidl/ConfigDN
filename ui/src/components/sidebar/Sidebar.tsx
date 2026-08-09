import React, {useEffect} from "preact/compat";
import pocketbase from "../../libraries/Pocketbase";
import {ClientResponseError} from "pocketbase";
import {ConfigRecord, EnvironmentRecord, ProjectRecord, TeamRecord} from "../../types/Structures";
import useAuthValid from "../../hooks/useAuthValid";
import SidebarObject from "./SidebarObject";
import {WORKSPACE_CHANGED_EVENT} from "../../helpers/notifyWorkspaceChanged";

export interface SidebarBase {
    id: string,
    name: string,
    url: string,
}

export interface SidebarEnvironment extends SidebarBase {
}

export interface SidebarConfig extends SidebarBase {
    environments: SidebarEnvironment[];
}

export interface SidebarProject extends SidebarBase {
    configs: SidebarConfig[];
}

export interface SidebarTeam extends SidebarBase {
    projects: SidebarProject[];
}

export default function Sidebar() {
    const authValid = useAuthValid();
    const [data, setData] = React.useState<SidebarTeam[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string>("");

    useEffect(() => {
        if (!authValid) {
            setData([]);
            return;
        }

        const loadSidebar = async () => {
            setLoading(true);
            try {
                const teams = await pocketbase.collection('team').getFullList() as TeamRecord[];
                const projects = await pocketbase.collection('project').getFullList() as ProjectRecord[];
                const configs = await pocketbase.collection('config').getFullList() as ConfigRecord[];
                const environments = await pocketbase.collection('environment').getFullList() as EnvironmentRecord[];

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
                                        environments: environments.filter((environment: any) => environment.project === project.id).map((environment: any) => {
                                            return {
                                                id: environment.id,
                                                name: environment.name,
                                                url: environment.url,
                                            }
                                        }),
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
        };

        const refreshSidebar = () => {
            void loadSidebar();
        };

        window.addEventListener(WORKSPACE_CHANGED_EVENT, refreshSidebar);
        refreshSidebar();

        return () => window.removeEventListener(WORKSPACE_CHANGED_EVENT, refreshSidebar);
    }, [authValid]);

    return <nav className="dashboard-sidebar fixed inset-y-0 left-0 z-50 flex w-72 flex-col overflow-y-auto border-r border-line/70 bg-ink-soft/95 px-4 py-5 backdrop-blur-xl">
        <div className="mb-7 px-3 font-mono text-[0.65rem] font-bold tracking-[0.2em] text-cyan">CONFIGDN / WORKSPACE</div>
        {loading && <div className="rounded-xl border border-line bg-panel px-3 py-2 text-sm text-muted">Loading...</div>}

        {/* print data hierarchy here */}
        {data.map((team: SidebarTeam) => {
            return <>
                <SidebarObject type="team" url={team.id} name={team.name}>
                    {team.projects.map((project: SidebarProject) => {
                        return <SidebarObject type="project" name={project.name} url={team.id + "/" + project.id}>
                            {project.configs.map((config: SidebarConfig) => {
                                return <SidebarObject type="config" name={config.name}
                                                      url={team.id + "/" + project.id + "/" + config.id + (config.environments.length > 0 ? "/" + config.environments[0].id : "")}/>
                            })}
                        </SidebarObject>
                    })}
                </SidebarObject>
            </>
        })}

        {error && <div className="rounded-xl border border-red/30 bg-red/5 px-3 py-2 text-sm text-red">{error}</div>}
    </nav>;
}
