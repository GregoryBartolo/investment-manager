import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowUpRight,
  RefreshCw,
  Calendar,
  ChevronRight,
  Sparkles,
} from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import useInvestmentStore from '@/stores/investmentStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn, formatCurrency, formatPercent } from '@/lib/utils'

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#6366f1', '#ec4899']

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
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground text-sm">Chargement...</p>
        </div>
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

  // Calculate total recurring investments
  const totalRecurring = comptes.reduce((sum, c) => sum + (c.versementRegulier?.montant || 0), 0)

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Hero Section - Patrimoine Total */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
        <div className="relative">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <p className="text-slate-400 text-sm font-medium mb-1">Patrimoine total</p>
              <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">{formatCurrency(patrimoineTotal)}</h1>
              <div className="flex items-center gap-4 mt-3">
                <div className={cn(
                  "flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium",
                  performanceGlobale >= 0 ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
                )}>
                  {performanceGlobale >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  {formatPercent(performanceGlobale)}
                </div>
                <span className="text-slate-400 text-sm">
                  {plusValue >= 0 ? '+' : ''}{formatCurrency(plusValue)} depuis le debut
                </span>
              </div>
            </div>
            <Link to="/mise-a-jour">
              <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100">
                <RefreshCw className="h-4 w-4 mr-2" />
                Mettre a jour
              </Button>
            </Link>
          </div>

          {/* Mini Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/10">
            <div>
              <p className="text-slate-400 text-xs uppercase tracking-wider">Investi</p>
              <p className="text-xl font-semibold mt-1">{formatCurrency(totalInvesti)}</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs uppercase tracking-wider">Ce mois</p>
              <p className="text-xl font-semibold mt-1">{formatCurrency(depositsThisMonth)}</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs uppercase tracking-wider">Versements auto</p>
              <p className="text-xl font-semibold mt-1">{formatCurrency(totalRecurring)}<span className="text-sm text-slate-400">/mois</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Accounts Section - 3 columns */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Mes comptes</h2>
            <Link to="/comptes" className="text-sm text-primary hover:underline flex items-center gap-1">
              Voir tout <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="space-y-3">
            {comptes.map((compte, index) => (
              <div
                key={compte.id}
                className="group relative bg-white rounded-xl border p-4 hover:shadow-lg hover:border-slate-200 transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  {/* Color indicator */}
                  <div
                    className="w-1 h-12 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 truncate">{compte.nom}</p>
                    <p className="text-sm text-slate-500">{compte.plateforme}</p>
                  </div>

                  {/* Versement regulier */}
                  {compte.versementRegulier && (
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg">
                      <Calendar className="h-3.5 w-3.5 text-blue-600" />
                      <span className="text-sm font-medium text-blue-700">
                        {formatCurrency(compte.versementRegulier.montant)}
                        <span className="text-blue-500 font-normal">
                          {FREQUENCE_LABELS[compte.versementRegulier.frequence]}
                        </span>
                      </span>
                    </div>
                  )}

                  {/* Performance */}
                  <div className={cn(
                    "text-sm font-semibold px-2 py-1 rounded",
                    compte.performance >= 0 ? "text-emerald-700 bg-emerald-50" : "text-red-700 bg-red-50"
                  )}>
                    {formatPercent(compte.performance)}
                  </div>

                  {/* Valeur */}
                  <div className="text-right min-w-[100px]">
                    <p className="font-semibold text-slate-900">{formatCurrency(compte.valeurActuelle)}</p>
                  </div>
                </div>
              </div>
            ))}

            {comptes.length === 0 && (
              <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed">
                <Wallet className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">Aucun compte pour l'instant</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Allocation */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Repartition</CardTitle>
            </CardHeader>
            <CardContent>
              {allocation.length > 0 ? (
                <div className="flex items-center gap-4">
                  <div className="w-28 h-28">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={allocation}
                          cx="50%"
                          cy="50%"
                          innerRadius={30}
                          outerRadius={50}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {allocation.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex-1 space-y-2">
                    {allocation.slice(0, 4).map((item, index) => (
                      <div key={item.name} className="flex items-center gap-2">
                        <div
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-xs text-slate-600 truncate flex-1">{item.name}</span>
                        <span className="text-xs font-medium">{item.percentage.toFixed(0)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-400 text-center py-4">Aucune donnee</p>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
              <p className="text-blue-100 text-xs uppercase tracking-wider">Comptes</p>
              <p className="text-2xl font-bold mt-1">{comptes.length}</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-4 text-white">
              <p className="text-emerald-100 text-xs uppercase tracking-wider">Plus-value</p>
              <p className="text-2xl font-bold mt-1">{plusValue >= 0 ? '+' : ''}{formatCurrency(plusValue)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Evolution Chart - Full Width */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium">Evolution du patrimoine</CardTitle>
            <span className="text-xs text-slate-400">12 derniers mois</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historique}>
                <defs>
                  <linearGradient id="colorValeur" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  tickFormatter={(value) =>
                    new Intl.NumberFormat('fr-FR', {
                      notation: 'compact',
                      compactDisplay: 'short',
                    }).format(value)
                  }
                  dx={-10}
                />
                <Tooltip
                  formatter={(value) => [formatCurrency(value), 'Valeur']}
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                  labelStyle={{ color: '#94a3b8' }}
                />
                <Area
                  type="monotone"
                  dataKey="valeur"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="url(#colorValeur)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
