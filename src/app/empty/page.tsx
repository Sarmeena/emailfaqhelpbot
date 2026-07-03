import EmptyHeader from "../../components/empty/EmptyHeader";
import EmptySidebar from "../../components/empty/EmptySidebar";
import EmptyBottomNav from "../../components/empty/EmptyBottomNav";

import EmptyPageHeader from "../../components/empty/EmptyPageHeader";
import EmptyRequests from "../../components/empty/EmptyRequests";
import EmptyFAQ from "../../components/empty/EmptyFAQ";
import EmptyBroadcast from "../../components/empty/EmptyBroadcast";
import EmptyConversation from "../../components/empty/EmptyConversation";
import EmptySearch from "../../components/empty/EmptySearch";

export default function EmptyStatesPage() {
  return (
    <>
      <EmptyHeader />
      <EmptySidebar />

      <main className="min-h-screen bg-surface pt-24 pb-32 md:ml-72">
        <div className="mx-auto max-w-5xl px-margin-mobile md:px-margin-desktop">
          <EmptyPageHeader />

          <div className="space-y-gutter">
            <EmptyRequests />
            <EmptyFAQ />
            <EmptyBroadcast />
            <EmptyConversation />
            <EmptySearch />
          </div>
        </div>
      </main>

      <EmptyBottomNav />
    </>
  );
}