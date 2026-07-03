import ErrorCard from "./ErrorCard";
import { WifiOff } from "lucide-react";

export default function ErrorNetwork() {
  return (
    <ErrorCard>
      <div className="flex h-72 w-72 items-center justify-center rounded-2xl bg-surface-container-low">
        <img
          src="/images/errors/network.png"
          alt="Network Error"
          className="h-52 w-52 object-contain"
        />
      </div>

      <div className="flex-1 space-y-6 text-center md:text-left">
        <div>
          <span className="inline-block rounded-full bg-surface-container px-3 py-1 text-label-sm uppercase tracking-wider text-outline">
            Connection Status
          </span>

          <h2 className="mt-4 text-headline-lg font-bold text-on-surface">
            Connection Lost
          </h2>

          <p className="mt-2 text-body-md text-on-surface-variant">
            Check your internet connection and try again.
          </p>
        </div>

        <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-label-md font-medium text-on-primary transition hover:opacity-90 active:scale-95">
          <WifiOff className="h-5 w-5" />
          Refresh Page
        </button>
      </div>
    </ErrorCard>
  );
}