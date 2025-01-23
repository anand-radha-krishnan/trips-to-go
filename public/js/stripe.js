/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';
const stripe = Stripe(
  'pk_test_51QkSLnFgzxsLv4oZlGlwb7nxcaxWd3KD58dQm9WV7yJa6BNWrFlgTB2UjHKapsVZpbc0KjLikb9P00hstuxxk2oS00t59swM2u',
);

export const bookTrip = async (tripId) => {
  try {
    // get session from endpoint
    const session = await axios(`/api/v1/booking/checkout-session/${tripId}`);

    // create checkout form + charge creadit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (error) {
    log(error);
    showAlert('Payment failed!', error);
  }
};
