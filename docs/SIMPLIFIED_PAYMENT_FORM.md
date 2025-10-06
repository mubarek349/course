# Simplified Payment Form - Phone Number Only

## ✅ **Payment Form Simplified Successfully!**

Updated the payment popup to only show payment method selection and phone number input, removing the gender and full name fields for a cleaner user experience.

## 🔧 **What I Changed:**

### 1. **Simplified Form Schema**

```typescript
// components/Payment.tsx
// Before: Complex form with multiple fields
const formSchema = z.object({
  id: z.string({ message: "" }).nonempty("ID is required"),
  fullName: z.string({ message: "" }).nonempty("Name is required"),
  gender: z.enum(["Female", "Male"], { message: "Gender is required" }),
  phoneNumber: z.string({ message: "" }).nonempty("Phone number is required"),
  affiliateCode: z.string().optional(),
});

// After: Simple form with only phone number
const formSchema = z.object({
  id: z.string({ message: "" }).nonempty("ID is required"),
  phoneNumber: z
    .string({ message: "" })
    .length(10, "Must be 10 digits")
    .regex(/^\d+$/, "Must contain only digits")
    .startsWith("0", "Must start with 0"),
  affiliateCode: z.string().optional(),
});
```

### 2. **Simplified Form Fields**

```typescript
// Before: Multiple input fields
<ModalBody>
  <Input {...register("fullName")} placeholder="Full Name" />
  <Select {...register("gender")} placeholder="Gender">
    <SelectItem key={"Female"}>Female</SelectItem>
    <SelectItem key={"Male"}>Male</SelectItem>
  </Select>
  <Input {...register("phoneNumber")} placeholder="Phone Number" />
</ModalBody>

// After: Only phone number field
<ModalBody>
  <Input
    {...register("phoneNumber")}
    color="primary"
    placeholder={lang == "en" ? "Phone Number" : "የስልክ ቁጥር"}
  />
</ModalBody>
```

### 3. **Updated Payment Actions**

```typescript
// lib/action/chapa.ts & lib/action/stripe.ts
// Before: Expected fullName and gender
const { id, fullName, gender, phoneNumber, affiliateCode } = data,
  [firstName = "", fatherName = "", lastName = ""] = fullName
    .split(" ")
    .filter((v) => !!v);

// After: Only phone number required
const { id, phoneNumber, affiliateCode } = data;
```

### 4. **Updated Type Definitions**

```typescript
// Before: Complex data structure
data: {
  id: string;
  fullName: string;
  gender: "Female" | "Male";
  phoneNumber: string;
  affiliateCode?: string;
}

// After: Simple data structure
data: {
  id: string;
  phoneNumber: string;
  affiliateCode?: string;
}
```

## 🧪 **How to Test the Changes:**

### 1. **Test Simplified Payment Flow**

1. Go to any course page
2. Click "Buy Course"
3. Select payment method (Chapa or Stripe)
4. Enter only phone number
5. Submit payment
6. Should proceed with payment using existing user data

### 2. **Test with Unregistered Phone Number**

1. Use a phone number that doesn't exist in database
2. Should see error: "Please register with this phone number before ordering the course"

### 3. **Test with Registered Phone Number**

1. Use a phone number that exists in database
2. Should proceed with payment normally

## 📋 **Files Modified:**

| File                     | Change                                                    |
| ------------------------ | --------------------------------------------------------- |
| `components/Payment.tsx` | Simplified form schema and removed fullName/gender fields |
| `lib/action/chapa.ts`    | Updated to handle simplified data structure               |
| `lib/action/stripe.ts`   | Updated to handle simplified data structure               |

## 🎯 **Result:**

- ✅ **Simplified User Experience** - Only phone number required
- ✅ **Faster Payment Process** - Fewer fields to fill
- ✅ **Cleaner Interface** - Single input field
- ✅ **Maintained Security** - User validation still works

## 🚀 **Benefits:**

1. **Better UX** - Faster and simpler payment process
2. **Reduced Friction** - Fewer fields to complete
3. **Cleaner Design** - Single input field looks better
4. **Maintained Security** - User validation still prevents unauthorized orders

## 📱 **New Payment Flow:**

1. **Click "Buy Course"** → Shows payment method selector
2. **Select Payment Method** → Shows phone number input
3. **Enter Phone Number** → Validates user exists
4. **Submit Payment** → Proceeds with payment

The payment form is now much simpler and faster to use! 🎉
