"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Sidebar from "../../../components/layout/Sidebar";
import Header from "../../../components/layout/Header";
import BroadcastContentForm from "../../../components/broadcast/BroadcastContentForm";
import BroadcastRecipients from "../../../components/broadcast/BroadcastRecipients";
import BroadcastSettings from "../../../components/broadcast/BroadcastSettings";
import BroadcastFooter from "../../../components/broadcast/BroadcastFooter";
import CreateBroadcastPreview from "../../../components/createbroadcast/CreateBroadcastPreview";

import {
    createBroadcast,
    getBroadcastById,
    updateBroadcast,
} from "../../../services/firestore/broadcasts";

export default function EditBroadcastClient() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const id = searchParams.get("id");

    const [subject, setSubject] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("");
    const [recipients, setRecipients] = useState("");

    const [status, setStatus] = useState<
        "Draft" | "Scheduled" | "Sent"
    >("Draft");

    const [scheduleDate, setScheduleDate] = useState("");
    const [scheduleTime, setScheduleTime] = useState("");

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadBroadcast() {
            if (!id) {
                setLoading(false);
                return;
            }

            try {
                const broadcast = await getBroadcastById(id);

                setSubject(broadcast.subject);
                setContent(broadcast.content);
                setCategory(broadcast.category);
                setRecipients(broadcast.recipients);
                setStatus(broadcast.status);

                setScheduleDate(
                    (broadcast as any).scheduleDate ?? ""
                );

                setScheduleTime(
                    (broadcast as any).scheduleTime ?? ""
                );
            } catch (error) {
                console.error(error);
                alert("Unable to load broadcast.");
            } finally {
                setLoading(false);
            }
        }

        loadBroadcast();
    }, [id]);

    async function handleSave() {
        try {
            const targetStatus = status === "Sent" ? "Draft" : status;

            if (id) {
                await updateBroadcast(id, {
                    subject,
                    content,
                    category,
                    recipients,
                    status: targetStatus,
                    scheduleDate,
                    scheduleTime,
                });
            } else {
                await createBroadcast({
                    subject,
                    content,
                    category,
                    recipients,
                    status: targetStatus,
                    openRate: 0,
                    replyRate: 0,
                    scheduleDate,
                    scheduleTime,
                } as any);
            }

            alert(`${targetStatus === "Scheduled" ? "Broadcast scheduled" : "Draft saved"} successfully.`);

            router.push("/broadcasts");
        } catch (error) {
            console.error(error);
            alert("Failed to save broadcast.");
        }
    }

    async function handleSend() {
        try {
            const recipientsList = [
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

            for (const recipient of recipientsList) {
              try {
                await fetch("/api/gmail/send", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    recipient: recipient.email,
                    subject: subject,
                    message: content,
                  }),
                });
              } catch (err) {
                console.error("Error sending email:", err);
              }
            }

            const openRateVal = Math.floor(Math.random() * 20) + 75; // 75-95%
            const replyRateVal = Math.floor(Math.random() * 10) + 5;  // 5-15%

            if (id) {
                await updateBroadcast(id, {
                    subject,
                    content,
                    category,
                    recipients: `${recipientsList.length} Recipients`,
                    status: "Sent",
                    openRate: openRateVal,
                    replyRate: replyRateVal,
                    scheduleDate,
                    scheduleTime,
                });
            } else {
                await createBroadcast({
                    subject,
                    content,
                    category,
                    recipients: `${recipientsList.length} Recipients`,
                    status: "Sent",
                    openRate: openRateVal,
                    replyRate: replyRateVal,
                    scheduleDate,
                    scheduleTime,
                } as any);
            }

            alert("Broadcast sent successfully!");

            router.push("/broadcasts");
        } catch (error) {
            console.error(error);
            alert("Failed to send broadcast.");
        }
    }

    function handleCancel() {
        router.push("/broadcasts");
    }

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                Loading Broadcast...
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <Sidebar />

            {/* Right Side */}
            <div className="flex flex-1 flex-col md:ml-64">
                {/* Header */}
                <Header />

                {/* Main Content */}
                <main className="flex-1">
                    <div className="mx-auto max-w-7xl space-y-8 p-8">

                        {/* Page Header */}
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900">
                                {id ? "Edit Broadcast" : "Create Broadcast"}
                            </h1>

                            <p className="mt-2 text-gray-500">
                                {id
                                    ? "Update your email campaign."
                                    : "Compose a new email broadcast."}
                            </p>
                        </div>

                        {/* Split layout */}
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                          <div className="space-y-6 lg:col-span-7">
                            <BroadcastContentForm
                                subject={subject}
                                content={content}
                                onSubjectChange={setSubject}
                                onContentChange={setContent}
                            />

                            {/* Recipients + Settings */}
                            <div className="grid gap-8 lg:grid-cols-2">
                                <BroadcastRecipients
                                    recipients={recipients}
                                    category={category}
                                    onRecipientsChange={setRecipients}
                                    onCategoryChange={setCategory}
                                />

                                <BroadcastSettings
                                    status={status}
                                    onStatusChange={setStatus}
                                    scheduleDate={scheduleDate}
                                    scheduleTime={scheduleTime}
                                    onScheduleDateChange={setScheduleDate}
                                    onScheduleTimeChange={setScheduleTime}
                                />
                            </div>
                          </div>

                          <div className="lg:col-span-5">
                            <CreateBroadcastPreview subject={subject} content={content} />
                          </div>
                        </div>

                        {/* Footer */}
                        <BroadcastFooter
                            onCancel={handleCancel}
                            onSaveDraft={handleSave}
                            onSend={handleSend}
                            status={status}
                        />
                    </div>
                </main>
            </div>
        </div>
    );
}