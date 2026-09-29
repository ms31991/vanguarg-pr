import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useI18n } from '../i18n/context'
import axios from 'axios'

const API_BASE = 'http://localhost:5098' // ose https://localhost:7118 nese backend-i yt eshte ne https

export function Login() {
  const { t } = useI18n()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      setError('')
      setSuccess('')

      const res = await axios.post(`${API_BASE}/api/Auth/login`, {
        email,
        password
      })

      const token = res.data?.token
      const user = res.data?.user

      if (token) {
        localStorage.setItem('token', token)
      }

      if (user) {
        localStorage.setItem('user', JSON.stringify(user))
      }

      setSuccess(res.data?.message || t('auth.loggingInSuccess'))

      setTimeout(() => {
        navigate('/secret/admin/page')
      }, 700)
    } catch (err) {
      if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          setError(err.response.data)
        } else if (err.response.data.message) {
          setError(err.response.data.message)
        } else if (Array.isArray(err.response.data)) {
          setError(err.response.data[0]?.description || t('auth.loginFailed'))
        } else {
          setError(t('auth.loginFailed'))
        }
      } else {
        setError(t('auth.serverError'))
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[70vh] bg-neutral-50 px-4 py-12 font-[Inter,system-ui,sans-serif] md:px-6 md:py-16">
      <div className="mx-auto max-w-md rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm md:p-10">
        <h1 className="text-center text-2xl font-bold text-neutral-900">
          {t('auth.loginTitle')}
        </h1>

        <p className="mt-2 text-center text-sm text-neutral-600">
          {t('auth.loginSubtitle')}
        </p>

        {error && (
          <div className="mt-6 rounded-xl bg-red-100 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-6 rounded-xl bg-green-100 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        )}

        <form className="mt-8 flex flex-col gap-4" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-2 text-left text-sm font-medium text-neutral-800">
            {t('contact.email')}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl border border-neutral-200 px-4 py-3 outline-none focus:ring-2 focus:ring-neutral-900"
              required
            />
          </label>

          <label className="flex flex-col gap-2 text-left text-sm font-medium text-neutral-800">
            {t('auth.password')}
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-xl border border-neutral-200 px-4 py-3 outline-none focus:ring-2 focus:ring-neutral-900"
              required
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-full bg-neutral-900 py-3 text-sm font-semibold text-white hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? t('auth.loading') : t('auth.continue')}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-600">
          {t('auth.noAccount')}{' '}
          <Link className="font-medium text-neutral-900 underline" to="/secret/register">
            {t('common.register')}
          </Link>
        </p>
      </div>
    </div>
  )
}