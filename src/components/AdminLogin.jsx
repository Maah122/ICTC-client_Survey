import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Admin.css"; 
import logo from "../images/logo.png"
const AdminLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();

        const validEmail = "user@example.com";
        const validPassword = "123";

        if (email === validEmail && password === validPassword) {
            navigate("/dashboard"); // Redirect to dashboard or homepage
        } else {
            setError("Invalid email or password.");
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
            <img src={logo} alt="logo" className="logo" />
                {/* <div className="logo">
                    <img src={logo} alt="logo" className="logo" />
                </div> */}
                <p> Log in to continue </p>
                
                <form onSubmit={handleLogin}>
                <div className="input-group">
                    <label className="label">Email:</label>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <label className="label">Password:</label>
                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p className="error">{error}</p>}
                <button type="submit">Login</button>
            </form>
            </div>
        </div>
    );
};

export default AdminLogin;
