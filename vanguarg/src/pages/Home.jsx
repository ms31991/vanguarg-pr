import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useI18n } from '../i18n/context'
const heroImage =
  'hero-background.avif'

const avatars = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop',
]

export function Home() {
  const { hash } = useLocation()
  const { t } = useI18n()
  useEffect(() => {
    if (!hash) return
    const id = hash.replace('#', '')
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }, [hash])

  return (
    <div className="font-[Inter,system-ui,sans-serif] antialiased">
      <section className="px-4 pb-8 pt-2 md:px-6 md:pb-12 md:pt-4">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] md:rounded-[2.5rem]">
          <div
            className="min-h-[520px] bg-cover bg-center md:min-h-[620px]"
            style={{ backgroundImage: `url(${heroImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-slate-900/75 to-blue-950/50" />

          <div className="absolute inset-0 flex flex-col justify-between p-6 text-left text-white md:p-10 lg:p-14">
            <div className="max-w-2xl">
              <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
                {t('home.heroTitle')}
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/85 md:text-base">
                {t('home.heroBody')}
              </p>
              <Link
                to="/properties"
                className="mt-8 inline-flex items-center gap-3 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-neutral-900 shadow-lg transition hover:bg-neutral-100 md:text-base"
              >
                {t('home.exploreCta')}
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-900 text-white">
                  <ArrowRightIcon />
                </span>
              </Link>
            </div>
             

            <div className="mt-10 flex flex-col gap-8 lg:mt-0 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex flex-wrap gap-8 md:gap-14">
                <Stat value="200+" label={t('home.statsProjects')} />
                <Stat value="70+" label={t('home.statsClients')} />
                <Stat value="$10M+" label={t('home.statsValue')} />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
                <div className="flex -space-x-3">
                  {avatars.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt=""
                      className="h-11 w-11 rounded-full border-2 border-white/80 object-cover ring-2 ring-slate-900/20"
                    />
                  ))}
                </div>
                <div>
                  <p className="text-sm font-medium">{t('home.joined')}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <Stars />
                    <span className="text-sm text-white/90">4.7/5</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="scroll-mt-24 px-4 py-16 md:px-6">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center text-2xl font-bold text-neutral-900 md:text-3xl">{t('home.servicesTitle')}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-neutral-600">
            {t('home.servicesBody')}
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <ServiceCard
              title={t('home.serviceBuyTitle')}
              desc={t('home.serviceBuyBody')}
            />
            <ServiceCard
              title={t('home.serviceSellTitle')}
              desc={t('home.serviceSellBody')}
            />
            <ServiceCard
              title={t('home.serviceInvestTitle')}
              desc={t('home.serviceInvestBody')}
            />
          </div>
        </div>
      </section>
      <section className="bg-neutral-50 px-4 py-16 md:px-6">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="text-2xl font-bold text-neutral-900 md:text-3xl">{t('home.readyTitle')}</h2>
          <p className="mx-auto mt-3 max-w-xl text-neutral-600">
            {t('home.readyBody')}
          </p>
          <Link
            to="/properties"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-neutral-900 px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-neutral-800"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden />
            {t('home.exploreCta')}
          </Link>
        </div>
      </section>
    </div>
  )
}

function Stat({ value, label }) {
  return (
    <div>
      <p className="text-2xl font-bold md:text-3xl">{value}</p>
      <p className="text-sm text-white/75">{label}</p>
    </div>
  )
}

function Stars({ rating = 4.7 }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => {
        if (i <= Math.floor(rating)) {
          // FULL STAR
          return (
            <svg key={i} className="h-4 w-4 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          )
        } else if (i === Math.floor(rating) + 1 && rating % 1 !== 0) {
          // HALF STAR
          return (
            <svg key={i} className="h-4 w-4" viewBox="0 0 24 24">
              <defs>
                <linearGradient id={`halfGrad-${i}`}>
                  <stop offset="50%" stopColor="#f59e0b" />
                  <stop offset="50%" stopColor="#d1d5db" />
                </linearGradient>
              </defs>
              <path
                fill={`url(#halfGrad-${i})`}
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              />
            </svg>
          )
        } else {
          // EMPTY STAR
          return (
            <svg key={i} className="h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          )
        }
      })}
    </div>
  )
}
function ArrowRightIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ServiceCard({ title, desc }) {
  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-8 text-left shadow-sm transition hover:shadow-md">
      <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-neutral-600">{desc}</p>
    </div>
  )
}
