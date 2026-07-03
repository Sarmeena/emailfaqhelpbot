# Gmail API Integration, ID Formatting, & Helpdesk Operations Plan

This plan details the technical implementation to satisfy all 10 core operational rules alongside the request ID format updates and Gmail API integration.

---

## 10 Core Operational Requirements Integration

### 1. Broadcast Emails & Group Targeting
- **Mechanism**: The **Broadcasts** interface lets admins draft messages for customer groups.
- **Gmail Integration**: When a broadcast campaign status is set to "Sent", the server-side API will send authorized emails to each recipient using the connected Gmail account (`https://gmail.googleapis.com/v1/users/me/messages/send`).
- **History Tracking**: The recipient delivery status (Delivered vs. Failed) is updated in the broadcast's `deliveryHistory` list.

### 2. Inbound Reply Association & Threading
- **Mechanism**: When sync fetches incoming Gmail messages:
  - It parses the `In-Reply-To` and `References` headers.
  - It checks if the subject line matches `Re: REQ-YYYYMMDD-XXXXXX` or matches a Broadcast Campaign ID.
  - If a match is found, the inbound reply is appended to the corresponding request/conversation history, and delivery stats (such as Broadcast replyRate) are updated.

### 3. Unique Request and FAQ IDs
- **Request ID**: Generated on creation using the format `REQ-YYYYMMDD-XXXXXX` (e.g. `REQ-20260703-A9K4Q2`).
- **FAQ ID**: Generated on creation using the format `FAQ-XXXXXX` (e.g. `FAQ-7Q8B2X`). Existing legacy FAQs will automatically backfill a stable unique FAQ ID when retrieved.

### 4. Intent Understanding & FAQ Retrieval Lock
- **Mechanism**: `searchFAQs(message)` parses and extracts matching approved articles.
- **Strict Guidelines**: The Gemini AI assistant prompt is locked to **ONLY** use the retrieved FAQ answers. If no FAQs match, the AI will not generate an ad-hoc answer. It will trigger the Human Escalation flow.

