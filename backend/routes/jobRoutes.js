const express = require('express');
const authenticateToken = require('../middleware/authenticateToken');
const asyncHandler = require('../utils/asyncHandler');
const {
	getJobs,
	getJobById,
	saveJob,
	applyToJob,
	removeSavedJob,
	removeAppliedJob,
	getSavedJobs,
	getAppliedJobs,
	getProfile,
	updateProfile,
} = require('../controllers/jobController');

const router = express.Router();

router.get('/profile', authenticateToken, asyncHandler(getProfile));
router.put('/profile', authenticateToken, asyncHandler(updateProfile));
router.get('/jobs', authenticateToken, asyncHandler(getJobs));
router.get('/jobs/:id', authenticateToken, asyncHandler(getJobById));
router.post('/jobs/:id/save', authenticateToken, asyncHandler(saveJob));
router.delete('/jobs/:id/save', authenticateToken, asyncHandler(removeSavedJob));
router.post('/jobs/:id/apply', authenticateToken, asyncHandler(applyToJob));
router.delete('/jobs/:id/apply', authenticateToken, asyncHandler(removeAppliedJob));
router.get('/saved-jobs', authenticateToken, asyncHandler(getSavedJobs));
router.get('/applied-jobs', authenticateToken, asyncHandler(getAppliedJobs));

module.exports = router;