import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AuthForm.css";

function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || (!isLogin && !name)) {
      alert("Please fill all fields");
      return;
    }

    try {
      if (isLogin) {
        // 🔐 Login API
        const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/dashboard");
      } else {
        // 📝 Register API
        await axios.post("http://localhost:5000/api/auth/register", { name, email, password });
        alert("✅ Registered! Now login.");
        setIsLogin(true);
      }
    } catch (err) {
      alert("❌ " + (isLogin ? "Login" : "Registration") + " failed");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>{isLogin ? "Admin Login" : "Admin Register"}</h2>

        {!isLogin && (
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        <button type="submit">{isLogin ? "Login" : "Register"}</button>

        <p style={{ marginTop: "10px" }}>
          {isLogin ? (
            <>New here? <span style={{ color: "blue", cursor: "pointer" }} onClick={() => setIsLogin(false)}>Register</span></>
          ) : (
            <>Already have an account? <span style={{ color: "blue", cursor: "pointer" }} onClick={() => setIsLogin(true)}>Login</span></>
          )}
        </p>
      </form>
    </div>
  );
}

export default AuthForm;
