import ExcelJS from 'exceljs'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { v4 as uuidv4 } from 'uuid'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const DATA_DIR = path.join(__dirname, '../../data')
const EXCEL_FILE = path.join(DATA_DIR, 'investments.xlsx')

// Types de comptes disponibles
export const ACCOUNT_TYPES = [
  { id: 'assurance-vie', label: 'Assurance vie' },
  { id: 'pea', label: 'PEA (Plan d\'Epargne en Actions)' },
  { id: 'cto', label: 'Compte titre ordinaire (CTO)' },
  { id: 'livret', label: 'Livret A / LDDS / LEP' },
  { id: 'per', label: 'PER (Plan d\'Epargne Retraite)' },
  { id: 'scpi', label: 'SCPI' },
  { id: 'crypto', label: 'Crypto' },
  { id: 'autre', label: 'Autre' },
]

// Plateformes disponibles
export const PLATFORMS = [
  { id: 'boursorama', label: 'Boursorama' },
  { id: 'fortuneo', label: 'Fortuneo' },
  { id: 'bourse-direct', label: 'Bourse Direct' },
  { id: 'degiro', label: 'Degiro' },
  { id: 'trade-republic', label: 'Trade Republic' },
  { id: 'linxea', label: 'Linxea' },
  { id: 'yomoni', label: 'Yomoni' },
  { id: 'nalo', label: 'Nalo' },
  { id: 'swisslife', label: 'Swisslife' },
  { id: 'axa', label: 'AXA' },
  { id: 'generali', label: 'Generali' },
  { id: 'credit-agricole', label: 'Credit Agricole' },
  { id: 'bnp-paribas', label: 'BNP Paribas' },
  { id: 'societe-generale', label: 'Societe Generale' },
  { id: 'autre', label: 'Autre' },
]

// Ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

// Initialize Excel file with empty sheets
async function initializeExcelFile() {
  ensureDataDir()

  const workbook = new ExcelJS.Workbook()

  // Sheet 1: Comptes
  const comptesSheet = workbook.addWorksheet('Comptes')
  comptesSheet.columns = [
    { header: 'id', key: 'id', width: 40 },
    { header: 'type', key: 'type', width: 30 },
    { header: 'nom', key: 'nom', width: 30 },
    { header: 'plateforme', key: 'plateforme', width: 25 },
    { header: 'dateOuverture', key: 'dateOuverture', width: 15 },
    { header: 'notes', key: 'notes', width: 40 },
  ]
  styleHeaderRow(comptesSheet)

  // Sheet 2: Transactions
  const transactionsSheet = workbook.addWorksheet('Transactions')
  transactionsSheet.columns = [
    { header: 'id', key: 'id', width: 40 },
    { header: 'compteId', key: 'compteId', width: 40 },
    { header: 'date', key: 'date', width: 15 },
    { header: 'type', key: 'type', width: 15 },
    { header: 'montant', key: 'montant', width: 15 },
    { header: 'frequence', key: 'frequence', width: 15 },
    { header: 'description', key: 'description', width: 40 },
  ]
  styleHeaderRow(transactionsSheet)

  // Sheet 3: Valorisations
  const valorisationsSheet = workbook.addWorksheet('Valorisations')
  valorisationsSheet.columns = [
    { header: 'id', key: 'id', width: 40 },
    { header: 'compteId', key: 'compteId', width: 40 },
    { header: 'date', key: 'date', width: 15 },
    { header: 'valeur', key: 'valeur', width: 15 },
    { header: 'notes', key: 'notes', width: 40 },
  ]
  styleHeaderRow(valorisationsSheet)

  // Sheet 4: Configuration
  const configSheet = workbook.addWorksheet('Configuration')
  configSheet.columns = [
    { header: 'cle', key: 'cle', width: 30 },
    { header: 'valeur', key: 'valeur', width: 50 },
  ]
  styleHeaderRow(configSheet)

  // Default configuration
  configSheet.addRow({ cle: 'devise', valeur: 'EUR' })
  configSheet.addRow({ cle: 'dateFormat', valeur: 'DD/MM/YYYY' })
  configSheet.addRow({ cle: 'onboardingComplete', valeur: 'false' })
  configSheet.addRow({ cle: 'lastUpdate', valeur: new Date().toISOString() })
  configSheet.addRow({ cle: 'version', valeur: '1.0.0' })

  await workbook.xlsx.writeFile(EXCEL_FILE)
  return workbook
}

function styleHeaderRow(sheet) {
  const headerRow = sheet.getRow(1)
  headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } }
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF2563EB' },
  }
  headerRow.alignment = { vertical: 'middle', horizontal: 'center' }
}

// Get or create workbook
async function getWorkbook() {
  ensureDataDir()

  if (!fs.existsSync(EXCEL_FILE)) {
    return await initializeExcelFile()
  }

  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.readFile(EXCEL_FILE)
  return workbook
}

// Save workbook
async function saveWorkbook(workbook) {
  await workbook.xlsx.writeFile(EXCEL_FILE)
}

// ==================== COMPTES ====================

