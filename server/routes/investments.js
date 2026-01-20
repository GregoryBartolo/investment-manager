import express from 'express'
import {
  getComptes,
  addCompte,
  updateCompte,
  deleteCompte,
  getTransactions,
  addTransaction,
  deleteTransaction,
  getValorisations,
  addValorisation,
  updateValorisation,
  getConfig,
  setConfig,
  getExcelPath,
  fileExists,
  resetData,
  ACCOUNT_TYPES,
  PLATFORMS,
} from '../services/excelService.js'

const router = express.Router()

// ==================== COMPTES ====================

router.get('/comptes', async (req, res) => {
  try {
    const comptes = await getComptes()
    res.json(comptes)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/comptes', async (req, res) => {
  try {
    const compte = await addCompte(req.body)
    res.status(201).json(compte)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.put('/comptes/:id', async (req, res) => {
  try {
    const compte = await updateCompte(req.params.id, req.body)
    res.json(compte)
  } catch (error) {
    res.status(404).json({ error: error.message })
  }
})

router.delete('/comptes/:id', async (req, res) => {
  try {
    await deleteCompte(req.params.id)
    res.json({ success: true })
  } catch (error) {
    res.status(404).json({ error: error.message })
  }
})

// ==================== TRANSACTIONS ====================

router.get('/transactions', async (req, res) => {
  try {
    const { compteId } = req.query
    const transactions = await getTransactions(compteId)
    res.json(transactions)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/transactions', async (req, res) => {
  try {
    const transaction = await addTransaction(req.body)
    res.status(201).json(transaction)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.delete('/transactions/:id', async (req, res) => {
  try {
    await deleteTransaction(req.params.id)
    res.json({ success: true })
  } catch (error) {
    res.status(404).json({ error: error.message })
  }
})

// ==================== VALORISATIONS ====================

router.get('/valorisations', async (req, res) => {
  try {
    const { compteId } = req.query
    const valorisations = await getValorisations(compteId)
    res.json(valorisations)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/valorisations', async (req, res) => {
  try {
    const valorisation = await addValorisation(req.body)
    res.status(201).json(valorisation)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.put('/valorisations/:id', async (req, res) => {
  try {
    const valorisation = await updateValorisation(req.params.id, req.body)
    res.json(valorisation)
  } catch (error) {
    res.status(404).json({ error: error.message })
  }
})

// ==================== CONFIGURATION ====================

router.get('/config', async (req, res) => {
  try {
    const config = await getConfig()
    res.json(config)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/config', async (req, res) => {
  try {
    const { key, value } = req.body
    const result = await setConfig(key, value)
    res.json(result)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// ==================== METADATA ====================

router.get('/types', (req, res) => {
  res.json(ACCOUNT_TYPES)
})

router.get('/platforms', (req, res) => {
  res.json(PLATFORMS)
})

router.get('/excel-path', (req, res) => {
  res.json({ path: getExcelPath() })
})

router.get('/file-exists', async (req, res) => {
  try {
    const exists = await fileExists()
    res.json({ exists })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/reset', async (req, res) => {
  try {
    await resetData()
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
