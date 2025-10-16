# Payment System Authentication Fix

## Overview

This document describes the changes made to ensure that only logged-in users can create orders and that phone numbers are automatically retrieved from the user's session instead of asking users to enter them manually.

## Changes Made

### 1. Server Action for User Phone Number (`lib/action/index.ts`)

**Added:** `getCurrentUserPhoneNumber()` function

- Retrieves the current logged-in user's phone number from the session
- Returns user phone number and ID if authenticated
- Returns error if user is not logged in

```typescript
export async function getCurrentUserPhoneNumber() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { status: false, message: "Not authenticated" };
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { phoneNumber: true, id: true },
    });

    if (!user) {
      return { status: false, message: "User not found" };
    }

    return { status: true, phoneNumber: user.phoneNumber, userId: user.id };
  } catch (error) {
    console.error("Error getting current user phone number:", error);
    return { status: false, message: "Failed to get user phone number" };
  }
}
```

### 2. Payment Component (`components/Payment.tsx`)

**Changes:**

- Added state management for user phone number
- Fetches user phone number automatically when modal opens
- Displays authentication error if user is not logged in
- Phone number field is now read-only and pre-filled
- Only allows payment if user is authenticated

**Key Features:**

- Automatically fetches phone number from session on modal open
- Shows error modal if user is not logged in with option to go to login page
- Phone number is displayed in a read-only, disabled input field
- Validates authentication before allowing payment method selection

### 3. Stripe Checkout Component (`components/StripeCheckout.tsx`)

**Changes:**

- Added `userPhoneNumber` prop to receive phone number from parent
- Automatically uses logged-in user's phone number
- Removes phone number input field (now auto-filled)
- Phone number is displayed in a read-only format
- Automatically creates payment intent when modal opens with logged-in user

**Key Features:**

- Receives phone number as prop from Payment component
- Displays phone number in read-only format
- Auto-creates payment intent on modal open
- Simplified user flow - no manual phone entry required

### 4. Chapa Payment Action (`lib/action/chapa.ts`)

**Changes:**

- Added authentication check at the beginning of the `pay()` function
- Validates that user is logged in before processing payment
- Ensures phone number matches logged-in user's phone number
- Returns error if user is not authenticated

**Security:**

- Checks session authentication
- Validates user ID matches the phone number provided
- Prevents unauthorized order creation

### 5. Stripe Payment Action (`lib/action/stripe.ts`)

**Changes:**

- Added authentication check at the beginning of the `payWithStripe()` function
- Validates that user is logged in before processing payment
- Ensures phone number matches logged-in user's phone number
- Returns error if user is not authenticated

**Security:**

- Checks session authentication
- Validates user ID matches the phone number provided
- Prevents unauthorized order creation

## User Flow

### Before (Old Flow)

1. User clicks "Buy Course"
2. User selects payment method (Chapa or Stripe)
3. **User manually enters phone number** ❌
4. User enters affiliate code (optional)
5. User proceeds to payment

### After (New Flow)

1. User clicks "Buy Course"
2. System checks if user is logged in
   - If not logged in: Shows error modal with "Go to Login" button
   - If logged in: Continues to step 3
3. User selects payment method (Chapa or Stripe)
4. **Phone number is automatically filled from session** ✅
5. User enters affiliate code (optional)
6. User proceeds to payment

## Security Improvements

1. **Authentication Required**: Only logged-in users can create orders
2. **Phone Number Validation**: Phone number must match logged-in user's phone number
3. **Session-Based**: Uses secure session authentication instead of manual phone entry
4. **Prevents Unauthorized Orders**: Cannot create orders with someone else's phone number

## Benefits

1. ✅ **Better User Experience**: No need to manually enter phone number
2. ✅ **Increased Security**: Only authenticated users can create orders
3. ✅ **Prevents Errors**: No typos in phone numbers
4. ✅ **Faster Checkout**: One less field to fill
5. ✅ **Data Integrity**: Phone number always matches logged-in user

## Testing Checklist

- [ ] Test with logged-in user - should auto-fill phone number
- [ ] Test with non-logged-in user - should show login prompt
- [ ] Test Chapa payment flow with logged-in user
- [ ] Test Stripe payment flow with logged-in user
- [ ] Verify phone number cannot be changed in UI
- [ ] Verify orders are created with correct user ID
- [ ] Test affiliate code functionality still works

## Files Modified

1. `lib/action/index.ts` - Added getCurrentUserPhoneNumber function
2. `components/Payment.tsx` - Added authentication and auto-fill phone
3. `components/StripeCheckout.tsx` - Updated to use prop-based phone number
4. `lib/action/chapa.ts` - Added authentication validation
5. `lib/action/stripe.ts` - Added authentication validation

## Migration Notes

- No database changes required
- No breaking changes to existing functionality
- All existing orders remain valid
- New orders require authentication

## Support

If you encounter any issues:

1. Check that the user is logged in before attempting payment
2. Verify the session is active and valid
3. Ensure the user's phone number is properly stored in the database
4. Check browser console for any authentication errors
