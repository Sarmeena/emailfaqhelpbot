# Verification Walkthrough

The formatting updates and Gmail API helpdesk integration have been successfully implemented across the codebase.

---

## What Was Added/Modified

### 1. ID Format Generators
- **Request IDs**: Updated in [requests.ts](file:///c:/Users/Windows%2011/Documents/email-faq-help-bot/src/services/firestore/requests.ts) to output `REQ-YYYYMMDD-XXXXXX` using local calendar dates and 6 random alphanumeric characters.
- **FAQ IDs**: Implemented `generateFaqId()` returning `FAQ-XXXXXX` in [faqs.ts](file:///c:/Users/Windows%2011/Documents/email-faq-help-bot/src/services/firestore/faqs.ts).
- **ID Backfilling**: Queries in `getFAQs()` and `getFAQById()` automatically detect legacy entries missing a `faqid`, generate one on the fly, and execute a background Firestore write to backfill and persist it.

### 2. UI ID Integration
- FAQ Management tables and detail modals in [FAQTable.tsx](file:///c:/Users/Windows%2011/Documents/email-faq-help-bot/src/components/faq-management/FAQTable.tsx) now render the unique `faqid`.

### 3. Gmail API & Sync Firestore Endpoints
- **Credentials Config**: Created [gmailConfig.ts](file:///c:/Users/Windows%2011/Documents/email-faq-help-bot/src/services/firestore/gmailConfig.ts) to manage keys, tokens, and active state indicators in `settings/gmail`.
- **OAuth Callback**:
  - `/api/gmail/auth` initiates Google client authentication or simulated session.
  - `/api/gmail/callback` exchanges standard auth codes for Google API access and refresh tokens.
- **Inbox Fetching**: `/api/gmail/messages` syncs messages from user's live Gmail account or returns mockup inbox items if in Sandbox simulated mode.
- **Ticket Importing & AI reply**: `/api/gmail/import` imports emails as requests, triggers intent-matching FAQ scans, and flags escalation items (e.g. sensitive terms or zero matches) to High Priority.
- **Threaded Send**: `/api/gmail/send` sends outgoing replies back to the customer, injecting MIME thread headers (`References`, `In-Reply-To`) to maintain a single email thread.

### 4. Helpdesk Page Enhancements
- **Settings Manager**: Added [SettingsGmail.tsx](file:///c:/Users/Windows%2011/Documents/email-faq-help-bot/src/components/settings/SettingsGmail.tsx) to `/settings` displaying Google OAuth parameters and a **One-Click Sandbox Simulation** button.
- **Inbox Panel**: Created [GmailInboxTable.tsx](file:///c:/Users/Windows%2011/Documents/email-faq-help-bot/src/components/requests/GmailInboxTable.tsx) allowing admins to pull, inspect, and import customer emails as tickets.
- **Inbox Tabs**: Added view toggles to [requests/page.tsx](file:///c:/Users/Windows%2011/Documents/email-faq-help-bot/src/app/requests/page.tsx) to switch between DB tickets and Gmail inbox.
- **Threaded Composers**: Updated [ChatComposer.tsx](file:///c:/Users/Windows%2011/Documents/email-faq-help-bot/src/components/notifications/conversation/ChatComposer.tsx) to show a toggle allowing agents to post responses back to Gmail directly.

### 5. Advanced Operational Dashboard Analytics
- Implemented peak hour activity calculation and dynamic FAQ hit metrics in [dashboard.ts](file:///c:/Users/Windows%2011/Documents/email-faq-help-bot/src/services/firestore/dashboard.ts).
- Upgraded [StatsGrid.tsx](file:///c:/Users/Windows%2011/Documents/email-faq-help-bot/src/components/dashboard/StatsGrid.tsx) and [TrendingFaqs.tsx](file:///c:/Users/Windows%2011/Documents/email-faq-help-bot/src/components/dashboard/TrendingFaqs.tsx) to render active open counters, peak hours, and dynamic FAQ usages.

---

## Verification Steps

### Step 1: Manage FAQ IDs
1. Go to **Knowledge Base** (`/faqs`).
2. Verify existing legacy FAQs show unique ID badges, e.g. `FAQ-W8L2K9`.
3. Add a new FAQ article and save. Confirm it generates and saves a new unique ID.

### Step 2: Establish Simulated Sandbox Inbox
1. Navigate to **Settings** (`/settings`).
2. Under **Gmail API Integration**, click **One-Click Sandbox Demo (No Keys)**.
3. Verify connection status changes to **Sandbox Simulated** under `support-sandbox@company.com`.

### Step 3: Import & Escalate Gmail Inbound Messages
1. Go to **Tickets** (`/requests`) and click **Gmail Sync Inbox**.
2. Sync the sandbox inbox and view the mock customer emails.
3. Click **Import to Tickets** next to the billing inquiry email.
4. Confirm a success dialog appears showing:
   - Generated Request ID (e.g. `REQ-20260703-A8K9Q1`)
   - Thread ID (derived from the email)
   - **Escalated Alert**: Confirms this issue was flagged for human escalation because of sensitive keywords ("charge", "billing") and lack of matching FAQ.
5. Click **Import to Tickets** next to the API secret key inquiry. Confirm it auto-drafts the response using approved FAQ context (since it matches the API secret FAQ) and flags it as auto-responded (no escalation needed).

### Step 4: Outgoing Threaded Replies
1. Open **Live Support Chat** / **Inbox** (`/conversation`).
2. Select the newly imported billing ticket conversation.
3. Draft a response and verify the checkbox **Send email response back to customer via Gmail thread** is checked.
4. Click **Send** and inspect your Next.js terminal logs to confirm the simulated email sender was executed, registering the correct threading headers.

### Step 5: Operational Analytics
1. Open the **Dashboard** (`/dashboard`).
2. Confirm the stats grid displays:
   - **Action Required**: Count of Open + In Progress tickets.
   - **Peak Hour**: Peak traffic hour calculated from the ticket timestamps.
   - **Trending FAQs (Hit Rate)**: Top FAQs ranked by usage hit metrics.

---

## Real-Time Gmail Auto-Sync & Response Setup

To have the bot receive emails and auto-reply **instantly** (without clicking "Import" manually), follow these integration steps:

### 1. Expose Your App Publicly
Google Cloud requires webhook endpoints to be publicly reachable via HTTPS.
- In production, deploy your app to **Vercel** or **Render**.
- In local development, run **ngrok** to create a secure tunnel:
  ```bash
  ngrok http 3000
  ```
  Copy the forwarding URL (e.g. `https://xxxx-xxxx.ngrok-free.app`).

### 2. Set Up Google Cloud Pub/Sub
1. Open your [Google Cloud Console](https://console.cloud.google.com/).
2. Select your Firebase project.
3. Enable the **Cloud Pub/Sub API** and **Gmail API**.
4. Go to **Pub/Sub > Topics** and click **Create Topic**. Name it `gmail-notifications`.
5. Under your topic's permissions, add the member `gmail-api-push@system.gserviceaccount.com` and grant it the role **Pub/Sub Publisher**.
6. Create a new **Subscription** on the `gmail-notifications` topic:
   - Delivery Type: **Push**
   - Endpoint URL: `https://your-public-url.com/api/gmail/webhook` (replace with your Vercel or Ngrok domain).

### 3. Register Gmail watch Subscriptions
When Gmail is connected in Settings, register the webhook subscription by sending a POST request to `/api/gmail/watch`:
- **Method**: `POST`
- **URL**: `http://localhost:3000/api/gmail/watch`
- **Headers**: `Content-Type: application/json`
- **Body**:
  ```json
  {
    "topicName": "projects/YOUR_GOOGLE_PROJECT_ID/topics/gmail-notifications"
  }
  ```
Gmail will now push webhook alerts to your `/api/gmail/webhook` route instantly whenever a new customer email lands in your inbox, which auto-replies and populates Firestore in real time.

