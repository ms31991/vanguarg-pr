import { Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useI18n } from '../i18n/context'

const API_BASE = 'http://localhost:5098'

function formatPrice(locale, n) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(Number(n || 0))
}

export function Details() {
  const { id } = useParams()
  const { lang, t } = useI18n()

  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadProperty() {
      try {
        setLoading(true)
        setError('')

        const res = await axios.get(`${API_BASE}/api/property/${id}`)
        setProperty(res.data || null)
      } catch (err) {
        setError(t('details.failedToLoad'))
        setProperty(null)
      } finally {
        setLoading(false)
      }
    }

    if (id) loadProperty()
  }, [id])

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center text-neutral-600">
        {t('propertiesList.loading')}
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-neutral-900">
          {t('details.notFoundTitle')}
        </h1>
        <Link
          to="/properties"
          className="mt-6 inline-block text-neutral-600 underline hover:text-neutral-900"
        >
          {t('common.backToProperties')}
        </Link>
      </div>
    )
  }

  const image =
    property?.images?.[0]?.imageUrl
      ? `${API_BASE}${property.images[0].imageUrl}`
      : `https://via.placeholder.com/1200x700?text=${encodeURIComponent(t('details.noImage'))}`

  const titleDe = property?.title ?? t('propertiesList.untitled')
  const titleEn = property?.titleEn ?? null
  const title = lang === 'en' && titleEn ? titleEn : titleDe
  const location = property?.city ?? t('details.unknownLocation')
  const price = Number(property?.price ?? 0)
  const descDe = property?.description ?? ''
  const descEn = property?.descriptionEn ?? null
  const description = lang === 'en' && descEn ? descEn : descDe
  const mapQuery = location

  return (
    <div className="bg-white px-4 py-10 md:px-6 md:py-14">
      <div className="mx-auto max-w-5xl">
        <Link
          to="/properties"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-neutral-900"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {t('common.properties')}
        </Link>

        <div className="overflow-hidden rounded-3xl ring-1 ring-neutral-200">
          <img
            src={image}
            alt={title}
            className="aspect-[21/9] w-full object-cover md:aspect-[2/1]"
          />
        </div>

        <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="mt-3 text-3xl font-bold text-neutral-900 md:text-4xl">
              {title}
            </h1>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 flex items-center gap-2 text-neutral-600 hover:text-neutral-900"
            >
              <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 21s-8-4.5-8-11a8 8 0 0 1 16 0c0 6.5-8 11-8 11z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {location}
            </a>
          </div>

          <p className="text-3xl font-bold text-neutral-900 md:text-right">
            {formatPrice(lang === 'de' ? 'de-CH' : 'en-US', price)}
          </p>
        </div>

        <p className="mt-10 text-xl leading-relaxed text-neutral-700 md:text-2xl">
          {description}
        </p>

        <div className="mt-10">
          <h3 className="mb-3 text-lg font-semibold text-neutral-900">
            {t('details.location')}
          </h3>

          <div className="overflow-hidden rounded-3xl border border-neutral-200 shadow-sm">
            <iframe
              title="map"
              src={`https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`}
              className="h-[350px] w-full border-0"
              loading="lazy"
              allowFullScreen
            ></iframe>
          </div>
        </div>

        <div className="mt-10">
          <Link
            to={`/contact?propertyId=${encodeURIComponent(property.id)}`}
            className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-neutral-800"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            {t('details.schedule')}
          </Link>
        </div>
      </div>
    </div>
  )
}