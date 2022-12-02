import React, {useCallback, useEffect} from "preact/compat";
import "../styles/pingpong.scss";

// a pingpong animation of a ball bouncing between two paddles toggling a switch on and off
export default function PingPong() {
    const [ballX, setBallX] = React.useState(50);
    const [ballY, setBallY] = React.useState(10);
    const [ballSpeedX, setBallSpeedX] = React.useState(1);
    const [ballSpeedY, setBallSpeedY] = React.useState(1);

    // makes the switch line up with the ball, so it passes through it in the middle (and toggles the switch)
    const [switchX, setSwitchX] = React.useState(0);
    const [switchAngle, setSwitchAngle] = React.useState(0);
    const [switchActive, setSwitchActive] = React.useState(false);

    const [paddle1X, setPaddle1X] = React.useState(50);
    const [paddle2X, setPaddle2X] = React.useState(50);

    useEffect(() => {
        let ballInternalX = ballX;
        let ballInternalY = ballY;

        let i = setInterval(() => {
            // move the ball
            ballInternalX = ballInternalX + ballSpeedX;
            ballInternalY = ballInternalY + ballSpeedY;

            if (ballInternalX > 97) {
                ballInternalX = 97;
                setBallSpeedX(-1);
            }

            if (ballInternalX < 3) {
                ballInternalX = 3;
                setBallSpeedX(1);
            }

            if (ballInternalY > 97) {
                ballInternalY = 97;
                setBallSpeedY(-1);
            }

            if (ballInternalY < 3) {
                ballInternalY = 3;
                setBallSpeedY(1);
            }

            setBallX(ballInternalX);
            setBallY(ballInternalY);

            // move the switch
            setSwitchX(ballInternalX);
            // set switch angle (aim for the balls relative position)
            setSwitchAngle(Math.atan2(ballInternalY, ballInternalX) * 180 / Math.PI);

            let paddle1InternalX = ballX;
            let paddle2InternalX = ballX;

            if (ballInternalX < 10) {
                paddle1InternalX = 10;
            }

            if (ballInternalX > 90) {
                paddle2InternalX = 90;
            }

            // move the paddles
            setPaddle1X(paddle1InternalX);
            setPaddle2X(paddle2InternalX);

            // bounce the ball off the paddles
            if (ballX < 10) {
                setBallSpeedX(1);
            }
            if (ballX > 90) {
                setBallSpeedX(-1);
            }

            // bounce the ball off the top and bottom
            if (ballY < 10) {
                setBallSpeedY(1);
            }
            if (ballY > 90) {
                setBallSpeedY(-1);
            }

            // toggle the switch when the ball passes through it
            if (ballY > 90 && ballX > switchX - 5 && ballX < switchX + 5) {
                setSwitchActive(!switchActive);
            }
        }, 1000 / 60);

        return () => clearInterval(i);
    }, []);

    return (
        <div className="ping-pong">
            <div className="ping-pong-paddle ping-pong-paddle-left" style={{top: paddle1X + "%"}} />
            <div className="ping-pong-paddle ping-pong-paddle-right" style={{top: paddle2X + "%"}} />
            <div className="ping-pong-ball" style={{top: ballX + "%", left: ballY + "%"}} />
            <div className={`ping-pong-switch ${switchActive ? "active" : "inactive"}`} style={{top: switchX + "%", transform: `rotate(${switchAngle}deg)`}} />
            <div className="ping-pong-divider" />
        </div>
    );
}