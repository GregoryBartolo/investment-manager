import { useEffect, useState } from 'react'
import {
  Plus,
  Trash2,
  Edit2,
  TrendingUp,
  TrendingDown,
  MoreVertical,
  X,
} from 'lucide-react'
import useInvestmentStore from '@/stores/investmentStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn, formatCurrency, formatPercent, formatDate } from '@/lib/utils'

const ACCOUNT_TYPES = [
  { id: 'assurance-vie', label: 'Assurance vie' },
  { id: 'pea', label: 'PEA' },
  { id: 'cto', label: 'Compte titre (CTO)' },
  { id: 'livret', label: 'Livret A / LDDS / LEP' },
  { id: 'per', label: 'PER' },
  { id: 'scpi', label: 'SCPI' },
  { id: 'crypto', label: 'Crypto' },
  { id: 'autre', label: 'Autre' },
]

const PLATFORMS = [
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

export default function Accounts() {
  const {
    comptes,
    transactions,
    fetchAll,
    fetchDashboard,
    dashboard,
    addCompte,
    updateCompte,
    deleteCompte,
    addTransaction,
    addValorisation,
    getLatestValorisation,
    getTransactionsForCompte,
    loading,
  } = useInvestmentStore()

  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedCompte, setSelectedCompte] = useState(null)
  const [formData, setFormData] = useState({
    type: '',
    nom: '',
    plateforme: '',
    totalInvesti: '',
    valeurActuelle: '',
  })

  useEffect(() => {
    fetchAll()
    fetchDashboard()
  }, [fetchAll, fetchDashboard])

  const handleOpenAdd = () => {
    setSelectedCompte(null)
    setFormData({
      type: '',
      nom: '',
      plateforme: '',
      totalInvesti: '',
      valeurActuelle: '',
    })
    setShowAddDialog(true)
  }

  const handleOpenEdit = (compte) => {
    const compteDetails = dashboard?.comptes?.find(c => c.id === compte.id)
    setSelectedCompte(compte)
    setFormData({
      type: compte.type,
      nom: compte.nom,
      plateforme: compte.plateforme,
      totalInvesti: compteDetails?.totalInvesti || '',
      valeurActuelle: compteDetails?.valeurActuelle || '',
    })
    setShowAddDialog(true)
  }

  const handleSave = async () => {
    try {
      const today = new Date().toISOString().split('T')[0]

      if (selectedCompte) {
        // Update existing
        await updateCompte(selectedCompte.id, {
          type: formData.type,
          nom: formData.nom,
          plateforme: formData.plateforme,
        })

        // Add new valuation if value changed
        if (formData.valeurActuelle) {
          await addValorisation({
            compteId: selectedCompte.id,
            valeur: parseFloat(formData.valeurActuelle),
            date: today,
          })
        }
      } else {
        // Create new
        const newCompte = await addCompte({
          type: formData.type,
          nom: formData.nom || `${ACCOUNT_TYPES.find(t => t.id === formData.type)?.label} - ${PLATFORMS.find(p => p.id === formData.plateforme)?.label}`,
          plateforme: formData.plateforme,
          dateOuverture: today,
        })

        // Add initial deposit if specified
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

        // Add initial valuation if specified
        if (formData.valeurActuelle) {
          await addValorisation({
            compteId: newCompte.id,
            valeur: parseFloat(formData.valeurActuelle),
            date: today,
          })
        }
      }

      setShowAddDialog(false)
      await fetchAll()
      await fetchDashboard()
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de l\'enregistrement')
    }
  }

  const handleDelete = async () => {
    if (!selectedCompte) return

    try {
      await deleteCompte(selectedCompte.id)
      setShowDeleteDialog(false)
      setSelectedCompte(null)
      await fetchDashboard()
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la suppression')
    }
  }

  const getCompteStats = (compteId) => {
    return dashboard?.comptes?.find(c => c.id === compteId) || null
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Mes comptes</h1>
          <p className="text-muted-foreground">Gerez vos comptes d'investissement</p>
        </div>
        <Button onClick={handleOpenAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un compte
        </Button>
      </div>

      {/* Accounts Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {comptes.map((compte) => {
          const stats = getCompteStats(compte.id)
          const typeLabel = ACCOUNT_TYPES.find(t => t.id === compte.type)?.label || compte.type
          const platformLabel = PLATFORMS.find(p => p.id === compte.plateforme)?.label || compte.plateforme

          return (
            <Card key={compte.id} className="relative">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{compte.nom}</CardTitle>
                    <CardDescription>
                      {typeLabel} - {platformLabel}
                    </CardDescription>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenEdit(compte)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedCompte(compte)
                        setShowDeleteDialog(true)
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm text-muted-foreground">Valeur actuelle</span>
                    <span className="text-xl font-bold">
                      {formatCurrency(stats?.valeurActuelle || 0)}
                    </span>
                  </div>

                  <div className="flex justify-between items-baseline">
                    <span className="text-sm text-muted-foreground">Total investi</span>
                    <span className="font-medium">
                      {formatCurrency(stats?.totalInvesti || 0)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-sm text-muted-foreground">Performance</span>
                    <div
                      className={cn(
                        'flex items-center gap-1 font-semibold',
                        (stats?.performance || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                      )}
                    >
                      {(stats?.performance || 0) >= 0 ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                      {formatPercent(stats?.performance || 0)}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Plus-value</span>
                    <span
                      className={cn(
                        'font-medium',
                        (stats?.plusValue || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                      )}
                    >
                      {(stats?.plusValue || 0) >= 0 ? '+' : ''}
                      {formatCurrency(stats?.plusValue || 0)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {comptes.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">Aucun compte enregistre</p>
            <Button onClick={handleOpenAdd}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter votre premier compte
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedCompte ? 'Modifier le compte' : 'Ajouter un compte'}
            </DialogTitle>
            <DialogDescription>
              {selectedCompte
                ? 'Modifiez les informations du compte'
                : 'Renseignez les informations de votre nouveau compte'}
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

            {!selectedCompte && (
              <>
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
              </>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer le compte</DialogTitle>
            <DialogDescription>
              Etes-vous sur de vouloir supprimer le compte "{selectedCompte?.nom}" ?
              Cette action est irreversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={loading}>
              {loading ? 'Suppression...' : 'Supprimer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
