# Form Validation Rules

## Registration Form Validations

The signup form now includes **real-time validation on keyup/blur** that matches the backend requirements exactly.

### Field Validations

#### 1. Name
- **Min Length**: 2 characters
- **Max Length**: 50 characters
- **Pattern**: Only letters and spaces allowed (`/^[a-zA-Z\s]+$/`)
- **Error Messages**:
  - "Name must be between 2 and 50 characters"
  - "Name can only contain letters and spaces"

#### 2. Email
- **Format**: Valid email format (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`)
- **Max Length**: 100 characters
- **Normalization**: Auto-normalized (lowercase)
- **Error Messages**:
  - "Please provide a valid email address"
  - "Email must not exceed 100 characters"

#### 3. Phone
- **Min Digits**: 10 digits
- **Max Digits**: 15 digits
- **Pattern**: Valid mobile phone format (`/^[\+]?[0-9\s\-\(\)]+$/`)
- **Examples**: 
  - `+91 98765 43210`
  - `9876543210`
  - `+1 (555) 123-4567`
- **Error Messages**:
  - "Phone number must be between 10 and 15 digits"
  - "Please provide a valid phone number"

#### 4. Password
- **Min Length**: 8 characters
- **Max Length**: 128 characters
- **Required Characters**:
  - ✓ At least one lowercase letter (`a-z`)
  - ✓ At least one uppercase letter (`A-Z`)
  - ✓ At least one number (`0-9`)
  - ✓ At least one special character (`@$!%*?&`)
- **Pattern**: `/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/`
- **Error Messages**:
  - "Password must be between 8 and 128 characters"
  - "Password must contain at least one lowercase letter"
  - "Password must contain at least one uppercase letter"
  - "Password must contain at least one number"
  - "Password must contain at least one special character (@$!%*?&)"
- **Success Message**: "✓ Password meets requirements" (green)

#### 5. Confirm Password
- **Rule**: Must match the password field exactly
- **Error Message**: "Passwords do not match"
- **Success Message**: "✓ Passwords match" (green)

#### 6. Terms Agreement
- **Required**: Must be checked before submission
- **Error Message**: "Please agree to the terms and conditions"

---

## Validation Behavior

### Real-Time Validation (On Keyup)
- Validation runs on every keystroke after field is touched
- Errors appear immediately as user types
- Green checkmarks appear when validation passes

### On Blur Validation
- Field is marked as "touched" when user leaves the field
- Validation errors show only after field is touched
- Prevents showing errors before user starts typing

### On Submit Validation
- All fields marked as touched
- Cannot submit if any validation errors exist
- Backend performs server-side validation as second layer

---

## Visual Feedback

### Error States
```tsx
// Red border on input
className="border-red-500"

// Error message below input
<p className="text-sm text-red-500">{validationErrors.fieldName}</p>
```

### Success States
```tsx
// Green success message for password fields
<p className="text-sm text-green-600">✓ Password meets requirements</p>
<p className="text-sm text-green-600">✓ Passwords match</p>
```

### Loading States
- Submit button disabled during API call
- Loading spinner shown
- Prevents duplicate submissions

---

## Backend Validation (Secondary Layer)

The backend uses `express-validator` middleware that performs the same validations:

**Endpoint**: `POST /api/auth/register`

**Middleware**: `validateRegistration` from `backend/middleware/validation.js`

**Response on Validation Error**:
```json
{
  "success": false,
  "message": "Validation failed",
  "code": "VALIDATION_ERROR",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address",
      "value": "invalid-email"
    }
  ]
}
```

---

## Password Requirements Summary

For a **valid password**, users must include:

1. ✅ Minimum 8 characters
2. ✅ At least one uppercase letter (A-Z)
3. ✅ At least one lowercase letter (a-z)
4. ✅ At least one number (0-9)
5. ✅ At least one special character (@, $, !, %, *, ?, &)

**Example Valid Passwords**:
- `MyPass123!`
- `Secure@2024`
- `T3st$Pass`

**Example Invalid Passwords**:
- `password` (no uppercase, no number, no special char)
- `PASSWORD123` (no lowercase, no special char)
- `Pass123` (less than 8 chars, no special char)
- `MyPassword!` (no number)

---

## Testing Validation

### Manual Testing Steps

1. **Test Empty Fields**:
   - Leave all fields empty → Submit
   - Should show "All fields are required"

2. **Test Name**:
   - Enter `A` → Should show "Name must be between 2 and 50 characters"
   - Enter `John123` → Should show "Name can only contain letters and spaces"
   - Enter `John Doe` → Should pass ✓

3. **Test Email**:
   - Enter `notanemail` → Should show "Please provide a valid email address"
   - Enter `user@example.com` → Should pass ✓

4. **Test Phone**:
   - Enter `123` → Should show "Phone number must be between 10 and 15 digits"
   - Enter `+91 98765 43210` → Should pass ✓

5. **Test Password**:
   - Enter `weak` → Should show length error
   - Enter `weakpassword` → Should show missing uppercase/number/special char
   - Enter `WeakPass` → Should show missing number/special char
   - Enter `WeakPass123` → Should show missing special char
   - Enter `WeakPass123!` → Should pass ✓

6. **Test Confirm Password**:
   - Enter different password → Should show "Passwords do not match"
   - Enter matching password → Should show "✓ Passwords match"

7. **Test Terms Checkbox**:
   - Try to submit without checking → Should show error
   - Check the box → Should allow submission

---

## Implementation Files

- **Frontend Validation**: `app/signup/page.tsx` (lines 1-150)
- **Backend Validation**: `backend/middleware/validation.js` (validateRegistration)
- **API Integration**: `lib/api.ts` (authApi.register)
- **Auth Context**: `contexts/auth-context.tsx` (register function)

All validation rules are synchronized between frontend and backend to ensure data integrity.
