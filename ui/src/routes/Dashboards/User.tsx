import {Link, useLoaderData, useNavigate} from "react-router-dom";
import Content from "../../components/general/Content";
import SettingButton from "../../components/dashboard/config/SettingButton";
import DashboardNavbar from "../../components/navbar/DashboardNavbar";
import {useAuthValidWithModel} from "../../hooks/useAuthValid";
import useAuthRedirect from "../../hooks/useAuthRedirect";
import URLS from "../../helpers/URLS";
import pocketbase from "../../libraries/Pocketbase";
import {ListResult} from "pocketbase";
import {TeamRecord} from "../../types/Structures";
import {useState} from "preact/compat";

export default function User() {
    const [, model] = useAuthValidWithModel();
    const navigate = useNavigate();
    useAuthRedirect(URLS.LOGIN, false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [message, setMessage] = useState("");

    const teams = useLoaderData() as ListResult<TeamRecord>;

    const deleteAccount = () => {
        if (!confirmDelete) {
            setConfirmDelete(true);
            setMessage("Are you sure you want to delete your account? This action is irreversible! Click the button again to confirm.");
            return;
        }

        pocketbase.collection('users').delete(model?.id as string).then(() => {
            pocketbase.authStore?.clear();
            navigate(URLS.HOME);
        }).catch(() => {
            setMessage("An error occurred while deleting your account. Please try again later.")
        });
    }

    return <>
         <DashboardNavbar>
             {model ? <div className="flex min-w-0 flex-1 items-center text-sm font-semibold text-copy sm:text-base">
                     <Link className="rounded-lg px-2 py-1 hover:bg-panel hover:text-lime"
                           to={`/dashboard/user/${model.id}`}>Account Settings</Link>
                 </div>
                 : null}
         </DashboardNavbar>
        <Content pageName="dashboard dashboard-user-settings">
           <div className="mx-auto w-full max-w-4xl">
               <header className="mb-8">
                   <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-cyan">ACCOUNT SETTINGS</p>
                   <h1 className="mt-3 text-3xl font-semibold tracking-tight text-copy sm:text-4xl">Manage your account</h1>
                   <p className="mt-3 max-w-2xl text-base leading-7 text-muted">Update your credentials or review the teams connected to your account.</p>
               </header>

               <section className="mb-6 overflow-hidden rounded-3xl border border-line bg-panel">
                   <div className="border-b border-line/70 px-5 py-5 sm:px-7">
                       <h2 className="text-xl font-semibold text-copy">Change password</h2>
                       <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">Use your current password to set a new one. If you have forgotten it, log out and use the password recovery process.</p>
                   </div>
                   <div className="px-5 py-5 sm:px-7">
                       <SettingButton onClick={() => navigate(URLS.CHANGE_PASSWORD)} type="Change Password"/>
                   </div>
               </section>

               <section className="overflow-hidden rounded-3xl border border-red/30 bg-panel">
                   <div className="border-b border-red/20 px-5 py-5 sm:px-7">
                       <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-red">Danger zone</p>
                       <h2 className="mt-2 text-xl font-semibold text-copy">Delete account</h2>
                       <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">Deleting your account is irreversible. Any teams you own, along with their projects, configurations, environments, and API keys, will also be deleted.</p>
                   </div>
                   <div className="px-5 py-5 sm:px-7">
                       <h3 className="text-sm font-semibold text-copy">Teams you own</h3>
                       {teams.items.length > 0 ?
                           <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                               {teams.items.map(team => <li key={team.id}>
                                   <Link className="block rounded-xl border border-line bg-ink px-3 py-2.5 text-sm font-semibold text-muted hover:border-cyan hover:text-cyan" to={`${URLS.DASHBOARD}/${team.id}`}>{team.name}</Link>
                               </li>)}
                           </ul> :
                           <p className="mt-2 text-sm text-muted">You do not currently own any teams.</p>}
                       <p className="mt-4 text-sm leading-6 text-muted">To transfer ownership, open a team, choose <strong className="text-copy">Add Member</strong>, select the <strong className="text-copy">Owner</strong> role, and confirm the transfer.</p>
                       <div className="mt-5 flex flex-wrap items-center gap-3">
                           <SettingButton onClick={() => deleteAccount()} type="Delete Account"/>
                           {message && <p className="max-w-xl text-sm leading-6 text-red">{message}</p>}
                       </div>
                   </div>
               </section>
           </div>
        </Content>
   </>;
}

export function userLoader({params}: { params: any }) {
    return pocketbase.collection('team').getList(params.team, undefined, {expand: "owner", filter: `owner = "${params.id}"`});
}
