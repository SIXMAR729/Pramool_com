import React, { useState, useEffect } from "react"; // Import useEffect

export default function FaqPage() {
  const [faqs, setFaqs] = useState([]); // Initialize with an empty array
  const [openIndex, setOpenIndex] = useState(null);

  // useEffect to fetch data when the component mounts
  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        // Fetch data from your new backend endpoint
        const response = await fetch('http://localhost:3001/api/faq');
        const data = await response.json();
        setFaqs(data);
      } catch (error) {
        console.error("Failed to fetch FAQs:", error);
      }
    };

    fetchFaqs();
  }, []); // The empty dependency array [] means this effect runs once when the component mounts

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-orange-600 mb-8">
          Frequently Asked Questions
        </h1>

        {/* This part remains the same, but now it's populated with data from your API */}
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={faq.id} // Use the unique ID from the database
              className="mb-4 border rounded-lg overflow-hidden shadow-sm bg-white transition-all"
            >
              <button
                onClick={() => toggle(index)}
                className="w-full text-left px-6 py-4 bg-orange-100 hover:bg-orange-200 transition-colors font-medium text-lg"
              >
                {faq.question}
              </button>

              <div
                className={`px-6 bg-white text-gray-700 transition-all duration-300 ease-in-out overflow-hidden ${
                  isOpen ? "max-h-40 py-4" : "max-h-0 py-0"
                }`}
              >
                <div>{faq.answer}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}