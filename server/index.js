import express from 'express'
import cors from 'cors'
import { fileURLToPath } from 'url'
import path from 'path'

import investmentsRoutes from './routes/investments.js'
import dashboardRoutes from './routes/dashboard.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/investments', investmentsRoutes)
app.use('/api/dashboard', dashboardRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Start server
app.listen(PORT, () => {
  console.log(`
  ========================================
    Investment Manager - Serveur API
  ========================================

    Serveur demarre sur http://localhost:${PORT}

    Endpoints disponibles:
    - GET  /api/health
    - GET  /api/investments/comptes
    - POST /api/investments/comptes
    - GET  /api/investments/transactions
    - POST /api/investments/transactions
    - GET  /api/investments/valorisations
    - POST /api/investments/valorisations
    - GET  /api/investments/config
    - POST /api/investments/config
    - GET  /api/dashboard/summary

  ========================================
  `)
})
