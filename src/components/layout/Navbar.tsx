import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '@/contexts/AuthContext';
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
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authState, setAuthState] = useState({
    user: null as any,
    isAuthenticated: false
  });

  // Update auth state when localStorage changes
  useEffect(() => {
    const getAuthData = () => {
      const userData = localStorage.getItem('userRole');
      const token = localStorage.getItem('token');
      return {
        user: userData ? userData : null,
        isAuthenticated: !!token
      };
    };

    // Set initial state
    setAuthState(getAuthData());

    // Listen for storage changes
    const handleStorageChange = () => {
      setAuthState(getAuthData());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const { user, isAuthenticated } = authState;

  const roleLabels: Record<NonNullable<UserRole>, string> = {
    admin: 'Admin Dashboard',
    subcontractor: 'Contractor Dashboard',
    client: 'Client Dashboard',
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    setAuthState({ user: null, isAuthenticated: false });
    navigate('/login');
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
              {user && user.role === 'admin' && (
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
              {isAuthenticated && (
                <button className="p-2 rounded-full text-gray-500 hover:text-gray-900 focus:outline-none">
                  <Bell className="h-5 w-5" />
                </button>
              )}

              {/* User Menu */}
              {isAuthenticated && user ? (
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
                      className={`flex items-center ${user.role === 'admin' ? 'bg-brand-50' : ''}`}
                      onClick={() => navigate('/admin/dashboard')}
                    >
                      Admin View
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className={`flex items-center ${user.role === 'subcontractor' ? 'bg-brand-50' : ''}`}
                      onClick={() => navigate('/contractor/dashboard')}
                    >
                      Contractor View
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className={`flex items-center ${user.role === 'client' ? 'bg-brand-50' : ''}`}
                      onClick={() => navigate('/client/dashboard')}
                    >
                      Client View
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-500">
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
            {user && user.role === 'admin' && (
              <a
                href="/admin/dashboard"
                className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
              >
                Admin
              </a>
            )}
          </div>

          {isAuthenticated && user ? (
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
                  onClick={() => navigate('/admin/dashboard')}
                  className={`block px-4 py-2 text-base font-medium ${
                    user.role === 'admin'
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  Admin View
                </a>
                <a
                  href="#"
                  onClick={() => navigate('/contractor/dashboard')}
                  className={`block px-4 py-2 text-base font-medium ${
                    user.role === 'subcontractor'
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  Contractor View
                </a>
                <a
                  href="#"
                  onClick={() => navigate('/client/dashboard')}
                  className={`block px-4 py-2 text-base font-medium ${
                    user.role === 'client'
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
                    onClick={handleLogout}
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
