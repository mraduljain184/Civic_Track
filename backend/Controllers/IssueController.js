const Issue = require('../Models/Issue');

// Create a new issue
exports.createIssue = async (req, res) => {
  try {
    const { title, description, photos, category, location, isAnonymous } = req.body;
    const reporter = isAnonymous ? null : req.user?._id;
    const issue = new Issue({
      title,
      description,
      photos,
      category,
      location,
      reporter,
      isAnonymous,
      statusLogs: [{ status: 'Reported', updatedBy: reporter }],
    });
    await issue.save();
    res.status(201).json(issue);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get issues with optional filters (status, category, distance)
exports.getIssues = async (req, res) => {
  try {
    const { status, category, lng, lat, radius } = req.query;
    let filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (lng && lat && radius) {
      filter.location = {
        $geoWithin: {
          $centerSphere: [[parseFloat(lng), parseFloat(lat)], parseFloat(radius) / 6378.1],
        },
      };
    }
    const issues = await Issue.find(filter);
    res.json(issues);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get issue details
exports.getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: 'Issue not found' });
    res.json(issue);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update issue status
exports.updateIssueStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: 'Issue not found' });
    issue.status = status;
    issue.statusLogs.push({ status, updatedBy: req.user?._id });
    await issue.save();
    res.json(issue);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Flag an issue
exports.flagIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: 'Issue not found' });
    issue.flags.push({ flaggedBy: req.user?._id, reason: req.body.reason });
    await issue.save();
    res.json({ message: 'Issue flagged' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
