import ErrorCard from "./ErrorCard";
import { LogIn } from "lucide-react";

export default function ErrorSessionExpired() {
  return (
    <ErrorCard>
      <div className="flex h-72 w-72 items-center justify-center rounded-2xl bg-surface-container-low">
        <img
          src="/images/errors/session-expired.png"
          alt="Session Expired"
          className="h-52 w-52 object-contain"
        />
      </div>

      <div className="flex-1 space-y-6 text-center md:text-left">
        <div>
          <span className="inline-block rounded-full bg-surface-variant/50 px-3 py-1 text-label-sm uppercase tracking-wider text-on-surface-variant">
            Timeout
          </span>

          <h2 className="mt-4 text-headline-lg font-bold text-on-surface">
            Session Expired
          </h2>

          <p className="mt-2 text-body-md text-on-surface-variant">
            For your security, your session has expired due to inactivity.
            Please sign in again to continue.
          </p>
        </div>

        <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-label-md font-medium text-on-primary shadow-sm transition hover:opacity-90 active:scale-95">
          <LogIn className="h-5 w-5" />
          Sign In Again
        </button>
      </div>
    </ErrorCard>
  );
}