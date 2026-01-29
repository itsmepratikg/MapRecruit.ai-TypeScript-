const express = require('express');
const router = express.Router();
const {
    getInterviews,
    getInterview,
    createInterview,
    updateInterview,
    deleteInterview
} = require('../controllers/interviewController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
    .get(getInterviews)
    .post(createInterview);

router.route('/:id')
    .get(getInterview)
    .put(updateInterview)
    .delete(deleteInterview);

module.exports = router;
