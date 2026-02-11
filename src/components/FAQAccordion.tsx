import { useState } from 'react'

interface FAQItem {
  question: string
  answer: string
}

const faqItems: FAQItem[] = [
  {
    question: "Who is eligible for the First Home Owners' Grant (FHOG)?",
    answer: "Anyone who is buying or building their first home should apply for the FHOG. Additional requirements will vary depending on the state or territory where you buy your home. Common criteria across all states are: you must be at least 18 years of age, at least one applicant must be a permanent resident or citizen, your home must be residential (not investment), you have not previously owned a home in Australia, you must be a natural person (not a trust or company), you must occupy your home within 12 months of purchase or construction, and you need to reside at your home continuously for at least 6 months.",
  },
  {
    question: "How do you apply for FHOG?",
    answer: "Start by using our calculator to check your eligibility. If eligible, you can apply directly to the government revenue office in your state or territory. When applying, you'll need to provide certain documents like proof of identity, citizenship or permanent residency and address. Other necessary documents may include: Australian birth certificate, Australian passport, foreign passport and current Australian Visa (if born overseas), Australian driver's licence or proof of age card, Medicare card, car registration, or debit/credit card, and utility bill, bank statement, or insurance policy (for evidence of residential address). If approved, you will have 90 days to buy your first home.",
  },
  {
    question: "Can you use First Home Owners' Grant as a deposit?",
    answer: "The FHOG is generally paid by the government into your mortgage loan after settlement. As such, some lenders will ask you to have the full deposit when applying for a loan. You may therefore need alternate funds to pay your deposit when you sign a contract of sale, which usually happens before settlement. Different lenders have different lending criteria.",
  },
  {
    question: "Can you get the First Home Owners' Grant when buying an established home?",
    answer: "Yes, you can use the FHOG to buy an existing home if it's been substantially renovated by the seller but has not served as a residence for the seller, builder or a tenant prior to, during or after renovations. Substantially renovated means structural or non-structural building parts have been removed or replaced. Renovations limited to a single room or cosmetic work like painting walls is not considered substantial.",
  },
]

export function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section>
      <h2 className="text-2xl font-bold text-navy mb-6">
        First Home Buyers & Owners Grant FAQs
      </h2>
      <div className="space-y-3">
        {faqItems.map((item, index) => (
          <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex justify-between items-center p-5 text-left cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <span className="font-medium text-navy pr-4">{item.question}</span>
              <svg
                className={`w-5 h-5 text-accent shrink-0 transition-transform ${
                  openIndex === index ? 'rotate-180' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openIndex === index && (
              <div className="px-5 pb-5">
                <p className="text-sm text-gray-600 leading-relaxed">{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
