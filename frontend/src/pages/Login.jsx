import { useState } from "react";
import { login } from "../services/api";
import { Link, useNavigate } from "react-router-dom";

const loginBackgroundImage =
  "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=2200&q=80";

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  marginBottom: "12px",
  padding: "12px",
  border: "none",
  borderRadius: "8px",
  fontSize: "16px"
};

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await login(form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      if (res.data.role === "customer") navigate("/home");
      else if (res.data.role === "admin") navigate("/admin");
      else if (res.data.role === "owner") navigate("/owner");
    } catch {
      alert("Login failed");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: `
          linear-gradient(rgba(2, 6, 23, 0.84), rgba(15, 23, 42, 0.9)),
          url(${loginBackgroundImage})
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "white",
        padding: "20px"
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          maxWidth: "360px",
          background: "rgba(2, 6, 23, 0.94)",
          padding: "30px",
          borderRadius: "12px",
          border: "1px solid rgba(148, 163, 184, 0.14)",
          boxShadow: "0 20px 45px rgba(0,0,0,0.55)"
        }}
      >
        <h2 style={{ marginTop: 0, marginBottom: "20px" }}>
          Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
          style={inputStyle}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            background: "#22c55e",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          Login
        </button>

        <p
          style={{
            marginTop: "18px",
            marginBottom: 0,
            textAlign: "center",
            fontSize: "14px",
            color: "#cbd5e1"
          }}
        >
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "#22c55e" }}>
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
}
