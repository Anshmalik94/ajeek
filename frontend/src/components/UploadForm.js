import React, { useState } from "react";
import axios from "axios";
import "./UploadForm.css"; // Create this file for styling

function UploadForm() {
  const [file, setFile] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("⚠️ Please select a file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://localhost:5000/api/users/upload", formData);
      setMessage(res.data.message);
      setTableData(res.data.data); // Set parsed table data
    } catch (err) {
      setMessage("❌ Upload failed");
    }
  };

  return (
    <div className="upload-container">
      <h2>📤 Upload Excel</h2>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>

      {message && <p className="message">{message}</p>}

      {tableData.length > 0 && (
        <div className="table-wrapper">
          <h3>📄 Uploaded Data Preview</h3>
          <table>
            <thead>
              <tr>
                {Object.keys(tableData[0]).map((key, index) => (
                  <th key={index}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {Object.values(row).map((val, colIndex) => (
                    <td key={colIndex}>{val}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default UploadForm;
