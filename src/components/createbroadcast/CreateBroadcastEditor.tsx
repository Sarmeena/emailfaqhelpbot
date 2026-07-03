"use client";

import {
  Bold,
  Italic,
  Link,
  Image as ImageIcon,
  PencilLine,
} from "lucide-react";

interface CreateBroadcastEditorProps {
  content: string;
  setContent: (val: string) => void;
}

export default function CreateBroadcastEditor({
  content,
  setContent,
}: CreateBroadcastEditorProps) {
  return (
    <section className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.05)]">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PencilLine className="h-6 w-6 text-primary" />

          <h2 className="text-title-lg font-title-lg text-on-surface">
            Email Body
          </h2>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="rounded-lg p-2 transition hover:bg-surface-container"
          >
            <Bold className="h-5 w-5 text-on-surface-variant" />
          </button>

          <button
            type="button"
            className="rounded-lg p-2 transition hover:bg-surface-container"
          >
            <Italic className="h-5 w-5 text-on-surface-variant" />
          </button>

          <button
            type="button"
            className="rounded-lg p-2 transition hover:bg-surface-container"
          >
            <Link className="h-5 w-5 text-on-surface-variant" />
          </button>

          <button
            type="button"
            className="rounded-lg p-2 transition hover:bg-surface-container"
          >
            <ImageIcon className="h-5 w-5 text-on-surface-variant" />
          </button>
        </div>
      </div>

      {/* Email Body */}
      <textarea
        rows={12}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Start writing your email here..."
        className="w-full resize-none rounded-lg border border-outline-variant bg-surface-container-low p-4 text-body-md text-on-surface outline-none transition-all focus:ring-2 focus:ring-primary"
      />
    </section>
  );
}