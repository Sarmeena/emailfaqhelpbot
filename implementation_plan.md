# Gmail Watch Webhook Access and Live Mode Setup Plan

This plan details the implementation of a Google Cloud Pub/Sub Topic setup and watch registration page directly in the application's settings, enabling the user to configure and trigger real-time Gmail inbox watch webhooks.

## Proposed Changes

### Component 1: config database helper
#### [MODIFY] [gmailConfig.ts](file:///c:/Users/Windows%2011/Documents/email-faq-help-bot/src/services/firestore/gmailConfig.ts)
* Extend the `GmailConfig` interface to store the Pub/Sub topic and the watch expiration timestamp so the user knows if/when their Gmail Watch needs renewal.
* Update `saveGmailConfig` and `disconnectGmail` to support these new fields.

### Component 2: watch registration endpoint
#### [MODIFY] [route.ts](file:///c:/Users/Windows%2011/Documents/email-faq-help-bot/src/app/api/gmail/watch/route.ts)
* Update `performWatchRegistration` to save the active Pub/Sub topic and expiration timestamp returned by Google (`watchData.expiration`) into Firestore.

### Component 3: settings panel UI
#### [MODIFY] [SettingsGmail.tsx](file:///c:/Users/Windows%2011/Documents/email-faq-help-bot/src/components/settings/SettingsGmail.tsx)
* Add a form and action to register a Gmail Watch webhook.
* Show instructions containing the Webhook Endpoint URL that the user needs to configure as their Google Cloud Pub/Sub push subscription target.
* Provide an input field for the Pub/Sub Topic name.
* Display the current Gmail Watch subscription status and expiration date.
* Add the `Radio` icon from `lucide-react` to decorate the section.

---

## Verification Plan

### Manual Verification
1. Open the settings page: `http://localhost:3500/settings` or similar.
2. Connect a live Gmail account if not already done.
3. Locate the new **Gmail Watch Webhook Setup** card.
4. Input a Google Cloud Pub/Sub Topic name (e.g. `projects/YOUR_PROJECT_ID/topics/YOUR_TOPIC_NAME`).
5. Click **Register Watch Webhook** and confirm it returns success.
6. Verify the watch expiration date is populated and displayed in the UI.
