import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getGuideBySlug } from '../data/stateGuides'
import { NotFoundPage } from './NotFoundPage'

export function StateGuidePage() {
  const { stateSlug } = useParams<{ stateSlug: string }>()
  const guide = stateSlug ? getGuideBySlug(stateSlug) : undefined

  useEffect(() => {
    if (guide) {
      document.title = `${guide.name} First Home Buyer Guide | firsthomebuyercalculator.com.au`
    }
    return () => {
      document.title = 'First Home Buyer Calculator'
    }
  }, [guide])

  if (!guide) return <NotFoundPage />

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
        <Link to="/guides" className="hover:text-accent transition-colors">State Guides</Link>
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-gray-600">{guide.name}</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {guide.name} First Home Buyer Guide
      </h1>
      <p className="text-gray-600 text-lg mb-10 leading-relaxed">{guide.description}</p>

      {/* Placeholder content */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-10">
        <p className="text-gray-500 text-sm leading-relaxed">
          Detailed guide content for {guide.name} is coming soon. This page will cover FHOG eligibility, stamp duty rates, concession thresholds, and tips specific to buying your first home in {guide.code}.
        </p>
      </div>

      {/* CTA */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 bg-accent text-white font-semibold text-sm px-6 py-3 rounded-xl hover:bg-accent-dark transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        Use the Calculator
      </Link>
    </div>
  )
}
