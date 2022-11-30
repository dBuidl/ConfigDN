import React from "preact/compat";
import "../styles/pingpong.scss";

// a pingpong animation of a ball bouncing between two paddles toggling a switch on and off
export default function PingPong() {
    return (
        <div className="ping-pong">
            <div className="ping-pong-paddle ping-pong-paddle-left" />
            <div className="ping-pong-paddle ping-pong-paddle-right" />
            <div className="ping-pong-ball" />
            <div className="ping-pong-switch" />
            <div className="ping-pong-divider" />
        </div>
    );
}