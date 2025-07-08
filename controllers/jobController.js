const Job = require("../models/jobModel");
const Category = require("../models/categoryModel");
const ServiceProvider = require("../models/serviceModel");
const authServiceProvider = require('../models/authServiceProviderModel');

const { uploadToCloud } = require('../utils/uploadToCloud');

// ✅ POST: Create New Job
const createJob = async (req, res) => {
  try {
    const { title, description, minBudget, maxBudget, categoryId, preferredDate, status, subCategory } = req.body;
    const customerId = req.user.id;

    if (!title || !description || !minBudget || !categoryId || !subCategory) {
      return res.status(400).json({ success: false, message: "Required fields are missing." });
    }


    let refImg = null;
    if (req.file) {
      const result = await uploadToCloud(req.file.buffer, req.file.originalname, req.file.mimetype);
      if (!result.success) return res.status(500).json({ message: 'Image upload failed', error: result.error });
      refImg = result.fileUrl;
    }
    let category = await Category.findOne({ _id: categoryId });

    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    if (!category.subcategories.includes(subCategory)) {
      return res.status(400).json({ success: false, message: "Invalid subcategory for the selected category." });
    }


    const newJob = new Job({
      customerId,
      title,
      description,
      minBudget,
      maxBudget,
      categoryId: category._id,
      refImg,
      preferredDate,
      status,
      subCategory
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
    const jobs = await Job.find({ customerId })
      .populate("customerId", "fullName")
      .populate("categoryId", "name ")
      .sort({ createdAt: -1 });

    const formatJob = jobs.map((job) => {
      return {
        customerName: job?.customerId?.fullName || "Unknown",
        catagery: job?.categoryId?.name || "Unknown",
        subCategory: job.subCategory,
        title: job.title,
        status: job.status,
        minBudget: job.minBudget,
        maxBudget: job.maxBudget,
        preferredDate: new Date(job.preferredDate).toLocaleDateString(),
        description: job.description,
        refImg: job.refImg
      }
    })

    res.status(200).json({ success: true, formatJob });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

const recommendedSevicesProviders = async (req, res) => {
  try {
    const customerId = req.user.id;

    // 1. Find all jobs posted by this customer
    const customerJobs = await Job.find({ customerId });

    // 2. Make an array of conditions to match services
    const check = customerJobs.map(job => ({
      categoryId: job.categoryId,
      subCategory: job.subCategory,
    }));

    // 3. Find matching services
    const matchingServices = await ServiceProvider.find({
      $or: check,
    }).populate("providerId");

    // 4. Extract providerIds (no duplicates assumed)
    const providerIds = matchingServices.map(service => service.providerId._id);

    // 5. Fetch recommended providers
    const recommended = await authServiceProvider.find({ _id: { $in: providerIds } });

    res.status(200).json({
      success: true,
      recommended,
    });
  } catch (error) {
    console.error("Recommendation Error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};


// ✅ PATCH: Update Job
const updateJob = async (req, res) => {
  try {
    const jobId = req.params;
    const customerId = req.user.id;
    const updates = req.body;

    const job = await Job.findOne({ _id: jobId, customerId });
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
    const jobId = req.params;
    const customerId = req.user.id;

    const job = await Job.findOneAndDelete({ _id: jobId, customerId });
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
  recommendedSevicesProviders
};
