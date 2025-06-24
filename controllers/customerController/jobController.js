const Job = require("../../models/customerModel/jobModel");
const Category = require("../../models/categoryModel/categoryModel");
const SubCategory = require("../../models/categoryModel/subCategoryModel");

// ✅ POST: Create New Job
const createJob = async (req, res) => {
  try {
    const { title, description, minBudget, maxBudget, categoryName, subCategoryName, preferredDate, refImg } = req.body;
    const customerId = req.user.id;

    if (!title || !description || !minBudget || !categoryName) {
      return res.status(400).json({ success: false, message: "Required fields are missing." });
    }

    let category = await Category.findOne({ name: categoryName.trim() });
    if (!category) category = await Category.create({ name: categoryName.trim() });

    let subCategory = null;
    if (subCategoryName) {
      subCategory = await SubCategory.findOne({ name: subCategoryName.trim(), categoryId: category._id });
      if (!subCategory) {
        subCategory = await SubCategory.create({ name: subCategoryName.trim(), categoryId: category._id });
      }
    }

    const newJob = new Job({
      customer: customerId,
      title,
      description,
      budget,
      category: category._id,
      subCategory: subCategory?._id,
      location,
      preferredDate,
    });

    await newJob.save();
    res.status(201).json({ success: true, message: "Job created successfully", job: newJob });
  } catch (error) {
    console.error("Job Create Error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// ✅ GET: Jobs by Customer
const getMyJobs = async (req, res) => {
  try {
    const customerId = req.user.id;
    const jobs = await Job.find({ customer: customerId })
      .populate("category", "name")
      .populate("subCategory", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// ✅ PATCH: Update Job
const updateJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const customerId = req.user.id;
    const updates = req.body;

    const job = await Job.findOne({ _id: jobId, customer: customerId });
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });

    Object.assign(job, updates);
    await job.save();

    res.status(200).json({ success: true, message: "Job updated", job });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// ✅ DELETE: Delete Job
const deleteJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const customerId = req.user.id;

    const job = await Job.findOneAndDelete({ _id: jobId, customer: customerId });
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });

    res.status(200).json({ success: true, message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

module.exports = {
  createJob,
  getMyJobs,
  updateJob,
  deleteJob,
};
