import {
  Home,
  Ticket,
  CircleHelp,
  BarChart3,
} from "lucide-react";

export default function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 flex w-full justify-around border-t bg-white py-3 md:hidden">
      <button className="flex flex-col items-center text-blue-700">
        <Home size={20} />
        <span className="text-xs">Home</span>
      </button>

      <button className="flex flex-col items-center">
        <Ticket size={20} />
        <span className="text-xs">Tickets</span>
      </button>

      <button className="flex flex-col items-center">
        <CircleHelp size={20} />
        <span className="text-xs">FAQs</span>
      </button>

      <button className="flex flex-col items-center">
        <BarChart3 size={20} />
        <span className="text-xs">Stats</span>
      </button>
    </nav>
  );
}