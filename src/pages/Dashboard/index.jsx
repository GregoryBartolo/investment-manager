import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
  ArrowUpRight,
  RefreshCw,
  Calendar,
} from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import useInvestmentStore from '@/stores/investmentStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn, formatCurrency, formatPercent } from '@/lib/utils'

const COLORS = ['#2563eb', '#7c3aed', '#059669', '#d97706', '#dc2626', '#0891b2', '#4f46e5', '#be185d']

const FREQUENCE_LABELS = {
  mensuel: '/mois',
  trimestriel: '/trim.',
  annuel: '/an',
  hebdomadaire: '/sem.',
}

export default function Dashboard() {
  const { dashboard, fetchDashboard, loading } = useInvestmentStore()

  useEffect(() => {
    fetchDashboard()
  }, [fetchDashboard])

  if (loading && !dashboard) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!dashboard) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Aucune donnee disponible</p>
      </div>
    )
  }

  const {
    patrimoineTotal,
    totalInvesti,
    plusValue,
    performanceGlobale,
    depositsThisMonth,
    comptes,
    historique,
    allocation,
  } = dashboard

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Tableau de bord</h1>
          <p className="text-muted-foreground">Vue d'ensemble de votre patrimoine</p>
        </div>
        <Link to="/mise-a-jour">
          <Button>
            <RefreshCw className="h-4 w-4 mr-2" />
            Mettre a jour
          </Button>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Patrimoine Total</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(patrimoineTotal)}</div>
            <p className="text-xs text-muted-foreground">
              {comptes.length} compte{comptes.length > 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance Globale</CardTitle>
            {performanceGlobale >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div
              className={cn(
                'text-2xl font-bold',
                performanceGlobale >= 0 ? 'text-green-600' : 'text-red-600'
              )}
            >
              {formatPercent(performanceGlobale)}
            </div>
            <p className="text-xs text-muted-foreground">
              {plusValue >= 0 ? '+' : ''}{formatCurrency(plusValue)} de plus-value
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Investi</CardTitle>
            <PiggyBank className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalInvesti)}</div>
            <p className="text-xs text-muted-foreground">Capital initial</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ce mois-ci</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(depositsThisMonth)}</div>
            <p className="text-xs text-muted-foreground">Versements</p>
          </CardContent>
        </Card>
      </div>

      {/* Accounts List - Main Focus */}
      <Card>
        <CardHeader>
          <CardTitle>Mes comptes</CardTitle>
          <CardDescription>Valeurs actuelles et versements reguliers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {comptes.map((compte) => (
              <div
                key={compte.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-semibold text-lg">{compte.nom}</p>
                  <p className="text-sm text-muted-foreground">{compte.plateforme}</p>
                </div>

                <div className="flex items-center gap-6">
                  {/* Versement regulier */}
                  {compte.versementRegulier && (
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>Versement</span>
                      </div>
                      <p className="font-medium text-primary">
                        {formatCurrency(compte.versementRegulier.montant)}
                        <span className="text-xs text-muted-foreground">
                          {FREQUENCE_LABELS[compte.versementRegulier.frequence] || ''}
                        </span>
                      </p>
                    </div>
                  )}

                  {/* Performance */}
                  <div className="text-right min-w-[80px]">
                    <p className="text-sm text-muted-foreground">Perf.</p>
                    <p
                      className={cn(
                        'font-semibold',
                        compte.performance >= 0 ? 'text-green-600' : 'text-red-600'
                      )}
                    >
                      {formatPercent(compte.performance)}
                    </p>
                  </div>

                  {/* Valeur actuelle */}
                  <div className="text-right min-w-[120px]">
                    <p className="text-sm text-muted-foreground">Valeur</p>
                    <p className="font-bold text-lg">{formatCurrency(compte.valeurActuelle)}</p>
                  </div>
                </div>
              </div>
            ))}
            {comptes.length === 0 && (
              <p className="text-center text-muted-foreground py-8">Aucun compte</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Charts Section - Bottom */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Evolution Chart */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Evolution du patrimoine</CardTitle>
            <CardDescription>12 derniers mois</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historique}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="label"
                    className="text-xs"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis
                    className="text-xs"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    tickFormatter={(value) =>
                      new Intl.NumberFormat('fr-FR', {
                        notation: 'compact',
                        compactDisplay: 'short',
                      }).format(value)
                    }
                  />
                  <Tooltip
                    formatter={(value) => [formatCurrency(value), 'Valeur']}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="valeur"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Allocation Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Repartition</CardTitle>
            <CardDescription>Par type de compte</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              {allocation.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={allocation}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={85}
                      paddingAngle={2}
                      dataKey="value"
                      nameKey="name"
                    >
                      {allocation.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => formatCurrency(value)}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Aucune donnee
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Resume</CardTitle>
            <CardDescription>Statistiques globales</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                <span className="text-muted-foreground">Nombre de comptes</span>
                <span className="font-semibold">{comptes.length}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                <span className="text-muted-foreground">Total investi</span>
                <span className="font-semibold">{formatCurrency(totalInvesti)}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                <span className="text-muted-foreground">Plus-value totale</span>
                <span className={cn(
                  'font-semibold',
                  plusValue >= 0 ? 'text-green-600' : 'text-red-600'
                )}>
                  {plusValue >= 0 ? '+' : ''}{formatCurrency(plusValue)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                <span className="text-muted-foreground">Versements ce mois</span>
                <span className="font-semibold">{formatCurrency(depositsThisMonth)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
