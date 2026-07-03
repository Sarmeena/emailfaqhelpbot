"use client";

import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface EditFAQHeaderProps {
  onSave: () => void;
  onCancel: () => void;
}

export default function EditFAQHeader({
  onSave,
  onCancel,
}: EditFAQHeaderProps) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-gray-200 bg-white">
      <div className="flex h-full items-center justify-between px-6 md:px-8">

        {/* Left */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="rounded-lg p-2 transition hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </button>

          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              Edit FAQ
            </h1>

            <p className="text-sm text-gray-500">
              Knowledge Base Management
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">

          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onSave}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            Save FAQ
          </button>

          <button className="overflow-hidden rounded-full border border-gray-200">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-eLI2mCvk3w5j4GZj5fzgAWruB4Pprd8r_HgiN3qWWbG175FNAxAnyrV4gvAP0SfJaD1lqLwPEzDQsjcRrvpls0fCYy6lDxDWFcA5Xw6Y3ERzWUDrKLk1hOd_mS5iJU3fwqgHbdtHEsTbAzI2HTXhTbK0TTtg4BOiX_XVwBDiv01W9lDUq0tp1g1iqbbSWtlam2pI-mUlZZd055jhQP5ZYAfzRmQNCgsIXSCfPLYDQXJDv4N_v1I7VSOy-fOC2iYzP_xCrnciCyE"
              alt="Support Agent"
              width={40}
              height={40}
              className="h-10 w-10 object-cover"
              unoptimized
            />
          </button>

        </div>

      </div>
    </header>
  );
}