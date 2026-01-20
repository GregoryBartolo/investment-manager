import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import useInvestmentStore from '@/stores/investmentStore'

export const ACCOUNT_TYPES = [
  { id: 'assurance-vie', label: 'Assurance vie' },
  { id: 'pea', label: 'PEA' },
  { id: 'cto', label: 'Compte titre (CTO)' },
  { id: 'livret-a', label: 'Livret A' },
  { id: 'ldds', label: 'LDDS' },
  { id: 'lep', label: 'LEP' },
  { id: 'per', label: 'PER' },
  { id: 'scpi', label: 'SCPI' },
  { id: 'crypto', label: 'Crypto' },
  { id: 'autre', label: 'Autre' },
]

export const PLATFORM_CATEGORIES = [
  { id: 'banques-en-ligne', label: 'Banques en ligne' },
  { id: 'banques-traditionnelles', label: 'Banques traditionnelles' },
  { id: 'courtiers', label: 'Courtiers' },
  { id: 'assureurs', label: 'Assureurs' },
  { id: 'crypto', label: 'Plateformes Crypto' },
  { id: 'gestion-patrimoine', label: 'Gestion de patrimoine' },
  { id: 'autre', label: 'Autre' },
]

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

export default function AddAccountDialog({ open, onOpenChange }) {
  const {
    addCompte,
    addTransaction,
    addValorisation,
    fetchAll,
    fetchDashboard,
    loading,
  } = useInvestmentStore()

  const [formData, setFormData] = useState({
    type: '',
    nom: '',
    plateforme: '',
    totalInvesti: '',
    valeurActuelle: '',
  })

  const resetForm = () => {
    setFormData({
      type: '',
      nom: '',
      plateforme: '',
      totalInvesti: '',
      valeurActuelle: '',
    })
  }

  const handleSave = async () => {
    try {
      const today = new Date().toISOString().split('T')[0]

      const newCompte = await addCompte({
        type: formData.type,
        nom: formData.nom || `${ACCOUNT_TYPES.find(t => t.id === formData.type)?.label} - ${PLATFORMS.find(p => p.id === formData.plateforme)?.label}`,
        plateforme: formData.plateforme,
        dateOuverture: today,
      })

      if (formData.totalInvesti) {
        await addTransaction({
          compteId: newCompte.id,
          type: 'depot',
          montant: parseFloat(formData.totalInvesti),
          frequence: 'ponctuel',
          description: 'Investissement initial',
          date: today,
        })
      }

      if (formData.valeurActuelle) {
        await addValorisation({
          compteId: newCompte.id,
          valeur: parseFloat(formData.valeurActuelle),
          date: today,
        })
      }

      resetForm()
      onOpenChange(false)
      await fetchAll()
      await fetchDashboard()
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de l\'enregistrement')
    }
  }

  const handleOpenChange = (open) => {
    if (!open) {
      resetForm()
    }
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un compte</DialogTitle>
          <DialogDescription>
            Renseignez les informations de votre nouveau compte
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Type de compte</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selectionnez un type" />
              </SelectTrigger>
              <SelectContent>
                {ACCOUNT_TYPES.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Plateforme / Courtier</Label>
            <Select
              value={formData.plateforme}
              onValueChange={(value) => setFormData({ ...formData, plateforme: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selectionnez une plateforme" />
              </SelectTrigger>
              <SelectContent>
                {PLATFORMS.map((platform) => (
                  <SelectItem key={platform.id} value={platform.id}>
                    {platform.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Nom du compte (optionnel)</Label>
            <Input
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              placeholder="Ex: PEA principal"
            />
          </div>

          <div className="space-y-2">
            <Label>Total investi</Label>
            <div className="relative">
              <Input
                type="number"
                value={formData.totalInvesti}
                onChange={(e) =>
                  setFormData({ ...formData, totalInvesti: e.target.value })
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
            <Label>Valeur actuelle</Label>
            <div className="relative">
              <Input
                type="number"
                value={formData.valeurActuelle}
                onChange={(e) =>
                  setFormData({ ...formData, valeurActuelle: e.target.value })
                }
                placeholder="0"
                className="pr-12"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                EUR
              </span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Annuler
          </Button>
          <Button
            onClick={handleSave}
            disabled={!formData.type || !formData.plateforme || loading}
          >
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
