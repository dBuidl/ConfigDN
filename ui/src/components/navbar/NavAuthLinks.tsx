import {useAuthValidWithModel} from "../../hooks/useAuthValid";
import URLS from "../../helpers/URLS";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUserCircle} from "@fortawesome/free-solid-svg-icons/faUserCircle";
import pocketbase from "../../libraries/Pocketbase";
import NavBarLink from "./NavBarLink";
import NavBarDropdownLink, {
    NavBarDropdownItem,
    NavBarDropdownItemContainer,
    NavBarDropdownLinkText
} from "./NavBarDropdownLink";

export default function NavAuthLinks() {
    const [authValid, record] = useAuthValidWithModel();

    if (authValid) {
        return <>
            <NavBarLink href={URLS.DASHBOARD}>Dashboard</NavBarLink>
            <NavBarDropdownLink>
            <NavBarDropdownLinkText>
                <FontAwesomeIcon
                    icon={faUserCircle}/>&nbsp;{pocketbase.authStore?.record?.username}
            </NavBarDropdownLinkText>
            <NavBarDropdownItemContainer>
                <NavBarDropdownItem>
                    <NavBarLink href={URLS.USER_SETTINGS + "/" + record?.id}>Account</NavBarLink>
                </NavBarDropdownItem>
                <NavBarDropdownItem>
                    <NavBarLink href={URLS.LOGOUT}>Logout</NavBarLink>
                </NavBarDropdownItem>
            </NavBarDropdownItemContainer>
        </NavBarDropdownLink>
            </>;
    }

    return <>
        <NavBarLink href={URLS.LOGIN}>Login</NavBarLink>
        <NavBarLink href={URLS.REGISTER}>Register</NavBarLink>
    </>;
}
