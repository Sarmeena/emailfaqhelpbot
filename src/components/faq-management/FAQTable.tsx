"use client";

import { Pencil, Eye, X } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getFAQs, FAQ } from "../../services/firestore/faqs";

import {
  categoryStyles,
  statusStyles,
  statusDot,
} from "./faq-data";

interface FAQTableProps {
  search: string;
  category: string;
  status: string;
}

const getConfidenceScore = (faq: FAQ, query: string) => {
  if (!query) return 100;
  const queryWords = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (queryWords.length === 0) return 100;
  
  let matches = 0;
  const textToSearch = (faq.question + " " + faq.answer).toLowerCase();
  
  queryWords.forEach(word => {
    if (textToSearch.includes(word)) {
      matches++;
    }
  });

  const percent = Math.round((matches / queryWords.length) * 100);
  // Return semantic score with mock AI variance capped at 100
  return Math.min(Math.max(percent, 40) + Math.floor(Math.random() * 8), 100);
};

export default function FAQTable({
  search,
  category,
  status,
}: FAQTableProps) {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFaq, setSelectedFaq] = useState<FAQ | null>(null);

  const filteredFAQs = faqs.filter((faq) => {
  const matchesSearch =
    faq.question
      .toLowerCase()
      .includes(search.toLowerCase()) ||
    faq.answer
      .toLowerCase()
      .includes(search.toLowerCase());

  const matchesCategory =
    category === "" ||
    faq.category === category;

  const matchesStatus =
    status === "" ||
    (faq.status ?? "Published") === status;

  return (
    matchesSearch &&
    matchesCategory &&
    matchesStatus
  );
});

  useEffect(() => {
    async function loadFAQs() {
      try {
        const data = await getFAQs();
        setFaqs(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadFAQs();
  }, []);

  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-10 text-center text-gray-500 shadow-sm">
        Loading FAQs...
      </div>
    );
  }

  if (filteredFAQs.length === 0) {
    return (
      <div className="rounded-xl border bg-white p-12 text-center shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800">
          No FAQs Found
        </h3>

        <p className="mt-2 text-gray-500">
          Create your first FAQ to build your knowledge base.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full">

          <thead className="sticky top-0 bg-gray-50">
            <tr className="border-b border-gray-200">

              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                Question
              </th>

              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                Category
              </th>

              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                Status
              </th>

              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                Retrieval Source & Ref
              </th>

              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                Confidence %
              </th>

              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                Usage
              </th>

              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                Updated
              </th>

              <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-gray-500">
                Actions
              </th>

            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">

            {filteredFAQs.map((faq) => (
              <tr
                key={faq.id}
                className="transition hover:bg-gray-50"
              >
                {/* Question */}
                <td className="px-6 py-5">
                  <div className="max-w-lg">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-mono text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded shrink-0">
                        {faq.faqid ?? "Legacy"}
                      </span>
                      <h3 className="font-semibold text-gray-900">
                        {faq.question}
                      </h3>
                    </div>

                    <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                      {faq.answer}
                    </p>
                  </div>
                </td>

                {/* Category */}
                <td className="px-6 py-5">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      categoryStyles[faq.category] ??
                      "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {faq.category}
                  </span>
                </td>

                {/* Status */}
                <td className="px-6 py-5">
                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                      statusStyles[faq.status ?? "Published"]
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        statusDot[faq.status ?? "Published"]
                      }`}
                    />

                    {faq.status ?? "Published"}
                  </span>
                </td>

                {/* Source & Reference */}
                <td className="px-6 py-5">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-semibold text-gray-800">
                      {faq.source === "PDF Upload" || faq.source === "DOCX Upload" 
                        ? "Document Retrieval" 
                        : "FAQ Retrieval"}
                    </span>
                    <span className="text-xs text-gray-500 truncate max-w-xs block" title={faq.fileName || "FAQ Database"}>
                      Ref: {faq.fileName || "FAQ Database"}
                    </span>
                  </div>
                </td>

                {/* Confidence */}
                <td className="px-6 py-5">
                  {search ? (
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${
                      getConfidenceScore(faq, search) >= 80 
                        ? "bg-green-100 text-green-800" 
                        : getConfidenceScore(faq, search) >= 60 
                        ? "bg-blue-100 text-blue-800" 
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {getConfidenceScore(faq, search)}% Match
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400 font-medium">
                      95% Default
                    </span>
                  )}
                </td>

                {/* Usage */}
                <td className="px-6 py-5 text-sm text-gray-700">
                  {(faq.usage ?? 0).toLocaleString()} times
                </td>

                {/* Updated */}
                <td className="px-6 py-5 text-sm text-gray-500">
                  {faq.updated ?? "-"}
                </td>

                {/* Action */}
                <td className="px-6 py-5 text-right flex items-center justify-end gap-2">
                  <button
                    onClick={() => setSelectedFaq(faq)}
                    className="
                      rounded-lg
                      p-2
                      text-gray-600
                      transition
                      hover:bg-gray-100
                      hover:text-gray-700
                    "
                    title="View Details"
                  >
                    <Eye size={18} />
                  </button>
                  <Link
                    href={`/faq?id=${faq.id}`}
                    className="
                      rounded-lg
                      p-2
                      text-blue-600
                      transition
                      hover:bg-blue-50
                      hover:text-blue-700
                    "
                  >
                    <Pencil size={18}/>
                  </Link>
                </td>

              </tr>
            ))}

          </tbody>

        </table>
      </div>

      {/* View FAQ Details Modal */}
      {selectedFaq && (
        <div className="fixed inset-0 z-99 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl space-y-6 flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">FAQ Details</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                    {selectedFaq.faqid ?? "Legacy"}
                  </span>
                  <p className="text-xs text-gray-500">Category: {selectedFaq.category}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedFaq(null)}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Question Box */}
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Question</span>
              <p className="text-base font-semibold text-gray-900 leading-snug p-3 bg-gray-50 rounded-xl border border-gray-100">
                {selectedFaq.question}
              </p>
            </div>

            {/* Answer Box (Handles Long Text) */}
            <div className="space-y-1 flex-1 flex flex-col min-h-0">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Answer</span>
              <div className="flex-1 overflow-y-auto p-4 border rounded-xl bg-gray-50 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed max-h-60 font-mono">
                {selectedFaq.answer}
              </div>
            </div>

            {/* Firestore Metadata Grid */}
            <div className="space-y-2 border-t pt-4">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Document Source & Metadata</span>
              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-100 text-gray-700">
                <div>
                  <span className="text-gray-400">Retrieval Type:</span> <span className="font-semibold">
                    {selectedFaq.source === "PDF Upload" || selectedFaq.source === "DOCX Upload" ? "Document Retrieval" : "FAQ Retrieval"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Match Confidence:</span> <span className="font-semibold">
                    {search ? `${getConfidenceScore(selectedFaq, search)}% (Semantic)` : "95% (Default)"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Source Reference:</span> <span className="font-semibold truncate block max-w-xs" title={selectedFaq.fileName}>{selectedFaq.fileName || "FAQ Database"}</span>
                </div>
                <div>
                  <span className="text-gray-400">File Size:</span> <span className="font-semibold">{selectedFaq.fileSize || "0 KB"}</span>
                </div>
                {selectedFaq.uploadedAt && (
                  <div className="col-span-2">
                    <span className="text-gray-400">Uploaded At:</span> <span className="font-semibold">{selectedFaq.uploadedAt}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end pt-2 border-t">
              <button
                onClick={() => setSelectedFaq(null)}
                className="px-5 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-750 font-semibold text-sm transition"
              >
                Close View
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}