export async function getComptes() {
  const workbook = await getWorkbook()
  const sheet = workbook.getWorksheet('Comptes')
  const comptes = []

  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return // Skip header
    comptes.push({
      id: row.getCell(1).value,
      type: row.getCell(2).value,
      nom: row.getCell(3).value,
      plateforme: row.getCell(4).value,
      dateOuverture: row.getCell(5).value,
      notes: row.getCell(6).value || '',
    })
  })

  return comptes
}

export async function addCompte(compte) {
  const workbook = await getWorkbook()
  const sheet = workbook.getWorksheet('Comptes')

  const newCompte = {
    id: uuidv4(),
    ...compte,
    dateOuverture: compte.dateOuverture || new Date().toISOString().split('T')[0],
    notes: compte.notes || '',
  }

  // Use array format to ensure correct column mapping
  sheet.addRow([
    newCompte.id,
    newCompte.type,
    newCompte.nom,
    newCompte.plateforme,
    newCompte.dateOuverture,
    newCompte.notes,
  ])
  await saveWorkbook(workbook)

  return newCompte
}

export async function updateCompte(id, updates) {
  const workbook = await getWorkbook()
  const sheet = workbook.getWorksheet('Comptes')

  let found = false
  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return
    if (row.getCell(1).value === id) {
      found = true
      if (updates.type) row.getCell(2).value = updates.type
      if (updates.nom) row.getCell(3).value = updates.nom
      if (updates.plateforme) row.getCell(4).value = updates.plateforme
      if (updates.dateOuverture) row.getCell(5).value = updates.dateOuverture
      if (updates.notes !== undefined) row.getCell(6).value = updates.notes
    }
  })

  if (!found) {
    throw new Error('Compte non trouve')
  }

  await saveWorkbook(workbook)
  return { id, ...updates }
}

export async function deleteCompte(id) {
  const workbook = await getWorkbook()
  const sheet = workbook.getWorksheet('Comptes')

  let rowToDelete = null
  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return
    if (row.getCell(1).value === id) {
      rowToDelete = rowNumber
    }
  })

  if (rowToDelete) {
    sheet.spliceRows(rowToDelete, 1)
    await saveWorkbook(workbook)
    return true
  }

  throw new Error('Compte non trouve')
}

// ==================== TRANSACTIONS ====================

export async function getTransactions(compteId = null) {
  const workbook = await getWorkbook()
  const sheet = workbook.getWorksheet('Transactions')
  const transactions = []

  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return
    const transaction = {
      id: row.getCell(1).value,
      compteId: row.getCell(2).value,
      date: row.getCell(3).value,
      type: row.getCell(4).value,
      montant: row.getCell(5).value,
      frequence: row.getCell(6).value,
      description: row.getCell(7).value || '',
    }

    if (!compteId || transaction.compteId === compteId) {
      transactions.push(transaction)
    }
  })

  return transactions
}

export async function addTransaction(transaction) {
  const workbook = await getWorkbook()
  const sheet = workbook.getWorksheet('Transactions')

  const newTransaction = {
    id: uuidv4(),
    ...transaction,
    date: transaction.date || new Date().toISOString().split('T')[0],
    description: transaction.description || '',
  }

  // Use array format to ensure correct column mapping
  sheet.addRow([
    newTransaction.id,
    newTransaction.compteId,
    newTransaction.date,
    newTransaction.type,
    newTransaction.montant,
    newTransaction.frequence,
    newTransaction.description,
  ])
  await saveWorkbook(workbook)

  return newTransaction
}

export async function deleteTransaction(id) {
  const workbook = await getWorkbook()
  const sheet = workbook.getWorksheet('Transactions')

  let rowToDelete = null
  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return
    if (row.getCell(1).value === id) {
      rowToDelete = rowNumber
    }
  })

  if (rowToDelete) {
    sheet.spliceRows(rowToDelete, 1)
    await saveWorkbook(workbook)
    return true
  }

  throw new Error('Transaction non trouvee')
}

// ==================== VALORISATIONS ====================

export async function getValorisations(compteId = null) {
  const workbook = await getWorkbook()
  const sheet = workbook.getWorksheet('Valorisations')
  const valorisations = []

  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return
    const valorisation = {
      id: row.getCell(1).value,
      compteId: row.getCell(2).value,
      date: row.getCell(3).value,
      valeur: row.getCell(4).value,
      notes: row.getCell(5).value || '',
    }

    if (!compteId || valorisation.compteId === compteId) {
      valorisations.push(valorisation)
    }
  })

  return valorisations
}

export async function addValorisation(valorisation) {
  const workbook = await getWorkbook()
  const sheet = workbook.getWorksheet('Valorisations')

  const newValorisation = {
    id: uuidv4(),
    ...valorisation,
    date: valorisation.date || new Date().toISOString().split('T')[0],
    notes: valorisation.notes || '',
  }

  // Use array format to ensure correct column mapping
  sheet.addRow([
    newValorisation.id,
    newValorisation.compteId,
    newValorisation.date,
    newValorisation.valeur,
    newValorisation.notes,
  ])
  await saveWorkbook(workbook)

  return newValorisation
}

