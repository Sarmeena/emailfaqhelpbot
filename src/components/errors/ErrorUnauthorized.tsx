import ErrorCard from "./ErrorCard";
import { ShieldAlert } from "lucide-react";

export default function ErrorUnauthorized() {
  return (
    <ErrorCard reverse>
      <div className="flex h-72 w-72 items-center justify-center rounded-2xl bg-surface-container-low">
        <img
          src="/images/errors/unauthorized.png"
          alt="Access Denied"
          className="h-52 w-52 object-contain"
        />
      </div>

      <div className="flex-1 space-y-6 text-center md:text-left">
        <div>
          <span className="inline-block rounded-full bg-tertiary-fixed/40 px-3 py-1 text-label-sm uppercase tracking-wider text-tertiary">
            Security Block
          </span>

          <h2 className="mt-4 text-headline-lg font-bold text-on-surface">
            Access Denied
          </h2>

          <p className="mt-2 text-body-md text-on-surface-variant">
            You do not have permission to view this section. Please contact your
            administrator.
          </p>
        </div>

        <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-label-md font-medium text-on-primary transition hover:opacity-90 active:scale-95">
          <ShieldAlert className="h-5 w-5" />
          Request Access
        </button>
      </div>
    </ErrorCard>
  );
}