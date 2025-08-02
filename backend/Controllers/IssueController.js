const IssueModel = require("../Models/Issue");
const UserModel = require("../Models/User");

// Get issues within radius
const getIssuesNearby = async (req, res) => {
  try {
    const { latitude, longitude, radius = 5 } = req.query;

    if (!latitude || !longitude) {
      return res
        .status(400)
        .json({ message: "Latitude and longitude are required" });
    }

    const radiusInMeters = radius * 1000; // Convert km to meters

    const issues = await IssueModel.find({
      isHidden: false,
      "location.coordinates": {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [
              Number.parseFloat(longitude),
              Number.parseFloat(latitude),
            ],
          },
          $maxDistance: radiusInMeters,
        },
      },
    })
      .populate("reportedBy", "username")
      .sort({ createdAt: -1 });

    res.status(200).json({ issues });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching issues", error: error.message });
  }
};

// Create new issue
const createIssue = async (req, res) => {
  try {
    const { title, description, category, location, photos, isAnonymous } =
      req.body;
    const userId = req.user ? req.user.id : null;

    const newIssue = new IssueModel({
      title,
      description,
      category,
      location,
      photos: photos[0] || [],
      reportedBy: isAnonymous ? null : userId,
      isAnonymous,
      activity: [
        {
          action: "Reported",
          description: "Issue reported by user",
          updatedBy: userId,
        },
      ],
    });

    await newIssue.save();
    res
      .status(201)
      .json({ message: "Issue reported successfully", issue: newIssue });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating issue", error: error.message });
  }
};

// Get issue by ID
const getIssueById = async (req, res) => {
  try {
    const { id } = req.params;
    const issue = await IssueModel.findById(id)
      .populate("reportedBy", "username")
      .populate("activity.updatedBy", "username");

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    res.status(200).json({ issue });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching issue", error: error.message });
  }
};

// Update issue status
const updateIssueStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, description } = req.body;
    const userId = req.user.id;

    const issue = await IssueModel.findById(id);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    issue.status = status;
    issue.updatedAt = new Date();
    issue.activity.push({
      action: `Status changed to ${status}`,
      description: description || `Issue status updated to ${status}`,
      updatedBy: userId,
    });

    await issue.save();
    res
      .status(200)
      .json({ message: "Issue status updated successfully", issue });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating issue status", error: error.message });
  }
};

// Flag issue
const flagIssue = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const userId = req.user.id;

    const issue = await IssueModel.findById(id);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    // Check if user already flagged this issue
    const alreadyFlagged = issue.flags.some(
      (flag) => flag.flaggedBy.toString() === userId
    );
    if (alreadyFlagged) {
      return res
        .status(400)
        .json({ message: "You have already flagged this issue" });
    }

    issue.flags.push({
      flaggedBy: userId,
      reason,
    });

    // Auto-hide if flagged by 3 or more users
    if (issue.flags.length >= 3) {
      issue.isHidden = true;
    }

    await issue.save();
    res.status(200).json({ message: "Issue flagged successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error flagging issue", error: error.message });
  }
};

// Get filtered issues
const getFilteredIssues = async (req, res) => {
  try {
    const {
      latitude,
      longitude,
      radius = 5,
      status,
      category,
      search,
    } = req.query;

    if (!latitude || !longitude) {
      return res
        .status(400)
        .json({ message: "Latitude and longitude are required" });
    }

    const radiusInMeters = radius * 1000;
    const query = {
      isHidden: false,
      "location.coordinates": {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [
              Number.parseFloat(longitude),
              Number.parseFloat(latitude),
            ],
          },
          $maxDistance: radiusInMeters,
        },
      },
    };

    if (status && status !== "All") {
      query.status = status;
    }

    if (category && category !== "All") {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const issues = await IssueModel.find(query)
      .populate("reportedBy", "username")
      .sort({ createdAt: -1 });

    res.status(200).json({ issues });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching filtered issues",
      error: error.message,
    });
  }
};

module.exports = {
  getIssuesNearby,
  createIssue,
  getIssueById,
  updateIssueStatus,
  flagIssue,
  getFilteredIssues,
};
