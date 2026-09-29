import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useI18n } from '../i18n/context'
import axios from 'axios'

const API_BASE = 'http://localhost:5098' // ndryshoje
export function Register() {
  const { t } = useI18n()
  const navigate = useNavigate()

  const [fullName, setFullName] = useState('')
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

      // 🔥 REGISTER
      const registerRes = await axios.post(`${API_BASE}/api/Auth/register`, {
        fullName,
        email,
        password,
        role: 'User' // ⚠️ nese do admin direkt (per test)
      })

      setSuccess(registerRes.data?.message || t('auth.registeredSuccessfully'))

      // 🔥 AUTO LOGIN (shumë e rëndësishme)
      const loginRes = await axios.post(`${API_BASE}/api/Auth/login`, {
        email,
        password
      })

      const token = loginRes.data?.token

      if (token) {
        localStorage.setItem('token', token)
      }

      // 🔥 REDIRECT
      setTimeout(() => {
        navigate('/secret/admin')
      }, 800)

    } catch (err) {
      console.log(err)

      // 🔥 ERROR handling i fortë
      if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          setError(err.response.data)
        } else if (err.response.data.message) {
          setError(err.response.data.message)
        } else if (Array.isArray(err.response.data)) {
          setError(err.response.data[0]?.description || t('auth.somethingWentWrong'))
        } else {
          setError(t('auth.somethingWentWrong'))
        }
      } else {
        setError(t('auth.serverError'))
      }

    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[70vh] bg-neutral-50 px-4 py-12 md:px-6 md:py-16">
      <div className="mx-auto max-w-md rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm md:p-10">
        
        <h1 className="text-center text-2xl font-bold text-neutral-900">
          {t('auth.registerTitle')}
        </h1>

        {/* 🔴 ERROR */}
        {error && (
          <div className="mt-6 rounded-xl bg-red-100 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* 🟢 SUCCESS */}
        {success && (
          <div className="mt-6 rounded-xl bg-green-100 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        )}

        <form className="mt-8 flex flex-col gap-4" onSubmit={handleSubmit}>
          
          <input
            type="text"
            placeholder={t('contact.name')}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="rounded-xl border border-neutral-200 px-4 py-3"
            required
          />

          <input
            type="email"
            placeholder={t('contact.email')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-xl border border-neutral-200 px-4 py-3"
            required
          />

          <input
            type="password"
            placeholder={t('auth.password')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-xl border border-neutral-200 px-4 py-3"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-black py-3 text-white"
          >
            {loading ? t('auth.loading') : t('common.register')}
          </button>
        </form>

        <p className="mt-6 text-center text-sm">
          {t('auth.already')}{' '}
          <Link to="/secret/login" className="underline">
            {t('common.login')}
          </Link>
        </p>

      </div>
    </div>
  )
}