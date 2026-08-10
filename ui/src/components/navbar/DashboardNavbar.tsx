import React, {PropsWithChildren} from "preact/compat";
import configdnMark from "../../assets/images/vector/configdn-mark.svg";
import NavBarLinksContainer from "./NavBarLinksContainer";
import NavAuthLinks from "./NavAuthLinks";
import NavBar from "./NavBar";

export default function DashboardNavbar(props: PropsWithChildren) {
    return <NavBar logo={configdnMark} className="dashboard-navbar pl-16 lg:pl-5">
        <NavBarLinksContainer>
            {props.children}
            <NavAuthLinks/>
        </NavBarLinksContainer>
    </NavBar>;
}
