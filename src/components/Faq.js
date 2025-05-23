import React, { useState } from "react";

const faqs = [
  {
    question: "What is PRAMOOL.COM?",
    answer:
      "PRAMOOL.COM is a Thai online auction website offering free auction and classified services.",
  },
  {
    question: "How do I participate in an auction?",
    answer:
      "To participate, create an account and start bidding on your desired items listed by other users.",
  },
  {
    question: "Is there a fee for posting listings?",
    answer:
      "No, it's completely free to post auction and classified listings on PRAMOOL.COM.",
  },
  {
    question: "How do I contact the webmaster?",
    answer:
      "You can contact the webmaster via the link at the top right of the site or through the contact form.",
  },
];

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-orange-50 text-gray-800 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-orange-600 mb-8">
          Frequently Asked Questions
        </h1>

        {faqs.map((faq, index) => (
          <div key={index} className="mb-4 border rounded-lg overflow-hidden shadow-sm bg-white">
            <button
              onClick={() => toggle(index)}
              className="w-full text-left px-6 py-4 bg-orange-100 hover:bg-orange-200 transition-colors font-medium text-lg"
            >
              {faq.question}
            </button>
            {openIndex === index && (
              <div className="px-6 py-4 bg-white text-gray-700">{faq.answer}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
