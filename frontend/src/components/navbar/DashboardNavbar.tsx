import React, {PropsWithChildren} from "preact/compat";
import logo from "../../assets/images/raster/logo.png";
import NavBarLinksContainer from "./NavBarLinksContainer";
import NavAuthLinks from "./NavAuthLinks";
import NavBar from "./NavBar";

export default function DashboardNavbar(props: PropsWithChildren) {
    return <NavBar logo={logo}>
        <NavBarLinksContainer>
            {props.children}
            <NavAuthLinks/>
        </NavBarLinksContainer>
    </NavBar>;
}