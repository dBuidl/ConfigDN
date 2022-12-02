import Navigation from "../components/Navigation";
import React from "preact/compat";
import "../styles/auth.scss";

export default function Register() {
    // register = POST http://127.0.0.1:8090/api/users

    return <div className={"auth-page"}>
        <Navigation/>

        <div className="auth-container">
            <div className="form">
                <div className="form-title">Register</div>
                <div className="form-input">
                    <label htmlFor="email">Email</label>
                    <input type="email" name="email" id="email"/>
                </div>
                <div className="form-input">
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" id="password"/>
                </div>
                <div className="form-input">
                    <label htmlFor="password-confirm">Confirm Password</label>
                    <input type="password" name="password-confirm" id="password-confirm"/>
                </div>
                <div className="form-input">
                    <button>Register</button>
                </div>

                {/* todo: add oauth2 options here */}
            </div>
        </div>
    </div>
}