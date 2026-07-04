# Execution Tasks Tracker - Gmail Watch Setup

- [x] **1. Extend config database helper**
  - [x] Add `pubSubTopic` and `watchExpiration` to `GmailConfig` interface in `gmailConfig.ts`
  - [x] Update `saveGmailConfig` and `disconnectGmail` fields in `gmailConfig.ts`

- [x] **2. Save watch info on registration**
  - [x] Update `performWatchRegistration` in `watch/route.ts` to call `saveGmailConfig` on success

- [x] **3. Implement Settings UI**
  - [x] Add `pubSubTopic` state to `SettingsGmail.tsx`
  - [x] Implement `handleRegisterWatch` in `SettingsGmail.tsx`
  - [x] Render "Gmail Watch Webhook Setup" section in `SettingsGmail.tsx` when connected in live mode
