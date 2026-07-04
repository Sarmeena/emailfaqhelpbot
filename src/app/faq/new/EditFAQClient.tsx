"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import EditFAQHeader from "../../../components/faq/EditFAQHeader";
import Sidebar from "../../../components/layout/Sidebar";
import FAQContentForm from "../../../components/faq/FAQContentForm";
import FAQCategorization from "../../../components/faq/FAQCategorization";
import FAQMetadata from "../../../components/faq/FAQMetadata";
import FAQDangerZone from "../../../components/faq/FAQDangerZone";


import {
    getFAQById,
    updateFAQ,
    deleteFAQ,
} from "../../../services/firestore/faqs";

export default function EditFAQClient() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const id = searchParams.get("id");

    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [category, setCategory] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadFAQ() {
            if (!id) {
                setLoading(false);
                return;
            }

            try {
                const faq = await getFAQById(id);

                setQuestion(faq.question);
                setAnswer(faq.answer);
                setCategory(faq.category);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        loadFAQ();
    }, [id]);

    async function handleSave() {
        if (!question.trim()) {
            alert("Please enter a question.");
            return;
        }

        if (!answer.trim()) {
            alert("Please enter an answer.");
            return;
        }

        if (!category) {
            alert("Please select a category.");
            return;
        }

        try {
            if (id) {
                await updateFAQ(id, {
                    question,
                    answer,
                    category,
                });
            }

            alert("FAQ saved successfully.");

            router.push("/faqs");
        } catch (error) {
            console.error(error);
            alert("Failed to save FAQ.");
        }
    }

    async function handleDelete() {
        if (!id) return;

        if (
            !confirm(
                "Are you sure you want to delete this FAQ?"
            )
        ) {
            return;
        }

        try {
            await deleteFAQ(id);

            alert("FAQ deleted successfully.");

            router.push("/faqs");
        } catch (error) {
            console.error(error);
            alert("Failed to delete FAQ.");
        }
    }

    function handleCancel() {
        router.push("/faqs");
    }

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                Loading FAQ...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <EditFAQHeader onSave={handleSave}
                onCancel={handleCancel} />

            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main
                className="rounded-2xl border border-gray-200 bg-white p-10 shadow-sm pt-20"
                style={{ marginLeft: "256px" }}
            >
                <div className="mx-auto max-w-6xl space-y-10 px-10 py-10">

                    {/* Page Header */}
                    <div className="mb-10">
                        <h1 className="text-4xl tracking-tight font-bold text-slate-900">
                            Edit FAQ
                        </h1>

                        <p className="mt-2 text-lg text-slate-500">
                            Update your knowledge base article.
                        </p>
                    </div>

                    {/* FAQ Content */}
                    <div className="mb-8">
                        <FAQContentForm
                            question={question}
                            answer={answer}
                            onQuestionChange={setQuestion}
                            onAnswerChange={setAnswer}
                        />
                    </div>

                    {/* Category + Metadata */}
                    <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
                        <FAQCategorization
                            category={category}
                            onCategoryChange={setCategory}
                        />

                        <FAQMetadata />
                    </div>

                    {/* Danger Zone */}
                    <FAQDangerZone onDelete={handleDelete} />
                </div>
            </main>

        </div>
    );
}