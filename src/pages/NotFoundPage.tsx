import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-24 text-center">
      <h1 className="text-6xl font-bold text-gray-200 mb-4">404</h1>
      <p className="text-lg text-gray-600 mb-8">Page not found</p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 bg-accent text-white font-semibold text-sm px-6 py-3 rounded-xl hover:bg-accent-dark transition-colors"
      >
        Back to Calculator
      </Link>
    </div>
  )
}
