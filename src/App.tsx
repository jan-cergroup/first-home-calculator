import { Calculator } from './components/Calculator'
import { InfoSection } from './components/InfoSection'
import { FAQAccordion } from './components/FAQAccordion'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EDE5F5] via-[#E0D0F0] to-[#D4B8E8] flex flex-col">
      {/* Minimal top bar */}
      <header className="pt-6 pb-4 px-6">
        <div className="max-w-6xl mx-auto flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" className="w-5 h-5">
            <path d="M16 3L2 15h4v12h8v-8h4v8h8V15h4L16 3z" fill="#7952B3"/>
          </svg>
          <span className="text-accent-dark font-medium text-sm">
            firsthomebuyercalculator.com.au
          </span>
        </div>
      </header>

      {/* Calculator cards */}
      <main className="flex-1 w-full">
        <div className="max-w-6xl mx-auto px-4 md:px-6 pb-12">
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
      </main>

      {/* Info + FAQ on white bg */}
      <div className="bg-white">
        <div className="max-w-6xl mx-auto px-6 md:px-8 py-16 space-y-16">
          <InfoSection />
          <FAQAccordion />
        </div>
      </div>

      <footer className="bg-gray-900 text-white/60 text-sm py-8 px-6">
        <div className="max-w-6xl mx-auto text-center space-y-2">
          <p>&copy; 2025 firsthomebuyercalculator.com.au</p>
          <p>This calculator provides estimates only. Contact your state revenue office for exact figures.</p>
        </div>
      </footer>
    </div>
  )
}

export default App
