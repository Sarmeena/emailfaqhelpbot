"use client";

import FAQCard from "./FAQCard";
import { faqs } from "./faq-data";

export default function FAQMobileList() {
  return (
    <div className="space-y-md lg:hidden">
      {faqs.map((faq) => (
        <FAQCard key={faq.id} faq={faq} />
      ))}
    </div>
  );
}