export async function updateValorisation(id, updates) {
  const workbook = await getWorkbook()
  const sheet = workbook.getWorksheet('Valorisations')

  let found = false
  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return
    if (row.getCell(1).value === id) {
      found = true
      if (updates.valeur !== undefined) row.getCell(4).value = updates.valeur
      if (updates.notes !== undefined) row.getCell(5).value = updates.notes
    }
  })

  if (!found) {
    throw new Error('Valorisation non trouvee')
  }

  await saveWorkbook(workbook)
  return { id, ...updates }
}

// ==================== CONFIGURATION ====================

export async function getConfig() {
  const workbook = await getWorkbook()
  const sheet = workbook.getWorksheet('Configuration')
  const config = {}

  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return
    const key = row.getCell(1).value
    const value = row.getCell(2).value
    config[key] = value
  })

  return config
}

export async function setConfig(key, value) {
  const workbook = await getWorkbook()
  const sheet = workbook.getWorksheet('Configuration')

  let found = false
  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return
    if (row.getCell(1).value === key) {
      found = true
      row.getCell(2).value = value
    }
  })

  if (!found) {
    sheet.addRow({ cle: key, valeur: value })
  }

  await saveWorkbook(workbook)
  return { key, value }
}

// ==================== DASHBOARD ====================

export async function getDashboardSummary() {
  const comptes = await getComptes()
  const transactions = await getTransactions()
  const valorisations = await getValorisations()

  // Get latest valuation for each account
  const latestValorisations = {}
  valorisations.forEach(v => {
    if (!latestValorisations[v.compteId] ||
        new Date(v.date) > new Date(latestValorisations[v.compteId].date)) {
      latestValorisations[v.compteId] = v
    }
  })

  // Calculate totals
  let patrimoineTotal = 0
  let totalInvesti = 0

  const comptesWithDetails = comptes.map(compte => {
    const latestValeur = latestValorisations[compte.id]?.valeur || 0
    const compteTransactions = transactions.filter(t => t.compteId === compte.id)
    const investi = compteTransactions
      .filter(t => t.type === 'depot')
      .reduce((sum, t) => sum + (Number(t.montant) || 0), 0)
    const retraits = compteTransactions
      .filter(t => t.type === 'retrait')
      .reduce((sum, t) => sum + (Number(t.montant) || 0), 0)

    const netInvesti = investi - retraits
    patrimoineTotal += latestValeur
    totalInvesti += netInvesti

    return {
      ...compte,
      valeurActuelle: latestValeur,
      totalInvesti: netInvesti,
      performance: netInvesti > 0 ? ((latestValeur - netInvesti) / netInvesti) * 100 : 0,
      plusValue: latestValeur - netInvesti,
    }
  })

  // Get monthly deposits (current month)
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  const depositsThisMonth = transactions
    .filter(t => {
      const date = new Date(t.date)
      return t.type === 'depot' &&
             date.getMonth() === currentMonth &&
             date.getFullYear() === currentYear
    })
    .reduce((sum, t) => sum + (Number(t.montant) || 0), 0)

  // Historical data for chart (last 12 months)
  const historique = []
  for (let i = 11; i >= 0; i--) {
    const date = new Date(currentYear, currentMonth - i, 1)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`

    let monthTotal = 0
    comptes.forEach(compte => {
      // Find the closest valuation before or during this month
      const compteValorisations = valorisations
        .filter(v => v.compteId === compte.id && new Date(v.date) <= new Date(date.getFullYear(), date.getMonth() + 1, 0))
        .sort((a, b) => new Date(b.date) - new Date(a.date))

      if (compteValorisations.length > 0) {
        monthTotal += Number(compteValorisations[0].valeur) || 0
      }
    })

    historique.push({
      date: monthKey,
      label: date.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' }),
      valeur: monthTotal,
    })
  }

  // Allocation by account type
  const allocationByType = {}
  comptesWithDetails.forEach(compte => {
    const typeLabel = ACCOUNT_TYPES.find(t => t.id === compte.type)?.label || compte.type
    if (!allocationByType[typeLabel]) {
      allocationByType[typeLabel] = 0
    }
    allocationByType[typeLabel] += compte.valeurActuelle
  })

  const allocation = Object.entries(allocationByType).map(([name, value]) => ({
    name,
    value,
    percentage: patrimoineTotal > 0 ? (value / patrimoineTotal) * 100 : 0,
  }))

  return {
    patrimoineTotal,
    totalInvesti,
    plusValue: patrimoineTotal - totalInvesti,
    performanceGlobale: totalInvesti > 0 ? ((patrimoineTotal - totalInvesti) / totalInvesti) * 100 : 0,
    depositsThisMonth,
    comptes: comptesWithDetails,
    historique,
    allocation,
  }
}

// ==================== UTILITIES ====================

export function getExcelPath() {
  return EXCEL_FILE
}

export async function fileExists() {
  return fs.existsSync(EXCEL_FILE)
}

export async function resetData() {
  if (fs.existsSync(EXCEL_FILE)) {
    fs.unlinkSync(EXCEL_FILE)
  }
  await initializeExcelFile()
}
