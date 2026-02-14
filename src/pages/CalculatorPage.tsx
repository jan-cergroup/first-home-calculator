import { Calculator } from '../components/Calculator'
import { InfoSection } from '../components/InfoSection'
import { FAQAccordion } from '../components/FAQAccordion'

export function CalculatorPage() {
  return (
    <>
      <div className="bg-gradient-to-br from-[#EDE5F5] via-[#E0D0F0] to-[#D4B8E8]">
        <div className="max-w-6xl mx-auto px-4 md:px-6 pt-10 pb-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              First Home Buyer Calculator
            </h1>
            <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
              Calculate how much your first home could cost and discover government grants and schemes available to you.
            </p>
          </div>
          <Calculator />
        </div>
      </div>

      <div className="bg-white">
        <div className="max-w-6xl mx-auto px-6 md:px-8 py-16 space-y-16">
          <InfoSection />
          <FAQAccordion />
        </div>
      </div>
    </>
  )
}
