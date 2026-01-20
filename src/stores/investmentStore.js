import { create } from 'zustand'
import * as api from '../services/api'

const useInvestmentStore = create((set, get) => ({
  // State
  comptes: [],
  transactions: [],
  valorisations: [],
  config: {},
  dashboard: null,
  accountTypes: [],
  platforms: [],

  loading: false,
  error: null,

  // Onboarding state
  onboardingData: {
    accounts: [],
    currentStep: 0,
  },

  // Actions
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Fetch all data
  fetchAll: async () => {
    set({ loading: true, error: null })
    try {
      const [comptes, transactions, valorisations, config, accountTypes, platforms] = await Promise.all([
        api.getComptes(),
        api.getTransactions(),
        api.getValorisations(),
        api.getConfig(),
        api.getAccountTypes(),
        api.getPlatforms(),
      ])
      set({ comptes, transactions, valorisations, config, accountTypes, platforms, loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },

  // Fetch dashboard
  fetchDashboard: async () => {
    set({ loading: true, error: null })
    try {
      const dashboard = await api.getDashboardSummary()
      set({ dashboard, loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },

  // Comptes
  addCompte: async (compte) => {
    set({ loading: true, error: null })
    try {
      const newCompte = await api.addCompte(compte)
      set((state) => ({
        comptes: [...state.comptes, newCompte],
        loading: false,
      }))
      return newCompte
    } catch (error) {
      set({ error: error.message, loading: false })
      throw error
    }
  },

  updateCompte: async (id, updates) => {
    set({ loading: true, error: null })
    try {
      await api.updateCompte(id, updates)
      set((state) => ({
        comptes: state.comptes.map((c) =>
          c.id === id ? { ...c, ...updates } : c
        ),
        loading: false,
      }))
    } catch (error) {
      set({ error: error.message, loading: false })
      throw error
    }
  },

  deleteCompte: async (id) => {
    set({ loading: true, error: null })
    try {
      await api.deleteCompte(id)
      set((state) => ({
        comptes: state.comptes.filter((c) => c.id !== id),
        transactions: state.transactions.filter((t) => t.compteId !== id),
        valorisations: state.valorisations.filter((v) => v.compteId !== id),
        loading: false,
      }))
    } catch (error) {
      set({ error: error.message, loading: false })
      throw error
    }
  },

  // Transactions
  addTransaction: async (transaction) => {
    set({ loading: true, error: null })
    try {
      const newTransaction = await api.addTransaction(transaction)
      set((state) => ({
        transactions: [...state.transactions, newTransaction],
        loading: false,
      }))
      return newTransaction
    } catch (error) {
      set({ error: error.message, loading: false })
      throw error
    }
  },

  deleteTransaction: async (id) => {
    set({ loading: true, error: null })
    try {
      await api.deleteTransaction(id)
      set((state) => ({
        transactions: state.transactions.filter((t) => t.id !== id),
        loading: false,
      }))
    } catch (error) {
      set({ error: error.message, loading: false })
      throw error
    }
  },

  // Valorisations
  addValorisation: async (valorisation) => {
    set({ loading: true, error: null })
    try {
      const newValorisation = await api.addValorisation(valorisation)
      set((state) => ({
        valorisations: [...state.valorisations, newValorisation],
        loading: false,
      }))
      return newValorisation
    } catch (error) {
      set({ error: error.message, loading: false })
      throw error
    }
  },

  updateValorisation: async (id, updates) => {
    set({ loading: true, error: null })
    try {
      await api.updateValorisation(id, updates)
      set((state) => ({
        valorisations: state.valorisations.map((v) =>
          v.id === id ? { ...v, ...updates } : v
        ),
        loading: false,
      }))
    } catch (error) {
      set({ error: error.message, loading: false })
      throw error
    }
  },

  // Configuration
  fetchConfig: async () => {
    try {
      const config = await api.getConfig()
      set({ config })
      return config
    } catch (error) {
      set({ error: error.message })
      throw error
    }
  },

  setConfigValue: async (key, value) => {
    try {
      await api.setConfig(key, value)
      set((state) => ({
        config: { ...state.config, [key]: value },
      }))
    } catch (error) {
      set({ error: error.message })
      throw error
    }
  },

  // Onboarding
  setOnboardingStep: (step) =>
    set((state) => ({
      onboardingData: { ...state.onboardingData, currentStep: step },
    })),

  addOnboardingAccount: (account) =>
    set((state) => ({
      onboardingData: {
        ...state.onboardingData,
        accounts: [...state.onboardingData.accounts, account],
      },
    })),

  updateOnboardingAccount: (index, updates) =>
    set((state) => ({
      onboardingData: {
        ...state.onboardingData,
        accounts: state.onboardingData.accounts.map((a, i) =>
          i === index ? { ...a, ...updates } : a
        ),
      },
    })),

  removeOnboardingAccount: (index) =>
    set((state) => ({
      onboardingData: {
        ...state.onboardingData,
        accounts: state.onboardingData.accounts.filter((_, i) => i !== index),
      },
    })),

  clearOnboardingData: () =>
    set({
      onboardingData: { accounts: [], currentStep: 0 },
    }),

  // Save onboarding data to Excel
  saveOnboardingData: async () => {
    const { onboardingData } = get()
    set({ loading: true, error: null })

    try {
      for (const account of onboardingData.accounts) {
        // Create account
        const newCompte = await api.addCompte({
          type: account.type,
          nom: account.nom,
          plateforme: account.plateforme,
          dateOuverture: account.dateOuverture || new Date().toISOString().split('T')[0],
        })

        // Add initial deposit transaction if totalInvesti > 0
        if (account.totalInvesti > 0) {
          await api.addTransaction({
            compteId: newCompte.id,
            type: 'depot',
            montant: account.totalInvesti,
            frequence: 'ponctuel',
            description: 'Investissement initial',
            date: account.dateOuverture || new Date().toISOString().split('T')[0],
          })
        }

        // Add recurring investment if configured
        if (account.investissementRegulier > 0) {
          await api.addTransaction({
            compteId: newCompte.id,
            type: 'depot',
            montant: account.investissementRegulier,
            frequence: account.frequence || 'mensuel',
            description: 'Investissement regulier',
            date: new Date().toISOString().split('T')[0],
          })
        }

        // Add current valuation
        if (account.valeurActuelle > 0) {
          await api.addValorisation({
            compteId: newCompte.id,
            valeur: account.valeurActuelle,
            date: new Date().toISOString().split('T')[0],
          })
        }
      }

      // Mark onboarding as complete
      await api.setConfig('onboardingComplete', 'true')

      set({ loading: false })
      get().clearOnboardingData()
      await get().fetchAll()
    } catch (error) {
      set({ error: error.message, loading: false })
      throw error
    }
  },

  // Check if onboarding is needed
  isOnboardingComplete: () => {
    const { config } = get()
    return config.onboardingComplete === 'true'
  },

  // Utility functions
  getCompteById: (id) => {
    const { comptes } = get()
    return comptes.find((c) => c.id === id)
  },

  getTransactionsForCompte: (compteId) => {
    const { transactions } = get()
    return transactions.filter((t) => t.compteId === compteId)
  },

  getValorisationsForCompte: (compteId) => {
    const { valorisations } = get()
    return valorisations.filter((v) => v.compteId === compteId)
  },

  getLatestValorisation: (compteId) => {
    const valorisations = get().getValorisationsForCompte(compteId)
    if (valorisations.length === 0) return null
    return valorisations.reduce((latest, v) =>
      new Date(v.date) > new Date(latest.date) ? v : latest
    )
  },
}))

export default useInvestmentStore
