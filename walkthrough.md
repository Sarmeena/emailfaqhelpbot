# Walkthrough: Broadcast Editing & Scheduling (with Quota, Mobile and Recipient UI Updates)

We have updated the Broadcast flow to allow full management of draft and scheduled broadcasts, enabling users to edit scheduled details or save updates.

## Changes Made

### 1. Draft & Scheduled Broadcast Editing
- **Footer Updates (`BroadcastFooter.tsx`)**: The footer now adapts to the broadcast status. When the user sets the status to "Scheduled", the secondary button dynamically changes to **"Schedule Broadcast"** instead of "Save Draft".
- **Save Handler (`EditBroadcastClient.tsx`)**: Replaced the separate draft saving mechanism with a unified `handleSave()` function that preserves the status state (Draft/Scheduled). This keeps the campaign scheduled rather than resetting it to Draft when edited.
- **Hide Sent Edits (`BroadcastTable.tsx`)**: Prevented sent campaigns from being modified by hiding the "Edit" button for broadcasts with status `"Sent"`.
- **Scheduled Mobile Edits**: Added an "Edit Schedule" action button in the mobile cards layout inside `BroadcastTable.tsx`, allowing mobile users to manage scheduled campaigns.
- **Fixed Responsive Render Bug (`src/app/broadcasts/page.tsx`)**: Removed the duplicate mock `<BroadcastMobileCards />` from the mobile viewport and rendered `<BroadcastTable />` directly. Since `BroadcastTable.tsx` already contains responsive media queries, it now handles rendering actual database entries on all viewports, fixing a visual bug where mobile screens displayed static mock data.

### 2. Broadcast Recipient & Group Management
- **Empty Initial State (`page.tsx`)**: Replaced the initial state seed `DEFAULT_RECIPIENTS` with an empty array `[]` so that when the Create Broadcast page loads, the recipient setup is completely clean and empty (removing dummy names).
- **Group Select actions (`CreateBroadcastRecipients.tsx`)**: Instead of automatically replacing the active recipient list on dropdown change, the user now selects a group and chooses to either **Replace List** or **Append to List** (skipping duplicates).
- **CSV Upload Dynamic Grouping**: Modified the CSV parser in `CreateBroadcastRecipients.tsx` to automatically register the imported list as a new predefined group under the CSV file's name (e.g., `filename.csv`), adding it to the dropdown options.
- **Custom Group Creation**: Added a form section allowing the user to name and save their currently configured recipient table as a custom predefined group in the dropdown menu.

---

## Verification

### Manual Verification
1. Open the **Broadcasts** page. Verify the list renders actual database entries on both desktop and mobile viewports.
2. Verify that **Sent** broadcasts do not display the **Edit** action.
3. Click **Edit** (or **Edit Schedule** on mobile) on a **Scheduled** or **Draft** broadcast. Ensure details load correctly.
4. Modify settings to "Scheduled", enter date/time, and click **Schedule Broadcast** in the footer. Check that the dashboard list updates the status and retains the configuration.
