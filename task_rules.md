# Tasks: Secure Firestore Security Rules & Backend Auth

- `[x]` Create `firestore.rules` file in the workspace root
- `[x]` Implement `ensureServerAuth()` and integrate into `checkAuthAndRole()` in `src/utils/apiAuth.ts`
- `[x]` Integrate `ensureServerAuth()` into `/api/gmail/webhook/route.ts`
- `[x]` Integrate `ensureServerAuth()` into `/api/gmail/callback/route.ts`
- `[x]` Remove hardcoded `agent@gmail.com` logic from `AuthContext.tsx` and `LoginForm.tsx`
- `[x]` Simplify profile creation rule in `firestore.rules` to strictly allow `"viewer"` creation
- `[x]` Verify type checking and compilation
