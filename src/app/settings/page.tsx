import SettingsHeader from "../../components/settings/SettingsHeader";
import SettingsSidebar from "../../components/settings/SettingsSidebar";
import SettingsProfile from "../../components/settings/SettingsProfile";
import SettingsFirebaseCard from "../../components/settings/SettingsFirebaseCard";
import SettingsGemini from "../../components/settings/SettingsGemini";
import SettingsSMTP from "../../components/settings/SettingsSMTP";
import SettingsGmail from "../../components/settings/SettingsGmail";
import SettingsNotifications from "../../components/settings/SettingsNotifications";
import SettingsAppearance from "../../components/settings/SettingsAppearance";
import SettingsSecurity from "../../components/settings/SettingsSecurity";
import SettingsLogout from "../../components/settings/SettingsLogout";
import SettingsBottomNav from "../../components/settings/SettingsBottomNav";
import ProtectedRoute from "../../components/auth/ProtectedRoute";

export default function SettingsPage() {
  return (
    <ProtectedRoute>
    <>
      <SettingsHeader />
      <SettingsSidebar />

      <main className="min-h-screen bg-surface pt-24 pb-12 md:ml-72">
        <div className="mx-auto max-w-5xl px-margin-mobile md:px-margin-desktop">
          <div className="space-y-6">
            <SettingsProfile />

            <SettingsFirebaseCard />

            <SettingsGemini />

            <SettingsGmail />

            <SettingsSMTP />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <SettingsNotifications />
              <SettingsAppearance />
            </div>

            <SettingsSecurity />

            <SettingsLogout />
          </div>
        </div>
      </main>

      <SettingsBottomNav />
    </>
    </ProtectedRoute>
  );
}