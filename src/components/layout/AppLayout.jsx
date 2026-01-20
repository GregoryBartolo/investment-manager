import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Wallet,
  RefreshCw,
  TrendingUp,
  Menu,
  X,
  Plus,
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import AddAccountDialog from '@/components/AddAccountDialog'

const navigation = [
  { name: 'Tableau de bord', href: '/', icon: LayoutDashboard },
  { name: 'Mes comptes', href: '/comptes', icon: Wallet },
  { name: 'Mise a jour', href: '/mise-a-jour', icon: RefreshCw },
]

export default function AppLayout({ children }) {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showAddAccount, setShowAddAccount] = useState(false)

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
          'fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-200 lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-16 items-center gap-2 px-6 border-b">
          <TrendingUp className="h-8 w-8 text-primary" />
          <span className="font-bold text-lg">Investment Manager</span>
        </div>

        <nav className="p-4 space-y-1">
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

        <div className="absolute bottom-4 left-4 right-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-800">
              Donnees 100% locales
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Vos donnees restent sur votre ordinateur
            </p>
          </div>
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
    </div>
  )
}
