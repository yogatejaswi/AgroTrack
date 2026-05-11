import React from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Tractor, LogOut, Menu, X, User, ChevronDown, Settings, Palette } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { isEquipmentManager } from '../utils/roles';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = React.useState(false);
    const [isProfileOpen, setIsProfileOpen] = React.useState(false);
    const [theme, setTheme] = React.useState(localStorage.getItem('theme') || 'light');
    const dropdownRef = React.useRef(null);

    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleThemeChange = (newTheme) => {
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    let navLinks = [];

    if (!user) {
        navLinks = [
            { name: 'Home', path: '/' },
            { name: 'Marketplace', path: '/marketplace' }
        ];
    } else if (isEquipmentManager(user)) {
        navLinks = [
            { name: 'Dashboard', path: '/admin-dashboard' },
            { name: 'Equipment Management', path: '/admin/equipment-management' },
            { name: 'Order Confirmation', path: '/admin/order-confirmation' },
            { name: 'Users', path: '/admin/users' },
            { name: 'Payments', path: '/admin/payments' },
        ];
    } else {
        navLinks = [
            { name: 'Dashboard', path: '/farmer-dashboard' },
            { name: 'Marketplace', path: '/marketplace' },
            { name: 'My Bookings', path: '/my-bookings' },
        ];
    }

    return (
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to={user ? (isEquipmentManager(user) ? '/admin-dashboard' : '/farmer-dashboard') : '/'} className="flex items-center">
                            <Tractor className="h-8 w-8 text-agro-600 mr-2" />
                            <span className="text-2xl font-bold text-gray-900 tracking-tight">Agro<span className="text-agro-600">Track</span></span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden sm:flex sm:items-center sm:space-x-8">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.name}
                                to={link.path}
                                className={({ isActive }) =>
                                    `text-sm font-semibold transition-colors ${isActive ? 'text-agro-600' : 'text-gray-500 hover:text-agro-600'}`
                                }
                            >
                                {link.name}
                            </NavLink>
                        ))}
                        {user ? (
                            <div className="flex items-center space-x-4 relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <User className="w-4 h-4 text-gray-600" />
                                    <span className="text-sm font-medium text-gray-700">{user.name}</span>
                                    <ChevronDown className="w-4 h-4 text-gray-500" />
                                </button>

                                {/* Dropdown Menu */}
                                {isProfileOpen && (
                                    <div className="absolute right-0 mt-12 w-56 bg-white rounded-lg shadow-2xl border border-gray-200 z-50">
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Account</p>
                                        </div>
                                        
                                        <Link
                                            to="/profile"
                                            onClick={() => setIsProfileOpen(false)}
                                            className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center"
                                        >
                                            <User className="w-4 h-4 mr-3 text-gray-500" /> My Profile
                                        </Link>

                                        <div className="border-t border-gray-100 px-4 py-3">
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Settings</p>
                                            
                                            <div className="space-y-2 mb-3">
                                                <p className="text-xs font-bold text-gray-600 flex items-center">
                                                    <Palette className="w-4 h-4 mr-2" /> Appearance
                                                </p>
                                                <div className="flex gap-2 ml-6">
                                                    <button
                                                        onClick={() => handleThemeChange('light')}
                                                        className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                                                            theme === 'light'
                                                                ? 'bg-agro-600 text-white'
                                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                        }`}
                                                    >
                                                        Light
                                                    </button>
                                                    <button
                                                        onClick={() => handleThemeChange('dark')}
                                                        className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                                                            theme === 'dark'
                                                                ? 'bg-agro-600 text-white'
                                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                        }`}
                                                    >
                                                        Dark
                                                    </button>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => {
                                                    setIsProfileOpen(false);
                                                    navigate('/profile');
                                                }}
                                                className="w-full text-left px-0 py-2 text-sm font-medium text-gray-700 hover:text-agro-600 flex items-center"
                                            >
                                                <Settings className="w-4 h-4 mr-3 text-gray-500" /> Edit Profile
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => {
                                                setIsProfileOpen(false);
                                                handleLogout();
                                            }}
                                            className="w-full text-left px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 flex items-center border-t border-gray-100"
                                        >
                                            <LogOut className="w-4 h-4 mr-3" /> Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link to="/login" className="text-sm font-semibold text-gray-500 hover:text-agro-600">Login</Link>
                                <Link to="/register" className="btn-primary px-4 py-2">Sign Up</Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center sm:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="sm:hidden bg-white border-b border-gray-100">
                    <div className="pt-2 pb-3 space-y-1">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.name}
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className={({ isActive }) =>
                                    `block pl-3 pr-4 py-2 text-base font-medium ${isActive ? 'bg-agro-50 text-agro-600' : 'text-gray-500'}`
                                }
                            >
                                {link.name}
                            </NavLink>
                        ))}
                    </div>
                    {user ? (
                        <div className="pt-4 pb-3 border-t border-gray-100 px-4 flex justify-between items-center">
                            <Link to="/profile" onClick={() => setIsOpen(false)}>
                                <p className="text-base font-medium text-gray-800 hover:text-agro-600 transition-colors">{user.name}</p>
                                <p className="text-sm text-gray-500">{user.email}</p>
                            </Link>
                            <button onClick={handleLogout} className="text-red-500 font-bold">Logout</button>
                        </div>
                    ) : (
                        <div className="pt-4 pb-3 border-t border-gray-100 px-4 space-y-2">
                            <Link to="/login" onClick={() => setIsOpen(false)} className="block text-center py-2 font-bold text-gray-500">Login</Link>
                            <Link to="/register" onClick={() => setIsOpen(false)} className="block text-center py-2 btn-primary">Sign Up</Link>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
