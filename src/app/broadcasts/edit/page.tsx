import { Suspense } from "react";
import EditBroadcastClient from "./EditBroadcastClient";

export default function EditBroadcastPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Loading...
        </div>
      }
    >
      <EditBroadcastClient />
    </Suspense>
  );
}