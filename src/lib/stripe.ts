import { loadStripe } from '@stripe/stripe-js';

const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

if (!stripePublicKey) {
  throw new Error('Missing Stripe public key');
}

export const stripe = loadStripe(stripePublicKey);

export const createCheckoutSession = async (priceId: string) => {
  const response = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ priceId }),
  });
  
  const { sessionId } = await response.json();
  return sessionId;
};

export const handleSubscription = async () => {
  const stripe = await loadStripe(stripePublicKey);
  if (!stripe) throw new Error('Stripe failed to load');

  const { error } = await stripe.redirectToCheckout({
    lineItems: [
      {
        price: import.meta.env.VITE_STRIPE_PRICE_ID,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    successUrl: `${window.location.origin}/settings?success=true`,
    cancelUrl: `${window.location.origin}/settings?canceled=true`,
  });

  if (error) {
    throw new Error(error.message);
  }
};