const asyncHandler = require('express-async-handler');
const Reservation = require('../models/Reservation');

// @desc    Create new reservation
// @route   POST /api/reservations
const addReservation = asyncHandler(async (req, res) => {
  const { name, email, phone, date, time, partySize, specialRequests } = req.body;
  const reservation = new Reservation({
    user: req.user ? req.user._id : null,
    name,
    email,
    phone,
    date,
    time,
    partySize,
    specialRequests,
  });
  const createdReservation = await reservation.save();
  res.status(201).json(createdReservation);
});

// @desc    Get all reservations
// @route   GET /api/reservations
const getReservations = asyncHandler(async (req, res) => {
  const reservations = await Reservation.find({});
  res.json(reservations);
});

// @desc    Update reservation status
// @route   PUT /api/reservations/:id
const updateReservationStatus = asyncHandler(async (req, res) => {
  const reservation = await Reservation.findById(req.params.id);
  if (reservation) {
    reservation.status = req.body.status || reservation.status;
    reservation.tableNumber = req.body.tableNumber || reservation.tableNumber;
    const updatedReservation = await reservation.save();
    res.json(updatedReservation);
  } else {
    res.status(404);
    throw new Error('Reservation not found');
  }
});

module.exports = { addReservation, getReservations, updateReservationStatus };