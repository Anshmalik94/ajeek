import React, { useState } from "react";
import axios from "axios";
import "./AddUserForm.css"; // optional custom styling

function AddUserForm({ onUserAdded }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    course: "",
    status: {
      verified: false,
      approved: false,
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      status: {
        ...prev.status,
        [name]: checked,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/users", formData);
      alert("✅ User added successfully");
      setFormData({
        name: "",
        email: "",
        mobile: "",
        course: "",
        status: {
          verified: false,
          approved: false,
        },
      });
      onUserAdded(); // refresh parent list
    } catch (err) {
      alert("❌ Failed to add user");
    }
  };

  return (
    <form className="add-user-form" onSubmit={handleSubmit}>
      <h3>Add New User</h3>
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="mobile"
        placeholder="Mobile"
        value={formData.mobile}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="course"
        placeholder="Course"
        value={formData.course}
        onChange={handleChange}
        required
      />

      <label>
        <input
          type="checkbox"
          name="verified"
          checked={formData.status.verified}
          onChange={handleCheckboxChange}
        />
        Verified
      </label>

      <label>
        <input
          type="checkbox"
          name="approved"
          checked={formData.status.approved}
          onChange={handleCheckboxChange}
        />
        Approved
      </label>

      <button type="submit">Add User</button>
    </form>
  );
}

export default AddUserForm;
