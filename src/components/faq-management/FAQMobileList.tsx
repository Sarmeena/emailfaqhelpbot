"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import FAQCard from "./FAQCard";
import { FAQ, getFAQs } from "../../services/firestore/faqs";

interface FAQMobileListProps {
  search: string;
  category: string;
  status: string;
}

export default function FAQMobileList({ search, category, status }: FAQMobileListProps) {
  const { user, role, loading: authLoading } = useAuth();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading || !user || !role) return;

    async function loadFAQs() {
      try {
        const data = await getFAQs();
        setFaqs(data);
      } catch (error: any) {
        console.error(error);
        if (error.code === "permission-denied" || error.message?.includes("permission")) {
          console.error(`[Firestore Permission Failure] FAQMobileList query denied. UID: ${user?.uid}, Role: ${role}`);
        }
      } finally {
        setLoading(false);
      }
    }

    loadFAQs();
  }, [user, role, authLoading]);

  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(search.toLowerCase()) ||
      faq.answer.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = category === "" || faq.category === category;

    const matchesStatus = status === "" || (faq.status ?? "Published") === status;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  if (authLoading || !user || !role || loading) {
    return (
      <div className="md:hidden p-6 text-center text-gray-500 font-medium">
        Loading FAQs...
      </div>
    );
  }

  if (filteredFAQs.length === 0) {
    return (
      <div className="md:hidden rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-400 font-medium">
        No FAQs found matching the filters.
      </div>
    );
  }

  return (
    <div className="space-y-md lg:hidden">
      {filteredFAQs.map((faq) => (
        <FAQCard key={faq.id || faq.faqid} faq={faq as any} />
      ))}
    </div>
  );
}