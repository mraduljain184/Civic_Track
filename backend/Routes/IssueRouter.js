const express = require('express');
const router = express.Router();
const IssueController = require('../Controllers/IssueController');
// const { authenticate } = require('../Middlewares/Auth'); // Uncomment when auth is ready

// Create a new issue
router.post('/', /*authenticate,*/ IssueController.createIssue);

// Get issues with filters
router.get('/', IssueController.getIssues);

// Get issue details
router.get('/:id', IssueController.getIssueById);

// Update issue status
router.patch('/:id/status', /*authenticate,*/ IssueController.updateIssueStatus);

// Flag an issue
router.post('/:id/flag', /*authenticate,*/ IssueController.flagIssue);

module.exports = router;
