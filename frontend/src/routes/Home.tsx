import React from "preact/compat";
import Page from "../components/general/Page";
import NavBar from "../components/navbar/NavBar";
import logo from "../assets/images/raster/logo.png";
import NavBarLinksContainer from "../components/navbar/NavBarLinksContainer";
import Content from "../components/general/Content";
import Demo from "../components/homepage/Demo";
import NavAuthLinks from "../components/navbar/NavAuthLinks";

export function Home() {
    return <>
        <Page>
            <NavBar logo={logo}>
                <NavBarLinksContainer>
                    <NavAuthLinks/>
                </NavBarLinksContainer>
            </NavBar>

            <Content pageName={"homepage"}>
                <h1 class={"page-title"}>Smart, super easy feature flag management for individuals, teams and
                    open-sourcerers</h1>

                <Demo/>
            </Content>
        </Page>
    </>;
}
