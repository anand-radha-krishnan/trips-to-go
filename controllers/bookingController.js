const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const Trip = require('../models/tripModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // get booked tour
  const trip = await Trip.findById(req.params.tripId);

  // create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    success_url: `${req.protocol}://${req.get('host')}/?trip=${req.params.tripId}&user=${req.user.id}&price=${trip.price}`,
    cancel_url: `${req.protocol}://${req.get('host')}/${trip.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tripId,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          unit_amount: trip.price * 100,
          product_data: {
            name: `${trip.name} Trip`,
            description: trip.summary,
            images: [`https://natours.dev/img/tours/${trip.imageCover}`],
          },
        },
        quantity: 1,
      },
    ],
  });

  // send to client
  res.status(200).json({
    status: 'success',
    session,
  });
});

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  const { trip, user, price } = req.query;

  if (!trip || !user || !price) return next();

  await Booking.create({ trip, user, price });

  res.redirect(req.originalUrl.split('?')[0]);
});

exports.createBooking = factory.createOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.getBooking = factory.getOne(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
