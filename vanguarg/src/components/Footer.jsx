import { Link } from 'react-router-dom'
import { useI18n } from '../i18n/context'

export function Footer() {
  const { t } = useI18n()
  return (
    <footer className="border-t border-neutral-200 bg-neutral-50">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="font-semibold tracking-wide text-neutral-900">VANGUARG LIVING GMBH
</p>
            <p className="mt-2 max-w-sm text-sm text-neutral-600">
              {t('footer.blurb')}
            </p>
          </div>
          <div className="flex flex-wrap gap-8 text-sm">
            <div className="flex flex-col gap-2">
              <span className="font-medium text-neutral-900">{t('common.explore')}</span>
              <Link className="text-neutral-600 hover:text-neutral-900" to="/properties">
                {t('common.properties')}
              </Link>
              <Link className="text-neutral-600 hover:text-neutral-900" to="/about">
                {t('common.about')}
              </Link>
            </div>
            
          </div>
        </div>
        <p className="mt-10 text-center text-xs text-neutral-500 md:text-left">
          {t('footer.copyright', { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  )
}
