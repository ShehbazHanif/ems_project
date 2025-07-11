const Offer = require("../common/offerModel");
const Job = require("../models/jobModel");
const Service = require("../models/serviceModel");
const Booking = require('../common/bookingModel');
const mongoose = require('mongoose')

// ✅ Send Offer
const sendOffer = async (req, res) => {
  try {
    const { job: jobId, service: serviceId } = req.query;
    const { price, proposal, portfolioUrl } = req.body;
    //console.log("ReqBody",req.body);
    const user = req.user;
  console.log("user", user.id)

    if (!price || (!jobId && !serviceId) || (jobId && serviceId)) {
      return res.status(400).json({
        message: "Either jobId or serviceId is required, not both."
      });
    }

    let offerData = { price, proposal, portfolioUrl };

    if (jobId) {
      const job = await Job.findById(jobId);
      if (!job) return res.status(404).json({ message: "Job not found." });
      

      // ❌ Prevent duplicate offers
      const existingOffer = await Offer.findOne({
        jobId,
        providerId: user._id
      });
      if (existingOffer)
        return res.status(400).json({ message: "Offer already sent to this job." });

      offerData.jobId = jobId;
      offerData.customerId = job.customerId;
      offerData.providerId = user.id;

    } else {
      const service = await Service.findById(serviceId);
      //console.log("serviceId is :",service?.providerId);
      if (!service) return res.status(404).json({ message: "Service not found." });

      const existingOffer = await Offer.findOne({
        serviceId,
        customerId: user.id
      });
      if (existingOffer)
        return res.status(400).json({ message: "Offer already sent to this service." });

      offerData.serviceId = serviceId;
      offerData.providerId = service.providerId;
      offerData.customerId = user.id;
    }

    const newOffer = await Offer.create(offerData);

    res.status(201).json({
      message: "Offer sent successfully.",
      offer: newOffer
    });

  } catch (error) {
    console.error("Error sending offer:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// 📥 Get All Offers for Logged-in User
const getAllOffers = async (req, res) => {
  try {
    const userId = req.user._id;

    const offers = await Offer.find({
      $or: [{ customerId: userId }, { providerId: userId }]
    })
      .populate("jobId")
      .populate("serviceId")
      .populate("customerId", "name email")
      .populate("providerId", "name email");

    res.status(200).json({
      offers
    });
  } catch (error) {
    console.error("Error fetching offers:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// ✅ Accept Offer
const acceptOffer = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const offerId = req.params.offerId;
    const userId = req.user.id;

    const offer = await Offer.findById(offerId).session(session);
    if (!offer) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Offer not found." });
    }

    const receiverId =
      offer.customerId?.toString() === userId.toString()
        ? offer.customerId
        : offer.providerId?.toString() === userId.toString()
        ? offer.providerId
        : null;

    if (!receiverId) {
      await session.abortTransaction();
      return res.status(403).json({ message: "You are not authorized to accept this offer." });
    }

    if (offer.status !== "pending") {
      await session.abortTransaction();
      return res.status(400).json({ message: "Offer already responded." });
    }

    // 1. Update offer status
    offer.status = "accepted";
    await offer.save({ session });

    // 2. Create Booking
    const booking = await Booking.create(
      [{
        offerId: offer._id,
        jobId: offer.jobId || undefined,
        serviceId: offer.serviceId || undefined,
        customerId: offer.customerId,
        providerId: offer.providerId,
        price: offer.price,
        status: "ongoing"
      }],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      message: "Offer accepted and booking created successfully.",
      offer,
      booking: booking[0]
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error in accepting offer and creating booking:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// ❌ Reject Offer
const rejectOffer = async (req, res) => {
  try {
    const offerId = req.params.offerId;
    const userId = req.user._id;

    const offer = await Offer.findById(offerId);
    if (!offer) return res.status(404).json({ message: "Offer not found." });

    const receiverId =
      offer.customerId?.toString() === userId.toString()
        ? offer.customerId
        : offer.providerId?.toString() === userId.toString()
        ? offer.providerId
        : null;

    if (!receiverId)
      return res.status(403).json({ message: "You are not authorized to reject this offer." });

    if (offer.status !== "pending")
      return res.status(400).json({ message: "Offer already responded." });

    offer.status = "rejected";
    await offer.save();

    res.status(200).json({ message: "Offer rejected successfully.", offer });

  } catch (error) {
    console.error("Error rejecting offer:", error);
    res.status(500).json({ message: "Server error." });
  }
};

module.exports = {
  sendOffer,
  getAllOffers,
  acceptOffer,
  rejectOffer
};
