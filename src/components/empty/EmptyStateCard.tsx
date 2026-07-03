"use client";

import Image from "next/image";
import { ReactNode } from "react";

interface EmptyStateCardProps {
  image: string;
  imageAlt: string;
  title: string;
  description: string;
  buttonText: string;
  onClick?: () => void;
  imageContainerClassName?: string;
  children?: ReactNode;
}

export default function EmptyStateCard({
  image,
  imageAlt,
  title,
  description,
  buttonText,
  onClick,
  imageContainerClassName = "rounded-full bg-surface-container",
  children,
}: EmptyStateCardProps) {
  return (
    <section className="rounded-xl border border-outline-variant bg-surface-container-lowest p-xl shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex flex-col items-center text-center">
        {/* Illustration */}
        <div
          className={`relative mb-md flex h-48 w-48 items-center justify-center overflow-hidden ${imageContainerClassName}`}
        >
          {children}

          <Image
            src={image}
            alt={imageAlt}
            width={140}
            height={140}
            className="relative z-10 object-contain"
          />
        </div>

        {/* Title */}
        <h2 className="mb-sm text-headline-md font-semibold text-on-surface">
          {title}
        </h2>

        {/* Description */}
        <p className="mb-lg max-w-md text-body-md text-on-surface-variant">
          {description}
        </p>

        {/* Button */}
        <button
          onClick={onClick}
          className="rounded-lg bg-primary px-lg py-3 text-label-md text-on-primary shadow-md transition-all hover:bg-primary-container active:scale-95"
        >
          {buttonText}
        </button>
      </div>
    </section>
  );
}