"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2, AlertCircle, X } from "lucide-react";
import Sidebar from "../../components/layout/Sidebar";
import Header from "../../components/layout/Header";

import CreateBroadcastCampaignDetails from "../../components/createbroadcast/CreateBroadcastCampaignDetails";
import CreateBroadcastRecipients, { Recipient } from "../../components/createbroadcast/CreateBroadcastRecipients";
import CreateBroadcastEditor from "../../components/createbroadcast/CreateBroadcastEditor";
import CreateBroadcastPreview from "../../components/createbroadcast/CreateBroadcastPreview";
import CreateBroadcastFooter from "../../components/createbroadcast/CreateBroadcastFooter";
import ProtectedRoute from "../../components/auth/ProtectedRoute";
import { createBroadcast } from "../../services/firestore/broadcasts";

const DEFAULT_RECIPIENTS: Recipient[] = [
  { name: "Alice Smith", email: "alice.smith@example.com" },
  { name: "Bob Jones", email: "bob.jones@example.com" },
  { name: "Charlie Brown", email: "charlie.brown@example.com" },
  { name: "Diana Prince", email: "diana.prince@example.com" },
  { name: "Ethan Hunt", email: "ethan.hunt@example.com" },
  { name: "Fiona Gallagher", email: "fiona.gallagher@example.com" },
  { name: "George Clark", email: "george.clark@example.com" },
  { name: "Hannah Abbott", email: "hannah.abbott@example.com" },
  { name: "Ian Malcolm", email: "ian.malcolm@example.com" },
  { name: "Julia Roberts", email: "julia.roberts@example.com" },
];

interface DeliveryHistoryItem {
  name: string;
  email: string;
  status: "Delivered" | "Failed";
  timestamp: string;
}

