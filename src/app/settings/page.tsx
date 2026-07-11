import Header from "../../components/layout/Header";
import Sidebar from "../../components/layout/Sidebar";
import SettingsProfile from "../../components/settings/SettingsProfile";
import SettingsGemini from "../../components/settings/SettingsGemini";
import SettingsGmail from "../../components/settings/SettingsGmail";
import SettingsSecurity from "../../components/settings/SettingsSecurity";
import SettingsBottomNav from "../../components/settings/SettingsBottomNav";
import ProtectedRoute from "../../components/auth/ProtectedRoute";

export default function SettingsPage() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
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

              <SettingsGemini />

              <SettingsGmail />

              <SettingsSecurity />
            </div>
          </main>
        </div>
      </div>

      <SettingsBottomNav />
    </ProtectedRoute>
  );
}