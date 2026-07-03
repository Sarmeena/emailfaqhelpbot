"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import BroadcastHeader from "../../../components/broadcast/BroadcastHeader";
import BroadcastSidebar from "../../../components/broadcast/BroadcastSidebar";
import BroadcastContentForm from "../../../components/broadcast/BroadcastContentForm";
import BroadcastRecipients from "../../../components/broadcast/BroadcastRecipients";
import BroadcastSettings from "../../../components/broadcast/BroadcastSettings";
import BroadcastFooter from "../../../components/broadcast/BroadcastFooter";

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

    async function handleSaveDraft() {
        try {
            if (id) {
                await updateBroadcast(id, {
                    subject,
                    content,
                    category,
                    recipients,
                    status: "Draft",
                    scheduleDate,
                    scheduleTime,
                });
            } else {
                await createBroadcast({
                    subject,
                    content,
                    category,
                    recipients,
                    status: "Draft",
                    openRate: 0,
                    replyRate: 0,
                    scheduleDate,
                    scheduleTime,
                } as any);
            }

            alert("Draft saved successfully.");

            router.push("/broadcasts");
        } catch (error) {
            console.error(error);
            alert("Failed to save draft.");
        }
    }

    async function handleSend() {
        try {
            if (id) {
                await updateBroadcast(id, {
                    subject,
                    content,
                    category,
                    recipients,
                    status,
                    scheduleDate,
                    scheduleTime,
                });
            } else {
                await createBroadcast({
                    subject,
                    content,
                    category,
                    recipients,
                    status,
                    openRate: 0,
                    replyRate: 0,
                    scheduleDate,
                    scheduleTime,
                } as any);
            }

            alert("Broadcast saved successfully.");

            router.push("/broadcasts");
        } catch (error) {
            console.error(error);
            alert("Failed to save broadcast.");
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
        <>
            <BroadcastHeader />

            <div className="flex min-h-screen bg-gray-50">
                <BroadcastSidebar />

                <main className="flex-1 pt-16 md:ml-64">
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

                        {/* Content */}
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

                        {/* Footer */}
                        <BroadcastFooter
                            onCancel={handleCancel}
                            onSaveDraft={handleSaveDraft}
                            onSend={handleSend}
                        />
                    </div>
                </main>
            </div>
        </>
    );
}