const express = require("express");
const jobRouter = express.Router();
const {
  createJob,
  getMyJobs,
  updateJob,
  deleteJob,
} = require("../../controllers/customerController/jobController");

const { authenticateToken } = require("../../middlewares/auth");

jobRouter.post("/", authenticateToken, createJob);
jobRouter.get("/", authenticateToken, getMyJobs);
jobRouter.patch("/:jobId", authenticateToken, updateJob);
jobRouter.delete("/:jobId", authenticateToken, deleteJob);

module.exports = jobRouter;
