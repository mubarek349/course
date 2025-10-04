# Payment System Documentation

## Overview

The payment system now supports two payment methods:

1. **Chapa** - Mobile and bank transfer payments
2. **Stripe** - Card and digital wallet payments

## How It Works

### Payment Flow

1. User clicks "Buy Course" button
2. **Payment Method Selection Popup** appears with two options:
   - Chapa (Mobile & Bank Transfer)
   - Stripe (Card & Digital Wallet)
3. User selects their preferred payment method
4. Payment form appears with user details (name, gender, phone)
5. User submits form and is redirected to the selected payment gateway

### Components

#### PaymentMethodSelector.tsx

- Shows payment method selection popup
- Displays course title and price
- Two payment options with clear descriptions
- Bilingual support (English/Amharic)

#### Payment.tsx (Updated)

- Now shows payment method selector first
- Then shows payment form based on selected method
- Handles both Chapa and Stripe payment flows
- Maintains existing user experience

#### Stripe Integration

- `lib/action/stripe.ts` - Stripe payment action
- `app/api/create-stripe-session/route.ts` - Creates Stripe checkout session
- `app/api/verify-stripe-payment/route.ts` - Verifies Stripe payments

## Environment Variables Required

Add these to your `.env` file:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# Existing Chapa Configuration
CHAPA_API=https://api.chapa.co/v1
CHAPA_TOKEN=your_chapa_token
```

## Installation

1. Install Stripe dependency:

```bash
npm install stripe
```

2. The payment system is ready to use!

## Usage

The payment system works automatically when users try to purchase a course. The flow is:

1. User clicks "Buy Course"
2. Payment method selection popup appears
3. User chooses Chapa or Stripe
4. Payment form appears
5. User fills details and submits
6. Redirected to chosen payment gateway

## Features

- ✅ Bilingual support (English/Amharic)
- ✅ Clean, modern UI
- ✅ Mobile responsive
- ✅ Error handling
- ✅ Loading states
- ✅ Form validation
- ✅ Back navigation between steps

## Testing

To test the payment system:

1. Make sure environment variables are set
2. Start the development server: `npm run dev`
3. Navigate to a course page
4. Click "Buy Course"
5. Select a payment method
6. Fill the form and submit
7. You'll be redirected to the payment gateway

## Notes

- The Stripe integration is set up for test mode by default
- Make sure to configure webhooks for production Stripe integration
- Both payment methods use the same order system in the database
- SMS notifications work for both payment methods
