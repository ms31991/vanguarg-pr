import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useI18n } from '../i18n/context'

const agents = [
  {
    name: 'Mergim',
    roleKey: 'about.agentSenior',
    img: '',
  },
 
]

export function AboutUs() {
  const { hash } = useLocation()
  const { t } = useI18n()
  useEffect(() => {
    if (!hash) return
    const id = hash.replace('#', '')
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }, [hash])

  return (
    <div className="bg-white px-4 py-12 font-[Inter,system-ui,sans-serif] md:px-6 md:py-16">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-3xl font-bold text-neutral-900 md:text-4xl">VANGUARG LIVING GMBH</h1>
        <p className="mt-6 text-left text-lg leading-relaxed text-neutral-600 md:text-center">
          {t('about.body')}
        </p>
      </div>

      <section id="agents" className="mx-auto mt-16  max-w-7xl scroll-mt-28">
        <h2 className="text-center text-2xl font-bold text-neutral-900">{t('about.agentsTitle')}</h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-neutral-600">
          {t('about.agentsBody')}
        </p>
        <div  style={{ display: 'flex', justifyContent: 'center' }} className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {agents.map((a) => (
            <div
              key={a.name}
              className="rounded-3xl border border-neutral-200 bg-neutral-50/50 p-8 text-center shadow-sm"
            >
              <img
                src={a.img}
                alt=""
                className="mx-auto h-28 w-28 rounded-full object-cover ring-4 ring-white shadow-md"
              />
              <h3 className="mt-5 text-lg font-semibold text-neutral-900">{a.name}</h3>
              <p className="mt-1 text-sm text-neutral-600">{t(a.roleKey)}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
