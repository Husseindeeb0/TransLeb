import { Car, Globe, User, LogIn, LogOut, UserPlus, LayoutGrid, Home as HomeIcon, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useLogoutMutation } from '../../state/services/auth/authAPI';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await logout({}).unwrap();
      toast.success('Successfully signed out');
      setIsProfileOpen(false);
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err);
      toast.error('Logout failed. Please try again.');
    }
  };

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??';
  };

  return (
    <nav className="bg-white shadow-lg border-b-4 border-green-600 sticky top-0 z-50 font-inter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Left Side */}
          <div className="flex items-center space-x-12">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="bg-gradient-to-br from-red-600 to-green-600 p-2.5 rounded-2xl shadow-lg group-hover:rotate-12 transition-transform duration-300">
                <Car className="h-7 w-7 text-white" />
              </div>
              <div className="text-3xl font-black italic tracking-tighter bg-gradient-to-r from-red-700 via-red-600 to-green-600 bg-clip-text text-transparent uppercase">
                TransLeb
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-2">
              <Link
                to="/home"
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-red-600 transition-all duration-300 font-black uppercase text-[11px] tracking-widest border border-transparent hover:border-gray-100"
              >
                <HomeIcon className="h-4 w-4" />
                <span>Home</span>
              </Link>
              {isAuthenticated && (
                <>
                  <Link
                    to="/dashboard"
                    className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-300 font-black uppercase text-[11px] tracking-widest border border-transparent hover:border-gray-200"
                  >
                    <LayoutGrid className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Right Side - Desktop */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Language Selector */}
            <div className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-md transition-all cursor-pointer">
              <Globe className="h-4 w-4 text-gray-400" />
              <select
                className="bg-transparent text-gray-600 text-[10px] font-black uppercase border-none outline-none cursor-pointer tracking-widest"
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  console.log('Language changed:', e.target.value)
                }
              >
                <option value="ar">العربية</option>
                <option value="en">English</option>
              </select>
            </div>

            {/* Auth Buttons / Profile Dropdown */}
            <div className="flex items-center space-x-4">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/signin"
                    className="flex items-center space-x-2 px-5 py-2.5 text-gray-600 hover:text-red-600 transition-colors font-black uppercase text-[11px] tracking-widest"
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Sign In</span>
                  </Link>

                  <Link
                    to="/signup"
                    className="relative flex items-center space-x-2 bg-gray-900 text-white px-7 py-3 rounded-2xl font-black uppercase text-[11px] tracking-widest overflow-hidden group transition-all duration-300 hover:shadow-xl hover:shadow-red-900/10 hover:-translate-y-0.5 active:scale-95"
                  >
                    <div className="absolute inset-0 w-0 bg-gradient-to-r from-red-600/50 to-green-600/50 group-hover:w-full transition-all duration-500 ease-out italic"></div>
                    <UserPlus className="h-4 w-4 relative z-10" />
                    <span className="relative z-10">Sign Up</span>
                  </Link>
                </>
              ) : (
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-3 p-1.5 pr-4 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-lg transition-all active:scale-95 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-green-600 flex items-center justify-center text-white font-black text-xs shadow-inner">
                      {user?.profileImage ? (
                        <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover rounded-xl" />
                      ) : (
                        getInitials(user?.name || '')
                      )}
                    </div>
                    <div className="flex flex-col items-start pr-1">
                      <span className="text-[10px] font-black text-gray-900 uppercase tracking-tight leading-none mb-1">
                        {user?.name?.split(' ')[0]}
                      </span>
                      <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none">
                        {user?.role}
                      </span>
                    </div>
                    <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 5, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 top-full mt-2 w-56 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-20 py-2 p-1.5"
                      >
                        <div className="px-5 py-4 border-b border-gray-50 mb-1">
                             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Account</p>
                             <p className="text-xs font-bold text-gray-900 truncate">{user?.email}</p>
                        </div>
                        <Link
                          to="/profile"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center space-x-3 px-5 py-3.5 rounded-2xl text-gray-600 hover:bg-red-50 hover:text-red-700 transition-all font-black uppercase text-[10px] tracking-widest"
                        >
                          <User className="h-4 w-4" />
                          <span>My Profile</span>
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center space-x-3 px-5 py-3.5 rounded-2xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all font-black uppercase text-[10px] tracking-widest"
                        >
                          <LogOut className="h-4 w-4 text-red-500" />
                          <span>Sign Out</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none transition-colors cursor-pointer"
              type="button"
            >
              <div className="flex flex-col justify-center items-center w-6 h-6 space-y-1">
                <div
                  className={`w-5 h-0.5 bg-gray-700 transition-all duration-300 ${
                    isMenuOpen ? 'rotate-45 translate-y-1.5' : ''
                  }`}
                ></div>
                <div
                  className={`w-5 h-0.5 bg-gray-700 transition-all duration-300 ${
                    isMenuOpen ? 'opacity-0' : 'opacity-100'
                  }`}
                ></div>
                <div
                  className={`w-5 h-0.5 bg-gray-700 transition-all duration-300 ${
                    isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
                  }`}
                ></div>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden border-t border-gray-100 bg-white overflow-hidden"
            >
              <div className="p-6 flex flex-col space-y-2">
                <Link
                  to="/home"
                  className="flex items-center space-x-3 px-5 py-4 rounded-2xl text-gray-600 hover:bg-gray-50 hover:text-red-600 transition-all font-black uppercase text-[10px] tracking-widest"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <HomeIcon className="h-4 w-4" />
                  <span>Home</span>
                </Link>

                {isAuthenticated ? (
                  <>
                    <Link
                      to="/dashboard"
                      className="flex items-center space-x-3 px-5 py-4 rounded-2xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all font-black uppercase text-[10px] tracking-widest"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <LayoutGrid className="h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>

                    <div className="pt-4 mt-2 border-t border-gray-100 flex flex-col space-y-2">
                      <Link
                        to="/profile"
                        className="flex items-center space-x-3 px-5 py-4 rounded-2xl text-gray-600 hover:bg-red-50 hover:text-red-700 transition-all font-black uppercase text-[10px] tracking-widest"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <User className="h-4 w-4" />
                        <span>My Profile</span>
                      </Link>

                      <button
                        onClick={() => {
                          handleSignOut();
                          setIsMenuOpen(false);
                        }}
                        className="w-full flex items-center space-x-3 px-5 py-4 rounded-2xl text-gray-600 hover:bg-gray-50 transition-all font-black uppercase text-[10px] tracking-widest"
                      >
                        <LogOut className="h-4 w-4 text-red-500" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="pt-4 mt-2 border-t border-gray-100 flex flex-col space-y-2">
                    <Link
                      to="/signin"
                      className="flex items-center space-x-3 px-5 py-4 rounded-2xl text-gray-600 hover:text-red-600 transition-all font-black uppercase text-[10px] tracking-widest"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <LogIn className="h-4 w-4" />
                      <span>Sign In</span>
                    </Link>

                    <Link
                      to="/signup"
                      className="flex items-center justify-center space-x-3 px-5 py-4 bg-gray-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-red-600 transition-all shadow-lg active:scale-95"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <UserPlus className="h-4 w-4" />
                      <span>Sign Up</span>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
