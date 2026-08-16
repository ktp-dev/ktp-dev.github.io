'use client'

import { useState } from 'react'
import { addAdmin, removeAdmin } from '@/app/admin/actions'
import type { ClientAdmin } from '@/lib/admins'

const btnClass =
  'px-4 py-2 bg-[#315CA9] text-white rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105 hover:shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
const inputClass =
  'w-full px-3 py-2 border border-gray-300 rounded-md bg-white/80 text-sm text-gray-700 outline-none transition-[border-color,box-shadow] duration-200 ease-out focus:border-[#315CA9] focus:shadow-[0_0_0_3px_rgba(49,92,169,0.18)]'
const sectionCardClass =
  'rounded-xl border border-gray-100 p-6 transform transition-all duration-300 ease-in-out hover:shadow-[0_12px_36px_rgba(0,0,0,0.1),0_4px_12px_rgba(0,0,0,0.05)]'
const sectionCardStyle = {
  backgroundColor: 'rgba(249, 250, 251, 0.95)',
  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)',
}
const innerCardClass = 'rounded-xl border border-gray-100 bg-white/80'
const innerCardStyle = { boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)' }

export default function AdminListManager({
  currentEmail,
  initialAdmins,
}: {
  currentEmail: string
  initialAdmins: ClientAdmin[]
}) {
  const [admins, setAdmins] = useState(initialAdmins)
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [pendingEmail, setPendingEmail] = useState<string | null>(null)
  const self = currentEmail.toLowerCase()

  async function handleAdd(event: React.FormEvent) {
    event.preventDefault()
    setError(null)
    setIsAdding(true)
    const result = await addAdmin(email)
    setIsAdding(false)
    if (result.error) {
      setError(result.error)
      return
    }
    if (result.data) {
      setAdmins((current) =>
        [...current, result.data!].sort((a, b) => {
          const first = (a.first_name ?? '').localeCompare(b.first_name ?? '', undefined, { sensitivity: 'base' })
          if (first !== 0) return first
          const last = (a.last_name ?? '').localeCompare(b.last_name ?? '', undefined, { sensitivity: 'base' })
          if (last !== 0) return last
          return a.email.localeCompare(b.email)
        })
      )
    }
    setEmail('')
  }

  async function handleRemove(target: string) {
    setError(null)
    setPendingEmail(target)
    const result = await removeAdmin(target)
    setPendingEmail(null)
    if (result.error) {
      setError(result.error)
      return
    }
    setAdmins((current) => current.filter((admin) => admin.email !== target))
  }

  return (
    <div className={`${sectionCardClass} flex h-full flex-col`} style={sectionCardStyle}>
      <div className="mb-4 flex min-h-10 flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold font-inter">Admins</h2>
        <form onSubmit={(event) => void handleAdd(event)} className="flex min-w-0 items-center gap-2">
          <input
            type="email"
            className={`${inputClass} w-40 sm:w-48`}
            placeholder="uniqname@umich.edu"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <button type="submit" className={`${btnClass} shrink-0`} disabled={isAdding}>
            {isAdding ? 'Adding…' : 'Add admin'}
          </button>
        </form>
      </div>

      <div className={`${innerCardClass} overflow-hidden`} style={innerCardStyle}>
        {admins.length === 0 ? (
          <p className="px-4 py-2 text-sm text-gray-500">No admins yet.</p>
        ) : (
          <ul className="max-h-64 divide-y divide-gray-100 overflow-y-auto">
            {admins.map((admin) => {
              const isSelf = admin.email === self
              const isLast = admins.length <= 1
              const removing = pendingEmail === admin.email
              const name = [admin.first_name, admin.last_name].filter(Boolean).join(' ').trim()
              return (
                <li key={admin.email} className="flex items-center justify-between gap-3 px-4 py-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-800">
                      {name || admin.email}
                      {isSelf ? <span className="ml-2 text-xs font-normal text-gray-500">You</span> : null}
                    </p>
                    {name ? <p className="truncate text-xs text-gray-500">{admin.email}</p> : null}
                  </div>
                  <button
                    type="button"
                    onClick={() => void handleRemove(admin.email)}
                    disabled={isSelf || isLast || Boolean(pendingEmail)}
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all duration-200 ${
                      isSelf || isLast
                        ? 'cursor-not-allowed text-gray-300'
                        : 'cursor-pointer text-gray-400 hover:scale-110 hover:bg-red-50 hover:text-red-500'
                    }`}
                    title={
                      isSelf
                        ? 'You cannot remove yourself'
                        : isLast
                          ? 'Keep at least one admin'
                          : 'Remove admin'
                    }
                    aria-label={removing ? `Removing ${admin.email}` : `Remove ${admin.email}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
    </div>
  )
}
