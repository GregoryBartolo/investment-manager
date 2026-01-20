import express from 'express'
import { getDashboardSummary } from '../services/excelService.js'

const router = express.Router()

router.get('/summary', async (req, res) => {
  try {
    const summary = await getDashboardSummary()
    res.json(summary)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
