"use client";

import { useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import Header from "../../components/layout/Header";
import ConversationHeader from "../../components/notifications/conversation/ConversationHeader";
import ConversationHistory from "../../components/notifications/conversation/ConversationHistory";
import ChatWindow from "../../components/notifications/conversation/ChatWindow";
import ChatComposer from "../../components/notifications/conversation/ChatComposer";
import MobileConversationNav from "../../components/notifications/conversation/MobileConversationNav";
import ConversationAIPanel from "../../components/notifications/conversation/ConversationAIPanel";
import ProtectedRoute from "../../components/auth/ProtectedRoute";

export default function ConversationPage() {
  const [selectedConversation, setSelectedConversation] =
  useState<string>("");
  const [latestCustomerMessage, setLatestCustomerMessage] =
  useState("");
  const [refresh, setRefresh] = useState(0);
  const [composerMessage, setComposerMessage] = useState("");

  return (
    <ProtectedRoute>
    <>
      <Sidebar />
      <Header />

      <main className="min-h-screen bg-gray-100 md:ml-64">
        <ConversationHeader 
          conversationId={selectedConversation} 
          onStatusUpdated={() => setRefresh((prev) => prev + 1)}
        />

        <div className="flex h-[calc(100vh-130px)] overflow-hidden">
          <ConversationHistory
            key={refresh}
            selectedConversation={selectedConversation}
            onSelectConversation={(id) => {
              setSelectedConversation(id);
              setComposerMessage("");
            }}
          />
          <section className="flex flex-1 flex-col bg-white min-w-0">
            <ChatWindow
              conversationId={selectedConversation}
              onLatestCustomerMessage={setLatestCustomerMessage}
            />
            <ChatComposer
              conversationId={selectedConversation}
              customerMessage={latestCustomerMessage}
              onMessageSent={() => setRefresh((prev) => prev + 1)}
              messageValue={composerMessage}
              onMessageValueChange={setComposerMessage}
            />
          </section>

          <ConversationAIPanel
            conversationId={selectedConversation}
            customerMessage={latestCustomerMessage}
            onInsertSuggestedResponse={setComposerMessage}
          />
        </div>

        <MobileConversationNav />
      </main>
    </>
    </ProtectedRoute>
  );
}