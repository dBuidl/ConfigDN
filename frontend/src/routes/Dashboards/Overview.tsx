import pocketbase from "../../libraries/Pocketbase";
import {useLoaderData, useNavigate} from "react-router-dom";
import {TeamRecord} from "../../types/Structures";
import {Content} from "../../components/Content";

export default function Overview() {
    const [teams] = useLoaderData() as OverviewData;
    const navigate = useNavigate();

    return <Content class={"page-overview"}>
        <h1>Overview</h1>

        <div class={"team-cards"}>
            {teams.map((team: TeamRecord) => <div class={"team-card"} onClick={() => navigate(`./${team.id}`)}>
                <img src={`https://robohash.org/${team.name}.png?set=set4&size=150x150`} alt={team.name}/>
                <h3>{team.name}</h3>
            </div>)}
        </div>
    </Content>
}

export type OverviewData = [TeamRecord[]];

export function overviewLoader() {
    return Promise.all([
        pocketbase.collection('team').getFullList(),
    ]);
}