import { getFAQs, FAQ } from "./faqs";

export async function searchFAQs(
  customerMessage: string
) {
  const faqs = await getFAQs();

  const messageWords = customerMessage
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter(Boolean);

  console.log("Customer Message:", customerMessage);
  console.log("Message Words:", messageWords);

  return faqs.filter((faq) => {
    const questionWords = faq.question
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter(Boolean);

    const matches = questionWords.filter((word) =>
      messageWords.includes(word)
    );

    console.log("----------------");
    console.log("FAQ:", faq.question);
    console.log("Question Words:", questionWords);
    console.log("Matches:", matches);

    return matches.length >= 2;
  });
}