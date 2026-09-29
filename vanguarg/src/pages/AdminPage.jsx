import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { LeadsList } from '../components/LeadsList'
import { useI18n } from '../i18n/context'

const API_BASE = 'http://localhost:5098' // ndryshoje

export function AdminPage() {
  const { t } = useI18n()
  const [tab, setTab] = useState('properties')
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const token = useMemo(() => localStorage.getItem('token') || '', [])

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  async function loadProperties() {
    try {
      setLoading(true)
      setError('')
      const res = await axios.get(`${API_BASE}/api/property`)
      setProperties(res.data || [])
    } catch (err) {
      setError(err.response?.data?.message || t('propertiesList.failedToLoad'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProperties()
  }, [refreshKey])

  function handleDeleteProperty(id) {
    setConfirmDelete(id)
  }

  async function confirmDeleteProperty() {
    if (!confirmDelete) return

    try {
      setError('')
      setSuccess('')
      await axios.delete(`${API_BASE}/api/property/${confirmDelete}`, authConfig)
      setSuccess(t('admin.propertyDeleted'))
      setRefreshKey((v) => v + 1)
    } catch (err) {
      setError(err.response?.data?.message || t('admin.failedToDeleteProperty'))
    } finally {
      setConfirmDelete(null)
    }
  }

  async function handleDeleteImage(propertyId, imageId) {
    try {
      setError('')
      setSuccess('')
      await axios.delete(`${API_BASE}/api/property/${propertyId}/image/${imageId}`, authConfig)
      setSuccess(t('admin.imageDeleted'))
      setRefreshKey((v) => v + 1)
    } catch (err) {
      setError(err.response?.data?.message || t('admin.failedToDeleteImage'))
    }
  }

  async function handleAddImages(propertyId, files) {
    if (!files || files.length === 0) return

    const formData = new FormData()
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i])
    }

    try {
      setError('')
      setSuccess('')
      await axios.post(`${API_BASE}/api/property/${propertyId}/images`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      setSuccess(t('admin.imagesAdded'))
      setRefreshKey((v) => v + 1)
    } catch (err) {
      setError(err.response?.data?.message || t('admin.failedToAddImages'))
    }
  }

  return (
    <>
      <div className="min-h-screen bg-neutral-50 px-4 py-8 font-[Inter,system-ui,sans-serif] md:px-6 md:py-10">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl bg-white p-6 shadow-sm md:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-neutral-900">{t('admin.title')}</h1>
                <p className="mt-2 text-neutral-600">
                  {t('admin.subtitle')}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <TabButton active={tab === 'properties'} onClick={() => setTab('properties')}>
                  {t('admin.tabProperties')}
                </TabButton>
                <TabButton active={tab === 'add'} onClick={() => setTab('add')}>
                  {t('admin.tabAdd')}
                </TabButton>
                <TabButton active={tab === 'leads'} onClick={() => setTab('leads')}>
                  {t('admin.tabLeads')}
                </TabButton>
              </div>
            </div>

            {(error || success) && (
              <div className="mt-6 space-y-3">
                {error ? (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                ) : null}
                {success ? (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    {success}
                  </div>
                ) : null}
              </div>
            )}

            {tab === 'properties' && (
              <div className="mt-8">
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-neutral-900">{t('admin.allProperties')}</h2>
                  <button
                    type="button"
                    className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-800 hover:bg-neutral-50"
                    onClick={() => setRefreshKey((v) => v + 1)}
                  >
                    {t('admin.refresh')}
                  </button>
                </div>

                {loading ? (
                  <div className="rounded-2xl border border-neutral-200 bg-white px-4 py-10 text-center text-neutral-600">
                    {t('propertiesList.loading')}
                  </div>
                ) : properties.length === 0 ? (
                  <div className="rounded-2xl border border-neutral-200 bg-white px-4 py-10 text-center text-neutral-600">
                    {t('propertiesList.empty')}
                  </div>
                ) : (
                  <div className="grid gap-6">
                    {properties.map((property) => (
                      <PropertyCard
                        key={property.id}
                        property={property}
                        apiBase={API_BASE}
                        onDelete={() => handleDeleteProperty(property.id)}
                        onDeleteImage={(imageId) => handleDeleteImage(property.id, imageId)}
                        onAddImages={(files) => handleAddImages(property.id, files)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {tab === 'add' && (
              <div className="mt-8">
                <h2 className="mb-5 text-xl font-semibold text-neutral-900">{t('admin.addNewProperty')}</h2>
                <AddPropertyForm
                  apiBase={API_BASE}
                  token={token}
                  onSuccess={(msg) => {
                    setSuccess(msg || t('admin.propertyAdded'))
                    setError('')
                    setTab('properties')
                    setRefreshKey((v) => v + 1)
                  }}
                  onError={(msg) => {
                    setError(msg || t('admin.failedToAddProperty'))
                    setSuccess('')
                  }}
                />
              </div>
            )}

           {tab === 'leads' && <LeadsList apiBase={API_BASE} />}
          </div>
        </div>
      </div>

      {confirmDelete !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-neutral-900">{t('admin.confirmDeleteTitle')}</h2>
            <p className="mt-2 text-sm text-neutral-600">
              {t('admin.confirmDeleteBody')}
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50"
              >
                {t('admin.cancel')}
              </button>
              <button
                onClick={confirmDeleteProperty}
                className="flex-1 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                {t('admin.delete')}
              </button>
            </div>
          </div>
        </div>
      )}



</>
  )
}

function TabButton({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
        active
          ? 'bg-neutral-900 text-white'
          : 'border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'
      }`}
    >
      {children}
    </button>
  )
}

function AddPropertyForm({ apiBase, token, onSuccess, onError }) {
  const { t } = useI18n()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [titleEn, setTitleEn] = useState('')
  const [descriptionEn, setDescriptionEn] = useState('')
  const [price, setPrice] = useState('')
  const [city, setCity] = useState('')
  const [images, setImages] = useState([])
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()

    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    if (titleEn.trim()) formData.append('titleEn', titleEn)
    if (descriptionEn.trim()) formData.append('descriptionEn', descriptionEn)
    formData.append('price', price)
    formData.append('city', city)

    for (let i = 0; i < images.length; i++) {
      formData.append('images', images[i])
    }

    try {
      setSubmitting(true)

      await axios.post(`${apiBase}/api/property`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })

      setTitle('')
      setDescription('')
      setTitleEn('')
      setDescriptionEn('')
      setPrice('')
      setCity('')
      setImages([])

      onSuccess(t('admin.propertyAdded'))
    } catch (err) {
      onError(err.response?.data?.message || t('admin.failedToCreateProperty'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5 rounded-3xl border border-neutral-200 bg-white p-6">
      <div className="grid gap-5 md:grid-cols-2">
        <Field label={t('admin.fieldTitle')}>
          <input
            type="text"
            className="w-full rounded-2xl border border-neutral-200 px-4 py-3 outline-none focus:border-neutral-400"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t('admin.placeholderLuxuryApartment')}
            required
          />
        </Field>

        <Field label={t('admin.fieldCity')}>
          <input
            type="text"
            className="w-full rounded-2xl border border-neutral-200 px-4 py-3 outline-none focus:border-neutral-400"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder={t('admin.placeholderZurich')}
            required
          />
        </Field>
      </div>

      <Field label={t('admin.fieldPrice')}>
        <input
          type="number"
          className="w-full rounded-2xl border border-neutral-200 px-4 py-3 outline-none focus:border-neutral-400"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="120000"
          required
        />
      </Field>

      <Field label={t('admin.fieldDescription')}>
        <textarea
          className="min-h-[140px] w-full rounded-2xl border border-neutral-200 px-4 py-3 outline-none focus:border-neutral-400"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t('admin.placeholderDescription')}
          required
        />
      </Field>

      <Field label={`${t('admin.fieldTitle')} (EN)`}>
        <input
          type="text"
          className="w-full rounded-2xl border border-neutral-200 px-4 py-3 outline-none focus:border-neutral-400"
          value={titleEn}
          onChange={(e) => setTitleEn(e.target.value)}
          placeholder={t('admin.placeholderLuxuryApartment')}
        />
      </Field>

      <Field label={`${t('admin.fieldDescription')} (EN)`}>
        <textarea
          className="min-h-[140px] w-full rounded-2xl border border-neutral-200 px-4 py-3 outline-none focus:border-neutral-400"
          value={descriptionEn}
          onChange={(e) => setDescriptionEn(e.target.value)}
          placeholder={t('admin.placeholderDescription')}
        />
      </Field>

      <Field label={t('admin.fieldImages')}>
        <div className="flex flex-col gap-3">
          <label className="cursor-pointer rounded-full border border-neutral-200 px-4 py-2 text-center text-sm font-semibold text-neutral-800 hover:bg-neutral-50">
            {t('admin.addImages')}
            <input
              type="file"
              multiple
              accept=".jpg,.jpeg,.png,.webp"
              className="hidden"
              onChange={(e) =>
                setImages((prev) => [...prev, ...Array.from(e.target.files || [])])
              }
            />
          </label>

          <div className="mt-2">
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-500">
              {t('admin.selectedImages')}
            </h4>

            {images.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-neutral-200 px-4 py-8 text-center text-sm text-neutral-500">
                {t('admin.noImagesSelected')}
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {images.map((img, index) => (
                  <div
                    key={index}
                    className="overflow-hidden rounded-2xl border border-neutral-200 bg-white"
                  >
                    <img
                      src={URL.createObjectURL(img)}
                      alt={`preview-${index}`}
                      className="h-48 w-full object-cover"
                    />
                    <div className="p-3">
                      <button
                        type="button"
                        onClick={() =>
                          setImages((prev) => prev.filter((_, i) => i !== index))
                        }
                        className="w-full rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                      >
                        {t('admin.removeImage')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Field>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? t('admin.saving') : t('admin.addPropertyCta')}
        </button>
      </div>
    </form>
  )
}

function PropertyCard({ property, apiBase, onDelete, onDeleteImage, onAddImages }) {
  const { t } = useI18n()
  const [editing, setEditing] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [title, setTitle] = useState(property.title || '')
  const [description, setDescription] = useState(property.description || '')
  const [titleEn, setTitleEn] = useState(property.titleEn || '')
  const [descriptionEn, setDescriptionEn] = useState(property.descriptionEn || '')
  const [price, setPrice] = useState(property.price || '')
  const [city, setCity] = useState(property.city || '')

  const token = localStorage.getItem('token') || ''

  async function handleUpdate(e) {
    e.preventDefault()

    try {
      setSubmitting(true)
      await axios.put(
        `${apiBase}/api/property/${property.id}`,
        {
          title,
          description,
          titleEn: titleEn.trim() ? titleEn : null,
          descriptionEn: descriptionEn.trim() ? descriptionEn : null,
          price,
          city,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      setEditing(false)
      window.location.reload()
    } catch (err) {
      alert(err.response?.data?.message || t('admin.failedToUpdateProperty'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-5 lg:flex-row lg:justify-between">
        <div className="flex-1">
          {!editing ? (
            <>
              <h3 className="text-xl font-semibold text-neutral-900">{property.title}</h3>
              <p className="mt-2 text-sm text-neutral-600">{property.description}</p>

              <div className="mt-4 flex flex-wrap gap-3 text-sm">
                <span className="rounded-full bg-neutral-100 px-3 py-1 text-neutral-700">
                  {t('admin.address')}: {property.city}
                </span>
                <span className="rounded-full bg-neutral-100 px-3 py-1 text-neutral-700">
                  {t('admin.fieldPrice')}: €{property.price}
                </span>
              </div>
            </>
          ) : (
            <form onSubmit={handleUpdate} className="grid gap-4">
              <input
                type="text"
                className="w-full rounded-2xl border border-neutral-200 px-4 py-3 outline-none focus:border-neutral-400"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <textarea
                className="min-h-[120px] w-full rounded-2xl border border-neutral-200 px-4 py-3 outline-none focus:border-neutral-400"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <input
                type="text"
                className="w-full rounded-2xl border border-neutral-200 px-4 py-3 outline-none focus:border-neutral-400"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                placeholder="Title (EN)"
              />
              <textarea
                className="min-h-[120px] w-full rounded-2xl border border-neutral-200 px-4 py-3 outline-none focus:border-neutral-400"
                value={descriptionEn}
                onChange={(e) => setDescriptionEn(e.target.value)}
                placeholder="Description (EN)"
              />
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  type="number"
                  className="w-full rounded-2xl border border-neutral-200 px-4 py-3 outline-none focus:border-neutral-400"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
                <input
                  type="text"
                  className="w-full rounded-2xl border border-neutral-200 px-4 py-3 outline-none focus:border-neutral-400"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800 disabled:opacity-60"
                >
                  {submitting ? t('admin.saving') : t('admin.save')}
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="rounded-full border border-neutral-200 px-5 py-2.5 text-sm font-semibold text-neutral-800 hover:bg-neutral-50"
                >
                  {t('admin.cancel')}
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="flex flex-col gap-3 lg:min-w-[180px]">
          {!editing && (
            <>
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-800 hover:bg-neutral-50"
              >
                {t('admin.edit')}
              </button>
              <button
                type="button"
                onClick={onDelete}
                className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
              >
                {t('admin.delete')}
              </button>
            </>
          )}

          {editing && (
            <label className="cursor-pointer rounded-full border border-neutral-200 px-4 py-2 text-center text-sm font-semibold text-neutral-800 hover:bg-neutral-50">
              {t('admin.addImages')}
              <input
                type="file"
                multiple
                accept=".jpg,.jpeg,.png,.webp"
                className="hidden"
                onChange={(e) => onAddImages(Array.from(e.target.files || []))}
              />
            </label>
          )}
        </div>
      </div>

      <div className="mt-6">
        <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-500">{t('admin.images')}</h4>

        {!property.images || property.images.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-neutral-200 px-4 py-8 text-center text-sm text-neutral-500">
            {t('admin.noImagesYet')}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {property.images.map((img) => (
              <div key={img.id} className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
                <img
                  src={`${apiBase}${img.imageUrl}`}
                  alt="property"
                  className="h-48 w-full object-cover"
                />
                {editing && (
                  <div className="p-3">
                    <button
                      type="button"
                      onClick={() => onDeleteImage(img.id)}
                      className="w-full rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                    >
                      {t('admin.deleteImage')}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-neutral-800">{label}</span>
      {children}
    </label>
  )
}