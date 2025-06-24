const Service = require("../../models/serviceProviderUserModel/serviceModel");
const Category = require("../../models/categoryModel/categoryModel");
const SubCategory = require("../../models/categoryModel/subCategoryModel");

// ✅ Add Service
const addService = async (req, res) => {
  try {
    const userId = req.user.id;
    const { catname, subcategory, description, price } = req.body;

    if (!catname || !description || !price) {
      return res.status(400).json({ success: false, message: "Required fields missing." });
    }

    let category = await Category.findOne({ name: catname.trim() });
    if (!category) category = await Category.create({ name: catname.trim() });

    let subCatId = null;
    if (subcategory) {
      let subCat = await SubCategory.findOne({ name: subcategory.trim(), categoryId: category._id });
      if (!subCat) {
        subCat = await SubCategory.create({ name: subcategory.trim(), categoryId: category._id });
      }
      subCatId = subCat._id;
    }

    const newService = await Service.create({
      provider: userId,
      category: category._id,
      subCategory: subCatId,
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
module.exports ={getMyServices,addService,deleteService}