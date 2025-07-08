const express = require("express");
const jobRouter = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const uploads = multer({ storage });
const {
  createJob,
  getMyJobs,
  updateJob,
  deleteJob,
  recommendedSevicesProviders
} = require("../controllers/jobController");

const { authenticateToken } = require("../middlewares/auth");

jobRouter.post("/addJob", authenticateToken, uploads.single('photo'), createJob);
jobRouter.get("/getJob", authenticateToken, getMyJobs);
jobRouter.patch("/:jobId", authenticateToken, updateJob);
jobRouter.delete("/:jobId", authenticateToken, deleteJob);
jobRouter.get('/getServices', authenticateToken, recommendedSevicesProviders);

module.exports = jobRouter;
