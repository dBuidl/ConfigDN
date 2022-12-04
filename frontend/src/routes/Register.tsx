import Navigation from "../components/Navigation";
import React from "preact/compat";
import "../styles/auth.scss";
import pocketbase from "../libraries/Pocketbase";

export default function Register() {
    // register = POST http://127.0.0.1:8090/api/users
    const [username, setUsername] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [passwordConfirm, setPasswordConfirm] = React.useState("");


    async function createAccount(e: Event) {
        e.preventDefault();
        e.stopPropagation();

        const response = await pocketbase.collection('users').create({
            username,
            email,
            password,
            passwordConfirm,
        })

        console.log(response);
    }

    return <div className={"auth-page"}>
        <Navigation/>

        <div className="auth-container">
            <div className="form" onSubmit={createAccount}>
                <div className="form-title">Register</div>
                <div className="form-input">
                    <label htmlFor="email">Username</label>
                    <input type="email" name="email" value={username}
                           onChange={(e: any) => setUsername(e.target.value)} id="email"/>
                </div>
                <div className="form-input">
                    <label htmlFor="email">Email</label>
                    <input type="email" name="email" value={email}
                           onChange={(e: any) => setEmail(e.target.value)} id="email"/>
                </div>
                <div className="form-input">
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" value={password}
                           onChange={(e: any) => setPassword(e.target.value)} id="password"/>
                </div>
                <div className="form-input">
                    <label htmlFor="password-confirm">Confirm Password</label>
                    <input type="password" name="password-confirm" value={passwordConfirm}
                           onChange={(e: any) => setPasswordConfirm(e.target.value)} id="password-confirm"/>
                </div>
                <div className="form-input">
                    <button onClick={createAccount}>Register</button>
                </div>

                {/* todo: add oauth2 options here */}
            </div>
        </div>
    </div>
}