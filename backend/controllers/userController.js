const xlsx = require("xlsx");
const UserData = require("../models/UserData"); // User model

// ✅ Excel Upload Handler
const uploadUsers = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "❌ No file uploaded" });
    }

    const filePath = req.file.path;
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = xlsx.utils.sheet_to_json(sheet);

    if (!Array.isArray(jsonData) || jsonData.length === 0) {
      return res.status(400).json({ message: "❌ Invalid or empty Excel file" });
    }

    const filteredData = await Promise.all(jsonData.map(async (entry) => {
      const exists = await UserData.findOne({ email: entry.email });
      return exists ? null : entry;
    }));

    const finalData = filteredData.filter(Boolean);

    await UserData.insertMany(finalData);

    res.status(200).json({
      message: "✅ Users uploaded successfully",
      uploaded: finalData.length,
      skipped: jsonData.length - finalData.length,
      data: finalData,
    });
  } catch (error) {
    console.error("❌ Upload Error:", error.message);
    res.status(500).json({ message: "❌ Upload failed", error: error.message });
  }
};

// ✅ Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await UserData.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users", error: err.message });
  }
};

// ✅ Delete user by ID
const deleteUser = async (req, res) => {
  try {
    await UserData.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "✅ User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "❌ Delete failed", error: err.message });
  }
};

// ✅ Update user by ID
const updateUser = async (req, res) => {
  try {
    const updated = await UserData.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: "❌ Update failed", error: err.message });
  }
};

module.exports = {
  uploadUsers,
  getAllUsers,
  deleteUser,
  updateUser,
};
