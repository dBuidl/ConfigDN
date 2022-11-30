import '../styles/theme.scss'
import React from "preact/compat";
import Navigation from "../components/Navigation";
import PingPong from "../components/PingPong";

export function Home() {
  return <>
    <Navigation />
    <PingPong />
  </>;
}