### 5. In-Thread Replies
- **Mechanism**: When replying to a customer message in a Gmail-linked thread, the Gmail API route adds correct threading headers (`References` and `In-Reply-To` referencing the customer's previous email `Message-ID`), ensuring the response lands in the same email thread in the customer's client.

### 6. Continuous Ticket Conversations
- **Mechanism**: The conversation history keeps appending new inbound and outbound messages. The status transitions between "Open", "In Progress", and remains active until a human agent marks it as "Resolved".

### 7. Automated Human Escalation
- **Mechanism**: Incoming requests are checked for escalation triggers:
  - **No FAQ Match**: Falls back to human routing.
  - **High-Risk/Sensitive Keywords**: Scanned for terms like "fraud", "security breach", "payment failed", "legal", or negative sentiment.
  - **Escalation Action**: The request's priority is set to "High", status to "Open", and is flagged as `escalated: true` so it is prominently displayed in the admin dashboard.

### 8. Complete Request-Level History
- **Mechanism**: The Helpdesk Chat interface renders the entire chronological exchange between the customer and the bot (or human agent) for that specific Request ID.

### 9. Knowledge Base Management
- **Mechanism**: Admins can add, delete, update, and categorize FAQs. 
- **AI Document Parsing**: Admins can import PDF/DOCX files; text is parsed and Q&As are generated and stored with their unique `faqid`.

### 10. Operational Analytics & Peak Activity
- **Mechanism**: Extend the dashboard statistics to collect operational metrics from Firestore:
  - Total tickets resolved vs. active.
  - **Peak Activity Hour**: An analytical query grouping ticket creation timestamps by hour of the day.
  - Average ticket resolution duration and FAQ article usage rates.

---

## Proposed Changes

### 1. Core Services & Utilities

#### [MODIFY] [requests.ts](file:///c:/Users/Windows%2011/Documents/email-faq-help-bot/src/services/firestore/requests.ts)
- Update `generateRequestId()` to produce the `REQ-YYYYMMDD-XXXXXX` format.
- Add an `escalated` flag and `gmailMessageId` / `gmailThreadId` fields to `Request`.

#### [MODIFY] [faqs.ts](file:///c:/Users/Windows%2011/Documents/email-faq-help-bot/src/services/firestore/faqs.ts)
- Add `faqid` parameter to `FAQ` interface.
- Implement `generateFaqId(): string` (returns `FAQ-XXXXXX`).
- Add on-the-fly backfilling logic in `getFAQs()` and `getFAQById()` to auto-write unique IDs for legacy entries.

#### [MODIFY] [faqSearch.ts](file:///c:/Users/Windows%2011/Documents/email-faq-help-bot/src/services/firestore/faqSearch.ts)
- Import interfaces and functions from `faqs.ts` directly to prevent duplication.

---

### 2. UI Display for IDs

#### [MODIFY] [FAQTable.tsx](file:///c:/Users/Windows%2011/Documents/email-faq-help-bot/src/components/faq-management/FAQTable.tsx)
- Render the unique `faqid` in the table list and modal viewer.

---

### 3. Gmail API Endpoints

#### [NEW] [gmailConfig.ts](file:///c:/Users/Windows%2011/Documents/email-faq-help-bot/src/services/firestore/gmailConfig.ts)
- Config helper to store client secret, client ID, status, and tokens in `settings/gmail`.

#### [NEW] [route.ts](/src/app/api/gmail/auth/route.ts)
- Initiates Google OAuth consent flow or triggers sandbox mode.

#### [NEW] [route.ts](/src/app/api/gmail/callback/route.ts)
- Processes code exchange redirects, stores authorization tokens, and returns to `/settings`.

#### [NEW] [route.ts](/src/app/api/gmail/messages/route.ts)
- Fetches real user inbox emails or simulates standard customer inquiries (e.g. refund requests, passwords).

#### [NEW] [route.ts](/src/app/api/gmail/import/route.ts)
- Imports a message as a Request, checks for escalation, formats the `requestId`, and auto-drafts replies.

#### [NEW] [route.ts](/src/app/api/gmail/send/route.ts)
- Sends replies using Google's send endpoint with threading headers.

---

### 4. Pages and Interface Integrations

#### [NEW] [SettingsGmail.tsx](file:///c:/Users/Windows%2011/Documents/email-faq-help-bot/src/components/settings/SettingsGmail.tsx)
- Connection manager UI containing client forms, scopes info, and Sandbox simulation toggle.

#### [MODIFY] [page.tsx](file:///c:/Users/Windows%2011/Documents/email-faq-help-bot/src/app/settings/page.tsx)
- Render `SettingsGmail` inside settings page.

#### [NEW] [GmailInboxTable.tsx](file:///c:/Users/Windows%2011/Documents/email-faq-help-bot/src/components/requests/GmailInboxTable.tsx)
- Gmail inbox list containing email preview and "Import to Ticket" operations.

#### [MODIFY] [page.tsx](file:///c:/Users/Windows%2011/Documents/email-faq-help-bot/src/app/requests/page.tsx)
- Render a Tab bar containing "All Tickets" vs "Gmail Sync Inbox".

#### [MODIFY] [ChatComposer.tsx](file:///c:/Users/Windows%2011/Documents/email-faq-help-bot/src/components/notifications/conversation/ChatComposer.tsx)
- Embed a toggle to "Send email reply via Gmail" if the ticket originated from a Gmail source.

#### [MODIFY] [StatsGrid.tsx](file:///c:/Users/Windows%2011/Documents/email-faq-help-bot/src/components/dashboard/StatsGrid.tsx) & [page.tsx](file:///c:/Users/Windows%2011/Documents/email-faq-help-bot/src/app/dashboard/page.tsx)
- Display advanced analytics: Resolved vs Open tickets, Peak Activity Hour, and FAQ article hit counters.

---

## Verification Plan

### Automated Verification
- Verify formatting of `REQ-YYYYMMDD-XXXXXX` and `FAQ-XXXXXX` matches exactly.
- Verify fallback when no FAQ matches, confirming the request status is correctly set to "Open" (escalated).

### Manual Verification
- **Test Gmail Sandbox**: Connect via Settings sandbox and list mockup emails.
- **Import & Escalate**: Import a refund email (which should fail FAQ lookup). Verify it escalates to "Open" and shows a warning status.
- **In-Thread Chat**: Open the chat log, send a reply, and check the mock send request logs correct threading headers.
- **Admins & KB**: Add FAQs and verify unique IDs populate. Verify peak activity hours list correct times on the dashboard.