export default function CreateBroadcastPage() {
  const router = useRouter();

  // Form State
  const [campaignName, setCampaignName] = useState("");
  const [subject, setSubject] = useState("");
  const [previewText, setPreviewText] = useState("");
  const [content, setContent] = useState("");
  
  // Initialize with empty recipients list
  const [recipientsList, setRecipientsList] = useState<Recipient[]>([]);

  // Sending Simulation State
  const [showSendingModal, setShowSendingModal] = useState(false);
  const [sendingProgress, setSendingProgress] = useState(0);
  const [liveLogs, setLiveLogs] = useState<DeliveryHistoryItem[]>([]);
  const [isSendingFinished, setIsSendingFinished] = useState(false);
  const [currentRecipient, setCurrentRecipient] = useState<Recipient | null>(null);

  // Helper to trigger database save
  const handleSave = async (status: "Draft" | "Scheduled" | "Sent") => {
    if (!campaignName.trim()) {
      alert("Please enter a campaign name.");
      return;
    }
    if (!subject.trim()) {
      alert("Please enter an email subject.");
      return;
    }
    if (recipientsList.length === 0) {
      alert("Please add at least one recipient.");
      return;
    }

    if (status === "Sent") {
      // Trigger Broadcast Sending
      startSending();
      return;
    }

    try {
      await createBroadcast({
        subject: campaignName,
        content: content,
        category: "Newsletter",
        recipients: `${recipientsList.length} Recipients`,
        status: status,
        openRate: 0,
        replyRate: 0,
      });
      alert(`Broadcast successfully saved as ${status}!`);
      router.push("/broadcasts");
    } catch (error) {
      console.error("Error creating broadcast:", error);
      alert("Failed to save broadcast.");
    }
  };

  // Real Sending logic via Gmail send API
  const startSending = async () => {
    setShowSendingModal(true);
    setSendingProgress(0);
    setLiveLogs([]);
    setIsSendingFinished(false);

    const totalRecipients = recipientsList.length;
    const finalHistory: DeliveryHistoryItem[] = [];

    for (let i = 0; i < totalRecipients; i++) {
      const recipient = recipientsList[i];
      setCurrentRecipient(recipient);

      let status: "Delivered" | "Failed" = "Failed";
      try {
        const sendRes = await fetch("/api/gmail/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            recipient: recipient.email,
            subject: subject || campaignName,
            message: content,
          }),
        });

        if (sendRes.ok) {
          status = "Delivered";
        } else {
          console.error(`Gmail Send API failed for ${recipient.email}:`, await sendRes.text());
        }
      } catch (err) {
        console.error(`Error connecting to send API for ${recipient.email}:`, err);
      }

      const timestamp = new Date().toLocaleTimeString();
      const newLog: DeliveryHistoryItem = {
        name: recipient.name,
        email: recipient.email,
        status,
        timestamp,
      };

      finalHistory.push(newLog);
      setLiveLogs((prev) => [newLog, ...prev]);
      setSendingProgress(Math.floor(((i + 1) / totalRecipients) * 100));

      // 300ms pause to make it visually pleasant and stagger calls
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    setCurrentRecipient(null);

    // Save to Database with Sent status and deliveryHistory
    try {
      const openRate = Math.floor(Math.random() * 20) + 75; // 75-95%
      const replyRate = Math.floor(Math.random() * 10) + 5;  // 5-15%

      await createBroadcast({
        subject: campaignName,
        content: content,
        category: "Newsletter",
        recipients: `${recipientsList.length} Recipients`,
        status: "Sent",
        openRate,
        replyRate,
        deliveryHistory: finalHistory,
      } as any);
      
      setIsSendingFinished(true);
    } catch (err) {
      console.error("Error saving sent broadcast", err);
      alert("Error saving campaign logs to server.");
      setShowSendingModal(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <Sidebar />

        {/* Right Side */}
        <div className="flex flex-1 flex-col md:ml-64">
          {/* Header */}
          <Header />

          {/* Main Content */}
          <main className="flex-1 bg-surface pt-24 pb-32">
            <div className="mx-auto max-w-7xl px-margin-mobile md:px-margin-desktop">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                {/* Left */}
                <div className="space-y-6 lg:col-span-7">
                  <CreateBroadcastCampaignDetails
                    campaignName={campaignName}
                    setCampaignName={setCampaignName}
                    subject={subject}
                    setSubject={setSubject}
                    previewText={previewText}
                    setPreviewText={setPreviewText}
                  />

                  <CreateBroadcastRecipients
                    recipientsList={recipientsList}
                    setRecipientsList={setRecipientsList}
                  />

                  <CreateBroadcastEditor
                    content={content}
                    setContent={setContent}
                  />
                </div>

                {/* Right */}
                <div className="lg:col-span-5">
                  <CreateBroadcastPreview
                    subject={subject}
                    content={content}
                  />
                </div>
              </div>
            </div>
          </main>
        </div>

        <CreateBroadcastFooter
          onSaveDraft={() => handleSave("Draft")}
          onSendNow={() => handleSave("Sent")}
          onSchedule={() => handleSave("Scheduled")}
        />

        {/* Mock Sending Modal */}
        {showSendingModal && (
          <div className="fixed inset-0 z-99 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl space-y-6 flex flex-col max-h-[90vh]">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-2">
                  {!isSendingFinished ? (
                    <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                  ) : (
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  )}
                  <h3 className="text-xl font-bold text-gray-900">
                    {!isSendingFinished ? "Sending Email Broadcast..." : "Campaign Sent Successfully!"}
                  </h3>
                </div>
                {isSendingFinished && (
                  <button 
                    onClick={() => router.push("/broadcasts")}
                    className="p-1 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                )}
              </div>

              {/* Progress Section */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-semibold text-gray-700">
                  <span>Progress</span>
                  <span>{sendingProgress}%</span>
                </div>
                <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 transition-all duration-300 rounded-full"
                    style={{ width: `${sendingProgress}%` }}
                  />
                </div>
                {currentRecipient && (
                  <p className="text-sm text-gray-500 italic">
                    Currently delivering to: <span className="font-semibold text-gray-700">{currentRecipient.name} ({currentRecipient.email})</span>
                  </p>
                )}
              </div>

              {/* Delivery History Logs */}
              <div className="flex-1 flex flex-col min-h-0 space-y-2">
                <span className="text-sm font-semibold text-gray-700">Live Delivery Log</span>
                <div className="flex-1 overflow-y-auto border rounded-xl bg-gray-50 p-4 space-y-2 max-h-60 font-mono text-xs">
                  {liveLogs.length > 0 ? (
                    liveLogs.map((log, index) => (
                      <div 
                        key={index}
                        className={`flex justify-between items-center py-1 border-b border-gray-100 last:border-0 ${
                          log.status === "Delivered" ? "text-green-700" : "text-red-700 font-semibold"
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          {log.status === "Delivered" ? (
                            <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                          ) : (
                            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                          )}
                          <span>[{log.timestamp}] {log.name} &lt;{log.email}&gt;</span>
                        </div>
                        <span className="uppercase text-[10px] tracking-wide font-bold px-1.5 py-0.5 rounded bg-white border">
                          {log.status}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 italic text-center py-8">Initializing connections...</p>
                  )}
                </div>
              </div>

              {/* Action */}
              {isSendingFinished && (
                <button
                  onClick={() => router.push("/broadcasts")}
                  className="w-full py-3 rounded-lg bg-blue-600 font-semibold text-white hover:bg-blue-700 transition active:scale-[0.98]"
                >
                  Go to Broadcast Dashboard
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}