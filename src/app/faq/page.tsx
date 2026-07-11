import { Suspense } from "react";
import EditFAQClient from "../faq/new/EditFAQClient";
import ProtectedRoute from "../../components/auth/ProtectedRoute";

export default function EditFAQPage() {
  return (
    <ProtectedRoute allowedRoles={["admin", "agent"]}>
      <Suspense fallback={<div>Loading...</div>}>
        <EditFAQClient />
      </Suspense>
    </ProtectedRoute>
  );
}