# Task List - Conversations Sidebar Link and Backend Route

- [x] Add Conversations link in `src/components/layout/Sidebar.tsx`
  - [x] Add `MessageSquare` icon import.
  - [x] Add dynamic link in `menu` array pointing to `/conversation`.
- [x] Create Conversations API endpoint in `src/app/api/conversations/route.ts`
  - [x] Map `GET` method to return conversation list.
  - [x] Map `POST` method to store agent message and return response.
- [x] Connect components to new backend route
  - [x] Refactor `ChatComposer.tsx` to send messages via POST to `/api/conversations`.
  - [x] Refactor `ConversationHistory.tsx` to fetch initial lists from GET `/api/conversations`.
- [x] Verify conversations integration works correctly.
