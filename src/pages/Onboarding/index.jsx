import { useState } from 'react'
import { TrendingUp, ArrowRight, ArrowLeft, Trash2, Check, ChevronDown, ChevronUp } from 'lucide-react'
import useInvestmentStore from '@/stores/investmentStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn, formatCurrency } from '@/lib/utils'

const STEPS = [
  { id: 'welcome', title: 'Bienvenue' },
  { id: 'types', title: 'Types de comptes' },
  { id: 'configure', title: 'Configuration' },
  { id: 'summary', title: 'Resume' },
]

const ACCOUNT_TYPES = [
  { id: 'assurance-vie', label: 'Assurance vie', description: 'Placement long terme avec avantages fiscaux' },
  { id: 'pea', label: 'PEA', description: 'Plan d\'Epargne en Actions' },
  { id: 'cto', label: 'Compte titre (CTO)', description: 'Compte titre ordinaire' },
  { id: 'livret-a', label: 'Livret A', description: 'Epargne reglementee defiscalisee' },
  { id: 'ldds', label: 'LDDS', description: 'Livret Developpement Durable et Solidaire' },
  { id: 'lep', label: 'LEP', description: 'Livret Epargne Populaire' },
  { id: 'per', label: 'PER', description: 'Plan d\'Epargne Retraite' },
  { id: 'scpi', label: 'SCPI', description: 'Immobilier pierre papier' },
  { id: 'crypto', label: 'Crypto', description: 'Cryptomonnaies' },
  { id: 'autre', label: 'Autre', description: 'Autre type de compte' },
]

const PLATFORM_CATEGORIES = [
  { id: 'banques-en-ligne', label: 'Banques en ligne' },
  { id: 'banques-traditionnelles', label: 'Banques traditionnelles' },
  { id: 'courtiers', label: 'Courtiers' },
  { id: 'assureurs', label: 'Assureurs' },
  { id: 'crypto', label: 'Plateformes Crypto' },
  { id: 'gestion-patrimoine', label: 'Gestion de patrimoine' },
  { id: 'autre', label: 'Autre' },
]

const PLATFORMS = [
  { id: 'boursorama', label: 'Boursorama', category: 'banques-en-ligne' },
  { id: 'fortuneo', label: 'Fortuneo', category: 'banques-en-ligne' },
  { id: 'hello-bank', label: 'Hello Bank', category: 'banques-en-ligne' },
  { id: 'ing', label: 'ING', category: 'banques-en-ligne' },
  { id: 'monabanq', label: 'Monabanq', category: 'banques-en-ligne' },
  { id: 'n26', label: 'N26', category: 'banques-en-ligne' },
  { id: 'revolut', label: 'Revolut', category: 'banques-en-ligne' },
  { id: 'credit-agricole', label: 'Credit Agricole', category: 'banques-traditionnelles' },
  { id: 'bnp-paribas', label: 'BNP Paribas', category: 'banques-traditionnelles' },
  { id: 'societe-generale', label: 'Societe Generale', category: 'banques-traditionnelles' },
  { id: 'lcl', label: 'LCL', category: 'banques-traditionnelles' },
  { id: 'caisse-epargne', label: 'Caisse d\'Epargne', category: 'banques-traditionnelles' },
  { id: 'banque-populaire', label: 'Banque Populaire', category: 'banques-traditionnelles' },
  { id: 'credit-mutuel', label: 'Credit Mutuel', category: 'banques-traditionnelles' },
  { id: 'la-banque-postale', label: 'La Banque Postale', category: 'banques-traditionnelles' },
  { id: 'hsbc', label: 'HSBC', category: 'banques-traditionnelles' },
  { id: 'bourse-direct', label: 'Bourse Direct', category: 'courtiers' },
  { id: 'degiro', label: 'Degiro', category: 'courtiers' },
  { id: 'trade-republic', label: 'Trade Republic', category: 'courtiers' },
  { id: 'saxo', label: 'Saxo Banque', category: 'courtiers' },
  { id: 'interactive-brokers', label: 'Interactive Brokers', category: 'courtiers' },
  { id: 'etoro', label: 'eToro', category: 'courtiers' },
  { id: 'trading212', label: 'Trading 212', category: 'courtiers' },
  { id: 'scalable-capital', label: 'Scalable Capital', category: 'courtiers' },
  { id: 'swisslife', label: 'Swisslife', category: 'assureurs' },
  { id: 'axa', label: 'AXA', category: 'assureurs' },
  { id: 'generali', label: 'Generali', category: 'assureurs' },
  { id: 'allianz', label: 'Allianz', category: 'assureurs' },
  { id: 'cardif', label: 'Cardif (BNP)', category: 'assureurs' },
  { id: 'spirica', label: 'Spirica', category: 'assureurs' },
  { id: 'suravenir', label: 'Suravenir', category: 'assureurs' },
  { id: 'binance', label: 'Binance', category: 'crypto' },
  { id: 'coinbase', label: 'Coinbase', category: 'crypto' },
  { id: 'kraken', label: 'Kraken', category: 'crypto' },
  { id: 'crypto-com', label: 'Crypto.com', category: 'crypto' },
  { id: 'bitpanda', label: 'Bitpanda', category: 'crypto' },
  { id: 'ledger', label: 'Ledger', category: 'crypto' },
  { id: 'linxea', label: 'Linxea', category: 'gestion-patrimoine' },
  { id: 'yomoni', label: 'Yomoni', category: 'gestion-patrimoine' },
  { id: 'nalo', label: 'Nalo', category: 'gestion-patrimoine' },
  { id: 'goodvest', label: 'Goodvest', category: 'gestion-patrimoine' },
  { id: 'ramify', label: 'Ramify', category: 'gestion-patrimoine' },
  { id: 'autre', label: 'Autre', category: 'autre' },
]

