import { Suspense } from "react";
import EditFAQClient from "../faq/new/EditFAQClient";

export default function EditFAQPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditFAQClient />
    </Suspense>
  );
}