import { Calculator } from './components/Calculator'
import { InfoSection } from './components/InfoSection'
import { FAQAccordion } from './components/FAQAccordion'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero section */}
      <header className="bg-navy text-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            First Home Buyers & Owners Grant Calculator
          </h1>
          <p className="text-blue-200 text-sm md:text-base leading-relaxed max-w-3xl mx-auto">
            Looking to buy or build your first home? You may be eligible for a one-off government grant
            to help make your homeownership dream a reality. Learn how the First Home Owner Grant (FHOG)
            can help you move into your new home sooner.
          </p>
        </div>
      </header>

      {/* Calculator section */}
      <main className="max-w-5xl mx-auto px-4 -mt-6">
        <Calculator />

        {/* Info sections */}
        <div className="mt-16 space-y-16 pb-20">
          <InfoSection />
          <FAQAccordion />
        </div>
      </main>
    </div>
  )
}

export default App
