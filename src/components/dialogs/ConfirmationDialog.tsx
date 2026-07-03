"use client";

interface ConfirmationDialogProps {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
}

export default function ConfirmationDialog({
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
}: ConfirmationDialogProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-outline-variant bg-white shadow-xl">
      <div className="p-md">
        <h3 className="text-body-md font-semibold">
          {title}
        </h3>

        <p className="mt-xs text-body-sm text-on-surface-variant">
          {description}
        </p>
      </div>

      <div className="flex justify-end gap-sm bg-surface-container p-sm">
        <button className="rounded-lg px-4 py-2 text-label-sm font-semibold text-on-surface-variant hover:bg-surface-variant">
          {cancelText}
        </button>

        <button className="rounded-lg bg-error px-4 py-2 text-label-sm font-semibold text-on-error">
          {confirmText}
        </button>
      </div>
    </div>
  );
}