import { useState } from "react";
import { register } from "../services/api";
import { Link, useNavigate } from "react-router-dom";

const registerBackgroundImage =
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

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: ""
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      return alert("Fill all fields");
    }

    if (!form.role) return alert("Select role");

    try {
      await register(form);
      alert("Registered successfully");
      navigate("/");
    } catch {
      alert("Registration failed");
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
          url(${registerBackgroundImage})
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
          Register
        </h2>

        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          style={inputStyle}
        />

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          style={inputStyle}
        />

        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          style={inputStyle}
        >
          <option value="">Select Role</option>
          <option value="customer">Customer</option>
          <option value="admin">Admin</option>
          <option value="owner">Owner</option>
        </select>

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
          Register
        </button>

        <p
          style={{
            marginTop: "15px",
            marginBottom: 0,
            textAlign: "center",
            fontSize: "14px",
            color: "#cbd5e1"
          }}
        >
          Already have an account?{" "}
          <Link to="/" style={{ color: "#22c55e" }}>
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
