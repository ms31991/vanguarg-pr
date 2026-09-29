import { useEffect, useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { PhoneInput } from 'react-international-phone'
import 'react-international-phone/style.css'
import { useI18n } from '../i18n/context'

const API_BASE = 'http://localhost:5098'

export function Contact() {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [property, setProperty] = useState(null)
  const [contactMethod, setContactMethod] = useState('email')
  const [phone, setPhone] = useState('')
  const { lang, t } = useI18n()
  const [params] = useSearchParams()
  const propertyId = params.get('propertyId')
  const navigate = useNavigate()

  useEffect(() => {
    async function loadProperty() {
      if (!propertyId) {
        setProperty(null)
        return
      }

      try {
        setLoading(true)
        const res = await axios.get(`${API_BASE}/api/property/${propertyId}`)
        setProperty(res.data || null)
      } catch (err) {
        setProperty(null)
      } finally {
        setLoading(false)
      }
    }

    loadProperty()
  }, [propertyId])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!property) return

    const form = new FormData(e.currentTarget)

    const payload = {
      propertyId: property.id,
      propertyTitle: lang === 'en' && property.titleEn ? property.titleEn : property.title,
      name: String(form.get('name') ?? ''),
      contactMethod,
      email: contactMethod === 'email' ? String(form.get('email') ?? '') : null,
      phone: contactMethod === 'phone' ? phone : null,
      message: String(form.get('message') ?? ''),
    }

    try {
      setSubmitting(true)
      await axios.post(`${API_BASE}/api/leads`, payload)
      setSent(true)
      setTimeout(() => {
        navigate('/properties')
      }, 2500)
    } catch (err) {
      console.log('FULL ERROR:', err.response?.data)
      alert(err.response?.data?.message || err.response?.data || t('contact.failedToSend'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-[70vh] bg-white px-4 py-12 font-[Inter,system-ui,sans-serif] md:px-6 md:py-16">
      <div className="mx-auto max-w-lg">
        <h1 className="text-center text-3xl font-bold text-neutral-900">
          {t('contact.title')}
        </h1>

        <p className="mt-3 text-center text-neutral-600">
          {t('contact.subtitle')}
        </p>

        {!propertyId && (
          <div className="mt-10 rounded-2xl border border-neutral-200 bg-neutral-50 p-6 text-center">
            <p className="text-sm text-neutral-700">{t('contact.selectPropertyFirst')}</p>
            <Link
              to="/properties"
              className="mt-4 inline-block text-sm font-medium text-neutral-900 underline"
            >
              {t('properties.title')}
            </Link>
          </div>
        )}

        {propertyId && loading && (
          <div className="mt-10 rounded-2xl border border-neutral-200 bg-neutral-50 p-6 text-center text-sm text-neutral-700">
            {t('contact.loadingProperty')}
          </div>
        )}

        {propertyId && !loading && !property && (
          <div className="mt-10 rounded-2xl border border-neutral-200 bg-neutral-50 p-6 text-center">
            <p className="text-sm text-neutral-700">{t('contact.propertyNotFound')}</p>
            <Link
              to="/properties"
              className="mt-4 inline-block text-sm font-medium text-neutral-900 underline"
            >
              {t('properties.title')}
            </Link>
          </div>
        )}

        {property && !sent && (
          <div className="mt-8 rounded-2xl border border-neutral-200 bg-neutral-50 p-5 text-left">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
              {t('contact.propertyLabel')}
            </p>
            <p className="mt-1 text-base font-semibold text-neutral-900">
              {property.title}
            </p>
            <p className="mt-1 text-sm text-neutral-600">
              {property.city}
            </p>
          </div>
        )}

        {sent ? (
          <div className="mt-10 flex flex-col items-center gap-4 rounded-2xl bg-emerald-50 px-6 py-10 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
              <svg className="h-7 w-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-lg font-semibold text-emerald-900">
              {t('contact.thanks')}
            </p>
          </div>
        ) : property ? (
          <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-5">
            <label className="flex flex-col gap-2 text-left text-sm font-medium text-neutral-800">
              {t('contact.name')}
              <input
                required
                name="name"
                type="text"
                className="rounded-xl border border-neutral-200 px-4 py-3 text-neutral-900 outline-none ring-neutral-900 focus:ring-2"
                placeholder={t('contact.namePh')}
              />
            </label>

            <div className="flex flex-col gap-3">
              <span className="text-left text-sm font-medium text-neutral-800">
                {t('contact.preferredContactMethod')}
              </span>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setContactMethod('email')}
                  className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                    contactMethod === 'email'
                      ? 'border-neutral-900 bg-neutral-900 text-white'
                      : 'border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-50'
                  }`}
                >
                  {t('contact.methodEmail')}
                </button>

                <button
                  type="button"
                  onClick={() => setContactMethod('phone')}
                  className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                    contactMethod === 'phone'
                      ? 'border-neutral-900 bg-neutral-900 text-white'
                      : 'border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-50'
                  }`}
                >
                  {t('contact.methodPhone')}
                </button>
              </div>
            </div>

            {contactMethod === 'email' ? (
              <label className="flex flex-col gap-2 text-left text-sm font-medium text-neutral-800">
                {t('contact.email')}
                <input
                  required
                  name="email"
                  type="email"
                  className="rounded-xl border border-neutral-200 px-4 py-3 text-neutral-900 outline-none focus:ring-2 focus:ring-neutral-900"
                  placeholder={t('contact.emailPh')}
                />
              </label>
            ) : (
              <div className="flex flex-col gap-2 text-left text-sm font-medium text-neutral-800">
                <span>{t('contact.phone')}</span>
                <div className="rounded-xl border border-neutral-200 px-2 py-2 focus-within:ring-2 focus-within:ring-neutral-900">
                  <PhoneInput
                    defaultCountry="ch"
                    value={phone}
                    onChange={(value) => setPhone(value)}
                    inputClassName="!w-full !border-0 !shadow-none !outline-none"
                    countrySelectorStyleProps={{
                      buttonClassName: '!border-0 !bg-transparent',
                    }}
                    inputStyle={{
                      width: '100%',
                      border: 'none',
                      outline: 'none',
                      boxShadow: 'none',
                      background: 'transparent',
                    }}
                  />
                </div>
              </div>
            )}

            <label className="flex flex-col gap-2 text-left text-sm font-medium text-neutral-800">
              {t('contact.message')}
              <textarea
                required
                name="message"
                rows={4}
                className="resize-none rounded-xl border border-neutral-200 px-4 py-3 text-neutral-900 outline-none focus:ring-2 focus:ring-neutral-900"
                placeholder={t('contact.messagePh')}
              />
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-neutral-900 px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-60"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden />
              {submitting ? t('contact.sending') : t('contact.send')}
            </button>
          </form>
        ) : null}
      </div>
    </div>
  )
}