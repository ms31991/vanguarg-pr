import { useMemo, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useI18n } from '../i18n/context'

const navClass = ({ isActive }) =>
  `text-sm font-medium transition ${isActive ? 'text-neutral-900' : 'text-neutral-500 hover:text-neutral-800'}`

export function Navbar() {
  const [open, setOpen] = useState(false)
  const { lang, setLang, t } = useI18n()
  const navigate = useNavigate()

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null')
    } catch {
      return null
    }
  }, [])

  const token = localStorage.getItem('token')
  const isLoggedIn = !!token
  const isAdmin = user?.roles?.includes('Admin')

  const links = [
    { to: '/', label: t('nav.home'), end: true },
    { to: '/#services', label: t('nav.services'), hash: true },
    { to: '/properties', label: t('nav.properties') },
    { to: '/about', label: t('nav.about') },
  ]

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setOpen(false)
    navigate('/secret/login')
    window.location.reload()
  }

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-100 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-6">
        <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-900 text-white">
            <HouseIcon className="h-5 w-5" />
          </span>
          <span className="font-semibold tracking-wide text-neutral-900">VANGUARG LIVING GMBH</span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {links.map(({ to, label, end, hash }) =>
            hash ? (
              <Link
                key={label}
                to={to}
                className="text-sm font-medium text-neutral-500 transition hover:text-neutral-800"
              >
                {label}
              </Link>
            ) : (
              <NavLink key={to} to={to} end={end} className={navClass}>
                {label}
              </NavLink>
            ),
          )}

          {isAdmin && (
            <NavLink to="/secret/admin/page" className={navClass}>
              {t('nav.adminPanel')}
            </NavLink>
          )}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {isLoggedIn ? (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-800 transition hover:bg-neutral-50"
            >
              {t('nav.logout')}
            </button>
          ) : (
            <>  {/*
    <Link
      to="/secret/login"
      className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-800 transition hover:bg-neutral-50"
    >
      Login
    </Link>
    <Link
      to="/secret/register"
      className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800"
    >
      Register
    </Link>
    */}
            </>
          )}

          <LanguageSwitch lang={lang} setLang={setLang} />
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-neutral-200 lg:hidden"
          aria-expanded={open}
          aria-label={open ? t('nav.closeMenu') : t('nav.openMenu')}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {open && (
        <div className="border-t border-neutral-100 bg-white px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-1">
            <div className="mb-2 flex items-center justify-between px-3">
              <span className="text-sm font-medium text-neutral-700">{t('nav.language')}</span>
              <LanguageSwitch lang={lang} setLang={setLang} />
            </div>

            {links.map(({ to, label, end, hash }) =>
              hash ? (
                <Link
                  key={label}
                  to={to}
                  className="rounded-lg px-3 py-3 text-base font-medium text-neutral-700 hover:bg-neutral-50"
                  onClick={() => setOpen(false)}
                >
                  {label}
                </Link>
              ) : (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-3 text-base font-medium ${
                      isActive ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-700 hover:bg-neutral-50'
                    }`
                  }
                  onClick={() => setOpen(false)}
                >
                  {label}
                </NavLink>
              ),
            )}

            {isAdmin && (
              <NavLink
                to="/secret/admin/page"
                className={({ isActive }) =>
                  `rounded-lg px-3 py-3 text-base font-medium ${
                    isActive ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-700 hover:bg-neutral-50'
                  }`
                }
                onClick={() => setOpen(false)}
              >
                {t('nav.adminPanel')}
              </NavLink>
            )}

            <div className="mt-3 border-t border-neutral-100 pt-3">
              
              {isLoggedIn ? (
  <button
    type="button"
    onClick={handleLogout}
    className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-800 transition hover:bg-neutral-50"
  >
    {t('nav.logout')}
  </button>
) : (
  <>
    {/*
    <Link
      to="/login"
      className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-800 transition hover:bg-neutral-50"
    >
      Login
    </Link>
    <Link
      to="/register"
      className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800"
    >
      Register
    </Link>
    */}
  </>
)}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

function LanguageSwitch({ lang, setLang }) {
  return (
    <div className="inline-flex overflow-hidden rounded-full border border-neutral-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setLang('de')}
        className={`px-3 py-2 text-xs font-semibold transition ${
          lang === 'de' ? 'bg-neutral-900 text-white' : 'text-neutral-700 hover:bg-neutral-50'
        }`}
        aria-pressed={lang === 'de'}
      >
        DE
      </button>
      <button
        type="button"
        onClick={() => setLang('en')}
        className={`px-3 py-2 text-xs font-semibold transition ${
          lang === 'en' ? 'bg-neutral-900 text-white' : 'text-neutral-700 hover:bg-neutral-50'
        }`}
        aria-pressed={lang === 'en'}
      >
        EN
      </button>
    </div>
  )
}

function HouseIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5 10.5V20h14v-9.5" />
      <path d="M9 20v-6h6v6" />
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg className="h-6 w-6 text-neutral-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg className="h-6 w-6 text-neutral-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}