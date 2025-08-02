const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const IssueSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: [
      "Roads",
      "Lighting",
      "Water Supply",
      "Cleanliness",
      "Public Safety",
      "Obstructions",
    ],
  },
  status: {
    type: String,
    default: "Reported",
    enum: ["Reported", "In Progress", "Resolved"],
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
      default: "Point",
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
  },

  photos: [
    {
      type: String, // URLs to uploaded photos
    },
  ],
  reportedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    default: null, // null for anonymous reports
  },
  isAnonymous: {
    type: Boolean,
    default: false,
  },
  activity: [
    {
      action: String,
      timestamp: {
        type: Date,
        default: Date.now,
      },
      description: String,
      updatedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    },
  ],
  flags: [
    {
      flaggedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      reason: String,
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  isHidden: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Add index for location-based queries
IssueSchema.index({ "location.coordinates": "2dsphere" });

const IssueModel = mongoose.model("Issue", IssueSchema);
module.exports = IssueModel;