import ErrorHeader from "../../components/errors/ErrorHeader";
import ErrorSidebar from "../../components/errors/ErrorSidebar";
import Error404 from "../../components/errors/Error404";
import Error500 from "../../components/errors/Error500";
import ErrorNetwork from "../../components/errors/ErrorNetwork";
import ErrorUnauthorized from "../../components/errors/ErrorUnauthorized";
import ErrorSessionExpired from "../../components/errors/ErrorSessionExpired";
import ErrorBottomNav from "../../components/errors/ErrorBottomNav";
export default function ErrorLibraryPage() {
  return (
    <>
      <ErrorHeader />
      <ErrorSidebar />

      <main className="min-h-screen bg-background pt-24 pb-24 md:ml-72">
        <div className="mx-auto max-w-5xl px-margin-mobile md:px-margin-desktop space-y-6">
          <Error404 />
          <Error500 />
          <ErrorNetwork />
          <ErrorUnauthorized />
          <ErrorSessionExpired />
        </div>
      </main>

      <ErrorBottomNav />
    </>
  );
}