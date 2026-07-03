"use client";

import Image from "next/image";

interface AvatarProps {
  src?: string;
  name?: string;
  size?: number;
}

export default function Avatar({
  src = "https://i.pravatar.cc/150?img=12",
  name = "Support Agent",
  size = 40,
}: AvatarProps) {
  return (
    <div
      className="overflow-hidden rounded-full border-2 border-primary/20"
      style={{
        width: size,
        height: size,
      }}
    >
      <Image
        src={src}
        alt={name}
        width={size}
        height={size}
        className="h-full w-full object-cover"
      />
    </div>
  );
}