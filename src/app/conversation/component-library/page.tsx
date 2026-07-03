import Sidebar from "../../../components/layout/Sidebar";
import TopNavbar from "../../../components/layout/TopNavBar";
import BottomNavbar from "../../../components/layout/BottomNavBar";
import FloatingActionButton from "../../../components/layout/FloatingActionButton";

import StatCard from "../../../components/cards/StatCard";
import TicketCard from "../../../components/cards/TicketCard";
import FAQCard from "../../../components/cards/FAQCard";
import BroadcastCard from "../../../components/cards/BroadcastCard";
import EmptyStateCard from "../../../components/cards/EmptyStateCard";
import SkeletonCard from "../../../components/cards/SkeletonCard";

import SectionHeader from "../../../components/common/SectionHeader";

export default function ComponentLibraryPage() {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        <TopNavbar />

        <main className="flex-1 overflow-y-auto p-8">
          <div className="mx-auto max-w-7xl space-y-12">
            <SectionHeader
              title="Component Gallery"
              description="The visual language of HelpBot AI."
            />

            <section className="space-y-6">
              <SectionHeader title="Content Blocks" />

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <StatCard
                  title="Open Tickets"
                  value="128"
                  change="+12.5%"
                  progress={75}
                  icon="ticket"
                />

                <TicketCard
                  avatar="https://i.pravatar.cc/150?img=8"
                  name="Alex Rivera"
                  ticketId="#TK-88219"
                  description="My account has been locked for 3 hours and I need immediate access to the API dashboard."
                  priority="high"
                  time="14 mins ago"
                />

                <FAQCard
                  title="How do I reset my API secret?"
                  description="Navigate to Settings → API Access → Credentials and click Rotate Key."
                  tags={["Security", "API"]}
                />

                <BroadcastCard
                  title="System Maintenance"
                  description="Scheduled updates on the EU Central node starting at 02:00 AM UTC."
                  date="Oct 24, 2023"
                />
              </div>
            </section>

            <section className="space-y-6">
              <SectionHeader title="System States" />

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <EmptyStateCard
                  title="No Pending Requests"
                  description="You're all caught up!"
                />

                <SkeletonCard />
              </div>
            </section>
          </div>
        </main>

        <BottomNavbar />
      </div>

      <FloatingActionButton />
    </div>
  );
}