const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {
  uploadUsers,
  getAllUsers,
  deleteUser,
  updateUser,
} = require("../controllers/userController");

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // uploads folder me save hoga
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // unique filename
  },
});

const upload = multer({ storage });

// ✅ Routes
router.post("/upload", upload.single("file"), uploadUsers);
router.get("/all", getAllUsers);
router.delete("/:id", deleteUser);
router.put("/:id", updateUser);

module.exports = router;
