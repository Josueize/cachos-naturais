# 💛 Cachos Naturais — Website Project

Luxury hair salon website for **Mônica Santos** — Cachos Naturais.

---

## 📁 Project Structure

```
cachos-naturais/
├── index.html              ← Main website (open this in a browser)
├── assets/
│   ├── images/             ← Add salon photos here
│   │   └── gallery/        ← Instagram-style gallery photos
│   ├── css/
│   │   └── style.css       ← Separate CSS (optional)
│   └── js/
│       └── main.js         ← Separate JS (optional)
├── backend/
│   ├── server.js           ← Node.js + Stripe server
│   ├── package.json        ← Dependencies
│   └── .env.example        ← Environment variables template
└── README.md               ← This file
```

---

## 🚀 How to Run the Website (No backend needed)

Just open `index.html` in any browser — it works out of the box!

For hosting, upload the file to any of these (free options):
- **Netlify** → https://netlify.com (drag & drop, free)
- **Vercel** → https://vercel.com (free)
- **GitHub Pages** → https://pages.github.com (free)

---

## 💳 How to Activate Stripe Payments

### Step 1 — Create a Stripe Account
Go to https://stripe.com/br and create a free account.

### Step 2 — Get Your API Keys
In the Stripe Dashboard → Developers → API Keys:
- Copy your **Publishable Key** (`pk_live_...`)
- Copy your **Secret Key** (`sk_live_...`)

### Step 3 — Set Up the Backend

```bash
# Go to the backend folder
cd backend

# Install dependencies
npm install

# Create your .env file
cp .env.example .env

# Edit .env and paste your Stripe keys
nano .env  # or open with any text editor
```

### Step 4 — Start the Server

```bash
# Production
npm start

# Development (auto-restart on changes)
npm run dev
```

Server runs at: `http://localhost:3000`

### Step 5 — Connect Frontend to Backend

In `index.html`, find the Stripe mock form section and replace it with:

```html
<!-- Load Stripe.js -->
<script src="https://js.stripe.com/v3/"></script>

<script>
const stripe = Stripe('YOUR_STRIPE_PUBLISHABLE_KEY');

async function processPayment(amount) {
  // Create Payment Intent on your backend
  const response = await fetch('http://localhost:3000/create-payment-intent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount,
      customerName: document.getElementById('f-name').value,
      service: document.getElementById('f-service').value,
      date: document.getElementById('f-date').value,
    }),
  });

  const { clientSecret } = await response.json();

  // Confirm payment with Stripe Elements
  const result = await stripe.confirmCardPayment(clientSecret, {
    payment_method: {
      card: cardElement, // Stripe Elements card input
    },
  });

  if (result.error) {
    alert('Erro no pagamento: ' + result.error.message);
  } else {
    submitBooking(); // Show success message
  }
}
</script>
```

### Step 6 — Set Up Webhook (for payment confirmation)

In Stripe Dashboard → Webhooks → Add endpoint:
- URL: `https://yourdomain.com/webhook`
- Events: `payment_intent.succeeded`, `payment_intent.payment_failed`
- Copy the **Webhook Secret** → paste in `.env`

---

## 📱 Contact & Social

- **WhatsApp:** +55 11 96074-7406
- **Instagram:** [@monicasantoscachos](https://www.instagram.com/monicasantoscachos)

---

## 🛠 Tech Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Fonts:** Cormorant Garamond + Montserrat (Google Fonts)
- **Backend:** Node.js + Express
- **Payments:** Stripe API
- **Hosting:** Any static host (Netlify recommended)

---

*Built with ✦ for Cachos Naturais © 2026*

---

## 👨‍💻 Developer

**Izehiuwa Igiebor Omogiate (Joshua)**
Full Stack Developer

- 🐙 GitHub: [github.com/Josueize](https://github.com/Josueize)
- 💼 LinkedIn: [izehiuwa-igiebor](https://www.linkedin.com/in/izehiuwa-igiebor-b9753919b/)
- 📧 Email: [izategbese1@gmail.com](mailto:izategbese1@gmail.com)