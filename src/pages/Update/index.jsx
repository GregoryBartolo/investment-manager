import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Save, ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react'
import useInvestmentStore from '@/stores/investmentStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn, formatCurrency, formatDateShort } from '@/lib/utils'

export default function Update() {
  const navigate = useNavigate()
  const {
    comptes,
    fetchAll,
    addValorisation,
    addTransaction,
    getLatestValorisation,
    loading,
  } = useInvestmentStore()

  const [updates, setUpdates] = useState({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  useEffect(() => {
    // Initialize updates with current values
    const initial = {}
    comptes.forEach((compte) => {
      const latest = getLatestValorisation(compte.id)
      initial[compte.id] = {
        valeurActuelle: latest?.valeur || 0,
        previousValeur: latest?.valeur || 0,
        depot: '',
        retrait: '',
      }
    })
    setUpdates(initial)
  }, [comptes, getLatestValorisation])

  const handleValueChange = (compteId, field, value) => {
    setUpdates((prev) => ({
      ...prev,
      [compteId]: {
        ...prev[compteId],
        [field]: value,
      },
    }))
    setSaved(false)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const today = new Date().toISOString().split('T')[0]

      for (const compte of comptes) {
        const update = updates[compte.id]
        if (!update) continue

        const newValeur = parseFloat(update.valeurActuelle) || 0
        const depot = parseFloat(update.depot) || 0
        const retrait = parseFloat(update.retrait) || 0

        // Add valuation if value changed
        if (newValeur !== update.previousValeur) {
          await addValorisation({
            compteId: compte.id,
            valeur: newValeur,
            date: today,
          })
        }

        // Add deposit transaction if specified
        if (depot > 0) {
          await addTransaction({
            compteId: compte.id,
            type: 'depot',
            montant: depot,
            frequence: 'ponctuel',
            description: 'Versement mensuel',
            date: today,
          })
        }

        // Add withdrawal transaction if specified
        if (retrait > 0) {
          await addTransaction({
            compteId: compte.id,
            type: 'retrait',
            montant: retrait,
            frequence: 'ponctuel',
            description: 'Retrait',
            date: today,
          })
        }
      }

      setSaved(true)
      await fetchAll()
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
      alert('Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  const currentMonth = new Date().toLocaleDateString('fr-FR', {
    month: 'long',
    year: 'numeric',
  })

  const calculateChange = (compteId) => {
    const update = updates[compteId]
    if (!update) return 0
    const newValeur = parseFloat(update.valeurActuelle) || 0
    const previousValeur = update.previousValeur || 0
    const depot = parseFloat(update.depot) || 0
    const retrait = parseFloat(update.retrait) || 0
    // Performance = new value - previous value - deposits + withdrawals
    return newValeur - previousValeur - depot + retrait
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Mise a jour</h1>
          <p className="text-muted-foreground capitalize">{currentMonth}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Enregistrement...' : saved ? 'Enregistre !' : 'Enregistrer'}
          </Button>
        </div>
      </div>

      {saved && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 text-sm">
            Les modifications ont ete enregistrees dans le fichier Excel.
          </p>
        </div>
      )}

      {/* Update Forms */}
      <div className="space-y-4">
        {comptes.map((compte) => {
          const update = updates[compte.id]
          const change = calculateChange(compte.id)
          const latest = getLatestValorisation(compte.id)

          return (
            <Card key={compte.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{compte.nom}</CardTitle>
                    <CardDescription>{compte.plateforme}</CardDescription>
                  </div>
                  {change !== 0 && (
                    <div
                      className={cn(
                        'flex items-center gap-1 px-2 py-1 rounded text-sm font-medium',
                        change >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      )}
                    >
                      {change >= 0 ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                      {change >= 0 ? '+' : ''}{formatCurrency(change)}
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-3">
                  {/* Current Value */}
                  <div className="space-y-2">
                    <Label>Valeur actuelle</Label>
                    <div className="relative">
                      <Input
                        type="number"
                        value={update?.valeurActuelle || ''}
                        onChange={(e) =>
                          handleValueChange(compte.id, 'valeurActuelle', e.target.value)
                        }
                        className="pr-12"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                        EUR
                      </span>
                    </div>
                    {latest && (
                      <p className="text-xs text-muted-foreground">
                        Precedente: {formatCurrency(latest.valeur)} ({formatDateShort(latest.date)})
                      </p>
                    )}
                  </div>

                  {/* Deposit */}
                  <div className="space-y-2">
                    <Label>Depot ce mois</Label>
                    <div className="relative">
                      <Input
                        type="number"
                        value={update?.depot || ''}
                        onChange={(e) => handleValueChange(compte.id, 'depot', e.target.value)}
                        placeholder="0"
                        className="pr-12"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                        EUR
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">Versement effectue</p>
                  </div>

                  {/* Withdrawal */}
                  <div className="space-y-2">
                    <Label>Retrait ce mois</Label>
                    <div className="relative">
                      <Input
                        type="number"
                        value={update?.retrait || ''}
                        onChange={(e) => handleValueChange(compte.id, 'retrait', e.target.value)}
                        placeholder="0"
                        className="pr-12"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                        EUR
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">Retrait effectue</p>
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
            <p className="text-muted-foreground">Aucun compte a mettre a jour</p>
          </CardContent>
        </Card>
      )}

      {/* Save Button (bottom) */}
      {comptes.length > 0 && (
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving} size="lg">
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Enregistrement...' : saved ? 'Enregistre !' : 'Enregistrer les modifications'}
          </Button>
        </div>
      )}
    </div>
  )
}
