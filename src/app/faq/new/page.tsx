"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { FileText, Upload, RefreshCw, CheckCircle, Info } from "lucide-react";

import EditFAQHeader from "../../../components/faq/EditFAQHeader";
import EditFAQSidebar from "../../../components/faq/EditFAQSidebar";
import FAQContentForm from "../../../components/faq/FAQContentForm";
import FAQCategorization from "../../../components/faq/FAQCategorization";

import { addFAQ } from "../../../services/firestore/faqs";

export default function NewFAQPage() {
  const router = useRouter();

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [category, setCategory] = useState("");

  // Metadata states
  const [source, setSource] = useState("Manual Entry");
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [uploadedAt, setUploadedAt] = useState("");

  // UI state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

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
      await addFAQ(
        question,
        answer,
        category,
        {
          source,
          fileName,
          fileSize,
          uploadedAt
        }
      );

      alert("FAQ created successfully.");
      router.push("/faqs");
    } catch (error) {
      console.error(error);
      alert("Failed to create FAQ.");
    }
  }

  function handleCancel() {
    router.push("/faqs");
  }

  // Simulated AI Document Parser
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: "pdf" | "docx") => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadSuccess(false);

    // Mock OCR / Document parsing with 1.2s delay
    setTimeout(() => {
      const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf("."));
      const readableName = nameWithoutExt.split(/[_-]/).join(" ");
      
      // Capitalize first letter
      const title = readableName.charAt(0).toUpperCase() + readableName.slice(1);
      
      // Auto-extract content based on file type / name
      let extractedQuestion = `How to ${readableName.toLowerCase()}?`;
      if (title.toLowerCase().startsWith("how to") || title.toLowerCase().startsWith("what is")) {
        extractedQuestion = `${title}?`;
      }
      
      let extractedAnswer = `Here is the step-by-step documentation extracted from your uploaded ${type.toUpperCase()} file ("${file.name}"):\n\n`;
      extractedAnswer += `1. Navigate to the main menu settings.\n`;
      extractedAnswer += `2. Select the option labeled "${title}".\n`;
      extractedAnswer += `3. Review the instructions outline detailed in the user guide.\n`;
      extractedAnswer += `4. If issues persist, contact our support team at support@company.com.\n\n`;
      extractedAnswer += `This FAQ was auto-parsed using AI text extraction. You can edit this text directly above.`;

      // Set states
      setQuestion(extractedQuestion);
      setAnswer(extractedAnswer);
      setCategory("Support"); // Default auto-category
      
      setSource(type === "pdf" ? "PDF Upload" : "DOCX Upload");
      setFileName(file.name);
      setFileSize((file.size / 1024).toFixed(1) + " KB");
      setUploadedAt(new Date().toLocaleString());

      setIsUploading(false);
      setUploadSuccess(true);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <EditFAQHeader
        onSave={handleSave}
        onCancel={handleCancel}
      />

      <EditFAQSidebar />

      <main
        className="rounded-2xl border border-gray-200 bg-white p-10 shadow-sm"
        style={{ marginLeft: "256px" }}
      >
        <div className="mx-auto max-w-6xl space-y-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b pb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Create FAQ
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Add an article manually or import a PDF/DOCX document.
              </p>
            </div>

            {/* Document Import Section */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">AI Document Import</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (fileInputRef.current) {
                        fileInputRef.current.accept = ".pdf";
                        fileInputRef.current.click();
                      }
                    }}
                    disabled={isUploading}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-red-50 hover:bg-red-100 text-red-700 transition border border-red-200 disabled:opacity-50"
                  >
                    <Upload size={14} />
                    Import PDF
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (fileInputRef.current) {
                        fileInputRef.current.accept = ".docx";
                        fileInputRef.current.click();
                      }
                    }}
                    disabled={isUploading}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition border border-blue-200 disabled:opacity-50"
                  >
                    <Upload size={14} />
                    Import DOCX
                  </button>
                </div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={(e) => {
                  const ext = e.target.files?.[0]?.name.split(".").pop()?.toLowerCase();
                  handleFileUpload(e, ext === "pdf" ? "pdf" : "docx");
                }}
              />
            </div>
          </div>

          {/* Loading / Success indicators */}
          {isUploading && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-50 text-blue-700 border border-blue-150 animate-pulse text-sm">
              <RefreshCw className="h-5 w-5 animate-spin" />
              <span>Analyzing document and extracting QA text with AI...</span>
            </div>
          )}

          {uploadSuccess && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50 text-green-700 border border-green-150 text-sm">
              <CheckCircle className="h-5 w-5" />
              <div>
                <span className="font-semibold">Import Complete:</span> Question and answer populated from <span className="font-semibold underline">{fileName}</span> ({fileSize}).
              </div>
            </div>
          )}

          <FAQContentForm
            question={question}
            answer={answer}
            onQuestionChange={setQuestion}
            onAnswerChange={setAnswer}
          />

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <FAQCategorization
              category={category}
              onCategoryChange={setCategory}
            />

            {/* Metadata Info Box */}
            <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm space-y-4">
              <div className="border-b border-gray-200 pb-4">
                <h2 className="text-xl font-semibold text-gray-900">Document Metadata</h2>
                <p className="mt-1 text-sm text-gray-500">Firestore metadata stored for tracking file sources.</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-xs font-semibold text-gray-500">Source Type</span>
                  <p className="mt-1 font-semibold text-gray-800">{source}</p>
                </div>
                <div>
                  <span className="text-xs font-semibold text-gray-500">Uploaded At</span>
                  <p className="mt-1 font-semibold text-gray-800">{uploadedAt || "N/A"}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-xs font-semibold text-gray-500">Attached File Name</span>
                  <p className="mt-1 font-semibold text-gray-800 break-all">{fileName || "None (Manually created)"}</p>
                </div>
                <div>
                  <span className="text-xs font-semibold text-gray-500">File Size</span>
                  <p className="mt-1 font-semibold text-gray-800">{fileSize || "0 KB"}</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}