import Navigation from "../components/Navigation";
import React from "preact/compat";

export default function Login() {
    return <>
        <Navigation/>

        <div className="auth-page">
            <div className="auth-container">
                <div className="form">
                    <div className="form-title">Login</div>
                    <div className="form-input">
                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" id="email"/>
                    </div>
                    <div className="form-input">
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" id="password"/>
                    </div>
                    <div className="form-input">
                        <button>Login</button>
                    </div>
                </div>

                {/* todo: add oauth2 options here */}
            </div>
        </div>
    </>
}