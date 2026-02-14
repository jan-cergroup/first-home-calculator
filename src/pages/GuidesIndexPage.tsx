import { Link } from 'react-router-dom'
import { STATE_GUIDES } from '../data/stateGuides'

export function GuidesIndexPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-3">State Guides</h1>
      <p className="text-gray-600 mb-10 max-w-2xl">
        Every state and territory has different grants, stamp duty rules, and concessions for first home buyers. Choose your state to learn more.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {STATE_GUIDES.map((guide) => (
          <Link
            key={guide.slug}
            to={`/guides/${guide.slug}`}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-accent/20 transition-all group"
          >
            <h2 className="text-lg font-bold text-gray-900 group-hover:text-accent transition-colors mb-2">
              {guide.name}
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed">{guide.description}</p>
            <span className="inline-flex items-center gap-1 text-sm font-medium text-accent mt-4">
              Learn more
              <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
