const express = require('express');
const router = express.Router();
const {
    getStatus,
    handleGoogleCallback,
    disconnect,
    getPickerToken,
    fetchDriveFile,
    syncCalendar,
    getCalendarEvents,
    createCalendarEvent,
    updateCalendarEvent,
    deleteSpecificCalendarEvent
} = require('../controllers/integrationController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getStatus);
router.get('/tokens/google', protect, getPickerToken);
router.post('/google/callback', protect, handleGoogleCallback);
router.post('/google/drive/fetch', protect, fetchDriveFile);
router.post('/google/calendar/sync', protect, syncCalendar);
router.get('/google/calendar/events', protect, getCalendarEvents);
router.post('/google/calendar/events', protect, createCalendarEvent);
router.put('/google/calendar/events/:eventId', protect, updateCalendarEvent);
router.delete('/google/calendar/events/:eventId', protect, deleteSpecificCalendarEvent);
router.delete('/:provider', protect, disconnect);

module.exports = router;
