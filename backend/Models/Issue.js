const mongoose = require('mongoose');

const IssueSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  photos: [{ type: String }], // URLs or file paths
  category: {
    type: String,
    enum: [
      'Roads',
      'Lighting',
      'Water Supply',
      'Cleanliness',
      'Public Safety',
      'Obstructions',
    ],
    required: true,
  },
  status: {
    type: String,
    enum: ['Reported', 'In Progress', 'Resolved'],
    default: 'Reported',
  },
  location: {
    type: { type: String, enum: ['Point'], required: true, default: 'Point' },
    coordinates: { type: [Number], required: true }, // [lng, lat]
  },
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  isAnonymous: { type: Boolean, default: false },
  statusLogs: [
    {
      status: String,
      timestamp: { type: Date, default: Date.now },
      updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
  ],
  flags: [
    {
      flaggedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      reason: String,
      timestamp: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

IssueSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Issue', IssueSchema);
