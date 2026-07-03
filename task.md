# Execution Tasks Tracker

- [x] **1. ID Formats & Backfilling**
  - [x] Update `generateRequestId()` in `requests.ts` to `REQ-YYYYMMDD-XXXXXX`
  - [x] Add `faqid` to `FAQ` interface in `faqs.ts`
  - [x] Implement `generateFaqId()` in `faqs.ts` and update `addFAQ()`
  - [x] Add on-the-fly unique ID backfilling to `getFAQs()` and `getFAQById()` in `faqs.ts`
  - [x] Clean up duplicate logic in `faqSearch.ts` (import from `faqs.ts`)
  
- [x] **2. Display IDs in FAQ UI**
  - [x] Display `faqid` in `FAQTable.tsx` list rows and Details Modal

- [x] **3. Gmail API & Sync Firestore Service**
  - [x] Create `gmailConfig.ts` to load/save Gmail settings and OAuth tokens in Firestore
  - [x] Create `/api/gmail/auth` endpoint for initiating OAuth / sandbox mode
  - [x] Create `/api/gmail/callback` endpoint for Google token exchange
  - [x] Create `/api/gmail/messages` endpoint to fetch real/mock emails
  - [x] Create `/api/gmail/import` endpoint to import emails as requests, parse threading, and check AI FAQ matches + escalation triggers
  - [x] Create `/api/gmail/send` endpoint to reply via Gmail API with headers

- [x] **4. Settings Page Integration**
  - [x] Create `SettingsGmail.tsx` with forms for Client ID/Secret, Redirect URI, and Simulated Sandbox toggle
  - [x] Import and render `SettingsGmail` in `/settings/page.tsx`

- [x] **5. Requests Page & Inbox Sync View**
  - [x] Create `GmailInboxTable.tsx` to list Gmail emails and support "Import to Ticket" action
  - [x] Modify `requests/page.tsx` to add a Tab selector ("Tickets" vs "Gmail Sync Inbox")
  - [x] Modify `ChatComposer.tsx` to toggle sending replies via Gmail API for Gmail-sourced tickets

- [x] **6. Operational Analytics on Dashboard**
  - [x] Add analytics helper to `dashboard.ts` (resolutions, peak activity hours, FAQ usage counters)
  - [x] Update `StatsGrid.tsx` and `dashboard/page.tsx` to display these stats
