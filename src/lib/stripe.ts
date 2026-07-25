import Stripe from 'stripe';
import config from '../config';

const stripe = new Stripe(config.stripe.secretKey, {
  apiVersion: '2025-02-24.acacia' as any, // Cast to any to avoid typings version clash
});

export default stripe;
