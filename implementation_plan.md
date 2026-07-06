# Edit Draft & Scheduled Broadcasts Later

This plan details the changes to the broadcasts dashboard and edit flow to enable editing of both draft and scheduled broadcasts, allowing updates to be saved back to Firestore with their scheduled state.

## Proposed Changes

### Component: Broadcast Footer

#### [MODIFY] [BroadcastFooter.tsx](file:///c:/Users/Windows%2011/Documents/email-faq-help-bot/src/components/broadcast/BroadcastFooter.tsx)
- Add a `status` prop to `BroadcastFooterProps`.
- Dynamically render the secondary action button text. If `status === "Scheduled"`, change the text from `"Save Draft"` to `"Schedule Broadcast"`, while retaining `"Save Draft"` for other statuses.

---

### Page: Edit Broadcast Client

#### [MODIFY] [EditBroadcastClient.tsx](file:///c:/Users/Windows%2011/Documents/email-faq-help-bot/src/app/broadcasts/edit/EditBroadcastClient.tsx)
- Implement a unified `handleSave()` function (passed as `onSaveDraft` to the footer) that saves the broadcast.
- The `handleSave()` function will check the selected `status` from settings:
  - If `status === "Scheduled"`, it saves the document with `"Scheduled"`, `scheduleDate`, and `scheduleTime` fields preserved.
  - Otherwise, it defaults to saving as `"Draft"`.
- Pass the current `status` state to the `<BroadcastFooter />` component so it can adapt dynamically.

---

### Component: Broadcast Table

#### [MODIFY] [BroadcastTable.tsx](file:///c:/Users/Windows%2011/Documents/email-faq-help-bot/src/components/broadcast/BroadcastTable.tsx)
- Hide the "Edit" button for broadcasts that have already been sent (`status === "Sent"`).
- In the mobile card layout section of the table component, render an **"Edit Schedule"** action button for broadcasts with `"Scheduled"` status, enabling scheduled campaigns to be managed on mobile screens.

---

### Page: Broadcasts Listing

#### [MODIFY] [page.tsx](file:///c:/Users/Windows%2011/Documents/email-faq-help-bot/src/app/broadcasts/page.tsx)
- Fix the desktop/mobile view rendering bug: remove the duplicate/mock `<BroadcastMobileCards />` element, and render `<BroadcastTable />` without wrappers. This ensures that the real Firestore-backed list is responsive and renders on all devices.

---

## Verification Plan

### Manual Verification
- Navigate to the **Broadcasts** page.
- Ensure the table loads real data from Firestore on both mobile and desktop resolutions.
- Click **Edit** on a **Draft** broadcast. Change settings to "Scheduled" and select a date/time. Click **Schedule Broadcast** in the footer and confirm it updates to "Scheduled" in the dashboard list.
- Click **Edit** (or **Edit Schedule** on mobile) on a **Scheduled** broadcast. Verify the date/time inputs are populated with the saved values. Make changes and save to confirm updates.
- Verify that a broadcast with status **Sent** does not display an "Edit" button.
