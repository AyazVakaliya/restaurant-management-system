const express = require('express');
const router = express.Router();
const { addReservation, getReservations, updateReservationStatus } = require('../controllers/reservationController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/').post(addReservation).get(protect, authorize('admin', 'manager'), getReservations);
router.route('/:id').put(protect, authorize('admin', 'manager'), updateReservationStatus);

module.exports = router;