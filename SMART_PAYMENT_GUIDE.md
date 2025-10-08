# Smart Payment Method Detection

## 🎯 **Overview**

This system automatically detects the user's country based on their IP address and shows only the appropriate payment method:

- **Ethiopia (ET)** → **Chapa Payment** (Mobile Money) - ETB
- **All Other Countries** → **Stripe Payment** (Credit Card) - USD

## 🚀 **Features**

- ✅ **Automatic IP Detection**: Gets user's IP from request headers
- ✅ **Country Geolocation**: Uses ipapi.co for accurate country detection
- ✅ **Smart Payment Selection**: Shows only relevant payment method
- ✅ **Fallback Handling**: Defaults to Chapa if detection fails
- ✅ **Development Support**: Test IP for local development
- ✅ **Real-time Detection**: Works on every page load

## 📁 **Files Created**

### 1. **API Endpoint** (`/api/get-country`)

- Detects user's IP address
- Gets country information
- Returns payment method and currency

### 2. **Custom Hook** (`hooks/usePaymentMethod.ts`)

- React hook for payment method detection
- Handles loading states and errors
- Provides payment method data

### 3. **Smart Component** (`components/SmartPaymentMethod.tsx`)

- Shows only the appropriate payment method
- Handles payment initiation
- Beautiful UI with location info

### 4. **Test Pages**

- `/test-payment` - Test the detection system
- `/smart-payment/[courseId]` - Example payment page

## 🔧 **Usage**

### **Basic Usage:**

```tsx
import SmartPaymentMethod from "@/components/SmartPaymentMethod";

function PaymentPage() {
  const handlePayment = (paymentData) => {
    if (paymentData.paymentType === "chapa") {
      // Handle Chapa payment
      console.log("Chapa payment:", paymentData);
    } else {
      // Handle Stripe payment
      console.log("Stripe payment:", paymentData);
    }
  };

  return (
    <SmartPaymentMethod
      courseId="course-123"
      amount={500}
      onPaymentInitiated={handlePayment}
    />
  );
}
```

### **Using the Hook:**

```tsx
import { usePaymentMethod } from "@/hooks/usePaymentMethod";

function MyComponent() {
  const { paymentMethod, currency, country, isEthiopia, loading, error } =
    usePaymentMethod();

  if (loading) return <div>Detecting location...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <p>Country: {country}</p>
      <p>Payment: {paymentMethod}</p>
      <p>Currency: {currency}</p>
    </div>
  );
}
```

## 🌍 **Country Detection Logic**

```typescript
// Detection Flow:
1. Get IP from headers (x-forwarded-for, x-real-ip, cf-connecting-ip)
2. Use ipapi.co to get country information
3. Check if country is Ethiopia (ET)
4. Return appropriate payment method

// Ethiopia (ET) → Chapa (ETB)
// All Others → Stripe (USD)
```

## 🧪 **Testing**

### **Test the Detection:**

```bash
# Visit the test page
GET /en/test-payment

# Test the API directly
GET /api/get-country
```

### **Development Testing:**

- Uses test Ethiopian IP for localhost
- Change IP in `/api/get-country/route.ts` line 20
- Test different countries by changing the IP

## 🔄 **Integration with Existing Payment System**

### **For Chapa Payments:**

```typescript
// In your payment handler
if (paymentMethod === "chapa") {
  // Use existing Chapa payment flow
  const chapaData = {
    courseId,
    amount,
    currency: "ETB",
    phoneNumber: userPhone,
    tx_ref: generateTxRef(),
  };

  // Call your existing Chapa payment function
  await initiateChapaPayment(chapaData);
}
```

### **For Stripe Payments:**

```typescript
// In your payment handler
if (paymentMethod === "stripe") {
  // Use existing Stripe payment flow
  const stripeData = {
    courseId,
    amount,
    currency: "USD",
    customerEmail: userEmail,
  };

  // Call your existing Stripe payment function
  await initiateStripePayment(stripeData);
}
```

## 🎨 **Customization**

### **Change Default Country:**

```typescript
// In /api/get-country/route.ts
const isEthiopia =
  countryCode === "ET" || country.toLowerCase().includes("ethiopia");
// Change "ET" to your preferred country code
```

### **Add More Countries:**

```typescript
// In /api/get-country/route.ts
const isEthiopia =
  countryCode === "ET" || countryCode === "KE" || countryCode === "TZ";
// Add more African countries for Chapa
```

### **Custom Payment Methods:**

```typescript
// In /api/get-country/route.ts
const paymentMethod = isEthiopia ? "chapa" : "stripe";
// Change to your preferred payment methods
```

## 🚀 **Production Deployment**

### **Environment Variables:**

```bash
# Optional: Add to .env
NEXT_PUBLIC_IP_API_KEY=your_ipapi_key
# For higher rate limits
```

### **Rate Limiting:**

- ipapi.co free tier: 1,000 requests/day
- For production, consider upgrading or using alternative services

### **Fallback Strategy:**

- If geolocation fails, defaults to Chapa (Ethiopia)
- Graceful error handling
- User can still proceed with payment

## 📊 **API Response Format**

```json
{
  "success": true,
  "ip": "41.207.251.142",
  "country": "Ethiopia",
  "countryCode": "ET",
  "isEthiopia": true,
  "paymentMethod": "chapa",
  "currency": "ETB",
  "city": "Addis Ababa",
  "region": "Addis Ababa",
  "timezone": "Africa/Addis_Ababa"
}
```

## 🎯 **Benefits**

1. **Better UX**: Users only see relevant payment methods
2. **Higher Conversion**: No confusion about payment options
3. **Automatic**: No manual country selection needed
4. **Accurate**: Uses real IP geolocation
5. **Fallback**: Works even if detection fails
6. **Scalable**: Easy to add more countries/methods

## 🔧 **Troubleshooting**

### **Common Issues:**

1. **"Unable to detect location"**

   - Check internet connection
   - Verify ipapi.co is accessible
   - Check browser console for errors

2. **Wrong country detected**

   - User might be using VPN
   - IP might be from different location
   - Test with different IP addresses

3. **Payment method not showing**
   - Check if country detection is working
   - Verify payment method logic
   - Check browser console for errors

### **Debug Commands:**

```bash
# Test API directly
curl http://localhost:3000/api/get-country

# Check browser console
# Look for "Country detected:" logs
```

The system is now ready to automatically show the appropriate payment method based on the user's location! 🎉
