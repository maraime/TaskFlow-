const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,

  deadline: Date,

  status: {
    type: String,
    enum: ["actif", "en pause", "archivé"],
    default: "actif"
  },

  owner: {
    type: String, // غادي نربطوه لاحقاً بالـ user id
    required: false
  }
}, { timestamps: true });

module.exports = mongoose.model("Project", ProjectSchema);