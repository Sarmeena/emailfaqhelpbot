# Implementation Plan: Secure Firestore Security Rules and Server-Side Authentication

This plan secures the Firestore database from public/unauthenticated access by creating production-ready security rules aligned with the application's Role-Based Access Control (RBAC) tiers (`admin`, `agent`, `viewer`). It also introduces a self-healing server-side authentication layer to ensure serverless Next.js API routes and webhooks can safely read/write documents without violating rules.

## Proposed Changes

### Database Security Rules

#### [NEW] [firestore.rules](file:///c:/Users/Windows%2011/Documents/email-faq-help-bot/firestore.rules)
Create a new `firestore.rules` file in the workspace root containing:
- `users`: User profiles. Accessible by owner and `admin`. Creating allowed for logged-in users with role restricted strictly to `"viewer"`. Role changes restricted to `admin`.
- `faqs`: FAQ knowledge base. Publicly readable (for FAQ Portal) but write access is restricted to `admin` and `agent`.
- `requests`: Customer tickets. Read access for all authenticated roles (`admin`, `agent`, `viewer`), write access only for `admin` and `agent`.
- `conversations` & `messages`: Chat transcripts. Read access for all authenticated roles (`admin`, `agent`, `viewer`), write access only for `admin` and `agent`.
- `broadcasts`: Campaign stats. Read access for authenticated roles, write access restricted to `admin` and `agent`.
- `settings`: Configuration documents (`settings/gemini` containing Gemini API key, `settings/gmail` containing Gmail client secrets). Strictly restricted to `admin` for both read and write.

---

### Backend Authentication Layer

Since the backend Next.js API routes and webhooks call the client-side Firebase JS SDK without active auth sessions, securing the Firestore rules would normally break these backend processes. To prevent this, we introduce a server-side authentication check that logs the server instance in as a system admin on startup.

#### [MODIFY] [apiAuth.ts](file:///c:/Users/Windows%2011/Documents/email-faq-help-bot/src/utils/apiAuth.ts)
- Add `ensureServerAuth()` function.
- If called on the server, it checks if `auth.currentUser` is set.
- If not set, it logs in as `system-backend@emailfaqhelpbot.com`. If the user does not exist, it automatically creates it, seeds its profile document in `users` with the role `"admin"`, and logs in.
- Inject `await ensureServerAuth()` at the top of `checkAuthAndRole()`.

#### [MODIFY] [route.ts](file:///c:/Users/Windows%2011/Documents/email-faq-help-bot/src/app/api/gmail/webhook/route.ts)
- Call `await ensureServerAuth()` at the start of the webhook `POST` handler to ensure Firestore calls succeed.

#### [MODIFY] [route.ts](file:///c:/Users/Windows%2011/Documents/email-faq-help-bot/src/app/api/gmail/callback/route.ts)
- Call `await ensureServerAuth()` at the start of the Gmail OAuth callback `GET` handler to ensure settings updates succeed.

---

## Verification Plan

### Automated Checks
- Check the syntax of `firestore.rules` using the standard rules parser rules/definitions.
- Since standard terminal execution has restrictions, we will perform structural and logical TypeScript verification on the codebase.

### Manual Verification
- Deploy rules to the project's Firebase Console.
- Verify dashboard loading, ticket views, FAQ management, and settings save.
- Trigger incoming emails / webhooks to confirm system-admin role authentication works.
