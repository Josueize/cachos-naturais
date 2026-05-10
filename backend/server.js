// ============================================
// Cachos Naturais — Backend Server
// Stripe Payment Integration (Node.js + Express)
// ============================================

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());
app.use(express.static('../')); // Serve the frontend files

// ============================================
// HEALTH CHECK
// ============================================
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Cachos Naturais server is running!' });
});

// ============================================
// CREATE PAYMENT INTENT
// Called when client wants to pay a deposit
// ============================================
app.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, customerName, service, date } = req.body;

    // Validate amount (minimum R$1, maximum R$1000)
    if (!amount || amount < 1 || amount > 1000) {
      return res.status(400).json({ error: 'Valor inválido.' });
    }

    // Create Payment Intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to centavos
      currency: 'brl',
      metadata: {
        customerName: customerName || 'Cliente',
        service: service || 'Não especificado',
        date: date || 'A definir',
        salon: 'Cachos Naturais — Mônica Santos',
      },
      description: `Depósito agendamento — ${service || 'Serviço'} — ${customerName || 'Cliente'}`,
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });

  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// STRIPE WEBHOOK
// Listens for payment confirmation from Stripe
// ============================================
app.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle payment events
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('✅ Payment received:', {
        id: paymentIntent.id,
        amount: `R$${(paymentIntent.amount / 100).toFixed(2)}`,
        customer: paymentIntent.metadata.customerName,
        service: paymentIntent.metadata.service,
      });
      // TODO: Send confirmation email or WhatsApp message here
      break;

    case 'payment_intent.payment_failed':
      console.log('❌ Payment failed:', event.data.object.id);
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
});

// ============================================
// GET ALL PAYMENTS (Dashboard use)
// ============================================
app.get('/payments', async (req, res) => {
  try {
    const paymentIntents = await stripe.paymentIntents.list({ limit: 20 });
    const payments = paymentIntents.data.map(p => ({
      id: p.id,
      amount: `R$${(p.amount / 100).toFixed(2)}`,
      status: p.status,
      customer: p.metadata.customerName,
      service: p.metadata.service,
      date: p.metadata.date,
      created: new Date(p.created * 1000).toLocaleDateString('pt-BR'),
    }));
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🌟 Cachos Naturais server running on port ${PORT}`);
  console.log(`👉 http://localhost:${PORT}\n`);
});
