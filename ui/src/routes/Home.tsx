import Page from "../components/general/Page";
import NavBar from "../components/navbar/NavBar";
import NavBarLinksContainer from "../components/navbar/NavBarLinksContainer";
import Content from "../components/general/Content";
import Demo from "../components/homepage/Demo";
import NavAuthLinks from "../components/navbar/NavAuthLinks";
import {faGithub} from "@fortawesome/free-brands-svg-icons/faGithub";
import NavBarLink from "../components/navbar/NavBarLink";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import configdnMark from "../assets/images/vector/configdn-mark.svg";

export function Home() {
    return <>
        <Page>
            <NavBar logo={configdnMark}>
                <NavBarLinksContainer>
                    <NavBarLink isExternal href="https://github.com/dBuidl/ConfigDN">
                        <FontAwesomeIcon icon={faGithub}/>
                    </NavBarLink>
                    <NavAuthLinks/>
                </NavBarLinksContainer>
            </NavBar>

            <Content pageName={"homepage"}>
                <p className="mb-4 font-mono text-xs font-bold uppercase tracking-[0.22em] text-cyan">FEATURE FLAGS, MADE SIMPLE</p>
                <h1 className="max-w-2xl text-balance text-3xl font-semibold leading-[1.05] tracking-[-0.04em] text-copy sm:text-4xl lg:text-5xl">Ship changes with confidence.</h1>
                <p className="mt-5 max-w-xl text-base leading-7 text-muted">Keep teams and environments in sync from one workspace.</p>

                <Demo/>
            </Content>
        </Page>
    </>;
}
