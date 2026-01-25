import { Car, Globe, User, LogIn, LogOut, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useLogoutMutation } from '../../state/services/auth/authAPI';
import toast from 'react-hot-toast';

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();

  const handleSignOut = async () => {
    try {
      await logout({}).unwrap();
      toast.success('Successfully signed out');
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err);
      toast.error('Logout failed. Please try again.');
    }
  };

  return (
    <nav className="bg-white shadow-lg border-b-4 border-green-600 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Side */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-red-700 to-green-600 p-2 rounded-lg">
                <Car className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold bg-gradient-to-r from-red-700 to-green-600 bg-clip-text text-transparent">
                TransLeb
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              {isAuthenticated && (
                <>
                  <Link
                    to="/ride"
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-green-50 hover:text-green-700 transition-all duration-200 font-medium border-2 border-transparent hover:border-green-200"
                  >
                    <User className="h-4 w-4" />
                    <span>Find a Ride</span>
                  </Link>
                  <Link
                    to="/drive"
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-700 transition-all duration-200 font-medium border-2 border-transparent hover:border-red-200"
                  >
                    <Car className="h-4 w-4" />
                    <span>Become a Driver</span>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Right Side - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Selector */}
            <div className="flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <Globe className="h-4 w-4 text-gray-600" />
              <select
                className="bg-transparent text-gray-700 text-sm font-medium border-none outline-none cursor-pointer"
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  console.log('Language changed:', e.target.value)
                }
              >
                <option value="ar">العربية</option>
                <option value="en">English</option>
              </select>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-2">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/signin"
                    className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-green-700 transition-colors font-medium"
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Sign In</span>
                  </Link>

                  <Link
                    to="/signup"
                    className="relative flex items-center space-x-2 bg-gradient-to-r from-red-700 to-green-600 text-white px-6 py-2 rounded-lg font-medium overflow-hidden group transition-all duration-200 hover:shadow-lg"
                  >
                    <div className="absolute inset-0 w-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 group-hover:w-full transition-all duration-700 ease-out"></div>
                    <UserPlus className="h-4 w-4 relative z-10" />
                    <span className="relative z-10">Sign Up</span>
                  </Link>
                </>
              ) : (
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-red-700 transition-colors font-medium cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
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
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 animate-in slide-in-from-top duration-200">
            <div className="flex flex-col space-y-3">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/ride"
                    className="flex items-center space-x-2 px-4 py-3 rounded-lg text-gray-700 hover:bg-green-50 hover:text-green-700 transition-all font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="h-4 w-4" />
                    <span>Find a Ride</span>
                  </Link>

                  <Link
                    to="/drive"
                    className="flex items-center space-x-2 px-4 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-700 transition-all font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Car className="h-4 w-4" />
                    <span>Become a Driver</span>
                  </Link>

                  <div className="border-t border-gray-200 pt-3">
                    <button
                      onClick={() => {
                        handleSignOut();
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center space-x-2 px-4 py-3 text-gray-700 hover:text-red-700 transition-colors font-medium cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="border-t border-gray-200 pt-3 flex flex-col space-y-2">
                  <Link
                    to="/signin"
                    className="flex items-center space-x-2 px-4 py-3 text-gray-700 hover:text-green-700 transition-colors font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Sign In</span>
                  </Link>

                  <Link
                    to="/signup"
                    className="relative flex items-center space-x-2 mx-4 bg-gradient-to-r from-red-700 to-green-600 text-white px-6 py-3 rounded-lg font-medium text-center justify-center overflow-hidden group transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="absolute inset-0 w-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 group-hover:w-full transition-all duration-700 ease-out"></div>
                    <UserPlus className="h-4 w-4 relative z-10" />
                    <span className="relative z-10">Sign Up</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
