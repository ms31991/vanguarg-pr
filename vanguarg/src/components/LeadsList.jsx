import { useEffect, useState } from 'react'
import axios from 'axios'
import { useI18n } from '../i18n/context'

export function LeadsList({ apiBase }) {
  const { t } = useI18n()
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  useEffect(() => {
    async function loadLeads() {
      try {
        setLoading(true)
        const res = await axios.get(`${apiBase}/api/leads`)
        setLeads(res.data || [])
      } catch (err) {
        setLeads([])
      } finally {
        setLoading(false)
      }
    }

    loadLeads()
  }, [apiBase])

  async function handleMarkAsRead(id) {
    try {
      await axios.put(`${apiBase}/api/leads/${id}/read`)
      setLeads((prev) =>
        prev.map((l) => (l.id === id ? { ...l, isRead: true } : l))
      )
    } catch (err) {
      alert(t('leads.failedMarkRead'))
    }
  }

  async function handleDeleteConfirm() {
    try {
      await axios.delete(`${apiBase}/api/leads/${deleteId}`)
      setLeads((prev) => prev.filter((l) => l.id !== deleteId))
      setDeleteId(null)
    } catch (err) {
      alert(t('leads.failedDelete'))
      setDeleteId(null)
    }
  }

  if (loading) {
    return (
      <div className="mt-8 rounded-2xl border border-neutral-200 bg-white px-4 py-10 text-center text-neutral-600">
        {t('leads.loading')}
      </div>
    )
  }

  if (leads.length === 0) {
    return (
      <div className="mt-8 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-10 text-center text-neutral-600">
        {t('leads.empty')}
      </div>
    )
  }

  return (
    <>
      {/* Delete Confirmation Modal */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-neutral-900">{t('leads.deleteLeadTitle')}</h2>
            <p className="mt-2 text-sm text-neutral-600">
              {t('leads.deleteLeadBody')}
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50"
              >
                {t('leads.cancel')}
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                {t('leads.delete')}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 grid gap-4">
        {leads.map((lead) => (
          <div
            key={lead.id}
            className={`rounded-2xl border p-5 shadow-sm transition ${
              lead.isRead
                ? 'border-neutral-200 bg-white'
                : 'border-emerald-200 bg-emerald-50'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-neutral-500">
                  {new Date(lead.createdAt).toLocaleString()}
                </p>
                <h3 className="mt-1 text-lg font-semibold text-neutral-900">
                  {lead.propertyTitle}
                </h3>
              </div>
              {!lead.isRead && (
                <span className="mt-1 shrink-0 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                  {t('leads.new')}
                </span>
              )}
            </div>

            <p className="mt-3 text-sm text-neutral-700">
              <strong>{t('leads.name')}:</strong> {lead.name}
            </p>

            <p className="mt-1 text-sm text-neutral-700">
              <strong>{t('leads.contactMethod')}:</strong> {lead.contactMethod}
            </p>

            {lead.email ? (
              <p className="mt-1 text-sm text-neutral-700">
                <strong>{t('leads.email')}:</strong> {lead.email}
              </p>
            ) : null}

            {lead.phone ? (
              <p className="mt-1 text-sm text-neutral-700">
                <strong>{t('leads.phone')}:</strong> {lead.phone}
              </p>
            ) : null}

            <p className="mt-3 text-sm text-neutral-700">
              <strong>{t('leads.message')}:</strong> {lead.message}
            </p>

            <div className="mt-4 flex gap-2">
              {!lead.isRead && (
                <button
                  onClick={() => handleMarkAsRead(lead.id)}
                  className="rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
                >
                  {t('leads.markAsRead')}
                </button>
              )}
              <button
                onClick={() => setDeleteId(lead.id)}
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
              >
                {t('leads.delete')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}