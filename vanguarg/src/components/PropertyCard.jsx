import { Link } from 'react-router-dom'
import { useI18n } from '../i18n/context'

function formatPrice(locale, n) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(Number(n || 0))
}

export function PropertyCard({ property }) {
  const { lang, t } = useI18n()

  const id = property?.id ?? 0
  const titleDe = property?.title ?? t('propertiesList.untitled')
  const titleEn = property?.titleEn ?? null
  const title = lang === 'en' && titleEn ? titleEn : titleDe
  const price = Number(property?.price ?? 0)
  const descDe = property?.description ?? ''
  const descEn = property?.descriptionEn ?? null
  const description = lang === 'en' && descEn ? descEn : descDe

  const image =
    property?.image ||
    (property?.images?.[0]?.imageUrl
      ? `http://localhost:5098${property.images[0].imageUrl}`
      : `https://via.placeholder.com/800x600?text=${encodeURIComponent(t('details.noImage'))}`)

  const location = property?.location ?? property?.city ?? t('details.unknownLocation')

  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-neutral-200/80 transition hover:shadow-lg">
      <Link to={`/property/${id}`} className="relative block aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </Link>

      <div className="flex flex-1 flex-col p-5 text-left">
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mb-1 flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900"
        >
          <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 21s-8-4.5-8-11a8 8 0 0 1 16 0c0 6.5-8 11-8 11z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {location}
        </a>

        <Link to={`/property/${id}`}>
          <h3 className="text-lg font-semibold text-neutral-900 transition group-hover:text-neutral-700">
            {title}
          </h3>
        </Link>

        <p className="mt-3 text-sm leading-relaxed text-neutral-600 line-clamp-2">
          {description}
        </p>

        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="text-xl font-bold text-neutral-900">{formatPrice(lang === 'de' ? 'de-CH' : 'en-US', price)}</p>
          <Link
            to={`/contact?propertyId=${encodeURIComponent(id)}`}
            className="inline-flex items-center justify-center rounded-full bg-neutral-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-neutral-800"
          >
            {t('common.contact')}
          </Link>
        </div>
      </div>
    </article>
  )
}