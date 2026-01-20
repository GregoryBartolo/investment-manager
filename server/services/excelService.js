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
  { id: 'livret-a', label: 'Livret A' },
  { id: 'ldds', label: 'LDDS (Livret Developpement Durable)' },
  { id: 'lep', label: 'LEP (Livret Epargne Populaire)' },
  { id: 'per', label: 'PER (Plan d\'Epargne Retraite)' },
  { id: 'scpi', label: 'SCPI' },
  { id: 'crypto', label: 'Crypto' },
  { id: 'autre', label: 'Autre' },
]

// Categories de plateformes
export const PLATFORM_CATEGORIES = [
  { id: 'banques-en-ligne', label: 'Banques en ligne' },
  { id: 'banques-traditionnelles', label: 'Banques traditionnelles' },
  { id: 'courtiers', label: 'Courtiers' },
  { id: 'assureurs', label: 'Assureurs' },
  { id: 'crypto', label: 'Plateformes Crypto' },
  { id: 'gestion-patrimoine', label: 'Gestion de patrimoine' },
  { id: 'autre', label: 'Autre' },
]

// Plateformes disponibles organisees par categorie
export const PLATFORMS = [
  // Banques en ligne
  { id: 'boursorama', label: 'Boursorama', category: 'banques-en-ligne' },
  { id: 'fortuneo', label: 'Fortuneo', category: 'banques-en-ligne' },
  { id: 'hello-bank', label: 'Hello Bank', category: 'banques-en-ligne' },
  { id: 'ing', label: 'ING', category: 'banques-en-ligne' },
  { id: 'monabanq', label: 'Monabanq', category: 'banques-en-ligne' },
  { id: 'n26', label: 'N26', category: 'banques-en-ligne' },
  { id: 'revolut', label: 'Revolut', category: 'banques-en-ligne' },

  // Banques traditionnelles
  { id: 'credit-agricole', label: 'Credit Agricole', category: 'banques-traditionnelles' },
  { id: 'bnp-paribas', label: 'BNP Paribas', category: 'banques-traditionnelles' },
  { id: 'societe-generale', label: 'Societe Generale', category: 'banques-traditionnelles' },
  { id: 'lcl', label: 'LCL', category: 'banques-traditionnelles' },
  { id: 'caisse-epargne', label: 'Caisse d\'Epargne', category: 'banques-traditionnelles' },
  { id: 'banque-populaire', label: 'Banque Populaire', category: 'banques-traditionnelles' },
  { id: 'credit-mutuel', label: 'Credit Mutuel', category: 'banques-traditionnelles' },
  { id: 'la-banque-postale', label: 'La Banque Postale', category: 'banques-traditionnelles' },
  { id: 'hsbc', label: 'HSBC', category: 'banques-traditionnelles' },

  // Courtiers
  { id: 'bourse-direct', label: 'Bourse Direct', category: 'courtiers' },
  { id: 'degiro', label: 'Degiro', category: 'courtiers' },
  { id: 'trade-republic', label: 'Trade Republic', category: 'courtiers' },
  { id: 'saxo', label: 'Saxo Banque', category: 'courtiers' },
  { id: 'interactive-brokers', label: 'Interactive Brokers', category: 'courtiers' },
  { id: 'etoro', label: 'eToro', category: 'courtiers' },
  { id: 'trading212', label: 'Trading 212', category: 'courtiers' },
  { id: 'scalable-capital', label: 'Scalable Capital', category: 'courtiers' },

  // Assureurs
  { id: 'swisslife', label: 'Swisslife', category: 'assureurs' },
  { id: 'axa', label: 'AXA', category: 'assureurs' },
  { id: 'generali', label: 'Generali', category: 'assureurs' },
  { id: 'allianz', label: 'Allianz', category: 'assureurs' },
  { id: 'cardif', label: 'Cardif (BNP)', category: 'assureurs' },
  { id: 'spirica', label: 'Spirica', category: 'assureurs' },
  { id: 'suravenir', label: 'Suravenir', category: 'assureurs' },

  // Plateformes Crypto
  { id: 'binance', label: 'Binance', category: 'crypto' },
  { id: 'coinbase', label: 'Coinbase', category: 'crypto' },
  { id: 'kraken', label: 'Kraken', category: 'crypto' },
  { id: 'crypto-com', label: 'Crypto.com', category: 'crypto' },
  { id: 'bitpanda', label: 'Bitpanda', category: 'crypto' },
  { id: 'bitstamp', label: 'Bitstamp', category: 'crypto' },
  { id: 'kucoin', label: 'KuCoin', category: 'crypto' },
  { id: 'bybit', label: 'Bybit', category: 'crypto' },
  { id: 'okx', label: 'OKX', category: 'crypto' },
  { id: 'ledger', label: 'Ledger (Hardware Wallet)', category: 'crypto' },
  { id: 'metamask', label: 'MetaMask', category: 'crypto' },
  { id: 'zengo', label: 'Zengo', category: 'crypto' },

  // Gestion de patrimoine
  { id: 'linxea', label: 'Linxea', category: 'gestion-patrimoine' },
  { id: 'yomoni', label: 'Yomoni', category: 'gestion-patrimoine' },
  { id: 'nalo', label: 'Nalo', category: 'gestion-patrimoine' },
  { id: 'goodvest', label: 'Goodvest', category: 'gestion-patrimoine' },
  { id: 'ramify', label: 'Ramify', category: 'gestion-patrimoine' },
  { id: 'mon-petit-placement', label: 'Mon Petit Placement', category: 'gestion-patrimoine' },

  // Autre
  { id: 'autre', label: 'Autre', category: 'autre' },
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

    // Find recurring investment
    const recurringDeposit = compteTransactions.find(
      t => t.type === 'depot' && t.frequence && t.frequence !== 'ponctuel'
    )

    const netInvesti = investi - retraits
    patrimoineTotal += latestValeur
    totalInvesti += netInvesti

    return {
      ...compte,
      valeurActuelle: latestValeur,
      totalInvesti: netInvesti,
      performance: netInvesti > 0 ? ((latestValeur - netInvesti) / netInvesti) * 100 : 0,
      plusValue: latestValeur - netInvesti,
      versementRegulier: recurringDeposit ? {
        montant: Number(recurringDeposit.montant) || 0,
        frequence: recurringDeposit.frequence,
      } : null,
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
