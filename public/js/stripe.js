import { showAlert } from './alert.js';

const stripe = Stripe(
  'pk_test_51PDd2OSF4S8UAi1myY580uKjhHPV0OA9O224LFSkXS6LhwgbEjWtzPTbIFGcpzhalzYm03JPc5hkKlO6EvrZnMwD00sE5OsSUS',
);

export const bookTour = async (tourID) => {
  try {
    // 1) Get checkout session from API
    const session = await axios({
      method: 'GET',
      url: `/api/v1/bookings/checkout-session/${tourID}`,
    });
    //  2) Create checkout form + process+ charge credit card for us
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.error(err);
    showAlert('error', err);
  }
};
