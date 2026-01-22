import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Wallet,
  RefreshCw,
  TrendingUp,
  Menu,
  Plus,
  Settings,
  Trash2,
  AlertTriangle,
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import AddAccountDialog from '@/components/AddAccountDialog'
import { resetData } from '@/services/api'

const navigation = [
  { name: 'Tableau de bord', href: '/', icon: LayoutDashboard },
  { name: 'Mes comptes', href: '/comptes', icon: Wallet },
  { name: 'Mise a jour', href: '/mise-a-jour', icon: RefreshCw },
]

export default function AppLayout({ children }) {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showAddAccount, setShowAddAccount] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [resetting, setResetting] = useState(false)

  const handleReset = async () => {
    setResetting(true)
    try {
      await resetData()
      window.location.href = '/'
    } catch (error) {
      console.error('Erreur lors de la reinitialisation:', error)
      alert('Erreur lors de la reinitialisation')
    } finally {
      setResetting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-200 lg:translate-x-0 flex flex-col',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-16 items-center gap-2 px-6 border-b">
          <TrendingUp className="h-8 w-8 text-primary" />
          <span className="font-bold text-lg">Investment Manager</span>
        </div>

        <nav className="p-4 space-y-1 flex-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            )
          })}

          <Button
            onClick={() => setShowAddAccount(true)}
            className="w-full mt-4"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un compte
          </Button>
        </nav>

        {/* Bottom section */}
        <div className="p-4 space-y-3">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-800">
              Donnees 100% locales
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Vos donnees restent sur votre ordinateur
            </p>
          </div>

          <Button
            variant="ghost"
            className="w-full justify-start text-gray-500 hover:text-gray-700"
            onClick={() => setShowSettings(true)}
          >
            <Settings className="h-4 w-4 mr-2" />
            Reglages
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Mobile header */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white px-4 lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>
          <div className="flex items-center gap-2 flex-1">
            <TrendingUp className="h-6 w-6 text-primary" />
            <span className="font-bold">Investment Manager</span>
          </div>
          <Button
            size="icon"
            onClick={() => setShowAddAccount(true)}
          >
            <Plus className="h-5 w-5" />
          </Button>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-8">{children}</main>
      </div>

      {/* Add Account Dialog */}
      <AddAccountDialog open={showAddAccount} onOpenChange={setShowAddAccount} />

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reglages</DialogTitle>
            <DialogDescription>
              Gerez les parametres de l'application
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-red-900">Zone de danger</p>
                  <p className="text-sm text-red-700 mt-1">
                    Supprimer toutes les donnees et recommencer a zero.
                    Cette action est irreversible.
                  </p>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="mt-3"
                    onClick={() => {
                      setShowSettings(false)
                      setShowResetConfirm(true)
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Reinitialiser l'application
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reset Confirmation Dialog */}
      <Dialog open={showResetConfirm} onOpenChange={setShowResetConfirm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Confirmer la reinitialisation
            </DialogTitle>
            <DialogDescription>
              Etes-vous absolument sur de vouloir supprimer toutes vos donnees ?
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                <strong>Attention :</strong> Cette action va supprimer tous vos comptes,
                transactions et valorisations. Le fichier Excel sera reinitialise
                et vous devrez recommencer la configuration depuis le debut.
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowResetConfirm(false)}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleReset}
              disabled={resetting}
            >
              {resetting ? 'Reinitialisation...' : 'Oui, tout supprimer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
