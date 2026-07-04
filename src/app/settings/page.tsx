import Header from "../../components/layout/Header";
import Sidebar from "../../components/layout/Sidebar";
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
      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <Sidebar />

        {/* Right Side */}
        <div className="flex flex-1 flex-col md:ml-64">
          {/* Header */}
          <Header />

          {/* Page */}
          <main className="mx-auto w-full max-w-5xl px-6 pt-24 pb-12">
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
          </main>
        </div>
      </div>

      <SettingsBottomNav />
    </ProtectedRoute>
  );
}