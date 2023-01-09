import '../styles/theme.scss'
import React from "preact/compat";
import Navigation from "../components/Navigation";
import "../styles/home.scss";

export function Home() {
  return <>
    <Navigation/>

    <div className="page-home">
      <div class={"banner"}>
        <h1>Simple yet powerful feature flags for you and your team.</h1>
        <p>Manage your feature flags in a simple and intuitive way.</p>
      </div>

      <div class="demo">
        <div class="demo-dashboard">

        </div>
        <div class="demo-devices">
          <div class="demo-device phone">
            <div class="demo-device-frame">
            </div>
          </div>
        </div>
      </div>
    </div>
  </>;
}
