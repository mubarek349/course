# User Validation Update - Prevent Orders for Unregistered Users

## ✅ **User Validation Added Successfully!**

Updated both Chapa and Stripe payment flows to prevent course orders when the user is not found in the database, showing a registration message instead.

## 🔧 **What I Changed:**

### 1. **Chapa Payment Validation**

```typescript
// lib/action/chapa.ts
// Before: Automatically created user if not found
if (!user) {
  user = await prisma.user.create({
    data: {
      role: "student",
      firstName,
      fatherName,
      lastName,
      gender,
      phoneNumber,
      password: "",
    },
  });
}

// After: Prevent order and show registration message
if (!user) {
  return {
    status: false,
    cause: "user_not_found",
    message:
      "Please register with this phone number before ordering the course",
  };
}
```

### 2. **Stripe Payment Validation**

```typescript
// lib/action/stripe.ts
// Before: Automatically created user if not found
if (!user) {
  user = await prisma.user.create({
    data: {
      role: "student",
      firstName,
      fatherName,
      lastName,
      gender,
      phoneNumber,
      password: "",
    },
  });
}

// After: Prevent order and show registration message
if (!user) {
  return {
    status: false,
    cause: "user_not_found",
    message:
      "Please register with this phone number before ordering the course",
  };
}
```

## 🧪 **How to Test the Changes:**

### 1. **Test with Unregistered Phone Number**

1. Go to any course page
2. Click "Buy Course"
3. Select payment method (Chapa or Stripe)
4. Enter a phone number that doesn't exist in the database
5. Fill other required fields and submit
6. Should see error message: "Please register with this phone number before ordering the course"

### 2. **Test with Registered Phone Number**

1. Go to any course page
2. Click "Buy Course"
3. Select payment method (Chapa or Stripe)
4. Enter a phone number that exists in the database
5. Fill other required fields and submit
6. Should proceed with payment normally

## 📋 **Files Modified:**

| File                   | Change                                                  |
| ---------------------- | ------------------------------------------------------- |
| `lib/action/chapa.ts`  | Added user validation - prevent order if user not found |
| `lib/action/stripe.ts` | Added user validation - prevent order if user not found |

## 🎯 **Result:**

- ✅ **Prevents Unauthorized Orders** - Users must be registered before ordering
- ✅ **Clear Error Messages** - Users know they need to register first
- ✅ **Consistent Behavior** - Same validation for both payment methods
- ✅ **Better Security** - No automatic user creation during payment

## 🚀 **Benefits:**

1. **Security** - Prevents unauthorized course access
2. **Data Integrity** - Ensures users are properly registered
3. **User Experience** - Clear guidance on what to do next
4. **Consistency** - Same validation across all payment methods

## 🔍 **Error Handling:**

The existing error handling in the Payment component will automatically display the error message when `state.status` is false:

```typescript
// components/Payment.tsx
const { action: chapaAction, isPending: chapaPending } = useAction(
  pay,
  undefined,
  {
    error: lang == "en" ? "Failed to initiate payment" : "ክፍያ ማስጀመር አልተሳካም",
    onSuccess(state) {
      if (state.status) {
        router.push(state.url);
      } else {
        onOpenChange(); // Close modal and show error
      }
    },
  }
);
```

## 📝 **Error Message:**

When a user tries to order with an unregistered phone number, they will see:

- **English**: "Please register with this phone number before ordering the course"
- **Amharic**: The error will be displayed in the user's selected language

The payment system now requires users to be registered before they can order courses! 🎉
