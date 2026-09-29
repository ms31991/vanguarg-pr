const STORAGE_KEY = 'vanguarg.leads'

function safeParse(json, fallback) {
  try {
    const v = JSON.parse(json)
    return v ?? fallback
  } catch {
    return fallback
  }
}

export function getLeads() {
  const raw = localStorage.getItem(STORAGE_KEY)
  const parsed = raw ? safeParse(raw, []) : []
  return Array.isArray(parsed) ? parsed : []
}

export function addLead(lead) {
  const leads = getLeads()
  leads.unshift(lead)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(leads))
}

export function clearLeads() {
  localStorage.removeItem(STORAGE_KEY)
}

