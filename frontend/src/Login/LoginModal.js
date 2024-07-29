import React, { useState } from "react";
import axios from "axios";
import "./LoginModal.css";
import { useToken } from "./../contexts/TokenContext";

const LoginModal = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [mode, setMode] = useState("login");
  const { setToken } = useToken();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mode === "login") {
      await handleLogin();
    } else if (mode === "register") {
      await handleRegister();
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:8080/login", {
        username,
        password,
      });
      setToken(response.data.jwtToken);
      setError(null);
      setSuccess(null);
      setUsername("");
      setPassword("");
      onClose();
    } catch (err) {
      setError(err.response.data.message);
      setSuccess(null);
      console.error(err);
    }
  };

  const handleRegister = async () => {
    try {
      await axios
        .post("http://localhost:8080/register", {
          username,
          password,
        })
        .then((response) => setSuccess(response.data));
      setError(null);
      setUsername("");
      setPassword("");
      setMode("login");
    } catch (err) {
      setError(err.response.data);
      setSuccess(null);
      console.error(err);
    }
  };

  const switchMode = () => {
    setMode((prevMode) => (prevMode === "login" ? "register" : "login"));
    setError(null);
    setSuccess(null);
    setUsername("");
    setPassword("");
  };

  return (
    <div className={`login-modal ${isOpen ? "open" : ""}`}>
      <div className="login-content">
        <h2>{mode === "login" ? "Login" : "Register"}</h2>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="button-container">
            <button type="submit">
              {mode === "login" ? "Login" : "Register"}
            </button>
            <button type="button" onClick={switchMode}>
              {mode === "login" ? "Switch to Register" : "Switch to Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
