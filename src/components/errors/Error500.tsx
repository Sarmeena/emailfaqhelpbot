import ErrorCard from "./ErrorCard";
import { RefreshCw } from "lucide-react";

export default function Error500() {
  return (
    <ErrorCard reverse>
      <div className="flex h-72 w-72 items-center justify-center rounded-2xl bg-surface-container-low">
        <img
          src="/images/errors/500.png"
          alt="500 Server Error"
          className="h-52 w-52 object-contain"
        />
      </div>

      <div className="flex-1 space-y-6 text-center md:text-left">
        <div>
          <span className="inline-block rounded-full bg-error-container/40 px-3 py-1 text-label-sm uppercase tracking-wider text-error">
            Code 500
          </span>

          <h2 className="mt-4 text-headline-lg font-bold text-on-surface">
            Something went wrong
          </h2>

          <p className="mt-2 text-body-md text-on-surface-variant">
            Our servers are having a moment. We are working on a fix right now.
          </p>
        </div>

        <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-label-md font-medium text-on-primary transition hover:opacity-90 active:scale-95">
          <RefreshCw className="h-5 w-5" />
          Retry Request
        </button>
      </div>
    </ErrorCard>
  );
}