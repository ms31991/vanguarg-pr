import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { PropertyCard } from '../components/PropertyCard'
import { useI18n } from '../i18n/context'

const API_BASE = 'http://localhost:5098'

export function Properties() {
  const { t } = useI18n()
  const [rawProperties, setRawProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadProperties() {
      try {
        setLoading(true)
        setError('')

        const res = await axios.get(`${API_BASE}/api/property`)
        setRawProperties(Array.isArray(res.data) ? res.data : [])
      } catch (err) {
        setError(err.response?.data?.message || t('propertiesList.failedToLoad'))
      } finally {
        setLoading(false)
      }
    }

    loadProperties()
  }, [])

  const properties = useMemo(() => {
    return rawProperties.map((p) => {
      const images = Array.isArray(p.images) ? p.images : []
      const firstImage = images[0]?.imageUrl
        ? `${API_BASE}${images[0].imageUrl}`
        : '/placeholder-property.jpg'

      return {
        ...p,
        id: p.id ?? 0,
        title: p.title ?? t('propertiesList.untitled'),
        titleEn: p.titleEn ?? null,
        description: p.description ?? '',
        descriptionEn: p.descriptionEn ?? null,
        city: p.city ?? '',
        price: Number(p.price ?? 0),
        images,
        image: firstImage,
      }
    })
  }, [rawProperties])

  return (
    <div className="min-h-[60vh] bg-white px-4 py-10 font-[Inter,system-ui,sans-serif] md:px-6 md:py-14">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-center text-3xl font-bold text-neutral-900 md:text-4xl">
          {t('properties.title')}
        </h1>

        <p className="mx-auto mt-3 max-w-2xl text-center text-neutral-600">
          {t('properties.subtitle')}
        </p>

        {loading ? (
          <div className="mt-12 text-center text-neutral-600">{t('propertiesList.loading')}</div>
        ) : error ? (
          <div className="mt-12 text-center text-red-600">{error}</div>
        ) : properties.length === 0 ? (
          <div className="mt-12 text-center text-neutral-600">
            {t('propertiesList.empty')}
          </div>
        ) : (
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}