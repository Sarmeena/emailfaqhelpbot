# Task List - Navigation Links, UI Library, and Analytics Dashboard

- [x] Dynamic Sidebar and Mobile Nav Routing
  - [x] Modify `src/components/layout/Sidebar.tsx` to handle dynamic routing, highlight the active menu, and link "New Ticket" to `/requests/create`.
  - [x] Modify `src/components/layout/MobileNav.tsx` to handle dynamic routing and highlight the active menu.
- [x] Build Analytics Backend API Route
  - [x] Create `src/app/api/analytics/route.ts` that compiles dashboard metrics from Firestore.
- [x] Build Analytics Dashboard Page
  - [x] Create `/analytics` page in `src/app/analytics/page.tsx` rendering layouts, charts, and metrics.
- [x] Build UI Library Page
  - [x] Create `/ui-library` page in `src/app/ui-library/page.tsx` showcasing app component patterns.
- [x] Sidebar Link Standardization & Brand Routing
  - [x] Wrapped Sidebar brand header ("HelpBot / AI Assistant") in Link pointing to `/dashboard`.
  - [x] Standardized layouts by replacing `BroadcastSidebar` and `BroadcastHeader` with standard `Sidebar` and `Header` in all campaign/broadcast views.
  - [x] Linked the bottom "Help" menu item in the sidebar to `/help`.
  - [x] Created a dedicated `/help` route showcasing instructions, system guides, and troubleshoot helpers.
  - [x] Render standard `<Sidebar />` on `/faqs`, `/faq/new` (Add FAQ), and `/faq` (Edit FAQ) so that the sidebar is visible and interactive on all KB/FAQ screens.
- [x] Verify navigation and features.
