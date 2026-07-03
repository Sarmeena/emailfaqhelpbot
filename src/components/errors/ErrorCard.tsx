"use client";

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

interface ErrorCardProps {
  badge?: string;
  badgeClassName?: string;

  title?: string;
  description?: string;

  buttonText?: string;
  buttonIcon?: LucideIcon;

  illustration?: ReactNode;

  reverse?: boolean;

  children?: ReactNode;
}

export default function ErrorCard({
  badge,
  badgeClassName = "bg-primary-container/20 text-primary",
  title,
  description,
  buttonText,
  buttonIcon: ButtonIcon,
  illustration,
  reverse = false,
  children,
}: ErrorCardProps) {
  return (
    <section
      className={`flex flex-col items-center gap-lg rounded-xl border border-outline-variant bg-surface-container-lowest p-lg shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg ${
        reverse ? "md:flex-row-reverse" : "md:flex-row"
      }`}
    >
      {children ? (
        children
      ) : (
        <>
          {/* Illustration */}
          <div className="flex h-72 w-72 items-center justify-center rounded-xl bg-surface-container-low md:h-80 md:w-80">
            {illustration}
          </div>

          {/* Content */}
          <div className="flex-1 space-y-md text-center md:text-left">
            <div>
              {badge && (
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-label-sm font-semibold uppercase tracking-wide ${badgeClassName}`}
                >
                  {badge}
                </span>
              )}

              {title && (
                <h2 className="mt-sm text-headline-lg font-bold text-on-surface">
                  {title}
                </h2>
              )}

              {description && (
                <p className="mt-sm max-w-lg text-body-md text-on-surface-variant">
                  {description}
                </p>
              )}
            </div>

            {buttonText && ButtonIcon && (
              <button className="inline-flex min-h-12 items-center justify-center gap-sm rounded-lg bg-primary px-lg py-sm text-label-md font-semibold text-on-primary shadow-md transition hover:opacity-95 active:scale-95">
                <ButtonIcon className="h-5 w-5" />
                {buttonText}
              </button>
            )}
          </div>
        </>
      )}
    </section>
  );
}