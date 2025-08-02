const {
  getIssuesNearby,
  createIssue,
  getIssueById,
  updateIssueStatus,
  flagIssue,
  getFilteredIssues,
} = require("../Controllers/IssueController");
const ensureAuthenticated = require("../Middlewares/Auth");

const router = require("express").Router();

// Public routes
router.get("/nearby", getIssuesNearby);
router.get("/filtered", getFilteredIssues);
router.get("/:id", getIssueById);

// Protected routes
router.post("/create", ensureAuthenticated, createIssue);
router.put("/:id/status", ensureAuthenticated, updateIssueStatus);
router.post("/:id/flag", ensureAuthenticated, flagIssue);

module.exports = router;
