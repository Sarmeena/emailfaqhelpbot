"use client";

import { Plus } from "lucide-react";

export default function FAQFloatingButton() {
  return (
    <button
      className="
      fixed
      bottom-8
      right-8
      hidden
      md:flex
      items-center
      gap-2
      rounded-xl
      bg-blue-700
      px-6
      py-4
      text-white
      shadow-xl
      transition
      hover:bg-blue-800
      "
    >
      <Plus size={20} />

      Add FAQ
    </button>
  );
}