const FREQUENCIES = [
  { id: 'mensuel', label: 'Mensuel' },
  { id: 'trimestriel', label: 'Trimestriel' },
  { id: 'annuel', label: 'Annuel' },
]

export default function Onboarding() {
  const { saveOnboardingData, loading } = useInvestmentStore()
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedTypes, setSelectedTypes] = useState([])
  const [accounts, setAccounts] = useState([])
  const [expandedAccount, setExpandedAccount] = useState(0)

  const progress = ((currentStep + 1) / STEPS.length) * 100

  // Toggle account type selection
  const toggleType = (typeId) => {
    if (selectedTypes.includes(typeId)) {
      setSelectedTypes(selectedTypes.filter(t => t !== typeId))
    } else {
      setSelectedTypes([...selectedTypes, typeId])
    }
  }

  // Initialize accounts when moving from types to configure
  const initializeAccounts = () => {
    const newAccounts = selectedTypes.map(typeId => {
      const type = ACCOUNT_TYPES.find(t => t.id === typeId)
      return {
        id: `${typeId}-${Date.now()}-${Math.random()}`,
        type: typeId,
        typeLabel: type?.label || typeId,
        plateforme: '',
        nom: '',
        investissementRegulier: '',
        frequence: 'mensuel',
        totalInvesti: '',
        valeurActuelle: '',
      }
    })
    setAccounts(newAccounts)
    setExpandedAccount(0)
  }

  const handleNext = () => {
    if (currentStep === 1) {
      initializeAccounts()
    }
    setCurrentStep(currentStep + 1)
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const updateAccount = (index, field, value) => {
    const newAccounts = [...accounts]
    newAccounts[index] = { ...newAccounts[index], [field]: value }
    setAccounts(newAccounts)
  }

  const removeAccount = (index) => {
    setAccounts(accounts.filter((_, i) => i !== index))
    if (expandedAccount >= accounts.length - 1) {
      setExpandedAccount(Math.max(0, accounts.length - 2))
    }
  }

  const getAccountName = (account) => {
    if (account.nom) return account.nom
    const platform = PLATFORMS.find(p => p.id === account.plateforme)
    return `${account.typeLabel}${platform ? ` - ${platform.label}` : ''}`
  }

  const handleFinish = async () => {
    const finalAccounts = accounts
      .filter(a => a.plateforme) // Only accounts with platform selected
      .map(a => ({
        type: a.type,
        nom: getAccountName(a),
        plateforme: a.plateforme,
        investissementRegulier: parseFloat(a.investissementRegulier) || 0,
        frequence: a.frequence,
        totalInvesti: parseFloat(a.totalInvesti) || 0,
        valeurActuelle: parseFloat(a.valeurActuelle) || 0,
      }))

    if (finalAccounts.length === 0) {
      alert('Veuillez configurer au moins un compte avec une plateforme.')
      return
    }

    useInvestmentStore.setState({
      onboardingData: { accounts: finalAccounts, currentStep: 0 },
    })
    await saveOnboardingData()
    window.location.reload()
  }

  const canProceed = () => {
    switch (STEPS[currentStep].id) {
      case 'welcome':
        return true
      case 'types':
        return selectedTypes.length > 0
      case 'configure':
        return accounts.some(a => a.plateforme)
      case 'summary':
        return accounts.some(a => a.plateforme)
      default:
        return true
    }
  }

  const totalPatrimoine = accounts.reduce((sum, a) => sum + (parseFloat(a.valeurActuelle) || 0), 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl shadow-2xl">
        <CardHeader className="text-center pb-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <TrendingUp className="h-10 w-10 text-primary" />
            <span className="text-2xl font-bold">Investment Manager</span>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2">
            Etape {currentStep + 1} sur {STEPS.length} - {STEPS[currentStep].title}
          </p>
        </CardHeader>

        <CardContent className="pt-6">
          {/* Step: Welcome */}
          {STEPS[currentStep].id === 'welcome' && (
            <div className="text-center space-y-6">
              <CardTitle className="text-2xl">Bienvenue !</CardTitle>
              <CardDescription className="text-base">
                Configurons ensemble votre gestionnaire d'investissements personnel.
                Vos donnees restent 100% locales sur votre ordinateur.
              </CardDescription>
              <div className="grid grid-cols-3 gap-4 mt-8">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl mb-2">📊</div>
                  <p className="text-sm font-medium">Suivez vos investissements</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl mb-2">🔒</div>
                  <p className="text-sm font-medium">Donnees 100% locales</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="text-3xl mb-2">📈</div>
                  <p className="text-sm font-medium">Analysez vos performances</p>
                </div>
              </div>
            </div>
          )}

          {/* Step: Select Multiple Types */}
          {STEPS[currentStep].id === 'types' && (
            <div className="space-y-6">
              <div className="text-center">
                <CardTitle>Quels types de comptes avez-vous ?</CardTitle>
                <CardDescription>Selectionnez tous les types de comptes que vous souhaitez ajouter</CardDescription>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {ACCOUNT_TYPES.map((type) => {
                  const isSelected = selectedTypes.includes(type.id)
                  return (
                    <button
                      key={type.id}
                      onClick={() => toggleType(type.id)}
                      className={cn(
                        'p-4 rounded-lg border-2 text-left transition-all relative',
                        isSelected
                          ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                          : 'border-gray-200 hover:border-gray-300'
                      )}
                    >
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      )}
                      <p className="font-medium">{type.label}</p>
                      <p className="text-xs text-muted-foreground">{type.description}</p>
                    </button>
                  )
                })}
              </div>
              {selectedTypes.length > 0 && (
                <p className="text-center text-sm text-muted-foreground">
                  {selectedTypes.length} type{selectedTypes.length > 1 ? 's' : ''} selectionne{selectedTypes.length > 1 ? 's' : ''}
                </p>
              )}
            </div>
          )}

          {/* Step: Configure All Accounts */}
          {STEPS[currentStep].id === 'configure' && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <CardTitle>Configurez vos comptes</CardTitle>
                <CardDescription>Renseignez les details de chaque compte</CardDescription>
              </div>

              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {accounts.map((account, index) => (
                  <div
                    key={account.id}
                    className={cn(
                      'border rounded-lg overflow-hidden transition-all',
                      expandedAccount === index ? 'border-primary' : 'border-gray-200'
                    )}
                  >
                    {/* Account Header */}
                    <button
                      onClick={() => setExpandedAccount(expandedAccount === index ? -1 : index)}
                      className="w-full p-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          'w-2 h-8 rounded-full',
                          account.plateforme ? 'bg-green-500' : 'bg-gray-300'
                        )} />
                        <div className="text-left">
                          <p className="font-medium">{account.typeLabel}</p>
                          {account.plateforme && (
                            <p className="text-sm text-muted-foreground">
                              {PLATFORMS.find(p => p.id === account.plateforme)?.label}
                              {account.valeurActuelle && ` - ${formatCurrency(parseFloat(account.valeurActuelle))}`}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {accounts.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation()
                              removeAccount(index)
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        )}
                        {expandedAccount === index ? (
                          <ChevronUp className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    </button>

                    {/* Account Details */}
                    {expandedAccount === index && (
                      <div className="p-4 space-y-4 bg-white">
                        {/* Platform Selection */}
                        <div className="space-y-2">
                          <Label>Plateforme / Courtier *</Label>
                          <div className="space-y-3 max-h-[200px] overflow-y-auto border rounded-lg p-3">
                            {PLATFORM_CATEGORIES.map((category) => {
                              const categoryPlatforms = PLATFORMS.filter(p => p.category === category.id)
                              if (categoryPlatforms.length === 0) return null
                              return (
                                <div key={category.id}>
                                  <p className="text-xs font-semibold text-muted-foreground mb-1">{category.label}</p>
                                  <div className="flex flex-wrap gap-1">
                                    {categoryPlatforms.map((platform) => (
                                      <button
                                        key={platform.id}
                                        onClick={() => updateAccount(index, 'plateforme', platform.id)}
                                        className={cn(
                                          'px-2 py-1 text-xs rounded border transition-all',
                                          account.plateforme === platform.id
                                            ? 'border-primary bg-primary text-white'
                                            : 'border-gray-200 hover:border-gray-300'
                                        )}
                                      >
                                        {platform.label}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>

                        {/* Account Name */}
                        <div className="space-y-2">
                          <Label>Nom personnalise (optionnel)</Label>
                          <Input
                            value={account.nom}
                            onChange={(e) => updateAccount(index, 'nom', e.target.value)}
                            placeholder={getAccountName(account)}
                          />
                        </div>

                        {/* Amounts Grid */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Total investi</Label>
                            <div className="relative">
                              <Input
                                type="number"
                                value={account.totalInvesti}
                                onChange={(e) => updateAccount(index, 'totalInvesti', e.target.value)}
                                placeholder="0"
                                className="pr-12"
                              />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">EUR</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Valeur actuelle</Label>
                            <div className="relative">
                              <Input
                                type="number"
                                value={account.valeurActuelle}
                                onChange={(e) => updateAccount(index, 'valeurActuelle', e.target.value)}
                                placeholder="0"
                                className="pr-12"
                              />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">EUR</span>
                            </div>
                          </div>
                        </div>

                        {/* Recurring Investment */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Versement regulier (optionnel)</Label>
                            <div className="relative">
                              <Input
                                type="number"
                                value={account.investissementRegulier}
                                onChange={(e) => updateAccount(index, 'investissementRegulier', e.target.value)}
                                placeholder="0"
                                className="pr-12"
                              />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">EUR</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Frequence</Label>
                            <Select
                              value={account.frequence}
                              onValueChange={(value) => updateAccount(index, 'frequence', value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {FREQUENCIES.map((freq) => (
                                  <SelectItem key={freq.id} value={freq.id}>
                                    {freq.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Total */}
              {totalPatrimoine > 0 && (
                <div className="p-4 bg-slate-100 rounded-lg mt-4">
                  <div className="flex justify-between items-center">
                    <p className="font-medium text-slate-600">Patrimoine total</p>
                    <p className="text-xl font-bold text-primary">{formatCurrency(totalPatrimoine)}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step: Summary */}
          {STEPS[currentStep].id === 'summary' && (
            <div className="space-y-6">
              <div className="text-center">
                <CardTitle>Recapitulatif</CardTitle>
                <CardDescription>Verifiez vos comptes avant de terminer</CardDescription>
              </div>

              <div className="space-y-3">
                {accounts.filter(a => a.plateforme).map((account, index) => {
                  const platform = PLATFORMS.find(p => p.id === account.plateforme)
                  const performance = account.totalInvesti && account.valeurActuelle
                    ? ((parseFloat(account.valeurActuelle) - parseFloat(account.totalInvesti)) / parseFloat(account.totalInvesti) * 100)
                    : null

                  return (
                    <div key={account.id} className="p-4 border rounded-lg bg-white">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">{getAccountName(account)}</p>
                          <p className="text-sm text-muted-foreground">{account.typeLabel} - {platform?.label}</p>
                          {account.investissementRegulier && (
                            <p className="text-sm text-blue-600 mt-1">
                              Versement: {formatCurrency(parseFloat(account.investissementRegulier))}/{account.frequence}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">{formatCurrency(parseFloat(account.valeurActuelle) || 0)}</p>
                          {performance !== null && (
                            <p className={cn(
                              'text-sm font-medium',
                              performance >= 0 ? 'text-green-600' : 'text-red-600'
                            )}>
                              {performance >= 0 ? '+' : ''}{performance.toFixed(1)}%
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Patrimoine total</p>
                    <p className="text-3xl font-bold text-primary">{formatCurrency(totalPatrimoine)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Comptes</p>
                    <p className="text-2xl font-bold">{accounts.filter(a => a.plateforme).length}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>

            {STEPS[currentStep].id === 'summary' ? (
              <Button onClick={handleFinish} disabled={loading || !canProceed()} size="lg">
                {loading ? (
                  'Enregistrement...'
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Terminer la configuration
                  </>
                )}
              </Button>
            ) : (
              <Button onClick={handleNext} disabled={!canProceed()}>
                Suivant
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
