import ErrorCard from "../../components/errors/ErrorCard";
import { LayoutDashboard } from "lucide-react";

export default function Error404() {
  return (
    <ErrorCard reverse={false}>
      <div className="flex h-72 w-72 items-center justify-center rounded-2xl bg-surface-container-low">
        <img
          src="/images/errors/404.png"
          alt="404 Not Found"
          className="h-52 w-52 object-contain"
        />
      </div>

      <div className="flex-1 space-y-6 text-center md:text-left">
        <div>
          <span className="inline-block rounded-full bg-primary-container/20 px-3 py-1 text-label-sm uppercase tracking-wider text-primary">
            Code 404
          </span>

          <h2 className="mt-4 text-headline-lg font-bold text-on-surface">
            We lost that page
          </h2>

          <p className="mt-2 text-body-md text-on-surface-variant">
            The link you followed might be broken or the page has been moved.
          </p>
        </div>

        <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-label-md font-medium text-on-primary transition hover:opacity-90 active:scale-95">
          <LayoutDashboard className="h-5 w-5" />
          Back to Dashboard
        </button>
      </div>
    </ErrorCard>
  );
}