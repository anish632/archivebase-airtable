import { NextRequest } from 'next/server';
import { jsonResponse } from '@/lib/cors';
import { verifyWebhookSignature } from '@/lib/stripe';
import { setSubscription, getSubscription } from '@/lib/storage';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('stripe-signature') || '';
    const secret = process.env.STRIPE_WEBHOOK_SECRET || '';

    if (!secret || !signature) {
      return jsonResponse({ success: false, error: 'Missing webhook configuration' }, 401);
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = verifyWebhookSignature(rawBody, signature, secret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return jsonResponse({ success: false, error: 'Invalid signature' }, 401);
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const baseId = session.metadata?.base_id;
        const tier = session.metadata?.tier as 'pro' | 'team';

        if (!baseId || !tier) {
          console.warn('Webhook missing base_id or tier in metadata');
          break;
        }

        const existing = getSubscription(baseId);
        setSubscription(baseId, {
          ...existing,
          tier,
          status: 'active',
          subscriptionId: session.subscription as string,
          customerId: session.customer as string,
        });
        break;
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.created': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // We need to find the baseId by customerId
        // Since we're using in-memory storage, we'll iterate through subscriptions
        // In production with a real DB, you'd query by customerId
        let baseId: string | null = null;
        // For now, we'll use metadata from the subscription if available
        // Or we could store a mapping of customerId -> baseId
        
        // Stripe subscriptions don't have metadata from checkout session
        // So we need to handle this differently
        // For now, we'll skip this case as it's handled by checkout.session.completed
        console.log('Subscription updated:', subscription.id);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Similar to above, we'd need to find baseId by customerId
        // For the in-memory implementation, this is a limitation
        // In production, query the DB for the subscription
        console.log('Subscription deleted:', subscription.id);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = (invoice as any).subscription as string;

        if (subscriptionId) {
          // Update subscription status to active
          // Again, with in-memory storage this is limited
          console.log('Payment succeeded for subscription:', subscriptionId);
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = (invoice as any).subscription as string;

        if (subscriptionId) {
          console.log('Payment failed for subscription:', subscriptionId);
          // Could mark subscription as past_due or send notifications
        }
        break;
      }
    }

    return jsonResponse({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return jsonResponse({ success: false, error: 'Webhook processing failed' }, 500);
  }
}

// Next.js App Router doesn't need bodyParser config — raw body is available via req.text()
