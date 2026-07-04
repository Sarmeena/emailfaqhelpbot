# Implementation Plan - Conversations Sidebar Link and Backend Route

We will add a "Conversations" link to the Sidebar, connect it to the existing `/conversation` screen, and build a Next.js API endpoint to handle fetching lists and submitting messages.

## Proposed Changes

### Component 1: Sidebar Link Addition

#### [MODIFY] [Sidebar.tsx](file:///c:/Users/Windows%2011/Documents/email-faq-help-bot/src/components/layout/Sidebar.tsx)
* Add `MessageSquare` from `lucide-react` to imports.
* Add a `Conversations` item to the `menu` array pointing to `/conversation`.

---

### Component 2: Conversations Backend Route

#### [NEW] [route.ts](file:///c:/Users/Windows%2011/Documents/email-faq-help-bot/src/app/api/conversations/route.ts)
* Build Next.js App Router API route mapping `GET` and `POST` methods.
* `GET` returns a list of conversations (from Firestore `conversations` collection) if no query params are present.
* `POST` receives `{ conversationId, sender, message }` in request body and saves it to Firestore messages collection using existing database helpers.

---

### Component 3: Conversation Components Integration

#### [MODIFY] [ChatComposer.tsx](file:///c:/Users/Windows%2011/Documents/email-faq-help-bot/src/components/notifications/conversation/ChatComposer.tsx)
* Replace direct client-side Firestore `sendMessage` SDK call with a POST fetch request to `/api/conversations`.

#### [MODIFY] [ConversationHistory.tsx](file:///c:/Users/Windows%2011/Documents/email-faq-help-bot/src/components/notifications/conversation/ConversationHistory.tsx)
* Replace direct client-side Firestore `getConversations` query with a GET fetch request to `/api/conversations`.

---

## Verification Plan

### Manual Verification
1. Open dashboard page. Check if the **Conversations** link is present in the sidebar.
2. Click **Conversations** and verify that it loads the inbox screen `/conversation` and changes active navigation highlight styles.
3. Verify that the list of chats loads correctly (making a GET request to `/api/conversations`).
4. Type a response message in the Chat Composer, select send, and verify that the message is submitted successfully through the backend API POST route.
