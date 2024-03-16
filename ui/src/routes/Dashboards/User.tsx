import {Link, useNavigate} from "react-router-dom";
import Content from "../../components/general/Content";
import DashboardSpacer from "../../components/dashboard/DashboardSpacer";
import SettingButtons from "../../components/dashboard/config/SettingButtons";
import SettingButton from "../../components/dashboard/config/SettingButton";
import DashboardNavbar from "../../components/navbar/DashboardNavbar";
import {useAuthValidWithModel} from "../../hooks/useAuthValid";
import useAuthRedirect from "../../hooks/useAuthRedirect";
import URLS from "../../helpers/URLS";

export default function User() {
    const [, model] = useAuthValidWithModel();
    const navigate = useNavigate();
    useAuthRedirect(URLS.LOGIN, false);

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

           <p>If you want to, you can delete your ConfigDN account. This actions is irreversible! Any teams you are the owner of will also be deleted.</p>

           <p>You currently own the following teams:</p>

           <ul>
               <li>Test</li>
           </ul>

           <SettingButtons>
               <SettingButton onClick={() => navigate(URLS.CHANGE_PASSWORD)}
                              type={"Change Password"}/>
           </SettingButtons>

           <DashboardSpacer/>
       </Content>
   </>;
}