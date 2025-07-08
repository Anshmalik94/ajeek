import React, { useEffect, useState } from "react";
import axios from "axios";
import "./UserTable.css";

function UserTable() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users/all");
      setUsers(res.data);
      setFilteredUsers(res.data);
    } catch (err) {
      alert("Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = users.filter((u) =>
      [u.name, u.email, u.course, u.mobile].some((field) =>
        field?.toLowerCase().includes(term)
      )
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`);
      fetchUsers();
    } catch (err) {
      alert("Delete failed");
    }
  };

  const handleEdit = (user) => {
    setEditId(user._id);
    setEditedData({ ...user });
  };

  const handleUpdate = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/users/${id}`, editedData);
      setEditId(null);
      fetchUsers();
    } catch (err) {
      alert("Update failed");
    }
  };

  const handleStatusToggle = async (id, field) => {
    const user = users.find((u) => u._id === id);
    const updatedStatus = {
      ...user.status,
      [field]: !user.status?.[field],
    };

    try {
      await axios.put(`http://localhost:5000/api/users/${id}`, {
        ...user,
        status: updatedStatus,
      });
      fetchUsers();
    } catch (err) {
      alert("Status update failed");
    }
  };

  const exportToCSV = () => {
    const csvRows = [];
    const headers = ["Name", "Email", "Mobile", "Course", "Verified", "Approved"];
    csvRows.push(headers.join(","));

    users.forEach((u) => {
      const row = [
        u.name,
        u.email,
        u.mobile,
        u.course,
        u.status?.verified ? "Yes" : "No",
        u.status?.approved ? "Yes" : "No",
      ];
      csvRows.push(row.join(","));
    });

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "students.csv";
    a.click();
  };

  return (
    <div className="user-table-container">
      <h2>User Data</h2>

      <input
        type="text"
        placeholder="Search by name, email, course, or mobile..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      <button onClick={exportToCSV} className="export-btn">
        Export CSV
      </button>

      <table className="user-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Course</th>
            <th>Verified</th>
            <th>Approved</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) =>
            editId === user._id ? (
              <tr key={user._id}>
                <td>
                  <input
                    value={editedData.name}
                    onChange={(e) =>
                      setEditedData({ ...editedData, name: e.target.value })
                    }
                  />
                </td>
                <td>
                  <input
                    value={editedData.email}
                    onChange={(e) =>
                      setEditedData({ ...editedData, email: e.target.value })
                    }
                  />
                </td>
                <td>
                  <input
                    value={editedData.mobile}
                    onChange={(e) =>
                      setEditedData({ ...editedData, mobile: e.target.value })
                    }
                  />
                </td>
                <td>
                  <input
                    value={editedData.course}
                    onChange={(e) =>
                      setEditedData({ ...editedData, course: e.target.value })
                    }
                  />
                </td>
                <td colSpan={3}>
                  <button onClick={() => handleUpdate(user._id)}>Save</button>
                  <button onClick={() => setEditId(null)}>Cancel</button>
                </td>
              </tr>
            ) : (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.mobile}</td>
                <td>{user.course}</td>
                <td>
                  <button
                    className={
                      user.status?.verified ? "btn-verified" : "btn-unverified"
                    }
                    onClick={() => handleStatusToggle(user._id, "verified")}
                  >
                    {user.status?.verified ? "Verified" : "Not Verified"}
                  </button>
                </td>
                <td>
                  <button
                    className={
                      user.status?.approved ? "btn-approved" : "btn-unapproved"
                    }
                    onClick={() => handleStatusToggle(user._id, "approved")}
                  >
                    {user.status?.approved ? "Approved" : "Not Approved"}
                  </button>
                </td>
                <td>
                  <button onClick={() => handleEdit(user)}>Edit</button>
                  <button onClick={() => handleDelete(user._id)}>Delete</button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}

export default UserTable;
