import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UploadForm from "./UploadForm";
import UserTable from "./UserTable";
import StatusPieChart from "./StatusPieChart";
import AddUserForm from "./AddUserForm";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(false);

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleUserAdded = () => {
    setRefresh((prev) => !prev);
  };

  return (
    <div
      style={{
        padding: "2rem",
        fontFamily: "'Segoe UI', sans-serif",
        backgroundColor: "#f0f4ff",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "transparent",
          padding: "1rem 2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
          borderBottom: "1px solid #c3d3f0",
        }}
      >
        <h2 style={{ margin: 0, fontWeight: "600", color: "#0d47a1" }}>
          Welcome, <span style={{ color: "#1565c0" }}>{user.name}</span> 👋
        </h2>
        <button
          onClick={logout}
          style={{
            padding: "10px 20px",
            backgroundColor: "#1565c0",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "500",
          }}
        >
          Logout
        </button>
      </div>

      {/* Upload Form */}
      <div
        style={{
          background: "transparent",
          padding: "1rem 0",
          marginBottom: "1.5rem",
        }}
      >
        <h3 style={{ marginBottom: "0.5rem", color: "#0d47a1" }}>
          📤 Upload Excel File
        </h3>
        <UploadForm />
      </div>

      {/* Pie Chart (boxed with shadow) */}
      <div
        style={{
          background: "#ffffff",
          padding: "1.5rem",
          borderRadius: "10px",
          marginBottom: "2rem",
          boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
        }}
      >
        <StatusPieChart key={refresh} />
      </div>

      {/* Add Student */}
      <div
        style={{
          background: "transparent",
          padding: "1rem 0",
          marginBottom: "1.5rem",
        }}
      >
        <h3 style={{ marginBottom: "0.5rem", color: "#0d47a1" }}>
          ➕ Add New Student
        </h3>
        <AddUserForm onUserAdded={handleUserAdded} />
      </div>

      {/* Table */}
      <div
        style={{
          background: "transparent",
          padding: "1rem 0",
          marginBottom: "2rem",
        }}
      >
        <UserTable key={refresh} />
      </div>
    </div>
  );
}

export default Dashboard;
