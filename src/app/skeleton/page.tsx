import SkeletonHeader from "../../components/skeleton/SkeletonHeader";
import SkeletonSidebar from "../../components/skeleton/SkeletonSidebar";
import SkeletonPageHeader from "../../components/skeleton/SkeletonPageHeader";
import SkeletonDashboard from "../../components/skeleton/SkeletonDashboard";
import SkeletonInbox from "../../components/skeleton/SkeletonInbox";
import SkeletonFAQ from "../../components/skeleton/SkeletonFAQ";
import SkeletonConversation from "../../components/skeleton/SkeletonConversation";
import SkeletonBroadcast from "../../components/skeleton/SkeletonBroadcast";
import SkeletonBottomNav from "../../components/skeleton/SkeletonBottomNav";
import SkeletonFAB from "../../components/skeleton/SkeletonFAB";

export default function SkeletonPage() {
  return (
    <>
      <SkeletonHeader />
      <SkeletonSidebar />

      <main className="min-h-screen bg-surface pt-24 pb-32 md:ml-72">
        <div className="mx-auto max-w-7xl px-margin-mobile md:px-margin-desktop">

          <SkeletonPageHeader />

          <div className="space-y-10">
            <SkeletonDashboard />

            <SkeletonInbox />

            <SkeletonFAQ />

            <SkeletonConversation />

            <SkeletonBroadcast />
          </div>

        </div>
      </main>

      <SkeletonFAB />

      <SkeletonBottomNav />
    </>
  );
}