"use client";

import {
  Bold,
  Italic,
  List,
  Link as LinkIcon,
} from "lucide-react";

interface FAQContentFormProps {
  question: string;
  answer: string;

  onQuestionChange: (value: string) => void;
  onAnswerChange: (value: string) => void;
}

export default function FAQContentForm({
  question,
  answer,
  onQuestionChange,
  onAnswerChange,
}: FAQContentFormProps) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">

      {/* Header */}
      <div className="mb-8 border-b border-gray-200 pb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          FAQ Content
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Update the question and answer that customers will see.
        </p>
      </div>

      <div className="space-y-8">

        {/* Question */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Question
          </label>

          <textarea
            rows={3}
            value={question}
            onChange={(e) => onQuestionChange(e.target.value)}
            placeholder="How do I reset my password?"
            className="w-full rounded-xl border border-gray-300 bg-white p-4 text-gray-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 resize-none"
          />
        </div>

        {/* Answer */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Answer
          </label>

          <div className="overflow-hidden rounded-xl border border-gray-300">

            {/* Toolbar */}
            <div className="flex items-center gap-2 border-b border-gray-200 bg-gray-50 px-3 py-2">

              <button
                type="button"
                className="rounded-md p-2 transition hover:bg-gray-200"
              >
                <Bold className="h-4 w-4 text-gray-600" />
              </button>

              <button
                type="button"
                className="rounded-md p-2 transition hover:bg-gray-200"
              >
                <Italic className="h-4 w-4 text-gray-600" />
              </button>

              <button
                type="button"
                className="rounded-md p-2 transition hover:bg-gray-200"
              >
                <List className="h-4 w-4 text-gray-600" />
              </button>

              <button
                type="button"
                className="rounded-md p-2 transition hover:bg-gray-200"
              >
                <LinkIcon className="h-4 w-4 text-gray-600" />
              </button>

            </div>

            {/* Answer Text */}
            <textarea
              rows={10}
              value={answer}
              onChange={(e) => onAnswerChange(e.target.value)}
              placeholder="Provide a detailed answer..."
              className="w-full resize-none border-none bg-white p-4 text-gray-800 outline-none"
            />

          </div>
        </div>

      </div>

    </section>
  );
}