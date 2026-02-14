import { useState, useEffect } from 'react'

interface EmailResultsModalProps {
  isOpen: boolean
  onClose: () => void
}

type ModalState = 'idle' | 'submitting' | 'success'

export function EmailResultsModal({ isOpen, onClose }: EmailResultsModalProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [modalState, setModalState] = useState<ModalState>('idle')

  // Reset all state on close
  useEffect(() => {
    if (!isOpen) {
      setName('')
      setEmail('')
      setModalState('idle')
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setModalState('submitting')
    setTimeout(() => {
      setModalState('success')
    }, 800)
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full relative shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl cursor-pointer"
        >
          &times;
        </button>

        {modalState === 'success' ? (
          <div className="text-center py-4">
            <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Check your inbox</h3>
            <p className="text-sm text-gray-500 mb-6">
              We've sent your estimate to <span className="font-medium text-gray-700">{email}</span>
            </p>
            <button
              onClick={onClose}
              className="bg-accent text-white font-semibold text-sm px-6 py-2.5 rounded-xl hover:bg-accent-dark transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Email your estimate</h3>
            <p className="text-sm text-gray-500 mb-6">Get a copy of your results sent to your inbox.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                  placeholder="you@example.com"
                />
              </div>
              <button
                type="submit"
                disabled={modalState === 'submitting'}
                className="w-full bg-accent text-white font-semibold text-sm py-2.5 rounded-xl hover:bg-accent-dark transition-colors cursor-pointer disabled:opacity-60"
              >
                {modalState === 'submitting' ? 'Sending...' : 'Send my estimate'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
