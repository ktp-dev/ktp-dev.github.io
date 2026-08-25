'use client'

import { useState } from 'react'
import { addAdmin, removeAdmin } from '@/app/admin/actions'
import { BrotherTypeahead } from '@/components/admin/BrotherTypeahead'
import {
  adminBodyClass,
  adminFieldClass,
  adminFieldEditStyle,
  adminHeadingClass,
  adminMutedClass,
  adminPrimaryBtnClass,
  adminSectionCardClass,
  adminSectionCardStyle,
  adminTableRowClass,
  adminTableWrapClass,
} from '@/components/admin/admin-ui'
import type { ClientAdmin } from '@/lib/admins'

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
    <div className={`${adminSectionCardClass} flex h-full flex-col`} style={adminSectionCardStyle}>
      <div className="mb-4 flex min-h-10 flex-wrap items-center justify-between gap-3">
        <h2 className={`text-xl font-bold font-inter ${adminHeadingClass}`}>Admins</h2>
        <form onSubmit={(event) => void handleAdd(event)} className="flex min-w-0 items-center gap-2">
          <div className="w-40 sm:w-56">
            <BrotherTypeahead
              className={adminFieldClass}
              style={adminFieldEditStyle}
              placeholder="uniqname"
              value={email}
              onChange={setEmail}
              required
            />
          </div>
          <button type="submit" className={`${adminPrimaryBtnClass} shrink-0`} disabled={isAdding}>
            {isAdding ? 'Adding…' : 'Add admin'}
          </button>
        </form>
      </div>

      <div className={`max-h-64 overflow-y-auto ${adminTableWrapClass}`}>
        {admins.length === 0 ? (
          <p className={`px-4 py-3 text-sm ${adminMutedClass}`}>No admins yet.</p>
        ) : (
          <ul>
            {admins.map((admin) => {
              const isSelf = admin.email === self
              const isLast = admins.length <= 1
              const removing = pendingEmail === admin.email
              const name = [admin.first_name, admin.last_name].filter(Boolean).join(' ').trim()
              return (
                <li
                  key={admin.email}
                  className={`flex items-center justify-between gap-3 px-4 py-3 first:border-t-0 ${adminTableRowClass}`}
                >
                  <div className="min-w-0">
                    <p className={`truncate text-sm font-medium ${adminBodyClass}`}>
                      {name || admin.email}
                      {isSelf ? <span className={`ml-2 text-xs font-normal ${adminMutedClass}`}>You</span> : null}
                    </p>
                    {name ? <p className={`truncate text-xs ${adminMutedClass}`}>{admin.email}</p> : null}
                  </div>
                  <button
                    type="button"
                    onClick={() => void handleRemove(admin.email)}
                    disabled={isSelf || isLast || Boolean(pendingEmail)}
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all duration-200 ${
                      isSelf || isLast
                        ? 'cursor-not-allowed text-slate-600'
                        : 'cursor-pointer text-slate-400 hover:scale-110 hover:bg-red-500/10 hover:text-red-300'
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

      {error ? <p className="mt-3 text-sm text-red-300">{error}</p> : null}
    </div>
  )
}
