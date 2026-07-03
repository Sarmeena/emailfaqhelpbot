export interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
  status: string;
  usage: number;
  updated: string;
}

export const faqs: FAQ[] = [
  {
    id: 1,
    question: "How do I reset my account password?",
    answer:
      "Users can reset their password through the security settings tab or via the 'Forgot Password' link on the login page.",
    category: "General",
    status: "Published",
    usage: 1245,
    updated: "Oct 24, 2023",
  },
  {
    id: 2,
    question: "Configuring custom webhooks for API v3",
    answer:
      "To enable webhooks, navigate to Developer > Webhooks and provide a valid listener URL.",
    category: "Technical",
    status: "Draft",
    usage: 0,
    updated: "Nov 02, 2023",
  },
  {
    id: 3,
    question: "Why was my payment declined?",
    answer:
      "Payments can be declined for several reasons: insufficient funds, expired cards, or incorrect billing addresses.",
    category: "Billing",
    status: "Published",
    usage: 842,
    updated: "Sep 15, 2023",
  },
];

export const categoryStyles: Record<string, string> = {
  General: "bg-primary-fixed text-on-primary-fixed-variant",

  Technical:
    "bg-secondary-fixed text-on-secondary-fixed-variant",

  Billing:
    "bg-tertiary-fixed text-on-tertiary-fixed-variant",

  Account:
    "bg-blue-100 text-blue-700",

  Password:
    "bg-purple-100 text-purple-700",

  Login:
    "bg-green-100 text-green-700",

  Payment:
    "bg-orange-100 text-orange-700",
};

export const statusStyles: Record<string, string> = {
  Published: "bg-green-100 text-green-700",

  Draft: "bg-amber-100 text-amber-700",

  Archived: "bg-gray-200 text-gray-700",
};

export const statusDot: Record<string, string> = {
  Published: "bg-green-500",

  Draft: "bg-amber-500",

  Archived: "bg-gray-500",
};