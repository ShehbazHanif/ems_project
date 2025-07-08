const Service = require("../models/serviceModel");
const Category = require("../models/categoryModel");
const Job = require('../models/jobModel');
const Customer = require('../models/authCustomerModel')

// ✅ Add Service
const addService = async (req, res) => {
  try {
    const providerId = req.user.id;
    const { categoryId, subCategory, description, price } = req.body;

    if (!categoryId || !description || !price || !subCategory) {
      return res.status(400).json({ success: false, message: "Required fields missing." });
    }

    let category = await Category.findOne({ _id: categoryId });
    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category is Not found"
      })
    }

    const newService = await Service.create({
      providerId,
      categoryId: category._id,
      subCategory,
      description,
      price,
    });

    res.status(201).json({ success: true, message: "Service added", service: newService });
  } catch (error) {
    console.error("Add Service Error:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ✅ Get All Services of Provider
const getMyServices = async (req, res) => {
  try {
    const userId = req.user.id;

    const services = await Service.find({ provider: userId })
      .populate("category", "name")
      .populate("subCategory", "name");

    res.status(200).json({ success: true, services });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ✅ Delete Service
const deleteService = async (req, res) => {
  try {
    const userId = req.user.id;
    const serviceId = req.params.serviceId;

    const service = await Service.findOneAndDelete({ _id: serviceId, provider: userId });
    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    res.status(200).json({ success: true, message: "Service deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
// recommend Job 
const recommendedJob = async (req, res) => {
  try {
    const providerId = req.user.id;

    // 1. Find all Services posted by this provider
    const providerServices = await Service.find({ providerId });
    //console.log(providerServices);


    // 2. Make an array of conditions to match services
    const check = providerServices.map(service => ({
      categoryId: service.categoryId,
      subCategory: service.subCategory,
    }));
    //console.log(check);


    // 3. Find matching services
    const matchingServices = await Job.find({
      $or: check,
    }).populate("customerId");
    //console.log(matchingServices);


    // 4. Extract customer IDs (no duplicates assumed)
    const custmoersIds = matchingServices.map(service => service.customerId._id);
    console.log(custmoersIds);


    // 5. Fetch recommended Job
    const recommended = await Customer.find({ _id: { $in: custmoersIds } });

    res.status(200).json({
      success: true,
      recommended,
    });
  } catch (error) {
    console.error("Recommendation Error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
module.exports = { getMyServices, addService, deleteService, recommendedJob }