import {Link, useLoaderData, useNavigate} from "react-router-dom";
import Content from "../../components/general/Content";
import DashboardSpacer from "../../components/dashboard/DashboardSpacer";
import SettingButtons from "../../components/dashboard/config/SettingButtons";
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
            {model ? <div className={"navbar-links-breadcrumb"}>
                    <Link class="breadcrumb-page"
                          to={`/dashboard/user`}><p>Account Settings</p></Link>
                </div>
                : null}
        </DashboardNavbar>
       <Content pageName="dashboard dashboard-user-settings">

           <h1 className="action-header">Change your password</h1>

           <p>You can do so using the button below if you know your current password. If you have forgotten it, please
               log out and use the forgotten password process.</p>

           <SettingButtons>
               <SettingButton onClick={() => navigate(URLS.CHANGE_PASSWORD)}
                              type={"Change Password"}/>
           </SettingButtons>

           <h1 className="action-header">Delete account</h1>

           <p>If you want to, you can delete your ConfigDN account. This actions is <strong>irreversible</strong>! <strong>All teams</strong> you are the owner of will also be deleted.</p>

           <p>You currently own the following teams:</p>

           <ul class="owned-teams-list">
               {
                   teams.items.map(v => <li><a href={URLS.DASHBOARD + "/" + v.id}>{v.name}</a></li>)
               }
           </ul>

           <p>You can transfer them by clicking on the links above, choosing add member, then owner and set the owner to the new owner.</p>

           <SettingButtons>
               <SettingButton onClick={() => deleteAccount()}
                              type={"Delete Account"}/>
           </SettingButtons>

           <p class="delete-account-warning">{message}</p>

           <DashboardSpacer/>
       </Content>
   </>;
}

export function userLoader({params}: { params: any }) {
    return pocketbase.collection('team').getList(params.team, undefined, {expand: "owner", filter: `owner = "${params.id}"`});
}