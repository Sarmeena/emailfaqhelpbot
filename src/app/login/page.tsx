import BrandingPanel from "../../components/auth/BrandingPanel";
import LoginForm from "../../components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#F7F9FC] flex">
      {/* Desktop Branding */}
      <div className="hidden lg:flex w-1/2">
        <BrandingPanel />
      </div>

      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-6 lg:p-8">
        <LoginForm />
      </div>
    </main>
  );
}