# Implementation Plan - Navigation Links, UI Library, and Analytics Dashboard

We will wire up the Sidebar navigation items to their corresponding routes. In addition, we will create the missing `UI Library` and `Analytics` sections, complete with a backend API route and interactive dashboard visuals.

## Proposed Changes

### Component 1: Sidebar & Mobile Navigation Dynamic Routing

#### [MODIFY] [Sidebar.tsx](file:///c:/Users/Windows%2011/Documents/email-faq-help-bot/src/components/layout/Sidebar.tsx)
* Replace hardcoded menu links with proper Next.js `/dashboard`, `/requests`, `/ui-library`, `/faqs`, `/broadcasts`, `/analytics` paths.
* Make the "New Ticket" button route to `/requests/create`.
* Integrate `usePathname` from `next/navigation` to dynamically check the active path and apply highlight styles.

#### [MODIFY] [MobileNav.tsx](file:///c:/Users/Windows%2011/Documents/email-faq-help-bot/src/components/layout/MobileNav.tsx)
* Turn the static buttons into Next.js `<Link>` components pointing to `/dashboard`, `/requests`, `/faqs`, `/analytics`.
* Dynamically highlight the active icon based on `usePathname`.

---

### Component 2: Analytics Backend API Route

#### [NEW] [route.ts](file:///c:/Users/Windows%2011/Documents/email-faq-help-bot/src/app/api/analytics/route.ts)
* Build a Next.js API route that compiles database metrics from Firestore.
* Return ticket status totals (Open, In Progress, Resolved), priority breakdown (High, Medium, Low), source breakdown (Gmail vs Manual), top FAQs list, and live Gmail watch webhook status.

---

### Component 3: Analytics Dashboard Webpage

#### [NEW] [page.tsx](file:///c:/Users/Windows%2011/Documents/email-faq-help-bot/src/app/analytics/page.tsx)
* Create the `/analytics` page rendering the Sidebar, Header, and a grid of charts and metrics.
* Display ticket status distributions using beautiful pure CSS bar charts and circular meters.
* Display priority ratios, support channel breakdowns, and top-performing FAQ statistics.

---

### Component 4: UI Library Showroom

#### [NEW] [page.tsx](file:///c:/Users/Windows%2011/Documents/email-faq-help-bot/src/app/ui-library/page.tsx)
* Create the `/ui-library` page showcasing application UI blocks (Buttons, Inputs, Badges, Modals, Cards, Loading States).
* Include a clean interactive preview and copyable code snippet options.

---

## Verification Plan

### Manual Verification
1. Navigate to `/dashboard` and check if clicking sidebar/mobile nav items correctly updates URL and navigates pages.
2. Verify active page highlight styles in Sidebar.
3. Open the **Analytics** page `/analytics`. Verify it fetches statistics from `/api/analytics` and displays actual dashboard cards and breakdowns.
4. Open the **UI Library** page `/ui-library`. Interact with component states (buttons, badges, inputs, dialogs).
