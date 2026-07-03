"use client";

import Image from "next/image";
import { Bot, Search } from "lucide-react";

export default function BroadcastHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-gray-200 bg-white shadow-sm">
      <div className="flex h-full items-center justify-between px-6 lg:px-8">

        {/* Left */}
        <div className="flex items-center gap-3">

          <Bot className="h-8 w-8 text-blue-600" />

          <h1 className="text-2xl font-bold text-gray-900">
            Email FAQ Help Bot
          </h1>

        </div>

        {/* Right */}
        <div className="flex items-center gap-4">

          {/* Search */}
          <div className="hidden items-center rounded-full border border-gray-300 bg-gray-50 px-4 py-2 md:flex">

            <Search className="mr-2 h-5 w-5 text-gray-500" />

            <input
              type="text"
              placeholder="Search broadcasts..."
              className="w-72 bg-transparent outline-none"
            />

          </div>

          {/* Avatar */}
          <div className="overflow-hidden rounded-full border border-gray-200">

            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_D6BaV-ixNXVrBmvGkzqUpnbtOa_MTl9vlhAZPwd-umnbgoFj2ze1S2ldxSrQyg9HcJb6rwKQl-OMkt1xVh2lWuc4vKk-HaX0kJ5BmGcD36__YomiRYdni6KdJ84mVhzh8HgdMWLXXJxLCQakVzwO8CeE5CeUH8hczdIht2WNsKvyTLA_K8Ggowa9W92YOLIF9YCCp96MMML6vf684BunnAYmUVu_tJ6H80Y5qUKcyETs1SDWP-jBsvROXpaaSzQj6Sq0GS8t8WE"
              alt="Support Agent"
              width={40}
              height={40}
              className="h-10 w-10 object-cover"
            />

          </div>

        </div>

      </div>
    </header>
  );
}