import { useState } from 'react'
import { TrendingUp, ArrowRight, ArrowLeft, Plus, Trash2, Check } from 'lucide-react'
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
  { id: 'type', title: 'Type de compte' },
  { id: 'platform', title: 'Plateforme' },
  { id: 'regular', title: 'Investissement regulier' },
  { id: 'current', title: 'Situation actuelle' },
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

const FREQUENCIES = [
  { id: 'mensuel', label: 'Mensuel' },
  { id: 'trimestriel', label: 'Trimestriel' },
  { id: 'annuel', label: 'Annuel' },
  { id: 'ponctuel', label: 'Ponctuel' },
]

export default function Onboarding() {
  const { saveOnboardingData, loading } = useInvestmentStore()
  const [currentStep, setCurrentStep] = useState(0)
  const [accounts, setAccounts] = useState([])
  const [currentAccount, setCurrentAccount] = useState({
    type: '',
    customType: '',
    plateforme: '',
    customPlateforme: '',
    nom: '',
    investissementRegulier: '',
    frequence: 'mensuel',
    totalInvesti: '',
    valeurActuelle: '',
    dateOuverture: '',
  })

  const progress = ((currentStep + 1) / STEPS.length) * 100

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleAddAccount = () => {
    const accountToAdd = {
      ...currentAccount,
      type: currentAccount.type === 'autre' ? currentAccount.customType : currentAccount.type,
      plateforme: currentAccount.plateforme === 'autre' ? currentAccount.customPlateforme : currentAccount.plateforme,
      nom: currentAccount.nom || generateAccountName(currentAccount),
      investissementRegulier: parseFloat(currentAccount.investissementRegulier) || 0,
      totalInvesti: parseFloat(currentAccount.totalInvesti) || 0,
      valeurActuelle: parseFloat(currentAccount.valeurActuelle) || 0,
    }
    setAccounts([...accounts, accountToAdd])
    setCurrentAccount({
      type: '',
      customType: '',
      plateforme: '',
      customPlateforme: '',
      nom: '',
      investissementRegulier: '',
      frequence: 'mensuel',
      totalInvesti: '',
      valeurActuelle: '',
      dateOuverture: '',
    })
    setCurrentStep(1) // Go back to type selection for new account
  }

  const handleRemoveAccount = (index) => {
    setAccounts(accounts.filter((_, i) => i !== index))
  }

  const handleFinish = async () => {
    // Add the current account if it has data
    let finalAccounts = [...accounts]
    if (currentAccount.type && currentAccount.plateforme) {
      const accountToAdd = {
        ...currentAccount,
        type: currentAccount.type === 'autre' ? currentAccount.customType : currentAccount.type,
        plateforme: currentAccount.plateforme === 'autre' ? currentAccount.customPlateforme : currentAccount.plateforme,
        nom: currentAccount.nom || generateAccountName(currentAccount),
        investissementRegulier: parseFloat(currentAccount.investissementRegulier) || 0,
        totalInvesti: parseFloat(currentAccount.totalInvesti) || 0,
        valeurActuelle: parseFloat(currentAccount.valeurActuelle) || 0,
      }
      finalAccounts = [...finalAccounts, accountToAdd]
    }

    if (finalAccounts.length === 0) {
      alert('Veuillez ajouter au moins un compte.')
      return
    }

    // Save to Excel
    useInvestmentStore.setState({
      onboardingData: { accounts: finalAccounts, currentStep: 0 },
    })
    await saveOnboardingData()
    window.location.reload()
  }

  const generateAccountName = (account) => {
    const typeLabel = ACCOUNT_TYPES.find((t) => t.id === account.type)?.label || account.customType || account.type
    const platformLabel = PLATFORMS.find((p) => p.id === account.plateforme)?.label || account.customPlateforme || account.plateforme
    return `${typeLabel} - ${platformLabel}`
  }

  const canProceed = () => {
    switch (STEPS[currentStep].id) {
      case 'welcome':
        return true
      case 'type':
        return currentAccount.type && (currentAccount.type !== 'autre' || currentAccount.customType)
      case 'platform':
        return currentAccount.plateforme && (currentAccount.plateforme !== 'autre' || currentAccount.customPlateforme)
      case 'regular':
        return true // Optional step
      case 'current':
        return true // Optional step
      case 'summary':
        return accounts.length > 0 || (currentAccount.type && currentAccount.plateforme)
      default:
        return true
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center pb-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <TrendingUp className="h-10 w-10 text-primary" />
            <span className="text-2xl font-bold">Investment Manager</span>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2">
            Etape {currentStep + 1} sur {STEPS.length}
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

          {/* Step: Account Type */}
          {STEPS[currentStep].id === 'type' && (
            <div className="space-y-6">
              <div className="text-center">
                <CardTitle>Type de compte</CardTitle>
                <CardDescription>Selectionnez le type de compte a ajouter</CardDescription>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {ACCOUNT_TYPES.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setCurrentAccount({ ...currentAccount, type: type.id })}
                    className={cn(
                      'p-4 rounded-lg border-2 text-left transition-all',
                      currentAccount.type === type.id
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    )}
                  >
                    <p className="font-medium">{type.label}</p>
                    <p className="text-xs text-muted-foreground">{type.description}</p>
                  </button>
                ))}
              </div>
              {currentAccount.type === 'autre' && (
                <div className="space-y-2">
                  <Label>Nom du type de compte</Label>
                  <Input
                    value={currentAccount.customType}
                    onChange={(e) =>
                      setCurrentAccount({ ...currentAccount, customType: e.target.value })
                    }
                    placeholder="Ex: Crowdfunding immobilier"
                  />
                </div>
              )}
            </div>
          )}

          {/* Step: Platform */}
          {STEPS[currentStep].id === 'platform' && (
            <div className="space-y-6">
              <div className="text-center">
                <CardTitle>Plateforme / Courtier</CardTitle>
                <CardDescription>Ou est heberge ce compte ?</CardDescription>
              </div>
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {PLATFORM_CATEGORIES.map((category) => {
                  const categoryPlatforms = PLATFORMS.filter(p => p.category === category.id)
                  if (categoryPlatforms.length === 0) return null
                  return (
                    <div key={category.id} className="space-y-2">
                      <p className="text-sm font-semibold text-muted-foreground">{category.label}</p>
                      <div className="grid grid-cols-3 gap-2">
                        {categoryPlatforms.map((platform) => (
                          <button
                            key={platform.id}
                            onClick={() =>
                              setCurrentAccount({ ...currentAccount, plateforme: platform.id })
                            }
                            className={cn(
                              'p-2 rounded-lg border-2 text-sm transition-all',
                              currentAccount.plateforme === platform.id
                                ? 'border-primary bg-primary/5'
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
              {currentAccount.plateforme === 'autre' && (
                <div className="space-y-2">
                  <Label>Nom de la plateforme</Label>
                  <Input
                    value={currentAccount.customPlateforme}
                    onChange={(e) =>
                      setCurrentAccount({ ...currentAccount, customPlateforme: e.target.value })
                    }
                    placeholder="Ex: Ma banque"
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label>Nom personnalise du compte (optionnel)</Label>
                <Input
                  value={currentAccount.nom}
                  onChange={(e) => setCurrentAccount({ ...currentAccount, nom: e.target.value })}
                  placeholder={generateAccountName(currentAccount)}
                />
              </div>
            </div>
          )}

          {/* Step: Regular Investment */}
          {STEPS[currentStep].id === 'regular' && (
            <div className="space-y-6">
              <div className="text-center">
                <CardTitle>Investissement regulier</CardTitle>
                <CardDescription>
                  Configurez vos versements programmes (optionnel)
                </CardDescription>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Montant</Label>
                  <div className="relative">
                    <Input
                      type="number"
                      value={currentAccount.investissementRegulier}
                      onChange={(e) =>
                        setCurrentAccount({
                          ...currentAccount,
                          investissementRegulier: e.target.value,
                        })
                      }
                      placeholder="0"
                      className="pr-12"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      EUR
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Frequence</Label>
                  <Select
                    value={currentAccount.frequence}
                    onValueChange={(value) =>
                      setCurrentAccount({ ...currentAccount, frequence: value })
                    }
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

          {/* Step: Current Situation */}
          {STEPS[currentStep].id === 'current' && (
            <div className="space-y-6">
              <div className="text-center">
                <CardTitle>Situation actuelle</CardTitle>
                <CardDescription>Quelle est la valeur actuelle de ce compte ?</CardDescription>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Total deja investi</Label>
                  <div className="relative">
                    <Input
                      type="number"
                      value={currentAccount.totalInvesti}
                      onChange={(e) =>
                        setCurrentAccount({ ...currentAccount, totalInvesti: e.target.value })
                      }
                      placeholder="0"
                      className="pr-12"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      EUR
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Somme totale que vous avez versee sur ce compte
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Valeur actuelle</Label>
                  <div className="relative">
                    <Input
                      type="number"
                      value={currentAccount.valeurActuelle}
                      onChange={(e) =>
                        setCurrentAccount({ ...currentAccount, valeurActuelle: e.target.value })
                      }
                      placeholder="0"
                      className="pr-12"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      EUR
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Valeur totale du compte aujourd'hui
                  </p>
                </div>
                {currentAccount.totalInvesti && currentAccount.valeurActuelle && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Performance estimee</p>
                    <p
                      className={cn(
                        'text-2xl font-bold',
                        parseFloat(currentAccount.valeurActuelle) >=
                          parseFloat(currentAccount.totalInvesti)
                          ? 'text-green-600'
                          : 'text-red-600'
                      )}
                    >
                      {(
                        ((parseFloat(currentAccount.valeurActuelle) -
                          parseFloat(currentAccount.totalInvesti)) /
                          parseFloat(currentAccount.totalInvesti)) *
                        100
                      ).toFixed(2)}
                      %
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step: Summary */}
          {STEPS[currentStep].id === 'summary' && (
            <div className="space-y-6">
              <div className="text-center">
                <CardTitle>Resume</CardTitle>
                <CardDescription>Verifiez vos comptes avant de terminer</CardDescription>
              </div>

              {/* Current account being added */}
              {currentAccount.type && currentAccount.plateforme && (
                <div className="p-4 border-2 border-dashed border-primary rounded-lg bg-primary/5">
                  <p className="text-sm font-medium text-primary mb-2">Compte en cours d'ajout</p>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">
                        {currentAccount.nom || generateAccountName(currentAccount)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {ACCOUNT_TYPES.find((t) => t.id === currentAccount.type)?.label ||
                          currentAccount.customType}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {formatCurrency(parseFloat(currentAccount.valeurActuelle) || 0)}
                      </p>
                      {currentAccount.investissementRegulier && (
                        <p className="text-xs text-muted-foreground">
                          +{formatCurrency(parseFloat(currentAccount.investissementRegulier))}/
                          {FREQUENCIES.find((f) => f.id === currentAccount.frequence)?.label.toLowerCase()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Already added accounts */}
              {accounts.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Comptes ajoutes</p>
                  {accounts.map((account, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-4 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{account.nom}</p>
                        <p className="text-sm text-muted-foreground">
                          {ACCOUNT_TYPES.find((t) => t.id === account.type)?.label || account.type}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-semibold">{formatCurrency(account.valeurActuelle)}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveAccount(index)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <Button variant="outline" className="w-full" onClick={handleAddAccount}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un autre compte
              </Button>

              {/* Total summary */}
              {(accounts.length > 0 || currentAccount.valeurActuelle) && (
                <div className="p-4 bg-gray-100 rounded-lg">
                  <div className="flex justify-between items-center">
                    <p className="font-medium">Patrimoine total</p>
                    <p className="text-2xl font-bold text-primary">
                      {formatCurrency(
                        accounts.reduce((sum, a) => sum + a.valeurActuelle, 0) +
                          (parseFloat(currentAccount.valeurActuelle) || 0)
                      )}
                    </p>
                  </div>
                </div>
              )}
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
              <Button onClick={handleFinish} disabled={loading || !canProceed()}>
                {loading ? (
                  'Enregistrement...'
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Terminer
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
