import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'

export function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-6xl mx-auto h-16 flex items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" className="w-5 h-5">
            <path d="M16 3L2 15h4v12h8v-8h4v8h8V15h4L16 3z" fill="#7952B3" />
          </svg>
          <span className="text-accent-dark font-medium text-sm">
            firsthomebuyercalculator.com.au
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `text-sm transition-colors ${isActive ? 'text-accent font-semibold' : 'text-gray-600 hover:text-gray-900'}`
            }
          >
            Calculator
          </NavLink>
          <NavLink
            to="/guides"
            className={({ isActive }) =>
              `text-sm transition-colors ${isActive ? 'text-accent font-semibold' : 'text-gray-600 hover:text-gray-900'}`
            }
          >
            State Guides
          </NavLink>
          <span className="text-sm text-gray-300 cursor-default">Talk to a Broker</span>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 -mr-2 text-gray-600 hover:text-gray-900 cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `block py-2 text-sm ${isActive ? 'text-accent font-semibold' : 'text-gray-600'}`
            }
          >
            Calculator
          </NavLink>
          <NavLink
            to="/guides"
            className={({ isActive }) =>
              `block py-2 text-sm ${isActive ? 'text-accent font-semibold' : 'text-gray-600'}`
            }
          >
            State Guides
          </NavLink>
          <span className="block py-2 text-sm text-gray-300">Talk to a Broker</span>
        </div>
      )}
    </nav>
  )
}
