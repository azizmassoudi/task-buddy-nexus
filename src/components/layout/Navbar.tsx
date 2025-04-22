
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import {
  Bell,
  Menu,
  User,
  Search,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const Navbar = () => {
  const { user, logout, currentRole, switchRole } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const roleLabels: Record<NonNullable<UserRole>, string> = {
    admin: 'Admin Dashboard',
    subcontractor: 'Contractor Dashboard',
    client: 'Client Dashboard',
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSwitchRole = (role: UserRole) => {
    if (role === null) return;
    switchRole(role);
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="h-8 w-8 bg-brand-300 rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="ml-2 text-xl font-semibold text-gray-900">
                ServiceConnect
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <a
                href="/"
                className="border-brand-300 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Home
              </a>
              <a
                href="/services"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Services
              </a>
              <a
                href="/about"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                About
              </a>
              {user && currentRole === 'admin' && (
                <a
                  href="/admin/dashboard"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Admin
                </a>
              )}
            </div>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <div className="flex space-x-4 items-center">
              {/* Search Icon */}
              <button className="p-2 rounded-full text-gray-500 hover:text-gray-900 focus:outline-none">
                <Search className="h-5 w-5" />
              </button>
              
              {/* Notification Bell */}
              {user && (
                <button className="p-2 rounded-full text-gray-500 hover:text-gray-900 focus:outline-none">
                  <Bell className="h-5 w-5" />
                </button>
              )}

              {/* User Menu */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-300">
                      <span className="sr-only">Open user menu</span>
                      {user.avatar ? (
                        <img 
                          className="h-8 w-8 rounded-full" 
                          src={user.avatar} 
                          alt={user.name}
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-brand-300 flex items-center justify-center">
                          <span className="text-white font-medium">
                            {user.name?.charAt(0)}
                          </span>
                        </div>
                      )}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="font-normal">
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>
                      <p className="text-xs font-medium text-gray-500">SWITCH ROLE</p>
                    </DropdownMenuLabel>
                    <DropdownMenuItem
                      className={`flex items-center ${currentRole === 'admin' ? 'bg-brand-50' : ''}`}
                      onClick={() => handleSwitchRole('admin')}
                    >
                      Admin View
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className={`flex items-center ${currentRole === 'subcontractor' ? 'bg-brand-50' : ''}`}
                      onClick={() => handleSwitchRole('subcontractor')}
                    >
                      Contractor View
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className={`flex items-center ${currentRole === 'client' ? 'bg-brand-50' : ''}`}
                      onClick={() => handleSwitchRole('client')}
                    >
                      Client View
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="text-red-500">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button onClick={handleLogin} variant="default" className="bg-brand-300 hover:bg-brand-400">
                  Login
                </Button>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-300"
            >
              <span className="sr-only">Open main menu</span>
              <Menu className="block h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <a
              href="/"
              className="bg-brand-50 border-brand-300 text-brand-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            >
              Home
            </a>
            <a
              href="/services"
              className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            >
              Services
            </a>
            <a
              href="/about"
              className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            >
              About
            </a>
            {user && currentRole === 'admin' && (
              <a
                href="/admin/dashboard"
                className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
              >
                Admin
              </a>
            )}
          </div>

          {user ? (
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-4">
                {user.avatar ? (
                  <img className="h-10 w-10 rounded-full" src={user.avatar} alt="" />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-brand-300 flex items-center justify-center text-white">
                    {user.name.charAt(0)}
                  </div>
                )}
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">{user.name}</div>
                  <div className="text-sm font-medium text-gray-500">{user.email}</div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <div className="px-4 py-2 text-sm text-gray-500 font-medium">SWITCH ROLE</div>
                <a
                  href="#"
                  onClick={() => handleSwitchRole('admin')}
                  className={`block px-4 py-2 text-base font-medium ${
                    currentRole === 'admin'
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  Admin View
                </a>
                <a
                  href="#"
                  onClick={() => handleSwitchRole('subcontractor')}
                  className={`block px-4 py-2 text-base font-medium ${
                    currentRole === 'subcontractor'
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  Contractor View
                </a>
                <a
                  href="#"
                  onClick={() => handleSwitchRole('client')}
                  className={`block px-4 py-2 text-base font-medium ${
                    currentRole === 'client'
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  Client View
                </a>
                <div className="border-t border-gray-200 pt-2">
                  <a
                    href="/profile"
                    className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                  >
                    Profile
                  </a>
                  <a
                    href="/settings"
                    className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                  >
                    Settings
                  </a>
                  <a
                    href="#"
                    onClick={logout}
                    className="block px-4 py-2 text-base font-medium text-red-500 hover:bg-gray-100"
                  >
                    Log out
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="px-4 flex">
                <Button onClick={handleLogin} className="w-full bg-brand-300 hover:bg-brand-400">
                  Login
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
