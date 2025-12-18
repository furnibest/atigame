"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import "../../styles/admin.css";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "amd123") {
      // Set login status in localStorage
      localStorage.setItem("adminLoggedIn", "true");
      router.push("/admin/dashboard");
    } else {
      setError("Username atau password salah");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="login-header">
          <h2>Admin Login</h2>
          <p>Masuk ke panel administrasi</p>
        </div>

        <div className="login-input-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            placeholder="Masukkan username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="login-input-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Masukkan password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <div className="login-error">{error}</div>}

        <button type="submit" className="login-submit-btn">
          Masuk
        </button>

        <div className="login-footer">
          <p>Atiga Meubel Admin Panel</p>
        </div>
      </form>
    </div>
  );
}
