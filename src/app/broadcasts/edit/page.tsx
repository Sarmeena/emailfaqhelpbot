import { Suspense } from "react";
import EditBroadcastClient from "./EditBroadcastClient";
import ProtectedRoute from "../../../components/auth/ProtectedRoute";

export default function EditBroadcastPage() {
  return (
    <ProtectedRoute allowedRoles={["admin", "agent"]}>
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center">
            Loading...
          </div>
        }
      >
        <EditBroadcastClient />
      </Suspense>
    </ProtectedRoute>
  );
}