const API_BASE = '/api'

async function fetchJSON(url, options = {}) {
  const response = await fetch(`${API_BASE}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Erreur reseau' }))
    throw new Error(error.error || 'Une erreur est survenue')
  }

  return response.json()
}

// ==================== COMPTES ====================

export async function getComptes() {
  return fetchJSON('/investments/comptes')
}

export async function addCompte(compte) {
  return fetchJSON('/investments/comptes', {
    method: 'POST',
    body: JSON.stringify(compte),
  })
}

export async function updateCompte(id, updates) {
  return fetchJSON(`/investments/comptes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  })
}

export async function deleteCompte(id) {
  return fetchJSON(`/investments/comptes/${id}`, {
    method: 'DELETE',
  })
}

// ==================== TRANSACTIONS ====================

export async function getTransactions(compteId = null) {
  const query = compteId ? `?compteId=${compteId}` : ''
  return fetchJSON(`/investments/transactions${query}`)
}

export async function addTransaction(transaction) {
  return fetchJSON('/investments/transactions', {
    method: 'POST',
    body: JSON.stringify(transaction),
  })
}

export async function deleteTransaction(id) {
  return fetchJSON(`/investments/transactions/${id}`, {
    method: 'DELETE',
  })
}

// ==================== VALORISATIONS ====================

export async function getValorisations(compteId = null) {
  const query = compteId ? `?compteId=${compteId}` : ''
  return fetchJSON(`/investments/valorisations${query}`)
}

export async function addValorisation(valorisation) {
  return fetchJSON('/investments/valorisations', {
    method: 'POST',
    body: JSON.stringify(valorisation),
  })
}

export async function updateValorisation(id, updates) {
  return fetchJSON(`/investments/valorisations/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  })
}

// ==================== CONFIGURATION ====================

export async function getConfig() {
  return fetchJSON('/investments/config')
}

export async function setConfig(key, value) {
  return fetchJSON('/investments/config', {
    method: 'POST',
    body: JSON.stringify({ key, value }),
  })
}

// ==================== DASHBOARD ====================

export async function getDashboardSummary() {
  return fetchJSON('/dashboard/summary')
}

// ==================== METADATA ====================

export async function getAccountTypes() {
  return fetchJSON('/investments/types')
}

export async function getPlatforms() {
  return fetchJSON('/investments/platforms')
}

export async function getExcelPath() {
  return fetchJSON('/investments/excel-path')
}

export async function checkFileExists() {
  return fetchJSON('/investments/file-exists')
}

export async function resetData() {
  return fetchJSON('/investments/reset', {
    method: 'POST',
  })
}
